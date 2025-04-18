import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Contact } from '@/types/contact';
import { Head } from '@inertiajs/react';
import { createColumnHelper } from '@tanstack/react-table';
import ContactsTable from './ContactsTable';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Contactos',
        href: '/contacts',
    },
];

const columnHelper = createColumnHelper<Contact>();

const columns = [
    columnHelper.accessor('id', {
        header: () => <span>ID</span>,
        cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('full_name', {
        header: () => <span>Nombre Completo</span>,
        cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('email', {
        header: () => <span>Correo Electronico</span>,
        cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('phone', {
        header: () => <span>Telefono</span>,
        cell: (info) => info.getValue(),
    }),
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
