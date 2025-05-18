import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { OperationTableColumns } from '@/types/operation';
import type { Table } from '@tanstack/react-table';

export function OperationTypeFilter({ table }: { table: Table<OperationTableColumns> }) {
    const col = table.getColumn('hidden_type');

    // Use "all" as the sentinel when NO filter is active
    const value = (col?.getFilterValue() as string | undefined) ?? 'all';

    const operationTypes = ['Expense', 'Income'];

    return (
        <Select value={value} onValueChange={(v) => col?.setFilterValue(v === 'all' ? undefined : v)}>
            <SelectTrigger className='px-4'>
                <SelectValue placeholder="Tipo de Operación" />
            </SelectTrigger>

            <SelectContent>
                <SelectItem value="all">Todos los tipos</SelectItem>
                {operationTypes.map((type) => (
                    <SelectItem key={type} value={type.toUpperCase()}>
                        {type}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}