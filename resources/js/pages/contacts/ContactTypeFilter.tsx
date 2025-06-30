// ContactTypeFilter.tsx
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { contactTypeMap, contactTypes } from '@/lib/utils';
import { Contact } from '@/types/contact';
import type { Table } from '@tanstack/react-table';

export function ContactTypeFilter({ table }: { table: Table<Contact> }) {
    const col = table.getColumn('type');

    // Use "all" as the sentinel when NO filter is active
    const value = (col?.getFilterValue() as string | undefined) ?? 'all';

    return (
        <Select value={value} onValueChange={(v) => col?.setFilterValue(v === 'all' ? undefined : v)}>
            <SelectTrigger className="w-36">
                <SelectValue placeholder="Tipo" />
            </SelectTrigger>

            <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {contactTypes.map((type) => (
                    <SelectItem key={type} value={type.toUpperCase()}>
                        {contactTypeMap[type]}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
