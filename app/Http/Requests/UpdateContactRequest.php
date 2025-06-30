<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateContactRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    // public function rules(): array
    // {
    //     return [
    //         // WTF is sometimes?
    //         'full_name' => ['required', 'string', 'max:255'],
    //         'email'     => ['nullable', 'email:filter'],
    //         'phone'     => ['nullable', 'phone:e164', 'max:20'],
    //         'type' => ['required']
    //     ];
    // }

    public function rules(): array
    {
        $userId    = $this->user()->id;                 // owner of the contacts
        $contactId = $this->route('contact')?->id;      // contact being updated
        //  (name depends on your route param)

        return [
            'full_name' => ['required', 'string', 'max:255'],

            'email' => [
                'nullable',                // allow null / unchanged
                'required_without:phone',  // must exist if phone is blank
                'email:rfc',
                'max:255',
                Rule::unique('contacts')
                    ->where(fn($q) => $q->where('user_id', $userId))
                    ->ignore($contactId),  // <-- skip current contact
            ],

            'phone' => [
                'nullable',
                'required_without:email',
                'string',
                'max:25',
                Rule::unique('contacts')
                    ->where(fn($q) => $q->where('user_id', $userId))
                    ->ignore($contactId),
            ],

            'type' => [
                'required',
                Rule::in(['NATURAL', 'GOVERNMENT', 'BUSINESS', 'NON-PROFIT', 'INSTITUTIONAL']),
            ],
        ];
    }

    public function messages()
    {
        return [
            'full_name.required' => "El campo nombre completo es requerido.",
            'email.required_without' => "El campo email es requerido cuando el campo de teléfono está vacío.",
            'email.rfc' => "El campo email debe ser un correo válido.",
            'phone.required_without' => "El campo teléfono es requerido cuando el campo email está vacío.",
            'email.unique' => "Ya existe un contacto con este email.",
            'phone.unique' => "Ya existe un contacto con este número de teléfono.",
            'phone.max' => "El número de teléfono no puede ser mayor a 25 caracteres."
        ];
    }
}
