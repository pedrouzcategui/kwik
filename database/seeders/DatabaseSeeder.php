<?php

namespace Database\Seeders;

use App\Models\Contact;
use App\Models\User;
use App\Models\Account;
use App\Models\AccountProvider;
use App\Models\Category;
use App\Models\Operation;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $user = User::factory()->create();
        $this->call(AccountProviderSeeder::class);
        $providers = AccountProvider::all();
        // Create contacts for the user
        $contacts = Contact::factory()
            ->count(10)
            ->for($user)
            ->create();

        // Create accounts with random providers
        $accounts = Account::factory()
            ->count(10)
            ->for($user)
            ->state(function () use ($providers) {
                return [
                    'account_provider_id' => $providers->random()->id,
                ];
            })
            ->create();

        $this->call(CategorySeeder::class);
        $categories = Category::all();

        Operation::factory()
            ->count(50)
            ->for($user)
            ->state(function () use ($contacts, $accounts, $categories) {
                return [
                    'contact_id' => $contacts->random()->id,
                    'account_id' => $accounts->random()->id,
                    'category_id' => $categories->random()->id
                ];
            })
            ->create();
    }
}
