<?php

namespace App\Observers;

use App\Models\Operation;
use App\Models\SystemLog;
use Illuminate\Support\Facades\Auth;

class OperationObserver
{
    /**
     * Handle the Operation "created" event.
     */
    public function created(Operation $operation): void
    {
        if ($operation->type == 'INCOME') {
            $operation->account->amount += $operation->amount;
        } else if ($operation->type == 'EXPENSE') {
            $operation->account->amount -= $operation->amount;
        }
        $operation->account->save();

        SystemLog::create([
            'user_id' => Auth::id(),
            'module' => 'Operation',
            'action' => 'Create',
            'description' => "Created operation with ID: {$operation->id}",
        ]);
    }

    /**
     * Handle the Operation "updating" event.
     */
    public function updating(Operation $operation): void
    {
        $oldAmount = $operation->getOriginal('amount');
        $newAmount = $operation->amount;
        $oldType   = $operation->getOriginal('type');
        $newType   = $operation->type;

        if ($oldType === 'INCOME' && $newType === 'INCOME') {
            $operation->account->amount -= ($oldAmount - $newAmount);
        } elseif ($oldType === 'EXPENSE' && $newType === 'EXPENSE') {
            $operation->account->amount += ($oldAmount - $newAmount);
        } elseif ($oldType === 'INCOME' && $newType === 'EXPENSE') {
            $operation->account->amount -= ($oldAmount + $newAmount);
        } elseif ($oldType === 'EXPENSE' && $newType === 'INCOME') {
            $operation->account->amount += ($oldAmount + $newAmount);
        }

        $operation->account->update();

        SystemLog::create([
            'user_id' => Auth::id(),
            'module' => 'Operation',
            'action' => 'Update',
            'description' => "Updated operation with ID: {$operation->id}",
        ]);
    }

    /**
     * Handle the Operation "deleted" event.
     */
    public function deleted(Operation $operation): void
    {

        if ($operation->isForceDeleting()) {
            return;
        }
        // fetch the parent even if it’s soft-deleted
        $account = $operation->account()->withTrashed()->first();

        if (! $account) {
            return;   // safety net – should never happen
        }

        if ($operation->type === 'INCOME') {
            $account->decrement('amount', $operation->amount);   // atomic SQL
        } else { // EXPENSE
            $account->increment('amount', $operation->amount);
        }

        SystemLog::create([
            'user_id'     => Auth::id(),
            'module'      => 'Operation',
            'action'      => 'Delete',
            'description' => "Deleted operation with ID: {$operation->id}",
        ]);
    }

    /**
     * Handle the Operation "restored" event.
     */
    public function restored(Operation $operation): void
    {
        $account = $operation->account;     // already "trash-aware" if you added ->withTrashed()
        if ($operation->type === 'INCOME') {
            $account->increment('amount', $operation->amount);
        } else { // EXPENSE
            $account->decrement('amount', $operation->amount);
        }

        SystemLog::create([
            'user_id' => Auth::id(),
            'module' => 'Operation',
            'action' => 'Restore',
            'description' => "Restored operation with ID: {$operation->id}",
        ]);
    }

    /**
     * Handle the Operation "force deleted" event.
     */
    public function forceDeleted(Operation $operation): void
    {
        SystemLog::create([
            'user_id' => Auth::id(),
            'module' => 'Operation',
            'action' => 'Force Delete',
            'description' => "Force deleted operation with ID: {$operation->id}",
        ]);
    }
}
