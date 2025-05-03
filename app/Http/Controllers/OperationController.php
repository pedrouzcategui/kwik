<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreOperationRequest;
use App\Http\Requests\UpdateOperationRequest;
use App\Models\Operation;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Category;

class OperationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $operations = $request->user()->operations()->with(['contact', 'account', 'category'])->orderBy('created_at', 'desc')->get();
        return Inertia::render('operations/index', [
            'operations' => $operations,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        // ?Difference between a query builder and this load method?
        $user = $request->user()->load(['contacts', 'accounts']);
        $categories = Category::all();
        return Inertia::render("operations/form", [
            'user' => $user,
            'categories' => $categories
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreOperationRequest $request)
    {
        $operation = new Operation($request->validated());
        $operation->user_id = $request->user()->id;
        // Event is dispatched here
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
    public function edit(Request $request, Operation $operation)
    {
        $user = $request->user()->with(['accounts', 'contacts'])->first();
        $categories = Category::all();
        return Inertia::render('operations/form', [
            'operation' => $operation,
            'categories' => $categories,
           'user' => $user
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateOperationRequest $request, Operation $operation)
    {
        if ($request->user()->id !== $operation->user_id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }
        $operation->amount = $request->input('amount');
        $operation->type = $request->input('type');
        $operation->update($request->validated());
        return to_route('operations.index')->with('success', 'Se ha actualizado la operación');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, Operation $operation)
    {
        if ($request->user()->id !== $operation->user_id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }
        $operation->delete();
        return to_route('operations.index')->with('success', 'Se ha eliminado la operación');
    }
}
