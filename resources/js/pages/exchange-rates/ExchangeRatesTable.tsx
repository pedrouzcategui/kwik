import { BaseTable } from '@/components/table/BaseTable';
import { ExchangeRate } from '@/types/exchange-rate';
import { createColumnHelper } from '@tanstack/react-table';

const columnHelper = createColumnHelper<ExchangeRate>();

const columns = [
    columnHelper.accessor('effective_date', {
        header: 'Fecha',
        cell: (info) => new Date(info.getValue()).toLocaleDateString(),
        enableGlobalFilter: true,
    }),
    columnHelper.accessor('currency_code', {
        header: 'Divisa',
        cell: (info) => info.getValue(),
        enableGlobalFilter: true,
    }),
    columnHelper.accessor('rate_to_usd', {
        header: 'Tasa de Cambio',
        cell: (info) => info.getValue(),
        enableGlobalFilter: true,
    }),
];

interface ExchangeRatesTableProps {
    exchange_rates: ExchangeRate[];
}

export default function ExchangeRatesTable({ exchange_rates }: ExchangeRatesTableProps) {
    console.log('Exchange Rates:', exchange_rates);
    return (
        <div>
            <BaseTable disableToolbar data={exchange_rates} columns={columns} />
        </div>
    );
}
