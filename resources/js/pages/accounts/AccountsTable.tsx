import { BaseTable } from '@/components/BaseTable';
import { Button } from '@/components/ui/button';
import { Account } from '@/types/account';
import { Link, router } from '@inertiajs/react';
import { createColumnHelper } from '@tanstack/react-table';

const columnHelper = createColumnHelper<Account>();

const columns = [
    columnHelper.accessor('name', {
        header: () => <span>Nombre</span>,
        cell: (info) => info.getValue(),
        sortingFn: 'alphanumeric',
        enableGlobalFilter: true, // This makes the search filter, search using full names
    }),
    columnHelper.accessor('currency', {
        header: () => <span>Moneda</span>,
        cell: (info) => info.getValue(),
        sortingFn: 'alphanumeric',
        enableGlobalFilter: false, // Same as above but with emails
    }),
    columnHelper.accessor('type', {
        header: () => <span>Tipo de cuenta</span>,
        cell: (info) => info.getValue(),
        sortingFn: 'alphanumeric',
        enableGlobalFilter: false,
    }),
    columnHelper.accessor('amount', {
        header: () => <span>Monto Disponible</span>,
        cell: (info) => {
            const currencyMap = {
                USD: '$',
                EUR: '€',
                VES: 'Bs.',
                VEF: 'Bs.',
            };

            const row = info.row.original;
            const symbol = currencyMap[row.currency] ?? '';

            const formattedAmount = new Intl.NumberFormat('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }).format(row.amount);

            return (
                <span>
                    {symbol} {formattedAmount}
                </span>
            );
        },
        sortingFn: 'alphanumeric',
        enableGlobalFilter: false,
    }),
    columnHelper.display({
        id: 'actions',
        header: () => <span>Acciones</span>,
        cell: (props) => {
            const account: Account = props.row.original;
            return (
                <div className="flex gap-2">
                    <Link href={`/accounts/${account.id}/edit`}>
                        <Button size="sm">Editar</Button>
                    </Link>
                    <Button
                        onClick={() => {
                            router.delete(`/accounts/${account.id}`);
                            location.reload();
                        }}
                        size="sm"
                    >
                        Eliminar
                    </Button>
                </div>
            );
        },
        enableGlobalFilter: false, // In this case of course we don't want to search for this
    }),
];

interface AccountsTableProps {
    accounts: Account[];
}

export default function AccountsTable({ accounts }: AccountsTableProps) {
    return <BaseTable data={accounts} columns={columns} globalFilterPlaceholder="Busca tu cuenta" />;
}
