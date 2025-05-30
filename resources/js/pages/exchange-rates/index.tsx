import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { ExchangeRate } from '../../types/exchange-rate';
import ExchangeRatesTable from './ExchangeRatesTable';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Valores Históricos de Divisas',
        href: '/currency-history',
    },
];

interface ExchangeRateIndexProps {
    exchange_rates: ExchangeRate[];
}

export default function Index({ exchange_rates }: ExchangeRateIndexProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Valores Históricos de Divisas" />
            <ExchangeRatesTable exchange_rates={exchange_rates} />
        </AppLayout>
    );
}
