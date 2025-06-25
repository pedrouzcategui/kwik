<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Mostrar la página de registro.
     */
    public function create(): Response
    {
        return Inertia::render('auth/register');
    }

    /**
     * Manejar una solicitud de registro entrante.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:' . User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ],  [ // <-- custom messages
            'name.required'      => 'Ingresa el campo nombre.',
            'email.required'     => 'Ingresa el campo email.',
            'email.email'        => 'Este no es un email valido.',
            'email.unique'       => 'Este email ya existe dentro del sistema.',
            'password.required'  => 'El campo contraseña es requerido.',
            'password.confirmed' => 'La contraseña que ingresaste no es la misma que la contraseña confirmada.',
            'password.min' => 'El campo contraseña debe ser de al menos 8 caracteres'
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        event(new Registered($user));

        Auth::login($user);

        // $request->user()->createToken('api-token');

        return to_route('dashboard');
    }
}
