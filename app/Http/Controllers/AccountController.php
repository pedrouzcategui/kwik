<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreAccountRequest;
use App\Http\Requests\UpdateAccountRequest;
use App\Models\Account;
use App\Models\AccountProvider;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AccountController extends Controller
{
    /**
     * Muestra la tabla de cuentas, y se le pasa la lista de cuentas y proveedores de cuentas.
     */
    public function index(Request $request)
    {
        $accounts = $request->user()->accounts()->with('account_provider')->get();
        $providers = AccountProvider::all();
        return Inertia::render('accounts/index', [
            'accounts' => $accounts,
            'providers' => $providers
        ]);
    }

    /**
     * Muestra el formulario para crear un nuevo recurso.
     */
    //   public function create(Request $request) {}

    /**
     * Valida el request y almacena una nueva cuenta en la base de datos.
     */
    public function store(StoreAccountRequest $request)
    {
        $account = new Account($request->validated());
        $account->user_id = $request->user()->id;
        $account->save();
        return to_route('accounts.index');
    }

    /**
     * Muestra el recurso especificado.
     */
    // public function show(Account $account)
    // {
    //     //
    // }

    /**
     * M
     */
    // public function edit(Request $request, Account $account)
    // {
    //     $providers = $request->user()->accountProviders;
    //     return Inertia::render('accounts/form', [
    //         'providers' => $providers,
    //         'account' => $account
    //     ]);
    // }

    /**
     * Valida una cuenta existente y los datos que se ingresan, valida si la cuenta es del usuario, y devuelve un mensaje de éxito o de error.
     */
    public function update(UpdateAccountRequest $request, Account $account)
    {
        if ($account->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Prohibido'], 403);
        }
        $account->update($request->validated());
        return to_route('accounts.index')->with('success', 'Cuenta Actualizada');
    }

    /**
     * Elimina el recurso especificado del almacenamiento.
     */
    public function destroy(Request $request, Account $account)
    {
        // ️Verificar propiedad | Esto se puede reemplazar con una policy
        if ($account->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Prohibido'], 403);
        }

        $account->delete();
        return to_route('accounts.index')->with('success', 'Cuenta Eliminada');
    }
}
