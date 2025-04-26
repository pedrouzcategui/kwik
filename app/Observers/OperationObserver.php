<?php

namespace App\Observers;

use App\Models\Operation;

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
                // (Old - New)
                $operation->account->amount -= ($oldAmount - $newAmount);
        
            } elseif ($oldType === 'EXPENSE' && $newType === 'EXPENSE') {
                // (Old - New), but since it's expense, invert sign
                $$operation->account->amount += ($oldAmount - $newAmount);
        
            } elseif ($oldType === 'INCOME' && $newType === 'EXPENSE') {
                // Remove income, then apply expense
                $operation->account->amount -= ($oldAmount + $newAmount);
        
            } elseif ($oldType === 'EXPENSE' && $newType === 'INCOME') {
                // Refund expense, then apply income
                $operation->account->amount += ($oldAmount + $newAmount);
            }
        
            $operation->account->update();
    }

    /**
     * Handle the Operation "deleted" event.
     */
    public function deleted(Operation $operation): void
    {
        if ($operation->type == 'INCOME') {
            $operation->account->amount -= $operation->amount;
        } else if ($operation->type == 'EXPENSE') {
            $operation->account->amount += $operation->amount;
        }
        $operation->account->save();
    }

    /**
     * Handle the Operation "restored" event.
     */
    public function restored(Operation $operation): void
    {
        //
    }

    /**
     * Handle the Operation "force deleted" event.
     */
    public function forceDeleted(Operation $operation): void
    {
        //
    }
}
