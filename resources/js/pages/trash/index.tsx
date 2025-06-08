import { BaseTable } from '@/components/table/BaseTable';
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
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { createColumnHelper } from '@tanstack/react-table';
import { BombIcon, CheckIcon } from 'lucide-react';
import React, { HTMLProps } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Papelera',
        href: '/trash',
    },
];

const columnHelper = createColumnHelper<TrashedContact>();

type OperationsTablePageProps = {
    contacts: TrashedContact[];
};

type TrashedContact = {
    id: string;
    full_name: string;
};

export default function Index({ contacts }: OperationsTablePageProps) {
    console.log(contacts);
    const columns = React.useMemo(
        () => [
            // A “display” column for your selection checkboxes
            columnHelper.display({
                id: 'select',
                header: ({ table }) => (
                    <IndeterminateCheckbox
                        checked={table.getIsAllRowsSelected()}
                        indeterminate={table.getIsSomeRowsSelected()}
                        onChange={table.getToggleAllRowsSelectedHandler()}
                    />
                ),
                cell: ({ row }) => (
                    <div className="px-1">
                        <IndeterminateCheckbox
                            checked={row.getIsSelected()}
                            disabled={!row.getCanSelect()}
                            indeterminate={row.getIsSomeSelected()}
                            onChange={row.getToggleSelectedHandler()}
                        />
                    </div>
                ),
            }),

            // An “accessor” column for your name field
            columnHelper.accessor('full_name', {
                header: 'Name',
                cell: (info) => <span>{info.getValue()}</span>,
            }),

            // Another display column for actions
            columnHelper.display({
                id: 'actions',
                header: 'Acciones',
                cell: (props) => {
                    const contact = props.row.original;
                    return (
                        <>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button size="sm" variant="destructive">
                                        <BombIcon />
                                    </Button>
                                </AlertDialogTrigger>

                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle className="text-center text-xl">
                                            ¿Estás seguro que quieres eliminar a {contact.full_name} por completo?
                                        </AlertDialogTitle>
                                        <span>Esto eliminará todas sus operaciones relacionadas.</span>
                                    </AlertDialogHeader>

                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                        <AlertDialogAction
                                            className="bg-destructive"
                                            onClick={() =>
                                                router.delete(`/contacts/${contact.id}/force`, {
                                                    preserveScroll: true,
                                                    onSuccess: () => {
                                                        router.reload({ only: ['contacts'] });
                                                        toast.success(`Eliminaste a ${contact.full_name}`);
                                                    },
                                                    onError: (e) => {
                                                        console.log(e);
                                                    },
                                                })
                                            }
                                        >
                                            Sí, eliminar
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>

                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button size="sm" className="bg-yellow-500 text-white hover:bg-yellow-600">
                                        <CheckIcon />
                                    </Button>
                                </AlertDialogTrigger>

                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle className="text-center text-xl">
                                            ¿Estás seguro que deseas restaurar a {contact.full_name}?
                                        </AlertDialogTitle>
                                    </AlertDialogHeader>

                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                        <AlertDialogAction
                                            className="bg-success"
                                            onClick={() =>
                                                router.put(
                                                    `/contacts/${contact.id}/restore`,
                                                    {
                                                        preserveScroll: true,
                                                    },
                                                    {
                                                        onSuccess: () => {
                                                            router.reload({ only: ['contacts'] });
                                                            toast.success('El contacto ha sido restaurado');
                                                        },
                                                    },
                                                )
                                            }
                                        >
                                            Sí, restaurar
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </>
                    );
                },
            }),
        ],
        [],
    );
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Operations" />
            <Tabs defaultValue="contacts" className="">
                <TabsList>
                    <TabsTrigger value="contacts">Contactos</TabsTrigger>
                    <TabsTrigger value="accounts">Cuentas</TabsTrigger>
                    <TabsTrigger value="operations">Operaciones</TabsTrigger>
                </TabsList>
                <TabsContent value="contacts">
                    <BaseTable data={contacts} columns={columns} />
                </TabsContent>
                <TabsContent value="operations">Change your password here.</TabsContent>
            </Tabs>
        </AppLayout>
    );
}

function IndeterminateCheckbox({ indeterminate, className = '', ...rest }: { indeterminate?: boolean } & HTMLProps<HTMLInputElement>) {
    const ref = React.useRef<HTMLInputElement>(null!);

    React.useEffect(() => {
        if (typeof indeterminate === 'boolean') {
            ref.current.indeterminate = !rest.checked && indeterminate;
        }
    }, [ref, indeterminate]);

    return <input type="checkbox" ref={ref} className={className + ' cursor-pointer'} {...rest} />;
}
