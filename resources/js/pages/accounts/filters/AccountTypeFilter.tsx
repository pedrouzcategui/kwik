import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Account, AccountType } from '@/types/account';
import type { Table } from '@tanstack/react-table';

export function AccountTypeFilter({ table }: { table: Table<Account> }) {
    const col = table.getColumn('type');

    // Use "all" as the sentinel when NO filter is active
    const value = (col?.getFilterValue() as string | undefined) ?? 'all';

    const accountTypes = Object.values(AccountType);

    return (
        <Select value={value} onValueChange={(v) => col?.setFilterValue(v === 'all' ? undefined : v)}>
            <SelectTrigger className='px-4'>
                <SelectValue placeholder="Tipo de Cuenta" />
            </SelectTrigger>

            <SelectContent>
                <SelectItem value="all">Todos los tipos</SelectItem>
                {accountTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                        {type}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
