import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Contact } from '@/types/contact';
import { Head } from '@inertiajs/react';

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

            {/**Second, I should create a table to show all of the contacts, with posibilities of filtering, searching, and these should be composite */}
        </AppLayout>
    );
}
