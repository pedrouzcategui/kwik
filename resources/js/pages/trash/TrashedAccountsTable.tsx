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
import { TrashedAccount } from '@/types/trash';
import { router } from '@inertiajs/react';
import { createColumnHelper } from '@tanstack/react-table';
import { BombIcon, CheckIcon } from 'lucide-react';
import React from 'react';
import { toast } from 'sonner';

const columnHelper = createColumnHelper<TrashedAccount>();

interface TrashedAccountsTableProps {
    accounts: TrashedAccount[];
}

export default function TrashedAccountsTable({ accounts }: TrashedAccountsTableProps) {
    const accountColumns = React.useMemo(
        () => [
            // An “accessor” column for your name field
            columnHelper.accessor('name', {
                header: 'Name',
                cell: (info) => <span>{info.getValue()}</span>,
            }),

            // Another display column for actions
            columnHelper.display({
                id: 'actions',
                header: 'Acciones',
                cell: (props) => {
                    const account = props.row.original;
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
                                            ¿Estás seguro que quieres eliminar a {account.name} por completo?
                                        </AlertDialogTitle>
                                        <span>Esto eliminará todas sus operaciones relacionadas.</span>
                                    </AlertDialogHeader>

                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                        <AlertDialogAction
                                            className="bg-destructive"
                                            onClick={() =>
                                                router.delete(`/accounts/${account.id}/force`, {
                                                    preserveScroll: true,
                                                    onSuccess: () => {
                                                        router.reload({ only: ['contacts'] });
                                                        toast.success(`Eliminaste a ${account.name}`);
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
                                    <Button size="sm" className="bg-yellow-500 text-white hover:bg-yellow-600">
                                        <CheckIcon />
                                    </Button>
                                </AlertDialogTrigger>

                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle className="text-center text-xl">
                                            ¿Estás seguro que deseas restaurar a {account.name}?
                                        </AlertDialogTitle>
                                    </AlertDialogHeader>

                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                        <AlertDialogAction
                                            className="bg-success"
                                            onClick={() =>
                                                router.put(
                                                    `/accounts/${account.id}/restore`,
                                                    {
                                                        preserveScroll: true,
                                                    },
                                                    {
                                                        onSuccess: () => {
                                                            router.reload({ only: ['accounts'] });
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
    return <BaseTable data={accounts} columns={accountColumns} />;
}
