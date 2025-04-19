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
                    <Link href={`/contacts/${contact.id}`}>
                        <Button size="sm">Editar</Button>
                    </Link>
                    <Button
                        onClick={() => {
                            router.delete(`/contacts/${contact.id}`);
                            location.reload();
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
    const [data] = React.useState(() => [...contacts]);
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [globalFilter, setGlobalFilter] = React.useState(''); // Input state

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
        <div className="p-8">
            <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <input
                    type="text"
                    value={globalFilter}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    placeholder="Buscar por nombre, email o teléfono..."
                    className="w-full rounded border p-2 md:w-96"
                />
                <Button asChild size={'lg'}>
                    <Link href="/contacts/create">Add New Contact</Link>
                </Button>
            </div>

            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <TableHead key={header.id}>
                                    {header.isPlaceholder ? null : (
                                        <div
                                            className={header.column.getCanSort() ? 'cursor-pointer select-none' : ''}
                                            onClick={header.column.getToggleSortingHandler()}
                                            title={
                                                header.column.getCanSort()
                                                    ? header.column.getNextSortingOrder() === 'asc'
                                                        ? 'Sort ascending'
                                                        : header.column.getNextSortingOrder() === 'desc'
                                                          ? 'Sort descending'
                                                          : 'Clear sort'
                                                    : undefined
                                            }
                                        >
                                            {flexRender(header.column.columnDef.header, header.getContext())}
                                            {{
                                                asc: ' 🔼',
                                                desc: ' 🔽',
                                            }[header.column.getIsSorted() as string] ?? null}
                                        </div>
                                    )}
                                </TableHead>
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows.map((row) => (
                        <TableRow key={row.id}>
                            {row.getVisibleCells().map((cell) => (
                                <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                            ))}
                        </TableRow>
                    ))}
                    {table.getRowModel().rows.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={columns.length} className="text-center">
                                No hay resultados
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
