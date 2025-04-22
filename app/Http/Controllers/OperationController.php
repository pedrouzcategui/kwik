<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreOperationRequest;
use App\Models\Operation;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OperationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $operations = $request->user()->operations()->with(['contact', 'account'])->orderBy('created_at', 'desc')->get();
        return Inertia::render('operations/index', [
            'operations' => $operations
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        // ?Difference between a query builder and this load method?
        $user = $request->user()->load(['contacts', 'accounts']);
        return Inertia::render("operations/form", [
            'user' => $user
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreOperationRequest $request)
    {
        $operation = new Operation($request->validated());
        $operation->user_id = $request->user()->id;
        $operation->save();
        return to_route('operations.index')->with('success', 'Contacto creado exitosamente');
    }

    /**
     * Display the specified resource.
     */
    public function show(Operation $operation)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Operation $operation)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Operation $operation)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Operation $operation)
    {
        //
    }
}
