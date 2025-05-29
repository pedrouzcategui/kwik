import { TableBody, TableCell, TableHead, TableHeader, TableRow, Table as UiTable } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { flexRender, Header, Table as TableInstance } from '@tanstack/react-table';
import { ArrowDown, ArrowUp } from 'lucide-react';

type Props<T> = {
    table: TableInstance<T>;
    /** Needed for the “no results” colspan */
    columnsLength: number;
};

export function TableView<T>({ table, columnsLength }: Props<T>) {
    return (
        <UiTable>
            {/* ── Header groups ─────────────────────────────── */}
            <TableHeader className="dark:bg-slate-900">
                {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                            <TableHead key={header.id}>{header.isPlaceholder ? null : <HeaderCell header={header} />}</TableHead>
                        ))}
                    </TableRow>
                ))}
            </TableHeader>

            {/* ── Body ──────────────────────────────────────── */}
            <TableBody>
                {table.getRowModel().rows.length > 0 ? (
                    table.getRowModel().rows.map((row) => (
                        <TableRow key={row.id}>
                            {row.getVisibleCells().map((cell) => (
                                <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                            ))}
                        </TableRow>
                    ))
                ) : (
                    <TableRow>
                        <TableCell colSpan={columnsLength} className="text-center">
                            No hay resultados
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </UiTable>
    );
}

/* Helper for sortable header cells */
function HeaderCell({ header }: { header: Header<any, unknown> }) {
    return (
        <div
            className={cn('flex items-center gap-2', header.column.getCanSort() && 'cursor-pointer select-none')}
            onClick={header.column.getToggleSortingHandler()}
            title={
                header.column.getCanSort()
                    ? ({
                          asc: 'Sort ascending',
                          desc: 'Sort descending',
                      }[header.column.getNextSortingOrder() ? 'asc' : 'desc'] ?? 'Clear sort')
                    : undefined
            }
        >
            {flexRender(header.column.columnDef.header, header.getContext())}
            {{
                asc: <ArrowUp size={16} />,
                desc: <ArrowDown size={16} />,
            }[header.column.getIsSorted() as string] ?? null}
        </div>
    );
}
