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
                'required',
                'email:rfc',
                'max:255',
                Rule::unique('contacts')
                    ->where(fn($q) => $q->where('user_id', $userId)),
            ],

            'phone' => [
                'nullable',
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
}
