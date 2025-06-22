<?php

namespace App\Observers;

use App\Models\Account;
use App\Models\SystemLog;
use Illuminate\Support\Facades\Auth;

class AccountObserver
{
    /**
     * Handle the Account "created" event.
     */
    public function created(Account $account): void
    {
        SystemLog::create([
            'user_id' => Auth::id(),
            'module' => 'Account',
            'action' => 'Create',
            'description' => "Created account with ID: {$account->id}",
        ]);
    }

    /**
     * Handle the Account "updated" event.
     */
    public function updated(Account $account): void
    {
        SystemLog::create([
            'user_id' => Auth::id(),
            'module' => 'Account',
            'action' => 'Update',
            'description' => "Updated account with ID: {$account->id}",
        ]);
    }

    /**
     * Handle the Account "deleted" event.
     */
    public function deleted(Account $account): void
    {


        $account->operations()->delete();

        SystemLog::create([
            'user_id' => Auth::id(),
            'module' => 'Account',
            'action' => 'Delete',
            'description' => "Deleted account with ID: {$account->id}",
        ]);
    }

    /**
     * Handle the Account "restored" event.
     */
    public function restored(Account $account): void
    {
        SystemLog::create([
            'user_id' => Auth::id(),
            'module' => 'Account',
            'action' => 'Restore',
            'description' => "Restored account with ID: {$account->id}",
        ]);
    }

    /**
     * Handle the Account "force deleted" event.
     */
    public function forceDeleted(Account $account): void
    {

        $account->operations()->withTrashed()->forceDelete();

        SystemLog::create([
            'user_id' => Auth::id(),
            'module' => 'Account',
            'action' => 'Force Delete',
            'description' => "Force deleted account with ID: {$account->id}",
        ]);
    }
}
