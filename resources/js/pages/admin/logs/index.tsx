import AdminLayout from '@/layouts/admin-layout';
import { type BreadcrumbItem } from '@/types';
import { Log } from '@/types/log';
import { Head } from '@inertiajs/react';
import LogsTable from './LogsTable';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin',
        href: '/admin',
    },
];

interface AdminUsersPageProps {
    logs: Log[];
}

export default function AdminUsersPage({ logs }: AdminUsersPageProps) {
    // Lifting the state up, means that the state lives in the parent component, and then it sends to the children

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title="Panel de Administración" />
            <LogsTable logs={logs} />
        </AdminLayout>
    );
}
