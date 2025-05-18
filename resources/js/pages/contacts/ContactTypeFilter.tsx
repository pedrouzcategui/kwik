// ContactTypeFilter.tsx
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from '@/components/ui/select';
  import type { Table } from '@tanstack/react-table';
  import { Contact } from '@/types/contact';
  
  export function ContactTypeFilter({ table }: { table: Table<Contact> }) {
    const col = table.getColumn('type');
  
    // Use "all" as the sentinel when NO filter is active
    const value = (col?.getFilterValue() as string | undefined) ?? 'all';

    const contactTypes = ["Natural", "Government", "Institutional", "Non-Profit", "Business"];
  
    return (
      <Select
        value={value}
        onValueChange={(v) =>
          col?.setFilterValue(v === 'all' ? undefined : v)
        }
      >
        <SelectTrigger className="w-36">
          <SelectValue placeholder="Tipo" />
        </SelectTrigger>
  
        <SelectContent>
          <SelectItem value="all">Todos</SelectItem>
          {contactTypes.map((type) => (
            <SelectItem key={type} value={type.toUpperCase()}>
              {type}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }