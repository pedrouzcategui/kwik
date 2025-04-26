<?php

namespace App\Models;

use App\Observers\OperationObserver;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;

#[ObservedBy([OperationObserver::class])]
class Operation extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'contact_id',
        'account_id',
        'category_id',
        'amount',
        'type',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
    public function contact(): BelongsTo
    {
        return $this->belongsTo(Contact::class);
    }
    public function account(): BelongsTo
    {
        return $this->belongsTo(Account::class);
    }

    
  
    
}
