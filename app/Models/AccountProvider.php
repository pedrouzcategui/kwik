<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AccountProvider extends Model
{
    // Usa el trait HasFactory para permitir la generación de instancias del modelo mediante factories
    // Usa el trait HasUuids para que las claves primarias del modelo sean UUIDs en vez de enteros autoincrementales
    use HasFactory, HasUuids;

    /**
     * Define una relación de tipo "pertenece a" (BelongsTo) con el modelo User.
     * Esto indica que cada AccountProvider está asociado a un usuario.
     *
     * @return BelongsTo
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
