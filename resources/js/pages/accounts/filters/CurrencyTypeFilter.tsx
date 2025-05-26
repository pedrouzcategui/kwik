import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Account } from '@/types/account';
import type { Table } from '@tanstack/react-table';
export function CurrencyTypeFilter({ table }: { table: Table<Account> }) {
    const col = table.getColumn('currency');

    // Use "all" as the sentinel when NO filter is active
    const value = (col?.getFilterValue() as string | undefined) ?? 'all';

    const currencyTypes = ['VES', 'EUR', 'USD'];

    return (
        <Select value={value} onValueChange={(v) => col?.setFilterValue(v === 'all' ? undefined : v)}>
            <SelectTrigger className="min-w-[200px]">
                <SelectValue placeholder="Tipo" />
            </SelectTrigger>

            <SelectContent>
                <SelectItem value="all">Todas las monedas</SelectItem>
                {currencyTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                        {type}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
