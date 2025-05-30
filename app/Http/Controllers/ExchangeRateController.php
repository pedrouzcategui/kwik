<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\ExchangeRate;

class ExchangeRateController extends Controller
{
    public function index()
    {
        $exchangeRates = ExchangeRate::orderBy('effective_date', 'desc')->get();
        return Inertia::render('exchange-rates/index', [
            'exchange_rates' => $exchangeRates,
        ]);
    }
}
