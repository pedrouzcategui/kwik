<?php

namespace Database\Seeders;

use App\Models\Contact;
use App\Models\User;
use App\Models\Account;
use App\Models\AccountProvider;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $user = User::factory()->create();

        // Create some account providers
        $providers = AccountProvider::factory()
            ->count(3)
            ->for($user)
            ->create();

        // Create contacts for the user
        Contact::factory()
            ->count(10)
            ->for($user)
            ->create();

        // Create accounts with random providers
        Account::factory()
            ->count(10)
            ->for($user)
            ->state(function () use ($providers) {
                return [
                    'account_provider_id' => $providers->random()->id,
                ];
            })
            ->create();
    }
}
