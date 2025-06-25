import { Account } from '@/types/account';
import { Category } from '@/types/category';
import { Contact } from '@/types/contact';
import { OperationTableColumns } from '@/types/operation';
import { Dispatch, SetStateAction } from 'react';
import OperationForm from '../forms/operations/OperationsForm';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';

type OperationsTableDialogProps = {
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
    selectedOperation?: OperationTableColumns;
    setSelectedOperation: Dispatch<SetStateAction<OperationTableColumns | undefined>>;
    contacts: Contact[];
    accounts: Account[];
    categories: Category[];
};

export default function OperationsTableDialog({
    selectedOperation,
    setSelectedOperation,
    isOpen,
    setIsOpen,
    contacts,
    accounts,
    categories,
}: OperationsTableDialogProps) {
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger
                asChild
                onClick={() => {
                    setIsOpen(true);
                    setSelectedOperation(undefined);
                }}
            >
                <Button>Crear Nueva Operación</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="mb-4">{selectedOperation ? 'Editar' : 'Crear'} Operación</DialogTitle>
                    <OperationForm
                        user={{
                            contacts,
                            accounts,
                        }}
                        operation={selectedOperation}
                        categories={categories}
                        setIsOpen={setIsOpen}
                    />
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}
