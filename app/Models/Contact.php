<?php

namespace App\Models;

use App\Observers\ContactObserver;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Concerns\HasUuids; // Trait para usar UUIDs como claves primarias
use Illuminate\Database\Eloquent\Factories\HasFactory; // Trait para usar factories en tests/seeds
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[ObservedBy([ContactObserver::class])]
class Contact extends Model
{
    // Traits que añaden funcionalidades al modelo:
    use HasFactory, // Permite crear instancias del modelo usando factories (útil para testing y seeding)
        HasUuids;   // Permite que el modelo use UUIDs como claves primarias

    protected $fillable = ['full_name', 'email', 'phone', 'type'];
    protected $hidden = ['user_id']; // Oculta el campo user_id en las respuestas serializadas
    protected $table = 'contacts';
    protected $primaryKey = 'id';
    public $incrementing = false; // Indica que la clave primaria no es auto-incremental (porque usamos UUIDs)
    protected $keyType = 'string'; // Especifica que la clave primaria es de tipo string (UUID)

    /**
     * Relación: Un contacto pertenece a un usuario.
     * Esto permite acceder al usuario propietario del contacto.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Relación: Un contacto puede tener muchas operaciones asociadas.
     * Esto permite acceder a todas las operaciones relacionadas con el contacto.
     */
    public function operations(): HasMany
    {
        return $this->hasMany(Operation::class);
    }
}
