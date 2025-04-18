import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Contact } from '@/types/contact';
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import React from 'react';

const columnHelper = createColumnHelper<Contact>();

const columns = [
    columnHelper.accessor('id', {
        header: () => <span>ID</span>,
        cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('full_name', {
        header: () => <span>Nombre Completo</span>,
        cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('email', {
        header: () => <span>Correo Electronico</span>,
        cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('phone', {
        header: () => <span>Telefono</span>,
        cell: (info) => info.getValue(),
    }),
];
interface ContactTableProps {
    contacts: Contact[];
}
export default function ContactsTable({ contacts }: ContactTableProps) {
    // Why this React.useState() call like this? Why you need to spread the contacts in an array?
    // When react uses a function inside useState, is called a "Lazy Initializer"
    // The reason we do the spreading in the [...contacts] part, is because we want to create a copy of this array, and not directly mutate it.
    const [data, _setData] = React.useState(() => [...contacts]);
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getRowId: (row) => row.id,
    });
    return (
        <Table>
            <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                            <TableHead key={header.id}>
                                {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                            </TableHead>
                        ))}
                    </TableRow>
                ))}
            </TableHeader>
            <TableBody>
                {table.getRowModel().rows.map((row, i) => (
                    <TableRow key={row.id}>
                        {row.getVisibleCells().map((cell) => (
                            <TableCell id={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                        ))}
                    </TableRow>
                ))}
                <TableRow>
                    <TableCell></TableCell>
                </TableRow>
            </TableBody>
        </Table>
    );
}
