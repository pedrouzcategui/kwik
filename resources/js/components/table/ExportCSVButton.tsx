// components/table/ExportCsvButton.tsx
import { Button } from '@/components/ui/button';
import { downloadBlob, tableToCsvBlob } from '@/lib/csv-utils';
import { cn } from '@/lib/utils';
import { Table } from '@tanstack/react-table';
import { Download } from 'lucide-react';

/**
 * Generic CSV exporter.
 * Pass the table instance and a list (or builder) of columns to export.
 */
type Props<T> = {
    table: Table<T>;
    /** Either a static header list or a fn that returns one */
    headers: (keyof T)[] | ((row: T) => (keyof T)[]);
    filename?: string;
    className?: string;
};

export function ExportCsvButton<T>({ table, headers, filename = 'export', className }: Props<T>) {
    return (
        <Button
            className={cn(className)}
            variant="outline"
            size="sm"
            onClick={() => {
                const rows = table.getFilteredRowModel().rows;
                if (rows.length === 0) return;

                const hdrs = typeof headers === 'function' ? headers(rows[0].original) : headers;

                const blob = tableToCsvBlob(table, hdrs);
                downloadBlob(blob, `${filename}.csv`);
            }}
        >
            <Download size={16} className="mr-1" />
            Exportar CSV
        </Button>
    );
}
