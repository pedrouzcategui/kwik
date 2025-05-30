import { Account, AccountProvider } from '@/types/account';
import { Dispatch, SetStateAction } from 'react';
import AccountForm from '../forms/accounts/AccountForm';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';

type AccountsTableDialogProps = {
    account?: Account;
    providers: AccountProvider[];
    isOpen: boolean;
    setIsOpen: (x: boolean) => any;
    setSelectedAccount: Dispatch<SetStateAction<Account | undefined>>;
};

export default function AccountsTableDialog({ account, providers, setSelectedAccount, isOpen, setIsOpen }: AccountsTableDialogProps) {
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger
                asChild
                onClick={() => {
                    setIsOpen(true);
                    setSelectedAccount(undefined);
                }}
            >
                <Button>Crear Nueva Cuenta</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="mb-4">{account ? 'Editar' : 'Crear'} Cuenta</DialogTitle>
                    <AccountForm account={account} setIsOpen={setIsOpen} providers={providers} />
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}
