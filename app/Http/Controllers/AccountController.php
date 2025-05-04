<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreAccountRequest;
use App\Http\Requests\UpdateAccountRequest;
use App\Models\Account;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AccountController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $accounts = $request->user()->accounts;
        $providers = $request->user()->accountProviders;
        return Inertia::render('accounts/index', [
            'accounts' => $accounts,
            'providers' => $providers
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
    }

    /**
     * Store a newly created resource in storage.
     */
    // TODO: Create Request and Validate
    public function store(StoreAccountRequest $request)
    {
        $account = new Account($request->validated());
        $account->user_id = $request->user()->id;
        $account->save();

        return to_route('accounts.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(Account $account)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Request $request, Account $account)
    {
        $providers = $request->user()->accountProviders;
        return Inertia::render('accounts/form', [
            'providers' => $providers,
            'account' => $account
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateAccountRequest $request, Account $account)
    {
        if ($account->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }
        $account->update($request->validated());
        return to_route('accounts.index')->with('success', 'Cuenta Actualizada');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, Account $account)
    {
        // 🛡️ Check ownership | This can be replaced with a policy tbh
        if ($account->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $account->delete();
        // TODO: Flash session here
        return to_route('accounts.index')->with('success', 'Cuenta Eliminada');
    }
}
