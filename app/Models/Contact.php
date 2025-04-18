<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Contact extends Model
{
    // When using UUIDs as Primary Keys in Laravel, you must use this trait.
    use HasFactory, HasUuids;

    protected $fillable = ['full_name', 'email', 'phone'];
    protected $hidden = ['user_id']; // I don't need to show this shit to the user
    protected $table = 'contacts';
    protected $primaryKey = 'id';
    public $incrementing = false; // Because we're using UUIDs
    protected $keyType = 'string'; // Becaue we're using UUIDs;

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
