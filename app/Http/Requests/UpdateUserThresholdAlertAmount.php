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
            // must be < the alert amount
            'danger_threshold_amount' => [
                'required',
                'numeric',
                'min:1',
                'lt:alert_threshold_amount',
            ],

            // must be > the danger amount
            'alert_threshold_amount'  => [
                'required',
                'numeric',
                'min:1',
                'gt:danger_threshold_amount',
            ],
        ];
    }

    public function messages()
    {
        return [
            'alert_threshold_amount.min' => "El monto mínimo de alerta debe ser 1",
            'danger_threshold_amount.min' => "El monto mínimo de alerta debe ser 1",
            'alert_threshold_amount.gt' => "El monto de alerta debe ser mayor al monto de peligro.",
            'danger_threshold_amount.lt' => "El monto de peligro debe ser menor al monto de alerta."
        ];
    }
}
