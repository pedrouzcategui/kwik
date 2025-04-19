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

export default function Index(props: any) {
    let contacts: Contact[] = props.contacts.original;
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Contactos" />
            <ContactsTable contacts={contacts} />
        </AppLayout>
    );
}
