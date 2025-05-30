<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\StoreAccountProviderRequest;
use App\Models\AccountProvider;

class AccountProviderController extends Controller
{
    public function index(Request $request)
    {
        return response()->json($request->user()->account_providers);
    }
    public function store(StoreAccountProviderRequest $request)
    {
        $accountProvider = AccountProvider::create($request->validated());
        return response()->json($accountProvider, 201);
    }
}
