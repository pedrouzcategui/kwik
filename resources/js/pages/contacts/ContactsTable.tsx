import { BaseTable } from '@/components/BaseTable';
import {
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Contact } from '@/types/contact';
import { Link, router } from '@inertiajs/react';
import { AlertDialog } from '@radix-ui/react-alert-dialog';
import { createColumnHelper, getCoreRowModel, getFilteredRowModel, getSortedRowModel, SortingState, useReactTable } from '@tanstack/react-table';
import { PencilIcon, Trash2Icon } from 'lucide-react';
import React from 'react';
import { toast } from 'sonner';

const columnHelper = createColumnHelper<Contact>();

const columns = [
    columnHelper.accessor('full_name', {
        header: () => <span>Nombre Completo</span>,
        cell: (info) => info.getValue(),
        sortingFn: 'alphanumeric',
        enableGlobalFilter: true, // This makes the search filter, search using full names
    }),
    columnHelper.accessor('email', {
        header: () => <span>Correo Electronico</span>,
        cell: (info) => info.getValue(),
        sortingFn: 'alphanumeric',
        enableGlobalFilter: true, // Same as above but with emails
    }),
    columnHelper.accessor('phone', {
        header: () => <span>Telefono</span>,
        cell: (info) => info.getValue(),
        sortingFn: 'alphanumeric',
        enableGlobalFilter: true,
    }),
    columnHelper.display({
        id: 'actions',
        header: () => <span>Acciones</span>,
        cell: (props) => {
            const contact: Contact = props.row.original;

            return (
                <div className="flex gap-2">
                    <Link href={`/contacts/${contact.id}/edit`}>
                        <Button size="sm">
                            {' '}
                            <PencilIcon />{' '}
                        </Button>{' '}
                    </Link>

                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button size="sm" variant="destructive">
                                <Trash2Icon />
                            </Button>
                        </AlertDialogTrigger>

                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle className="text-center text-xl">
                                    ¿Estás seguro que quieres eliminar a {contact.full_name}?
                                </AlertDialogTitle>
                                <span>Esto eliminará todas sus operaciones relacionadas, y es posible que tus cuentas cambien drasticamente.</span>
                            </AlertDialogHeader>

                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                    className="bg-destructive"
                                    onClick={() =>
                                        router.delete(`/contacts/${contact.id}`, {
                                            preserveScroll: true,
                                            onSuccess: () => {
                                                router.reload({ only: ['contacts'] });
                                                toast.success(`Eliminaste a ${contact.full_name}`);
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
    }),
];

interface ContactTableProps {
    contacts: Contact[];
}

export default function ContactsTable({ contacts }: ContactTableProps) {
    const [data, setData] = React.useState<Contact[]>(contacts);
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [globalFilter, setGlobalFilter] = React.useState(''); // Input state

    React.useEffect(() => {
        setData(contacts);
    }, [contacts]);

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
            globalFilter,
        },
        onSortingChange: setSorting,
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
    });

    return <BaseTable data={contacts} columns={columns} modelName={'Contact'} />;
}
