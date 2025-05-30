import { BaseTable } from '@/components/table/BaseTable';
import { Badge } from '@/components/ui/badge';
import { ExchangeRate } from '@/types/exchange-rate';
import { createColumnHelper } from '@tanstack/react-table';

const columnHelper = createColumnHelper<ExchangeRate>();

const columns = [
    columnHelper.accessor('effective_date', {
        header: 'Fecha',
        cell: (info) => new Date(info.getValue()).toLocaleDateString(),
    }),
    columnHelper.accessor('currency_code', {
        header: 'Divisa',
        cell: (info) => <Badge variant={'outline'}>{info.getValue()}</Badge>,
    }),
    columnHelper.accessor('rate_to_usd', {
        header: 'Tasa de Cambio',
        cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('source_type', {
        header: 'Fuente',
        cell: (info) => {
            const value = info.getValue();
            let label = null;
            if (value === 'official') {
                label = 'Oficial';
            }
            if (value === 'black_market') label = 'Paralelo';
            return <Badge variant={'outline'}>{label}</Badge>;
        },
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
