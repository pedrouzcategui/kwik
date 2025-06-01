import type { ColumnFiltersState, Table as TableInstance } from '@tanstack/react-table';
import {
    ColumnDef,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
} from '@tanstack/react-table';
import React from 'react';
import { Pagination } from './Pagination';
import { TableToolbar } from './TableToolbar';
import { TableView } from './TableView';

export type BaseTableProps<T> = {
    data: T[];
    columns: ColumnDef<T, any>[];
    /** Placeholder text for the global search box */
    globalFilterPlaceholder?: string;
    renderToolbarRight?: (table: TableInstance<T>) => React.ReactNode;
    dialog?: React.ReactNode;
    /** If true, hides the toolbar */
    disableToolbar?: boolean;
};

export function BaseTable<T>({
    data,
    columns,
    globalFilterPlaceholder = 'Buscar…',
    dialog,
    renderToolbarRight,
    disableToolbar = false,
}: BaseTableProps<T>) {
    /* ── TanStack Table state ─────────────────────────────── */
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [globalFilter, setGlobalFilter] = React.useState('');

    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);

    const table = useReactTable({
        data,
        columns,
        state: { sorting, globalFilter, columnFilters },
        onSortingChange: setSorting,
        onGlobalFilterChange: setGlobalFilter,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: {
            pagination: { pageIndex: 0, pageSize: 10 },
            columnVisibility: { hidden_type: false }, // Hide the column by defaultdd
        },
    });

    /* ── Composition ──────────────────────────────────────── */
    return (
        <div className="space-y-4 p-8">
            {!disableToolbar && (
                <TableToolbar globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} placeholder={globalFilterPlaceholder}>
                    <div className="flex gap-2">{renderToolbarRight?.(table)}</div>
                    {dialog}
                </TableToolbar>
            )}

            <TableView table={table} columnsLength={columns.length} />

            <Pagination table={table} />
        </div>
    );
}
