import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Budgets',
        href: '/budgets',
    },
];

export default function Index(props: any) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Budgets" />
        </AppLayout>
    );
}
