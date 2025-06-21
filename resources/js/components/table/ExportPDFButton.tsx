import { Table } from '@tanstack/react-table';
import { FileText } from 'lucide-react';
import { Button } from '../ui/button';

type Props<T> = {
    table: Table<T>;
    headers: (keyof T)[] | ((row: T) => (keyof T)[]);
    filename?: string;
    className?: string;
};

/**
 * Return only the columns that are currently visible *and*
 *   are not in the excluded list (e.g. "actions").
 *
 * @param table      TanStack table instance
 * @param excludeIds Column IDs to omit from the export
 */
export function getVisibleData<T>(
    table: Table<T>,
    excludeIds: string[] = ['actions'], // 👈 default: hide "actions"
) {
    const rows = table.getFilteredRowModel().rows;

    /** keep visible columns except those we want to exclude */
    const cols = table.getVisibleLeafColumns().filter((col) => !excludeIds.includes(col.id));

    const headerKeys = cols.map((c) => c.id as keyof T);

    const data = rows.map((row) => {
        const obj: Record<string, unknown> = {};
        cols.forEach((col) => {
            obj[col.id] = row.getValue(col.id);
        });
        return obj;
    });

    return { headerKeys, data };
}

export default function ExportPDFButton<T>({ table, headers, filename = 'export', className }: Props<T>) {
    return (
        <Button
            className={className ?? 'w-full'}
            variant="outline"
            onClick={() => {
                const { headerKeys, data } = getVisibleData(table);

                if (data.length === 0) return; // nothing to export
                fetch('/export/pdf/initiate', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content || '',
                    },
                    body: JSON.stringify({
                        headers: headerKeys, // e.g. ["name","amount",...]
                        data, // array with ONLY those keys
                        filename,
                    }),
                    credentials: 'same-origin',
                })
                    .then((r) => r.json())
                    .then(({ token }) => token && window.open(`/export/pdf/download?token=${token}`, '_blank'))
                    .catch((e) => console.error(e));
            }}
        >
            <FileText className="mr-1" />
            Exportar en PDF
        </Button>
    );
}
