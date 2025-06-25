<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateUserThresholdAlertAmount extends FormRequest
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
            'alert_threshold_amount' => ['required', 'numeric', 'min:1']
        ];
    }

    public function messages()
    {
        return [
            'alert_threshold_amount.min' => "El monto mínimo de alerta debe ser 1"
        ];
    }
}
