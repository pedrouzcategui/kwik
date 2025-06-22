<?php

namespace App\Observers;

use App\Models\Contact;
use App\Models\User;

class UserObserver
{
    /**
     * Handle the User "created" event.
     */
    public function created(User $user): void
    {
        Contact::create([
            'id' => $user->id,
            'full_name' => $user->name,
            'email' => $user->email,
            'phone' => $user->phone,
            'type' => 'NATURAL',
            'user_id' => $user->id,
        ])->save();
    }

    /**
     * Handle the User "updated" event.
     */
    public function updated(User $user): void
    {
        //
    }

    /**
     * Handle the User "deleted" event.
     */
    public function deleted(User $user): void
    {
        //
    }

    /**
     * Handle the User "restored" event.
     */
    public function restored(User $user): void
    {
        //
    }

    /**
     * Handle the User "force deleted" event.
     */
    public function forceDeleted(User $user): void
    {
        //
    }
}
