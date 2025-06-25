<?php

namespace App\Http\Controllers;

use App\Models\Account;
use App\Models\Trash;
use App\Models\Contact;
use App\Models\Operation;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TrashController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $user = $request->user();        // the authenticated user

        $contacts = $user->contacts()    // HasMany builder → already filtered by user_id
            ->onlyTrashed()              // keep just the soft-deleted ones
            ->get();

        $accounts = $user->accounts()
            ->with('account_provider')
            ->onlyTrashed()
            ->get();

        $operations = $user->operations()
            ->onlyTrashed()
            ->with([
                // include the related (possibly-trashed) account & contact
                'account' => fn($q) => $q->withTrashed(),
                'contact' => fn($q) => $q->withTrashed(),
                'category'
            ])
            ->get();

        return Inertia::render('trash/index', [
            'contacts'   => $contacts,
            'accounts'   => $accounts,
            'operations' => $operations,
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
    public function show(Trash $trash)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Trash $trash)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Trash $trash)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Trash $trash)
    {
        //
    }
}
