<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;

use App\Observers\UserObserver;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

#[ObservedBy([UserObserver::class])]
class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    // Traits usados:
    use HasFactory, // Permite la generación de instancias de User usando factories (útil para tests y seeders)
        Notifiable, // Habilita el envío de notificaciones al usuario
        HasUuids,   // Hace que la clave primaria sea un UUID en vez de un entero autoincremental
        HasApiTokens; // Permite la autenticación vía tokens API usando Laravel Sanctum

    protected $keyType = 'string';
    public $incrementing = false;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'alert_threshold_amount',
        'danger_threshold_amount'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Relación uno a muchos: Un usuario puede tener muchos contactos.
     */
    public function contacts(): HasMany
    {
        return $this->hasMany(Contact::class);
    }

    /**
     * Relación uno a muchos: Un usuario puede tener muchas cuentas.
     */
    public function accounts(): HasMany
    {
        return $this->hasMany(Account::class);
    }

    /**
     * Relación uno a muchos: Un usuario puede tener muchas operaciones.
     */
    public function operations(): HasMany
    {
        return $this->hasMany(Operation::class);
    }

    public function getTotalAccountBalanceInUSD(): float
    {
        $accounts = $this->accounts()->select('amount', 'currency')->get();

        $rates = ExchangeRate::where('source_type', 'official')
            ->select('currency_code', 'rate_to_usd')
            ->get()
            ->unique('currency_code')
            ->pluck('rate_to_usd', 'currency_code');

        return round($accounts->reduce(function ($total, $account) use ($rates) {
            $rate = $rates[$account->currency] ?? 1;
            return $total + ($account->amount * $rate);
        }, 0), 2);
    }
}
