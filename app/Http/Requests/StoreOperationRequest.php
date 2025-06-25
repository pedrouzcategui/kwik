<?php

namespace App\Http\Requests;

use App\Rules\HasSufficientBalance;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreOperationRequest extends FormRequest
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
        $userId = $this->user()->id;

        return [
            'contact_id'  => ['required', 'string', 'min:1'],
            'account_id'  => ['required', 'string', 'min:1'],
            'category_id' => ['required', 'string', 'min:1'],
            'type'        => ['required', 'string', 'min:1'],

            'amount' => [
                'required',
                'numeric',
                'min:0.01',

                // attach balance-check only when all these are true
                Rule::when(
                    $this->input('type')    === 'EXPENSE'
                        && $this->filled('account_id')   // account chosen
                        && $this->filled('amount'),      // amount sent
                    fn() => [                     // ← array of extra rules
                        new HasSufficientBalance($userId, $this->input('account_id')),
                    ],
                ),
            ],

            'description' => ['nullable', 'string'],
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
