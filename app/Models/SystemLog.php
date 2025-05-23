<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SystemLog extends Model
{
    // Especifica el nombre de la tabla asociada a este modelo
    protected $table = 'system_logs';
    // Indica que no se gestionan automáticamente las columnas created_at y updated_at
    public $timestamps = false;

    // Define los campos que pueden ser asignados masivamente
    protected $fillable = [
        'user_id',
        'module',
        'action', // Create, Update, Delete, Visit
        'description',
        'created_at',
    ];

    /**
     * Relación: Un registro de SystemLog pertenece a un usuario.
     * Permite acceder al usuario relacionado con el log.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
