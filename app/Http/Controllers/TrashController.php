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
    public function index()
    {

        $contacts = Contact::onlyTrashed()->get();
        $accounts = Account::onlyTrashed()->get();
        $operations = Operation::onlyTrashed()->with([
            'account' => fn($q) => $q->withTrashed(),
            'contact' => fn($q) => $q->withTrashed()
        ])->get();
        return Inertia::render('trash/index', [
            'contacts' => $contacts,
            'accounts' => $accounts,
            'operations' => $operations
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
