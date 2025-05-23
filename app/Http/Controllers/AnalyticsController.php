<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

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

        // 6. Se renderiza el dashboard con la información solicitada.
        return Inertia::render('dashboard', [
            'accounts_totals' => $accountSumsByCurrency,
            'expenses_grouped_by_categories' => $expensesGroupedByCategories,
            'logs' => $systemLogs,
        ]);
    }
}
