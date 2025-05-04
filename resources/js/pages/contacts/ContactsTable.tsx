import { BaseTable } from '@/components/BaseTable';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Contact } from '@/types/contact';
import { Link, router } from '@inertiajs/react';
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
} from '@tanstack/react-table';
import React from 'react';

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
                        <Button size="sm">Editar</Button>
                    </Link>
                    <Button
                        onClick={() => {
                            router.delete(`/contacts/${contact.id}`, {
                                preserveScroll: true,
                                onSuccess: () => router.reload({ only: ['contacts'] }),
                            });
                        }}
                        size="sm"
                    >
                        Eliminar
                    </Button>
                </div>
            );
        },
        enableGlobalFilter: false, // In this case of course we don't want to search for this
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

    return (
           <BaseTable data={contacts} columns={columns} modelName={'Contact'} /> 
    );
}
