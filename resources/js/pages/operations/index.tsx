import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Operation } from '@/types/operation';
import { Head } from '@inertiajs/react';
import OperationsTable from './OperationsTable';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Contactos',
        href: '/contacts',
    },
];

export default function Index(props: any) {
    let operations: Operation[] = props.operations;
    console.log(operations);
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Contactos" />
            <OperationsTable operations={operations} />
        </AppLayout>
    );
}
