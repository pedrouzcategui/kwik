import { BaseTable } from '@/components/table/BaseTable';
import OperationsTableDialog from '@/components/dialogs/OperationsTableDialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { currencyMap } from '@/lib/utils';
import { Account } from '@/types/account';
import { Category } from '@/types/category';
import { Contact } from '@/types/contact';
import { Operation, OperationTableColumns } from '@/types/operation';
import { router } from '@inertiajs/react';
import { createColumnHelper } from '@tanstack/react-table';
import { PencilIcon, Trash2Icon } from 'lucide-react';
import React from 'react';
import { toast } from 'sonner';

const columnHelper = createColumnHelper<OperationTableColumns>();

interface OperationsTableProps {
    operations: OperationTableColumns[];
    user: {
        contacts: Contact[];
        accounts: Account[];
    };
    categories: Category[];
}

export default function OperationsTable({ operations, user, categories }: OperationsTableProps) {
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);
    const [selectedOperation, setSelectedOperation] = React.useState<OperationTableColumns>();
    const columns = [
        columnHelper.accessor('account.name', {
            header: () => <span>Nombre de la cuenta</span>,
            cell: (info) => info.getValue(),
            sortingFn: 'alphanumeric',
            enableGlobalFilter: true, // This makes the search filter, search using full names
        }),
        columnHelper.accessor('amount', {
            header: () => <span>Monto de la opearcion</span>,
            cell: (info) => {
                let symbol = currencyMap[info.row.original.account.currency];
                return (
                    <Badge variant={info.row.original.type == 'INCOME' ? 'success' : 'destructive'}>
                        <b>
                            {info.row.original.type == 'INCOME' ? '+' : '-'} {symbol}
                        </b>
                        {info.getValue()}
                    </Badge>
                );
            },
            sortingFn: 'alphanumeric',
            enableGlobalFilter: true, // This makes the search filter, search using full names
        }),
        columnHelper.accessor('contact.full_name', {
            header: () => <span>Contacto</span>,
            cell: (info) => info.getValue(),
            sortingFn: 'alphanumeric',
            enableGlobalFilter: true, // This makes the search filter, search using full names
        }),
        columnHelper.accessor('category.name', {
            header: () => <span>Categoria de la operacion</span>,
            cell: (info) => <Badge style={{ backgroundColor: info.row.original.category.color }}>{info.getValue()}</Badge>,
            sortingFn: 'alphanumeric',
            enableGlobalFilter: true, // This makes the search filter, search using full names
        }),
        columnHelper.accessor('description', {
            header: () => <span>Descipcion</span>,
            //Puedo usar truncate tambien o text-wrap
            cell: (info) => <div className="max-w-[200px] truncate">{info.getValue()}</div>,
            sortingFn: 'alphanumeric',
            enableGlobalFilter: true, // This makes the search filter, search using full names
        }),
        columnHelper.display({
            id: 'actions',
            header: () => <span>Acciones</span>,
            cell: (props) => {
                const operation: OperationTableColumns = props.row.original;
                return (
                    <div className="flex gap-2">
                        <Button
                            size="sm"
                            onClick={() => {
                                setSelectedOperation(operation);
                                setIsDialogOpen(true);
                            }}
                        >
                            <PencilIcon />
                        </Button>

                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button size="sm" variant="destructive">
                                    <Trash2Icon />
                                </Button>
                            </AlertDialogTrigger>

                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle className="text-center text-xl">
                                        ¿Estás seguro que quieres eliminar la cuenta {operation.id}?
                                    </AlertDialogTitle>
                                    <span>Esto eliminará todas las operaciones asociadas a esta cuenta.</span>
                                </AlertDialogHeader>

                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction
                                        className="bg-destructive"
                                        onClick={() =>
                                            router.delete(`/operations/${operation.id}`, {
                                                preserveScroll: true,
                                                onSuccess: () => {
                                                    toast.success(`La cuenta ${operation.id} ha sido eliminada exitosamente.`);
                                                    router.reload({ only: ['accounts'] });
                                                },
                                            })
                                        }
                                    >
                                        Sí, eliminar
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                );
            },
            enableGlobalFilter: false, // In this case of course we don't want to search for this
        }),
    ];
    return (
        <BaseTable
            data={operations}
            columns={columns}
            globalFilterPlaceholder="Busca tu operacion"
            modelName="operation"
            dialog={
                <OperationsTableDialog
                    isOpen={isDialogOpen}
                    selectedOperation={selectedOperation}
                    setIsOpen={setIsDialogOpen}
                    setSelectedOperation={setSelectedOperation}
                    contacts={user.contacts}
                    accounts={user.accounts}
                    categories={categories}
                />
            }
        />
    );
}
