<?php

namespace App\Http\Controllers;

use App\Models\Account;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use App\Models\ExchangeRate;
use App\Models\Operation;
use Carbon\Carbon;
use Illuminate\Support\Facades\Cache;

class AnalyticsController extends Controller
{
    public function index(Request $request)
    {
        /* ------------------------------------------------------------------ */
        /* 1) Rango de fechas                                                 */
        /* ------------------------------------------------------------------ */
        [$start, $end] = $this->resolveDateRange($request);

        /* ------------------------------------------------------------------ */
        /* 2) Tipos de cambio oficiales (cache 60 s)                          */
        /* ------------------------------------------------------------------ */
        $rates = Cache::remember('fx:official', 60, function () {
            return ExchangeRate::where('source_type', 'official')
                ->latest('effective_date')
                ->get()
                ->unique('currency_code')
                ->pluck('rate_to_usd', 'currency_code')
                ->toArray();            // -> { 'USD' => 1, 'VES' => 106.47, … }
        });

        /* Helpers de conversión */
        $toUsd   = fn(float $amt, string $cur) => $cur === 'USD'
            ? $amt
            : $amt / ($rates[$cur] ?? 1);

        $fromUsd = fn(float $usd) => [
            'USD' => round($usd, 2),
            'VES' => round($usd * ($rates['VES'] ?? 1), 2),
            'EUR' => round($usd * ($rates['EUR'] ?? 1), 2),
        ];

        /* ------------------------------------------------------------------ */
        /* 3) Cuentas (todas de una vez)                                      */
        /* ------------------------------------------------------------------ */
        $accounts = $request->user()
            ->accounts()
            ->when($start && $end, fn($q) => $q->whereBetween('created_at', [$start, $end]))
            ->get(['id', 'type', 'currency', 'amount']);

        /* Totales por divisa                                                  */
        $accountSumsByCurrency = $accounts
            ->groupBy('currency')
            ->map(fn($rows, $cur) => [
                'currency' => $cur,
                'amount'   => round($rows->sum('amount'), 2),
            ])
            ->values();

        /* Totales globales (todas las cuentas)                                */
        $totalAvailableUsd = $accounts->sum(fn($a) => $toUsd($a->amount, $a->currency));
        $totalAvailable    = $fromUsd($totalAvailableUsd);

        /* Totales sólo de cuentas de ahorro                                   */
        $savings           = $accounts->where('type', 'SAVINGS');
        $totalSavingsUsd   = $savings->sum(fn($a) => $toUsd($a->amount, $a->currency));
        $totalSavings      = $fromUsd($totalSavingsUsd);
        /* ------------------------------------------------------------------ */
        /* 4) Operaciones (gastos)                                             */
        /* ------------------------------------------------------------------ */
        $expenses = Operation::with(['category:id,name', 'account:id,currency'])
            ->where('user_id',   $request->user()->id)
            ->where('type',     'EXPENSE')
            ->when($start && $end, fn($q) => $q->whereBetween('created_at', [$start, $end]))
            ->get();

        /* 4.a) Gastos por categoría                                           */
        $expensesGroupedByCategories = $expenses
            ->groupBy(fn($op) => $op->category->name)
            ->map(fn($grp, $name) => [
                'name'  => $name,
                'total' => round(
                    $grp->sum(fn($op) => $toUsd($op->amount, $op->account->currency)),
                    2
                ),
            ])
            ->values();

        /* 4.b) Top-5 contactos                                                */
        $topFiveContacts = $expenses
            ->groupBy(fn($op) => $op->contact->full_name)
            ->map(fn($grp, $name) => [
                'name'  => $name,
                'total' => $fromUsd(
                    $grp->sum(fn($op) => $toUsd($op->amount, $op->account->currency))
                ),
            ])
            ->sortByDesc(fn($row) => $row['total']['USD'])
            ->take(5)
            ->values();

        /* ------------------------------------------------------------------ */
        /* 5) Logs + tasas VES (BCV / paralelo)                                */
        /* ------------------------------------------------------------------ */
        $systemLogs = DB::table('system_logs')
            ->select('id', 'description', 'module', 'created_at')
            ->latest()
            ->limit(30)
            ->get();

        $dolarBcv = ExchangeRate::where('currency_code', 'VES')
            ->where('source_type', 'official')
            ->latest('effective_date')
            ->first();

        $dolarParalelo = ExchangeRate::where('currency_code', 'VES')
            ->where('source_type', 'black_market')
            ->latest('effective_date')
            ->first();

        /* ------------------------------------------------------------------ */
        /* 6) Semáforo de estado                                               */
        /* ------------------------------------------------------------------ */
        $hasOps      = $expenses->isNotEmpty();  // ya las cargamos arriba
        $hasAccounts = $accounts->isNotEmpty();

        $status = 'neutral';
        if ($totalAvailableUsd < 0) {
            $status = 'red';
        } elseif (
            $hasOps && $hasAccounts &&
            $totalAvailableUsd <= $request->user()->alert_threshold_amount
        ) {
            $status = 'yellow';
        } elseif ($hasOps && $hasAccounts) {
            $status = 'green';
        }

        /* ------------------------------------------------------------------ */
        /* 7) Render                                                           */
        /* ------------------------------------------------------------------ */
        return Inertia::render('dashboard/index', [
            'accounts_totals'              => $accountSumsByCurrency,
            'expenses_grouped_by_categories' => $expensesGroupedByCategories,
            'top_5_contacts_by_expense'    => $topFiveContacts,
            'logs'                         => $systemLogs,
            'dollar_rates'                 => [$dolarBcv, $dolarParalelo],
            'total_available_amount'       => $totalAvailable,
            'total_savings_amount'         => $totalSavings,
            'status'                       => $status,
        ]);
    }

    /* ---------------------------------------------------------------------- */
    /* Extra: helper privado para resolver rango de fechas                    */
    /* ---------------------------------------------------------------------- */
    private function resolveDateRange(Request $req): array
    {
        $start = $req->query('start_date');
        $end   = $req->query('end_date');

        if (!$start || !$end) {
            $start = now()->subWeek();
            $end   = now();
        }

        return [
            Carbon::parse($start)->startOfDay(),
            Carbon::parse($end)->endOfDay(),
        ];
    }
}
