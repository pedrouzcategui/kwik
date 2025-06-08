<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreContactRequest;
use App\Http\Requests\UpdateContactRequest;
use App\Models\Contact;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ContactController extends Controller
{
    /**
     * Muestra una lista de los contactos.
     */
    public function index(Request $request)
    {
        $contacts = $request->user()->contacts;
        return Inertia::render('contacts/index', [
            'contacts' => $contacts
        ]);
    }

    /**
     * Muestra el formulario para crear un nuevo contacto.
     */
    public function create()
    {
        return Inertia::render('contacts/form');
    }

    /**
     * Almacena un nuevo contacto en la base de datos.
     */
    public function store(StoreContactRequest $request)
    {
        // Crea una nueva instancia de Contacto con los datos validados
        $contact = new Contact($request->validated());
        // Asigna el usuario autenticado al contacto
        $contact->user_id = $request->user()->id;
        $contact->save();

        return to_route('contacts.index');
    }

    /**
     * Muestra un contacto específico.
     */
    public function show(Request $request, Contact $contact)
    {
        // Verifica que el usuario autenticado sea el dueño del contacto
        if ($contact->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Prohibido'], 403);
        }

        return response()->json($contact);
    }

    /**
     * Muestra el formulario para editar un contacto específico.
     */
    public function edit(Contact $contact)
    {
        return Inertia::render('contacts/form', [
            'contact' => $contact
        ]);
    }

    /**
     * Actualiza un contacto específico en la base de datos.
     */
    public function update(UpdateContactRequest $request, Contact $contact)
    {
        // Verifica que el usuario autenticado sea el dueño del contacto
        if ($request->user()->id !== $contact->user_id) {
            return response()->json(['message' => 'Prohibido'], 403);
        }

        // Actualiza el modelo Contacto
        $contact->update($request->validated());

        return to_route('contacts.index');
    }

    /**
     * Mueve un contacto específico de la base de datos a la papelera.
     */

    public function destroy(Request $request, Contact $contact)
    {
        // 🛡️ Verifica que el usuario autenticado sea el dueño del contacto | Esto se puede reemplazar por una policy
        if ($contact->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Prohibido'], 403);
        }

        $contact->delete();
        // TODO: Agregar mensaje flash a la sesión
        return to_route('contacts.index')->with('success', 'Contacto eliminado');
    }

    public function forceDestroy(Request $request, Contact $contact){
        echo "Hola";
        die();
        if ($contact->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Prohibido'], 403);
        }

        $contact->forceDelete();
        // TODO: Agregar mensaje flash a la sesión
        return to_route('trash.index')->with('success', 'Contacto eliminado');
    }
}
