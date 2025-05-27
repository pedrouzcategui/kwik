<?php

namespace Database\Factories;

use App\Models\Contact;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Contact>
 */
class ContactFactory extends Factory
{

    protected $model = Contact::class;

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
            'full_name' => fake()->name(),
            'email' => fake()->safeEmail(),
            'type' => fake()->randomElement(['NATURAL', 'GOVERNMENT', 'BUSINESS', 'NON-PROFIT', 'INSTITUTIONAL']),
            'phone' => fake()->unique()->e164PhoneNumber(),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
