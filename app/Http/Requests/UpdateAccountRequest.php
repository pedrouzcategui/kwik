<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateAccountRequest extends FormRequest
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
        return [
            'name' => ['required', 'string', 'max:255'],
            'currency' => ['required', 'string'],
            'type' => ['required', 'string'],
            'account_provider_id' => ['required', 'string']
        ];
    }

    public function messages()
    {
        return [
            'name' => "El nombre de la cuenta es requerido.",
            'account_provider_id' => "El proveedor de la cuenta es requerido.",
        ];
    }
}
