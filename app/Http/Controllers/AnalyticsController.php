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

class AnalyticsController extends Controller
{
    /**
     * Tabla de Analíticas
     */
    public function index(Request $request)
    {
        // 1. Se obtiene el rango de fechas a consultar.
        $startDate = $request->query('start_date');
        $endDate = $request->query('end_date');

        if (empty($startDate) || empty($endDate)) {
            $startDate = now()->subWeek()->toDateString();
            $endDate = now()->toDateString();
        }

        // Asegura que $endDate sea EOD (23:59:59)
        $startDate = Carbon::parse($startDate)->startOfDay()->toDateTimeString();
        $endDate = Carbon::parse($endDate)->endOfDay()->toDateTimeString();

        $query = $request->user()                      // current user
            ->accounts()                               // hasMany relation on User
            ->selectRaw('currency, SUM(amount) as amount')
            ->groupBy('currency');

        // I might group these conditions
        if ($startDate && $endDate) {
            $query->whereBetween('created_at', [$startDate, $endDate]);
        }

        $accountSumsByCurrency = $query->get();

        // Get all accounts
        $accounts = $request->user()
            ->accounts()
            ->select('amount', 'currency')
            ->get();

        $rates = ExchangeRate::where('source_type', 'official')
            ->select('currency_code', 'rate_to_usd')
            ->latest()
            ->get()
            ->unique('currency_code')
            ->pluck('rate_to_usd', 'currency_code');

        $total_accounts_amount_in_usd = round($accounts->reduce(function ($total, $account) use ($rates) {
            $currency = $account->currency ?? 'USD';
            $rate = $rates[$currency] ?? 1;

            // Convert to USD
            $convertedAmount = $currency === 'USD' ? $account->amount : $account->amount / $rate;

            return $total + $convertedAmount;
        }, 0), 2);


        // $total_accounts_amount_in_ves = $total_accounts_amount_in_usd * $rates['VES'];
        $total_accounts_amount_in_ves = round($accounts->reduce(function ($total, $account) use ($rates) {
            $currency = $account->currency ?? 'VES';
            $ves_rates = [
                "EUR" => $rates['VES'] / $rates['EUR'],
                "USD" => (float) $rates['VES'],
            ];
            // Convert to USD
            $convertedAmount = $currency === 'VES' ? $account->amount : $account->amount * $ves_rates[$currency];

            return $total + $convertedAmount;
        }, 0), 2);


        // $total_accounts_amount_in_eur = $total_accounts_amount_in_usd * $rates['EUR'];
        $total_accounts_amount_in_eur = round($accounts->reduce(function ($total, $account) use ($rates) {
            $currency = $account->currency ?? 'EUR';
            $eur_rates = [
                "USD" => $rates['EUR'],
                "VES" => 1 / ($rates['VES'] / $rates['EUR']),
            ];
            // Convert to USD
            $convertedAmount = $currency === 'EUR' ? $account->amount : $account->amount * $eur_rates[$currency];
            return $total + $convertedAmount;
        }, 0), 2);


        // 3. Se obtiene el total por cuenta y tipo de operación.
        $totalsByCurrencyAndType = DB::table('operations')
            ->join('accounts', 'operations.account_id', '=', 'accounts.id')
            ->select(
                'accounts.currency',
                'operations.type',
                DB::raw('SUM(operations.amount) as total')
            )
            ->where('operations.user_id', '=', Auth::user()->id)
            ->groupBy('accounts.currency', 'operations.type');

        if ($startDate && $endDate) {
            $totalsByCurrencyAndType->whereBetween('operations.created_at', [$startDate, $endDate]);
        }

        $totalsByCurrencyAndType = $totalsByCurrencyAndType->get();

        // Calculate total savings amount
        $rates = ExchangeRate::where('source_type', 'official')
            ->pluck('rate_to_usd', 'currency_code');

        $total_savings_amount_in_usd = Account::where('user_id', Auth::id())
            ->where('type', 'SAVINGS')
            ->get()
            ->reduce(function ($sum, Account $acct) use ($rates) {
                $rate = $rates[$acct->currency] ?? 1;
                $usd  = $acct->currency === 'USD'
                    ? $acct->amount
                    : $acct->amount / $rate;
                return $sum + $usd;
            }, 0);

        $total_savings_amount_in_ves = $total_savings_amount_in_usd * $rates['VES'];
        $total_savings_amount_in_eur = $total_savings_amount_in_usd * $rates['EUR'];


        // 4. Se obtiene el total de gastos por categoría.
        $rates = ExchangeRate::where('source_type', 'official')
            ->pluck('rate_to_usd', 'currency_code');

        $rows = Operation::with(['category', 'account'])
            ->where('type', 'EXPENSE')
            ->where('user_id', Auth::id())
            ->when(
                $startDate && $endDate,
                fn($q) =>
                $q->whereBetween('created_at', [$startDate, $endDate])
            )
            ->get();

        // Map each operation into a USD-amount + category name
        $mapped = $rows->map(fn($op) => [
            'name' => $op->category->name,
            'usd'  => $op->account->currency === 'USD'
                ? $op->amount
                : $op->amount / ($rates[$op->account->currency] ?? 1),
        ]);

        // Group by category name, sum and round
        $expensesGroupedByCategories = $mapped
            ->groupBy('name')
            ->map(fn($items, $name) => [
                'name'  => $name,
                'total' => round(collect($items)->sum('usd'), 2),
            ])
            ->values();

        // 5. Se obtienen los ultimos 30 logs del usuario.
        $systemLogs = DB::table('system_logs')
            ->select('id', 'description', 'module', 'created_at')
            ->orderBy('created_at', 'desc')
            ->limit(30)
            ->get();

        // 2) get all expense operations with their contact & account
        // $ops = Operation::with(['contact', 'account'])
        //     ->where('type', 'EXPENSE')
        //     ->where('user_id', Auth::id())
        //     ->get();

        // // 3) map each op to [name, usdAmount]
        // $mapped = $ops->map(fn($op) => [
        //     'name' => $op->contact->full_name,
        //     'usd'  => $op->account->currency === 'USD'
        //         ? $op->amount
        //         : $op->amount / ($rates[$op->account->currency] ?? 1),
        // ]);

        // // 4) group, sum & round
        // $topFiveContacts = $mapped
        //     ->groupBy('name')
        //     ->map(fn($items, $name) => [
        //         'name'  => $name,
        //         'total' => round(collect($items)->sum('usd'), 2),
        //     ])
        //     ->sortByDesc('total')
        //     ->take(5)
        //     ->values();

        $ops = Operation::with(['contact', 'account'])
            ->where('type', 'EXPENSE')
            ->where('user_id', Auth::id())
            ->get();

        /* ----------------------------------------------------------------------
| 1) normalise every operation to USD (exactly as you already did)
|---------------------------------------------------------------------*/
        $mapped = $ops->map(fn($op) => [
            'name' => $op->contact->full_name,
            'usd'  => $op->account->currency === 'USD'
                ? $op->amount
                : $op->amount / ($rates[$op->account->currency] ?? 1),
        ]);

        /* ----------------------------------------------------------------------
| 2) group by contact and build totals in USD, VES and EUR
|---------------------------------------------------------------------*/
        $topFiveContacts = $mapped
            ->groupBy('name')
            ->map(function ($items, $name) use ($rates) {
                $totalUsd = collect($items)->sum('usd');   // <- base figure

                return [
                    'name'  => $name,
                    'total' => [
                        'USD' => round($totalUsd, 2),
                        'VES' => round($totalUsd * ($rates['VES'] ?? 1), 2),
                        'EUR' => round($totalUsd * ($rates['EUR'] ?? 1), 2),
                    ],
                ];
            })
            // sort by USD so the ranking is stable
            ->sortByDesc(fn($row) => $row['total']['USD'])
            ->take(5)
            ->values();

        // Obtener el último dolar bcv y dolar paralelo disponibles
        $dolarBcv = ExchangeRate::where('currency_code', 'VES')
            ->where('source_type', 'official')
            ->orderBy('effective_date', 'desc')
            ->first();

        $dolarParalelo = ExchangeRate::where('currency_code', 'VES')
            ->where('source_type', 'black_market')
            ->orderBy('effective_date', 'desc')
            ->first();

        // Determine the user's status based on operations and accounts
        $hasOperations = Operation::where('user_id', Auth::id())->exists();
        $hasAccounts = Account::where('user_id', Auth::id())->exists();

        if ($total_accounts_amount_in_usd < 0) {
            // 1️⃣ negative balance → red
            $status = 'red';
        } elseif (($hasOperations && $hasAccounts) && ($total_accounts_amount_in_usd <= $request->user()->alert_threshold_amount)) {
            // 2️⃣ below alert threshold → yellow
            $status = 'yellow';
        } elseif ($hasOperations && $hasAccounts) {
            // 3️⃣ has both ops & accounts → green
            $status = 'green';
        } else {
            // 4️⃣ anything else (usually no ops & no accounts) → gray/neutral
            $status = 'neutral';
        }

        // 6. Se renderiza el dashboard con la información solicitada.
        return Inertia::render('dashboard/index', [
            'accounts_totals' => $accountSumsByCurrency,
            'expenses_grouped_by_categories' => $expensesGroupedByCategories,
            'top_5_contacts_by_expense' => $topFiveContacts,
            'logs' => $systemLogs,
            'dollar_rates' => [
                $dolarBcv,
                $dolarParalelo,
            ],
            'total_available_amount' => [
                'USD' => $total_accounts_amount_in_usd,
                'VES' => $total_accounts_amount_in_ves,
                'EUR' => $total_accounts_amount_in_eur
            ],
            'total_savings_amount' => [
                'USD' => $total_savings_amount_in_usd,
                'VES' => $total_savings_amount_in_ves,
                'EUR' => $total_savings_amount_in_eur
            ],
            'status' => $status,
        ]);
    }
}
