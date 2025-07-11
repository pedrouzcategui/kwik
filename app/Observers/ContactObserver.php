<?php

namespace App\Observers;

use App\Models\Contact;
use App\Models\SystemLog;
use Illuminate\Support\Facades\Auth;

class ContactObserver
{
    /**
     * Handle the Contact "created" event.
     */
    public function created(Contact $contact): void
    {
        SystemLog::create([
            'user_id' => Auth::id(),
            'module' => 'Contact',
            'action' => 'Create',
            'description' => "Created contact with ID: {$contact->id}",
        ]);
    }

    /**
     * Handle the Contact "updated" event.
     */
    public function updated(Contact $contact): void
    {
        SystemLog::create([
            'user_id' => Auth::id(),
            'module' => 'Contact',
            'action' => 'Update',
            'description' => "Updated contact with ID: {$contact->id}",
        ]);
    }

    /**
     * Handle the Contact "deleted" event.
     */
    public function deleted(Contact $contact): void
    {

        if ($contact->isForceDeleting()) {
            // hard-delete everything
            $contact->operations()->withTrashed()->forceDelete();
        } else {
            // SOFT delete one by one -> observers fire
            $contact->operations   // already a Collection if the relation was eager-loaded
                ->each
                ->delete();    // fires OperationObserver::deleted
        }
        SystemLog::create([
            'user_id' => Auth::id(),
            'module' => 'Contact',
            'action' => 'Delete',
            'description' => "Deleted contact with ID: {$contact->id}",
        ]);
    }

    /**
     * Handle the Contact "restored" event.
     */
    public function restored(Contact $contact): void
    {
        SystemLog::create([
            'user_id' => Auth::id(),
            'module' => 'Contact',
            'action' => 'Restore',
            'description' => "Restored contact with ID: {$contact->id}",
        ]);
    }

    /**
     * Handle the Contact "force deleted" event.
     */
    public function forceDeleted(Contact $contact): void
    {
        $contact->operations()->withTrashed()->forceDelete();

        SystemLog::create([
            'user_id' => Auth::id(),
            'module' => 'Contact',
            'action' => 'Force Delete',
            'description' => "Force deleted contact with ID: {$contact->id}",
        ]);
    }
}
