<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AccountProviderController extends Controller
{
    public function index(Request $request)
    {
        return response()->json($request->user()->account_providers);
    }
}
