<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AnalyticsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $startDate = $request->query('start_date');
        $endDate = $request->query('end_date');

        $query = DB::table('operations')
            ->join('accounts', 'operations.account_id', '=', 'accounts.id')
            ->select('accounts.currency', DB::raw('SUM(operations.amount) as amount'))
            ->groupBy('accounts.currency');

        if ($startDate && $endDate) {
            $query->whereBetween('operations.created_at', [$startDate, $endDate]);
        }

        $accountSumsByCurrency = $query->get();

        // Income vs Expense, for this I'll need to query the operations table
        // I need to normalize this probably, or separate it by currency
        $totalsByCurrencyAndType = DB::table('operations')
            ->join('accounts', 'operations.account_id', '=', 'accounts.id')
            ->select(
                'accounts.currency',
                'operations.type',
                DB::raw('SUM(operations.amount) as total')
            )
            ->groupBy('accounts.currency', 'operations.type');

        if ($startDate && $endDate) {
            $totalsByCurrencyAndType->whereBetween('operations.created_at', [$startDate, $endDate]);
        }

        $totalsByCurrencyAndType = $totalsByCurrencyAndType->get();


        return Inertia::render('dashboard', [
            'accounts_totals' => $accountSumsByCurrency
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
