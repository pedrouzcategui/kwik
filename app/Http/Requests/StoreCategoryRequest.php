<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCategoryRequest extends FormRequest
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
            'name'  => ['required', 'unique:categories,name', 'string', 'max:40'],
            'color'  => ['required', 'unique:categories,color', 'max:7'],
            'type'  => ['required'],
        ];
    }

    public function messages()
    {
        return [
            'name.required' => "El campo nombre es requerido.",
            'name.unique' => "Este nombre ya existe con otra categoría. Elige otro nombre",
            'color.unique' => "El color ya es usado por otra categoría. Por favor, usa otro color.",
            'type.required' => "El tipo de operación para la categoría es requerido.",
        ];
    }
}
