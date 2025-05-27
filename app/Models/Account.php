<?php

namespace App\Models;

use App\Observers\AccountObserver;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

// El atributo ObservedBy indica que este modelo será observado por AccountObserver.
// Los observers permiten ejecutar lógica automáticamente en eventos del modelo (crear, actualizar, eliminar, etc).
#[ObservedBy([AccountObserver::class])]
class Account extends Model
{
    // HasFactory permite generar instancias del modelo usando factories (útil para pruebas y seeders).
    // HasUuids hace que las llaves primarias del modelo sean UUIDs en vez de enteros autoincrementales.
    use HasFactory, HasUuids;

    // La propiedad $fillable define qué campos pueden ser asignados masivamente (mass assignment).
    // Esto ayuda a proteger contra asignaciones no deseadas de atributos.
    protected $fillable = ['name', 'currency', 'type', 'account_provider_id'];

    // Relación: Un Account pertenece a un User.
    // Esto permite acceder al usuario dueño de la cuenta usando $account->user.
    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function account_provider()
    {
        return $this->belongsTo(AccountProvider::class, 'account_provider_id');
    }
}
