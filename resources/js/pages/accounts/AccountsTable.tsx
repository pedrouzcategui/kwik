import AccountsTableDialog from '@/components/dialogs/AccountsTableDialog';
import { BaseTable } from '@/components/table/BaseTable';
import { ExportCsvButton } from '@/components/table/ExportCSVButton';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Account, AccountProvider } from '@/types/account';
import { router } from '@inertiajs/react';
import { createColumnHelper } from '@tanstack/react-table';
import { PencilIcon, Trash2Icon } from 'lucide-react';
import React from 'react';
import { toast } from 'sonner';
import { AccountTypeFilter } from './filters/AccountTypeFilter';
import { CurrencyTypeFilter } from './filters/CurrencyTypeFilter';

const columnHelper = createColumnHelper<Account>();

interface AccountsTableProps {
    accounts: Account[];
    providers: AccountProvider[];
}

export default function AccountsTable({ accounts, providers }: AccountsTableProps) {
    const [selectedAccount, setSelectedAccount] = React.useState<Account | undefined>();
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);

    const columns = [
        columnHelper.accessor('name', {
            header: () => <span>Nombre</span>,
            cell: (info) => info.getValue(),
            sortingFn: 'alphanumeric',
            enableGlobalFilter: true,
        }),
        columnHelper.accessor('currency', {
            header: () => <span>Moneda</span>,
            cell: (info) => info.getValue(),
            sortingFn: 'alphanumeric',
            enableGlobalFilter: false,
        }),
        columnHelper.accessor('type', {
            header: () => <span>Tipo de cuenta</span>,
            cell: (info) => <Badge variant={'outline'}>{info.getValue()}</Badge>,
            sortingFn: 'alphanumeric',
            enableGlobalFilter: false,
        }),
        columnHelper.accessor('amount', {
            header: () => <span>Monto Disponible</span>,
            cell: (info) => {
                const row = info.row.original;
                const currencyMap = {
                    USD: '$',
                    EUR: '€',
                    VES: 'Bs.',
                    VEF: 'Bs.',
                };
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
                const account = props.row.original;

                return (
                    <div className="flex gap-2">
                        <Button
                            size="sm"
                            onClick={() => {
                                setSelectedAccount(account);
                                setIsDialogOpen(true);
                            }}
                        >
                            <PencilIcon />
                        </Button>

                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button size="sm" variant="destructive">
                                    <Trash2Icon />
                                </Button>
                            </AlertDialogTrigger>

                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle className="text-center text-xl">
                                        ¿Estás seguro que quieres eliminar la cuenta {account.name}?
                                    </AlertDialogTitle>
                                    <span>Esto eliminará todas las operaciones asociadas a esta cuenta.</span>
                                </AlertDialogHeader>

                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction
                                        className="bg-destructive"
                                        onClick={() =>
                                            router.delete(`/accounts/${account.id}`, {
                                                preserveScroll: true,
                                                onSuccess: () => {
                                                    toast.success(`La cuenta ${account.name} ha sido eliminada exitosamente.`);
                                                    router.reload({ only: ['accounts'] });
                                                },
                                            })
                                        }
                                    >
                                        Sí, eliminar
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                );
            },
            enableGlobalFilter: false,
        }),
    ];

    return (
        <BaseTable
            data={accounts}
            columns={columns}
            renderToolbarRight={(table) => (
                <>
                    <CurrencyTypeFilter table={table} />
                    <AccountTypeFilter table={table} />
                    <ExportCsvButton table={table} filename="accounts" headers={['name', 'currency', 'type', 'amount']} />
                </>
            )}
            dialog={
                <AccountsTableDialog
                    isOpen={isDialogOpen}
                    setIsOpen={setIsDialogOpen}
                    setSelectedAccount={setSelectedAccount}
                    providers={providers}
                    account={selectedAccount}
                />
            }
        />
    );
}
