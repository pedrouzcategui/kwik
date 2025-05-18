import { saveAs } from 'file-saver';      // tiny helper lib, optional
import { Table } from '@tanstack/react-table';

/** Convert filtered rows to a CSV Blob */
export function tableToCsvBlob<T>(
  table: Table<T>,
  headers: (keyof T)[],
) {
  const escape = (v: unknown) =>
    String(v ?? '')
      .replace(/"/g, '""')
      .replace(/\n/g, '\\n');

  const rows = table.getFilteredRowModel().rows.map((r) => r.original);
  const headerLine = headers.join(',');
  const dataLines = rows.map((row) =>
    headers.map((h) => `"${escape(row[h])}"`).join(','),
  );
  const csvString = [headerLine, ...dataLines].join('\n');

  /* 👉 Create a *Blob* from that string */
  return new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
}

/** Trigger browser download */
export function downloadBlob(blob: Blob, filename: string) {
  // If you don't want the extra dependency, replicate what saveAs does
  saveAs(blob, filename);
}
