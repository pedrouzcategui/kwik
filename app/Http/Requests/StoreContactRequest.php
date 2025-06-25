<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreContactRequest extends FormRequest
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
    public function rules(): array
    {
        $userId = $this->user()->id;   // current user

        return [
            'full_name' => ['required', 'string', 'max:255'],

            'email' => [
                'required_without:phone',
                'email:rfc',
                'max:255',
                Rule::unique('contacts')
                    ->where(fn($q) => $q->where('user_id', $userId)),
            ],

            'phone' => [
                'required_without:email',
                'string',
                'max:25',
                Rule::unique('contacts')
                    ->where(fn($q) => $q->where('user_id', $userId)),
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
