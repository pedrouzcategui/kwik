<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Category extends Model
{
    // Usa los traits HasFactory y HasUuids
    // HasFactory: permite crear instancias de este modelo usando factories (útil para testing y seeders)
    // HasUuids: habilita el uso de UUIDs como identificadores primarios en lugar de enteros autoincrementales
    use HasFactory, HasUuids;

    // Define los atributos que se pueden asignar masivamente
    protected $fillable = [
        'name',
        'icon',
        'color'
    ];

    // Define la relación uno a muchos con el modelo Operation
    // Una categoría puede tener muchas operaciones asociadas
    public function operations()
    {
        return $this->hasMany(Operation::class);
    }
}
