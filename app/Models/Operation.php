<?php

namespace App\Models;

use App\Observers\OperationObserver;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\SoftDeletes;

// Asocia el observer OperationObserver a este modelo usando el atributo ObservedBy
#[ObservedBy([OperationObserver::class])]
class Operation extends Model
{
    // Trait para habilitar la fábrica de modelos (factories) en pruebas y seeders
    use HasFactory,
        // Trait para que el modelo utilice UUIDs como clave primaria
        HasUuids,
        // Trait de SoftDeletion
        SoftDeletes;

    // Campos que se pueden asignar masivamente
    protected $fillable = [
        'contact_id',
        'account_id',
        'category_id',
        'amount',
        'type',
        'description'
    ];

    /**
     * Relación: Una operación pertenece a un usuario.
     * @return BelongsTo
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Relación: Una operación pertenece a un contacto.
     * @return BelongsTo
     */
    public function contact(): BelongsTo
    {
        return $this->belongsTo(Contact::class);
    }

    /**
     * Relación: Una operación pertenece a una cuenta.
     * @return BelongsTo
     */
    public function account(): BelongsTo
    {
        return $this->belongsTo(Account::class);
    }

    /**
     * Relación: Una operación pertenece a una categoría.
     * @return BelongsTo
     */
    public function category()
    {
        return $this->belongsTo(Category::class);
    }
}
