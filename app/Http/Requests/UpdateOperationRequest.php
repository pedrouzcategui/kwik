<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateOperationRequest extends FormRequest
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
            'contact_id' => ['required', 'string'],
            'account_id' => ['required', 'string'],
            'category_id' => ['required', 'string'],
            'type' => ['required', 'string'],
            'amount' => ['required'],
            'description' => ['nullable', 'string']
        ];
    }

    public function messages()
    {
        return [
            'contact_id.required' => "El campo contacto es requerido.",
            'type.required' => "El campo tipo de operación es requerido.",
            'account_id.required' => "El campo cuenta es requerido.",
            'category_id.required' => "El campo categoría es requerido.",
            'amount.min' => "El monto mínimo de operación es de 0.01.",
            'amount.required' => "El monto de operación es requerido."
        ];
    }
}
