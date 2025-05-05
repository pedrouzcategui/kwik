import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Operation } from '@/types/operation';
import { Head } from '@inertiajs/react';
import OperationsTable from './OperationsTable';
import { Category } from '@/types/category';
import { Contact } from '@/types/contact';
import { Account } from '@/types/account';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Contactos',
        href: '/contacts',
    },
];

type OperationsTablePageProps = {
    operations: Operation[];
    user: {
        contacts: Contact[];
        accounts: Account[];
    }
    categories: Category[]; 
}

export default function Index({operations, user, categories}: OperationsTablePageProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Contactos" />
            <OperationsTable user={user} operations={operations} categories={categories}/>
        </AppLayout>
    );
}
