import OperationsTableDialog from '@/components/dialogs/OperationsTableDialog';
import { BaseTable } from '@/components/table/BaseTable';
import { ExportButton } from '@/components/table/ExportButton';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { currencyMap } from '@/lib/utils';
import { Account } from '@/types/account';
import { Category } from '@/types/category';
import { Contact } from '@/types/contact';
import { OperationTableColumns } from '@/types/operation';
import { router } from '@inertiajs/react';
import { createColumnHelper } from '@tanstack/react-table';
import { PencilIcon, Trash2Icon } from 'lucide-react';
import React from 'react';
import { toast } from 'sonner';
import { CategoryFilter } from './filters/CategoryFilter';
import { ContactFilter } from './filters/ContactFilter';
import { OperationTypeFilter } from './filters/OperationTypeFilter';

const columnHelper = createColumnHelper<OperationTableColumns>();

interface OperationsTableProps {
    operations: OperationTableColumns[];
    user: {
        contacts: Contact[];
        accounts: Account[];
    };
    categories: Category[];
    contacts: Contact[];
}

export default function OperationsTable({ operations, user, categories, contacts }: OperationsTableProps) {
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);
    const [selectedOperation, setSelectedOperation] = React.useState<OperationTableColumns>();
    const columns = [
        columnHelper.accessor('created_at', {
            header: () => <span>Fecha de Creación</span>,
            //Puedo usar truncate tambien o text-wrap
            // cell: (info) => <div className="max-w-[200px] truncate">{info.getValue()}</div>,
            cell: (info) => (
                <div className="max-w-[300px] truncate">
                    {new Date(info.getValue()).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                    })}
                </div>
            ),
            sortingFn: 'datetime',
        }),
        columnHelper.accessor('description', {
            header: () => <span>Descripción</span>,
            //Puedo usar truncate tambien o text-wrap
            // cell: (info) => <div className="max-w-[200px] truncate">{info.getValue()}</div>,
            cell: (info) => <div className="max-w-[300px] truncate">{info.getValue()}</div>,
            sortingFn: 'alphanumeric',
            enableGlobalFilter: true, // This makes the search filter, search using full names
        }),
        columnHelper.accessor('account.name', {
            header: () => <span>Nombre de la cuenta</span>,
            cell: (info) => info.getValue(),
            sortingFn: 'alphanumeric',
            enableGlobalFilter: true, // This makes the search filter, search using full names
        }),
        columnHelper.accessor('type', {
            id: 'hidden_type',
            header: () => <span>Tipo</span>,
            cell: (info) => info.getValue(),
            enableGlobalFilter: false,
        }),
        columnHelper.accessor(
            /* 1️⃣  Return a *signed* number  */
            (row) => (row.type === 'EXPENSE' ? -Number(row.amount) : Number(row.amount)),
            {
                id: 'amount', // stable key for filters/sorts

                header: () => <span>Monto</span>,

                /* 2️⃣  Presentational badge — keeps the sign for the user */
                cell: ({ row }) => {
                    const { amount, type, account } = row.original;
                    const symbol = currencyMap[account.currency];
                    const signed = type === 'EXPENSE' ? '-' : '+';

                    return (
                        <Badge variant={type === 'INCOME' ? 'success' : 'destructive'}>
                            <b>{signed}</b> {symbol}
                            {amount}
                        </Badge>
                    );
                },

                sortingFn: 'basic',

                sortDescFirst: true, // first click → ▼

                enableGlobalFilter: true,
            },
        ),
        columnHelper.accessor('contact.full_name', {
            header: () => <span>Contacto</span>,
            id: 'contact_name',
            cell: (info) => info.getValue(),
            sortingFn: 'alphanumeric',
            enableGlobalFilter: true, // This makes the search filter, search using full names
        }),
        columnHelper.accessor('category.name', {
            id: 'category_name',
            header: () => <span>Categoria de la operación</span>,
            cell: (info) => <Badge style={{ backgroundColor: info.row.original.category.color }}>{info.getValue()}</Badge>,
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
                                <AlertDialogHeader className="text-center">
                                    <AlertDialogTitle className="text-xl">
                                        ¿Estás seguro que quieres eliminar la operación {operation.contact.full_name} - {operation.description}?
                                    </AlertDialogTitle>
                                    <span>No hay vuelta atrás.</span>
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
            renderToolbarRight={(table) => (
                <>
                    <ContactFilter table={table} contacts={contacts} />
                    <CategoryFilter table={table} categories={categories} />
                    <OperationTypeFilter table={table} />
                    <ExportButton table={table} filename="Operaciones" headers={['account_name', 'amount', 'contact_name', 'description'] as any} />
                </>
            )}
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
