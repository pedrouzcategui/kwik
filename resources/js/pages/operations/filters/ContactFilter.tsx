import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Contact } from '@/types/contact';
import type { Table } from '@tanstack/react-table';
import { OperationTableColumns } from '@/types/operation';

export function ContactFilter({ table, contacts }: { table: Table<OperationTableColumns>; contacts: Contact[] }) {
    const [selectedContact, setSelectedContact] = useState<string | undefined>('all');

    const handleValueChange = (value: string) => {
        setSelectedContact(value);
        table.getColumn('contact_name')?.setFilterValue(value === 'all' ? undefined : value);
    };

    return (
        <Select value={selectedContact} onValueChange={handleValueChange}>
            <SelectTrigger className='px-4'>
                <SelectValue placeholder="Contacto" />
            </SelectTrigger>

            <SelectContent>
                <SelectItem value="all">Todos los contactos</SelectItem>
                {contacts.map((contact) => (
                    <SelectItem key={contact.id} value={contact.full_name}>
                        {contact.full_name}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
