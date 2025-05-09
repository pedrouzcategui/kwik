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
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $contacts = $request->user()->contacts;
        return Inertia::render('contacts/index', [
            'contacts' => $contacts
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('contacts/form');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreContactRequest $request)
    {
        // Mmm. I don't get this line
        $contact = new Contact($request->validated());
        // Also, this line does automatically check the Personal Access Token?
        $contact->user_id = $request->user()->id;
        $contact->save();

        return to_route('contacts.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, Contact $contact)
    {

        if ($contact->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        return response()->json($contact);
    }


    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Contact $contact)
    {
        return Inertia::render('contacts/form', [
            'contact' => $contact
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateContactRequest $request, Contact $contact)
    {
        // Ensure the logged-in user owns this contact
        if ($request->user()->id !== $contact->user_id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        // Update the model
        $contact->update($request->validated());

        return to_route('contacts.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, Contact $contact)
    {
        // 🛡️ Check ownership | This can be replaced with a policy tbh
        if ($contact->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $contact->delete();
        // TODO: Flash session here
        return to_route('contacts.index')->with('success', 'Contacto eliminado');
    }
}
