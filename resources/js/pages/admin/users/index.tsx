import AdminLayout from '@/layouts/admin-layout';
import { User, type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import UsersTable from './UsersTable';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin',
        href: '/admin',
    },
];

interface AdminUsersPageProps {
    users: User[];
}

export default function AdminUsersPage({ users }: AdminUsersPageProps) {
    // Lifting the state up, means that the state lives in the parent component, and then it sends to the children

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title="Panel de Administración" />
            <UsersTable users={users} />
        </AdminLayout>
    );
}
