<?php

namespace App\Rules;

use App\Models\Account;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class HasSufficientBalance implements ValidationRule
{
    public function __construct(
        protected string    $userId,
        protected string $accountId,
    ) {}

    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $account = Account::query()
            ->where('id', $this->accountId)
            ->where('user_id', $this->userId)
            ->first(['amount', 'currency']);

        $balance = $account->amount;
        $currency = $account->currency;

        if ($balance === null || $value > $balance) {
            // $fail(__('The :attribute exceeds the account balance.'));
            $fail(__("El monto de la operación excede el total disponible en la cuenta. Por favor, ingresa un monto de $currency $balance o menos"));
        }
    }
}
