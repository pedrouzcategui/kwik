import AccountsTableDialog from '@/components/dialogs/AccountsTableDialog';
import { BaseTable } from '@/components/table/BaseTable';
import { ExportButton } from '@/components/table/ExportButton';
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
        columnHelper.accessor('created_at', {
            header: () => <span>Fecha de Creación</span>,
            //Puedo usar truncate tambien o text-wrap
            // cell: (info) => <div className="max-w-[200px] truncate">{info.getValue()}</div>,
            cell: (info) => (
                <div className="max-w-[300px] truncate">
                    {new Date(info.getValue()).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                    })}
                </div>
            ),
            sortingFn: 'datetime',
        }),
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
            cell: (info) => <Badge variant={'outline'}>{info.getValue() === 'CHECKING' ? 'CORRIENTE' : 'AHORRO'}</Badge>,
            sortingFn: 'alphanumeric',
            enableGlobalFilter: false,
        }),

        columnHelper.accessor('account_provider.name', {
            header: () => <span>Proveedor de cuenta</span>,
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
                                        ¿Quieres mover la cuenta {account.name} a la papelera?
                                    </AlertDialogTitle>
                                    <span>
                                        ¡No te preocupes! Podrás recuperar esta cuenta y todas las operaciones asociadas a ella en la papelera.
                                    </span>
                                </AlertDialogHeader>

                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction
                                        className="bg-destructive"
                                        onClick={() =>
                                            router.delete(`/accounts/${account.id}`, {
                                                preserveScroll: true,
                                                onSuccess: () => {
                                                    toast.success(`La cuenta ${account.name} ha sido movida a la papelera.`);
                                                    router.reload({ only: ['accounts'] });
                                                },
                                            })
                                        }
                                    >
                                        Sí, mover a la papelera
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
                    <ExportButton table={table} filename="Cuentas" headers={['name', 'currency', 'type', 'amount']} />
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
