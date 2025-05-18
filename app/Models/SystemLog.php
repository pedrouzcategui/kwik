<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SystemLog extends Model
{
    protected $table = 'system_logs';
    public $timestamps = false;

    protected $fillable = [
        'user_id',
        'module',
        'action', // Create, Update, Delete, Visit`
        'description',
        'created_at',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
