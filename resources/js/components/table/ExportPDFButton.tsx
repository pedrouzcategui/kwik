import { Table } from '@tanstack/react-table';
import { Button } from '../ui/button';

type Props<T> = {
    table: Table<T>;
    headers: (keyof T)[] | ((row: T) => (keyof T)[]);
    filename?: string;
    className?: string;
};

export default function ExportPDFButton<T>({ table, headers, filename = 'export', className }: Props<T>) {
    return (
        <Button
            className={className ?? 'w-full'}
            variant="outline"
            onClick={() => {
                const rows = table.getFilteredRowModel().rows;
                if (rows.length === 0) return;

                const data = rows.map((row) => row.original);

                const params = new URLSearchParams({
                    data: JSON.stringify(data),
                    headers: JSON.stringify(headers),
                    filename: filename || 'export',
                });

                window.open(`/export/pdf?${params.toString()}`, '_blank');
            }}
        >
            Exportar en PDF
        </Button>
    );
}
