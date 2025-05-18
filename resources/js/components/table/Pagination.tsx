import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Table } from '@tanstack/react-table';

type Props<T> = {
  table: Table<T>;
};

export function Pagination<T>({ table }: Props<T>) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-muted-foreground">
        Página {table.getState().pagination.pageIndex + 1} de{' '}
        {table.getPageCount()}
      </span>

      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <ChevronLeft className="h-4 w-4" />
          Anterior
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Siguiente
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
