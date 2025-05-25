<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\Contact;
use App\Models\Account;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Operation>
 */
class OperationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'contact_id' => Contact::factory(),
            'account_id' => Account::factory(),
            'amount' => fake()->numberBetween(50, 500),
            'type' => fake()->randomElement(['INCOME', 'EXPENSE']),
            'description' => fake()->text(250),
            'created_at' => Carbon::now()
        ];
    }
}
