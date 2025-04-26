<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

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
        return [
            'contact_id' => ['required', 'string'],
            'account_id' => ['required', 'string'],
            'category_id' => ['required', 'string'],
            'type' => ['required', 'string'],
            'amount' => ['required'],
            // TODO: Add optional transfer account
        ];
    }
}
