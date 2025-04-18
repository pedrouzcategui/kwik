import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Contact } from '@/types/contact';
import { Head, Link } from '@inertiajs/react';
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
            <Link href="/contacts/add">
                <Button className="w-fit" size={'sm'}>
                    Add New Contact
                </Button>
            </Link>
            <ContactsTable contacts={contacts} />
        </AppLayout>
    );
}
