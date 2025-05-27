import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import AccountsTable from './AccountsTable';
import { Account, AccountProvider } from '@/types/account';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Cuentas',
        href: '/accounts',
    },
];

type AccountIndexProps = {
    accounts: Account[];
    providers: AccountProvider[];
}

export default function Index({accounts, providers}: AccountIndexProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Cuentas" />
            <AccountsTable providers={providers} accounts={accounts} />
        </AppLayout>
    );
}
