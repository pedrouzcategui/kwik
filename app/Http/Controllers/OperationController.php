<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreOperationRequest;
use App\Http\Requests\UpdateOperationRequest;
use App\Models\Operation;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Category;
use Illuminate\Validation\ValidationException;

class OperationController extends Controller
{
    /**
     * Muestra una lista de las operaciones.
     */
    public function index(Request $request)
    {
        $operations = $request->user()->operations()->with(['contact', 'account', 'category'])->latest()->get();
        $user = $request->user()->load(['contacts', 'accounts']);
        $categories = Category::all();
        $contacts = $request->user()->contacts;
        return Inertia::render('operations/index', [
            'categories' => $categories,
            'user' => $user,
            'operations' => $operations,
            'contacts' => $contacts,
        ]);
    }

    /**
     * Muestra el formulario para crear una nueva operación.
     */
    public function create(Request $request)
    {
        // ¿Diferencia entre un query builder y este método load?
    }

    /**
     * Almacena una nueva operación en la base de datos.
     */
    public function store(StoreOperationRequest $request)
    {
        $operation = new Operation($request->validated());
        $operation->user_id = $request->user()->id;
        $operation->save();
        return to_route('operations.index')->with('success', 'Operación creada exitosamente');
    }

    /**
     * Muestra la operación especificada.
     */
    public function show(Operation $operation)
    {
        //
    }

    /**
     * Muestra el formulario para editar la operación especificada.
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
     * Actualiza la operación especificada en la base de datos.
     */
    public function update(UpdateOperationRequest $request, Operation $operation)
    {
        if ($request->user()->id !== $operation->user_id) {
            return response()->json(['message' => 'Prohibido'], 403);
        }
        $operation->amount = $request->input('amount');
        $operation->type = $request->input('type');
        $operation->update($request->validated());
        return to_route('operations.index')->with('success', 'Se ha actualizado la operación');
    }

    /**
     * Elimina la operación especificada de la base de datos.
     */
    public function destroy(Request $request, Operation $operation)
    {
        if ($request->user()->id !== $operation->user_id) {
            return response()->json(['message' => 'Prohibido'], 403);
        }
        $operation->delete();
        return to_route('operations.index')->with('success', 'Se ha eliminado la operación');
    }

    public function restore(Request $request, Operation $operation)
    {
        // 🛡️ Verifica que el usuario autenticado sea el dueño del contacto | Esto se puede reemplazar por una policy
        if ($operation->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Prohibido'], 403);
        }

        $operation->restore();
        // TODO: Agregar mensaje flash a la sesión
        return to_route('trash.index')->with('success', 'Operación Restaurada');
    }
    public function forceDestroy(Request $request, Operation $operation)
    {

        if ($operation->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Prohibido'], 403);
        }

        $account = $operation->account()->withTrashed()->first();
        // What will the balance be *after* this row is gone?
        $newBalance = $operation->type === 'INCOME'
            ? $account->amount - $operation->amount
            : $account->amount + $operation->amount;

        // Stop everything if it would go negative
        if ($newBalance < 0 && $account->operations()->count() > 1) {
            // You can also throw a ValidationException to bubble a nice error up
            // return to_route('trash.index')->withMess('error', 'El saldo de la cuenta no puede ser negativo. Intenta eliminando gastos primero.');
            throw ValidationException::withMessages([
                'negative_balance' => 'El saldo de la cuenta no puede ser negativo. Intenta eliminando gastos primero.',
            ]);
        }

        $operation->forceDelete();
        // TODO: Agregar mensaje flash a la sesión
        return to_route('trash.index')->with('success', 'Operación eliminada');
    }
}
