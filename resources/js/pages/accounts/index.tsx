import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import AccountsTable from './AccountsTable';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Cuentas',
        href: '/accounts',
    },
];

export default function Index(props: any) {
    let accounts = props.accounts;
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Contactos" />
            <AccountsTable accounts={accounts} />
        </AppLayout>
    );
}
