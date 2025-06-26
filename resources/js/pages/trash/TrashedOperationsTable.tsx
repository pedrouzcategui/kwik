import { BaseTable } from '@/components/table/BaseTable';
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
import { TrashedOperation } from '@/types/trash';
import { router } from '@inertiajs/react';
import { createColumnHelper } from '@tanstack/react-table';
import { BombIcon, CheckIcon } from 'lucide-react';
import React from 'react';
import { toast } from 'sonner';

const columnHelper = createColumnHelper<TrashedOperation>();

interface TrashedOperationsTableProps {
    operations: TrashedOperation[];
}

export default function TrashedOperationsTable({ operations }: TrashedOperationsTableProps) {
    const operationsColumns = React.useMemo(
        () => [
            columnHelper.accessor('deleted_at', {
                header: 'Fecha de Eliminación',
                cell: (info) => (
                    <span>
                        {new Date(info.getValue()).toLocaleDateString('es-ES', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                        })}
                    </span>
                ),
            }),
            // An “accessor” column for your name field
            columnHelper.accessor('account.name', {
                header: 'Nombre de la cuenta',
                cell: (info) => <span>{info.getValue()}</span>,
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
                header: () => <span>Categoría de la operación</span>,
                cell: (info) => <Badge style={{ backgroundColor: info.row.original.category.color }}>{info.getValue()}</Badge>,
                sortingFn: 'alphanumeric',
                enableGlobalFilter: true, // This makes the search filter, search using full names
            }),

            columnHelper.accessor('description', {
                header: () => <span>Descripción</span>,
                //Puedo usar truncate tambien o text-wrap
                // cell: (info) => <div className="max-w-[200px] truncate">{info.getValue()}</div>,
                cell: (info) => <div className="max-w-[300px] truncate">{info.getValue()}</div>,
                sortingFn: 'alphanumeric',
                enableGlobalFilter: true, // This makes the search filter, search using full names
            }),

            // Another display column for actions
            columnHelper.display({
                id: 'actions',
                header: 'Acciones',
                cell: (props) => {
                    const operation = props.row.original;
                    return (
                        <>
                            <AlertDialog>
                                <AlertDialogTrigger asChild className="mr-2">
                                    <Button size="sm" variant="destructive">
                                        <BombIcon />
                                    </Button>
                                </AlertDialogTrigger>

                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle className="text-center text-xl">
                                            ¿Estás seguro que quieres eliminar la operación `{operation.description}` por completo?
                                        </AlertDialogTitle>
                                        <span>Esto eliminará todas sus operaciones relacionadas.</span>
                                    </AlertDialogHeader>

                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                        <AlertDialogAction
                                            className="bg-destructive"
                                            onClick={() =>
                                                router.delete(`/operations/${operation.id}/force`, {
                                                    preserveScroll: true,
                                                    onSuccess: () => {
                                                        router.reload({ only: ['contacts', 'operations'] });
                                                        toast.success(`Eliminaste a ${operation.id}`);
                                                    },
                                                    onError: (e) => {
                                                        toast.error(`No se pudo eliminar la operación. ${e.negative_balance}`);
                                                    },
                                                })
                                            }
                                        >
                                            Sí, eliminar
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>

                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button
                                        disabled={operation.account.deleted_at !== null || operation.contact.deleted_at !== null}
                                        size="sm"
                                        variant={'outline'}
                                    >
                                        <CheckIcon />
                                    </Button>
                                </AlertDialogTrigger>

                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle className="text-center text-xl">
                                            ¿Estás seguro que deseas restaurar a {operation.id}?
                                        </AlertDialogTitle>
                                    </AlertDialogHeader>

                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                        <AlertDialogAction
                                            className="bg-success"
                                            onClick={() =>
                                                router.put(
                                                    `/operations/${operation.id}/restore`,
                                                    {
                                                        preserveScroll: true,
                                                    },
                                                    {
                                                        onSuccess: () => {
                                                            router.reload({ only: ['operations'] });
                                                            toast.success('La cuenta ha sido restaurada');
                                                        },
                                                    },
                                                )
                                            }
                                        >
                                            Sí, restaurar
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </>
                    );
                },
            }),
        ],
        [],
    );
    return <BaseTable data={operations} columns={operationsColumns} />;
}
