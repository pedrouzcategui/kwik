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
import { Button } from '@/components/ui/button';
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
            // An “accessor” column for your name field
            columnHelper.accessor('account.name', {
                header: 'Name',
                cell: (info) => <span>{info.getValue()}</span>,
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
                                <AlertDialogTrigger asChild>
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
                                                        router.reload({ only: ['contacts'] });
                                                        toast.success(`Eliminaste a ${operation.id}`);
                                                    },
                                                    onError: (e) => {
                                                        console.log(e);
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
                                        disabled={operation.account.deleted_at === null}
                                        size="sm"
                                        className="bg-yellow-500 text-white hover:bg-yellow-600"
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
