// components/table/ExportCsvButton.tsx
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table } from '@tanstack/react-table';
import { tableToCsvBlob, downloadBlob } from '@/lib/csv-utils';

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

export function ExportCsvButton<T>({
  table,
  headers,
  filename = 'export',
}: Props<T>) {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => {
        const rows = table.getFilteredRowModel().rows;
        if (rows.length === 0) return;

        const hdrs = typeof headers === 'function'
          ? headers(rows[0].original)
          : headers;

        const blob = tableToCsvBlob(table, hdrs);
        downloadBlob(blob, `${filename}.csv`);
      }}
    >
      <Download size={16} className="mr-1" />
      Exportar CSV
    </Button>
  );
}
