<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use App\Models\ExchangeRate;
use App\Models\User;

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
        $startDate = \Carbon\Carbon::parse($startDate)->startOfDay()->toDateTimeString();
        $endDate = \Carbon\Carbon::parse($endDate)->endOfDay()->toDateTimeString();

        // 2. Se obtienen las cuentas y operaciones del usuario.
        $query = DB::table('operations')
            ->join('accounts', 'operations.account_id', '=', 'accounts.id')
            ->select('accounts.currency', DB::raw('SUM(operations.amount) as amount'))
            ->where('operations.user_id', '=', Auth::user()->id)
            ->groupBy('accounts.currency');

        // I might group these condtions
        if ($startDate && $endDate) {
            $query->whereBetween('operations.created_at', [$startDate, $endDate]);
        }

        $accountSumsByCurrency = $query->get();

        // Get total account balance in USD
        $operations = Auth::user()
            ->operations()
            ->with('account')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->select('amount', 'account_id', 'type') // include type!
            ->get();

        $rates = ExchangeRate::where('source_type', 'official')
            ->select('currency_code', 'rate_to_usd')
            ->get()
            ->unique('currency_code')
            ->pluck('rate_to_usd', 'currency_code');

        $total_accounts_amount_in_usd = round($operations->reduce(function ($total, $op) use ($rates) {
            $currency = $op->account?->currency ?? 'USD';
            $rate = $rates[$currency] ?? 1;

            $signedAmount = $op->tipo_operacion === 'E' ? -1 * $op->amount : $op->amount;

            // Convert to USD
            $convertedAmount = $currency === 'USD' ? $signedAmount : $signedAmount / $rate;

            return $total + $convertedAmount;
        }, 0), 2);

        //



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

        // 4. Se obtiene el total de gastos por categoría.
        $expensesGroupedByCategories = DB::table('operations')
            ->join('categories', 'operations.category_id', '=', 'categories.id')
            ->select('categories.name', DB::raw('SUM(operations.amount) as total'))
            ->where('type', '=', 'EXPENSE')
            ->where('operations.user_id', '=', Auth::user()->id)
            ->groupBy('categories.name');

        if ($startDate && $endDate) {
            $expensesGroupedByCategories->whereBetween('operations.created_at', [$startDate, $endDate]);
        }

        $expensesGroupedByCategories = $expensesGroupedByCategories->get();

        // 5. Se obtienen los ultimos 30 logs del usuario.
        $systemLogs = DB::table('system_logs')
            ->select('id', 'description', 'module', 'created_at')
            ->orderBy('created_at', 'desc')
            ->limit(30)
            ->get();

        // Obtener el último dolar bcv y dolar paralelo disponibles
        $dolarBcv = ExchangeRate::where('currency_code', 'VES')
            ->where('source_type', 'official')
            ->orderBy('effective_date', 'desc')
            ->first();

        $dolarParalelo = ExchangeRate::where('currency_code', 'VES')
            ->where('source_type', 'black_market')
            ->orderBy('effective_date', 'desc')
            ->first();

        // 6. Se renderiza el dashboard con la información solicitada.
        return Inertia::render('dashboard', [
            'accounts_totals' => $accountSumsByCurrency,
            'expenses_grouped_by_categories' => $expensesGroupedByCategories,
            'logs' => $systemLogs,
            'dollar_rates' => [
                $dolarBcv,
                $dolarParalelo,
            ],
            'total_account_amount_in_usd' => $total_accounts_amount_in_usd,
        ]);
    }
}
