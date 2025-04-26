<?php

namespace App\Listeners;

use App\Events\OperationUpserted;
use App\Models\Account;
use App\Models\Operation;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class UpdateAmountAccount
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(OperationUpserted $event): void
    {
        $op = $event->operation;
        $account = Account::find($op->account_id);
        // Check if the operation is a expense

        // Created
        // Amount + Op Amount
        if($event->action == 'created'){
            if($op->type == 'INCOME'){
                $account->amount += $op->amount;
            } else if($op->type == 'EXPENSE') {
                $account->amount -= $op->amount;
            }
        }

        // Updated Income
        // $3,000
        // Created Income $1000 (op)
        // $4,000
        // Updated Income $300 (op)
        // $4,000 -> $3,300
        // (Account Amount - (Old Income - New Income))

        // Updated Expense
        // $3,000
        // -$27 Sushi (op)
        // $2973
        // Updated Expense - $270 (op)
        // $2730
        // ((Account Balance + Prev Op Amount) - New Op Amount)

        // Update from Incom to Expense
        // 3,000
        // 250 income
        // account amount 3,250
        // update to expense and 100
        // 3250 - (250 + 100)

        // Update from Expense to Income
        // 3,000
        // 250 expense
        // account amount 2750
        // update income and set to 120
        // (2750 + 250 + 120)

        if ($event->action === 'updated') {
            $oldAmount = $op->getOriginal('amount');
            $newAmount = $op->amount;
            $oldType   = $op->getOriginal('type');
            $newType   = $op->type;
        
            if ($oldType === 'INCOME' && $newType === 'INCOME') {
                // (Old - New)
                $account->amount -= ($oldAmount - $newAmount);
        
            } elseif ($oldType === 'EXPENSE' && $newType === 'EXPENSE') {
                // (Old - New), but since it's expense, invert sign
                $account->amount += ($oldAmount - $newAmount);
        
            } elseif ($oldType === 'INCOME' && $newType === 'EXPENSE') {
                // Remove income, then apply expense
                $account->amount -= ($oldAmount + $newAmount);
        
            } elseif ($oldType === 'EXPENSE' && $newType === 'INCOME') {
                // Refund expense, then apply income
                $account->amount += ($oldAmount + $newAmount);
            }
        
            $account->save();
        }        
        

        // Deleted
        if($event->action == 'deleted'){
            if($op->type == 'INCOME'){
                $account->amount -= $op->amount;
            } else if($op->type == 'EXPENSE') {
                $account->amount += $op->amount;
            }
        }
        // Deleted Income
        // $3,000
        // +$500
        // New income 3500
        // Delete operation
        // Amount - Op

        // Deleted Expense
        // 3000
        // - $500
        // 2500
        // deleted op 500
        // Amount + Op
        $account->update();
               
    }
}
