// components/table/ExportCsvButton.tsx
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Table } from '@tanstack/react-table';
import { Download } from 'lucide-react';
import { ExportCsvButton } from './ExportCSVButton';
import ExportPDFButton from './ExportPDFButton';
/**
 * Generic CSV exporter.
 * Pass the table instance and a list (or builder) of columns to export.
 */
type Props<T> = {
    table: Table<T>;
    /** Either a static header list or a fn that returns one */
    headers: (keyof T)[] | ((row: T) => (keyof T)[]);
    filename?: string;
};

export function ExportButton<T>({ table, headers, filename = 'export' }: Props<T>) {
    return (
        <Popover>
            <PopoverTrigger>
                <Button variant="outline" size="sm">
                    <Download size={16} className="mr-1" />
                    Exportar
                </Button>
            </PopoverTrigger>
            <PopoverContent className="">
                <ExportCsvButton className="mb-4 w-full" filename={filename} table={table} headers={headers} />
                <ExportPDFButton table={table} headers={headers} filename={filename} />
            </PopoverContent>
        </Popover>
    );
}
