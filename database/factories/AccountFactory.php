<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\User;
use Carbon\Carbon;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Account>
 */
class AccountFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'id' => fake()->unique()->uuid(),
            'user_id' => User::factory(),
            'name' => fake()->creditCardDetails()['name'],
            'currency' => fake()->randomElement(["USD", "EUR", "VES"]),
            'type' => fake()->randomElement(["CHECKING", "SAVINGS"]),
            'amount' => fake()->numberBetween(0, 5000),
            'created_at' => Carbon::create("2025", 1, 1)
        ];
    }
}
