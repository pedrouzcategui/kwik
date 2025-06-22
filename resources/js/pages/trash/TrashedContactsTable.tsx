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
import { TrashedContact } from '@/types/trash';
import { router } from '@inertiajs/react';
import { createColumnHelper } from '@tanstack/react-table';
import { BombIcon, CheckIcon } from 'lucide-react';
import React from 'react';
import { toast } from 'sonner';

const columnHelper = createColumnHelper<TrashedContact>();

interface TrashedContactsTableProps {
    contacts: TrashedContact[];
}

export default function TrashedContactsTable({ contacts }: TrashedContactsTableProps) {
    const contactColumns = React.useMemo(
        () => [
            // An “accessor” column for your name field
            columnHelper.accessor('full_name', {
                header: 'Name',
                cell: (info) => <span>{info.getValue()}</span>,
            }),

            // Another display column for actions
            columnHelper.display({
                id: 'actions',
                header: 'Acciones',
                cell: (props) => {
                    const contact = props.row.original;
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
                                            ¿Estás seguro que quieres eliminar a {contact.full_name} por completo?
                                        </AlertDialogTitle>
                                        <span>Esto eliminará todas sus operaciones relacionadas.</span>
                                    </AlertDialogHeader>

                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                        <AlertDialogAction
                                            className="bg-destructive"
                                            onClick={() =>
                                                router.delete(`/contacts/${contact.id}/force`, {
                                                    preserveScroll: true,
                                                    onSuccess: () => {
                                                        router.reload({ only: ['contacts', 'operations'] });
                                                        toast.success(`Eliminaste a ${contact.full_name}`);
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
                                            ¿Estás seguro que deseas restaurar a {contact.full_name}?
                                        </AlertDialogTitle>
                                    </AlertDialogHeader>

                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                        <AlertDialogAction
                                            className="bg-success"
                                            onClick={() =>
                                                router.put(
                                                    `/contacts/${contact.id}/restore`,
                                                    {
                                                        preserveScroll: true,
                                                    },
                                                    {
                                                        onSuccess: () => {
                                                            router.reload({ only: ['contacts', 'operations'] });
                                                            toast.success('El contacto ha sido restaurado');
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
    return <BaseTable data={contacts} columns={contactColumns} />;
}
