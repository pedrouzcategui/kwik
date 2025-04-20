<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Account extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = ['name', 'currency', 'type', 'account_provider_id'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
