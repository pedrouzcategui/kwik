<?php

namespace Database\Seeders;

use App\Models\{
    Account,
    AccountProvider,
    Category,
    Contact,
    Operation,
    User
};
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // ─── Users ────────────────────────────────────────────────────────────────
        $user = User::factory()->create();

        // ─── Providers & Accounts ────────────────────────────────────────────────
        $this->call(AccountProviderSeeder::class);
        $providers = AccountProvider::all();

        $accounts = Account::factory()
            ->count(10)
            ->for($user)
            ->state(fn() => [
                'account_provider_id' => $providers->random()->id,
            ])
            ->create();

        // ─── Contacts ────────────────────────────────────────────────────────────
        $contacts = Contact::factory()
            ->count(10)
            ->for($user)
            ->create();

        // ─── Categories ──────────────────────────────────────────────────────────
        $this->call(CategorySeeder::class);
        $categories        = Category::all();
        $incomeCategories  = $categories->where('type', 'INCOME')->values();
        $expenseCategories = $categories->where('type', 'EXPENSE')->values();

        // ─── INCOME operations ───────────────────────────────────────────────────
        Operation::factory()
            ->count(25)
            ->for($user)
            ->state(fn() => [
                'type'        => 'INCOME',                        // make sure the op itself is income
                'contact_id'  => $contacts->random()->id,
                'account_id'  => $accounts->random()->id,
                'category_id' => $incomeCategories->random()->id, // ← only INCOME cats
            ])
            ->create();

        // ─── EXPENSE operations ──────────────────────────────────────────────────
        Operation::factory()
            ->count(25)
            ->for($user)
            ->state(fn() => [
                'type'        => 'EXPENSE',
                'contact_id'  => $contacts->random()->id,
                'account_id'  => $accounts->random()->id,
                'category_id' => $expenseCategories->random()->id, // ← only EXPENSE cats
            ])
            ->create();
    }
}
