import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { OperationTableColumns } from '@/types/operation';
import type { Table } from '@tanstack/react-table';

export function OperationTypeFilter({ table }: { table: Table<OperationTableColumns> }) {
    const col = table.getColumn('hidden_type');

    // Use "all" as the sentinel when NO filter is active
    const value = (col?.getFilterValue() as string | undefined) ?? 'all';

    // Map internal values to display labels
    const operationTypes = [
        { value: 'Expense', label: 'Egreso' },
        { value: 'Income', label: 'Ingreso' },
    ];

    return (
        <Select value={value} onValueChange={(v) => col?.setFilterValue(v === 'all' ? undefined : v)}>
            <SelectTrigger className="min-w-[200px] px-4">
                <SelectValue placeholder="Tipo de Operación" />
            </SelectTrigger>

            <SelectContent>
                <SelectItem value="all">Todos los tipos</SelectItem>
                {operationTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                        {type.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
