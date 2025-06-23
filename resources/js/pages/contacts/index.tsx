import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Contact } from '@/types/contact';
import { Head } from '@inertiajs/react';
import ContactsTable from './ContactsTable';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Contactos',
        href: '/contacts',
    },
];

type ContactIndexProps = {
    contacts: Contact[];
};

export default function Index({ contacts }: ContactIndexProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Contactos" />
            <ContactsTable contacts={contacts} />
        </AppLayout>
    );
}
