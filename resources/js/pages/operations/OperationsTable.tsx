import { BaseTable } from '@/components/BaseTable';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { currencyMap } from '@/lib/utils';
import { Operation } from '@/types/operation';
import { Link, router } from '@inertiajs/react';
import { createColumnHelper } from '@tanstack/react-table';

const columnHelper = createColumnHelper<Operation>();

const columns = [
    columnHelper.accessor('account.name', {
        header: () => <span>Nombre de la cuenta</span>,
        cell: (info) => info.getValue(),
        sortingFn: 'alphanumeric',
        enableGlobalFilter: true, // This makes the search filter, search using full names
    }),
    columnHelper.accessor('amount', {
        header: () => <span>Monto de la opearcion</span>,
        cell: (info) => {
            let symbol = currencyMap[info.row.original.account.currency];
            return (
                <Badge variant={info.row.original.type == 'INCOME' ? 'success' : 'destructive'}>
                    <b>
                        {info.row.original.type == 'INCOME' ? '+' : '-'} {symbol}
                    </b>
                    {info.getValue()}
                </Badge>
            );
        },
        sortingFn: 'alphanumeric',
        enableGlobalFilter: true, // This makes the search filter, search using full names
    }),
    columnHelper.accessor('contact.full_name', {
        header: () => <span>Contacto</span>,
        cell: (info) => info.getValue(),
        sortingFn: 'alphanumeric',
        enableGlobalFilter: true, // This makes the search filter, search using full names
    }),
    columnHelper.display({
        id: 'actions',
        header: () => <span>Acciones</span>,
        cell: (props) => {
            const operation: Operation = props.row.original;
            return (
                <div className="flex gap-2">
                    <Link href={`/operations/${operation.id}/edit`}>
                        <Button variant={'outline'} size="sm">
                            Editar
                        </Button>
                    </Link>
                    <Button
                        variant={'destructive'}
                        onClick={() => {
                            router.delete(`/operations/${operation.id}`, {
                                preserveScroll: true,
                                onSuccess: () => router.reload({ only: ['operations'] }),
                            });
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

interface OperationsTableProps {
    operations: Operation[];
}

export default function OperationsTable({ operations }: OperationsTableProps) {
    return <BaseTable data={operations} columns={columns} globalFilterPlaceholder="Busca tu operacion" modelName="operation" />;
}
