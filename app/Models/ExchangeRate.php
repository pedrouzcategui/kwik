<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ExchangeRate extends Model
{
    protected $fillable = [
        'currency_code',
        'rate_to_usd',
        'effective_date',
        'source_type',
        'source',
    ];

    protected $casts = [
        'effective_date' => 'date',
    ];
}
