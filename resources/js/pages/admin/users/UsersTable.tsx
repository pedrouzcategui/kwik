import { BaseTable } from '@/components/table/BaseTable';
import { ExportButton } from '@/components/table/ExportButton';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getInitials } from '@/lib/utils';
import { User } from '@/types';
import { usePage } from '@inertiajs/react';
import { createColumnHelper } from '@tanstack/react-table';
import { Copy } from 'lucide-react';
import React from 'react';
import { toast } from 'sonner';

const columnHelper = createColumnHelper<User>();

interface UsersTableProps {
    users: User[];
}

export const ROLE_LABELS = {
    user: 'Usuario',
    admin: 'Administrador',
} as const;

export default function ContactsTable({ users }: UsersTableProps) {
    const [data, setData] = React.useState<User[]>(users);
    // const [selectedContact, setSelectedContact] = React.useState<User | undefined>();
    // const [isDialogOpen, setIsDialogOpen] = React.useState(false);

    const { auth } = usePage().props;

    // React.useEffect(() => {
    //     setData(contacts);
    // }, [contacts]);

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
            header: () => <span>Nombre Completo</span>,
            cell: (info) => (
                <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8 overflow-hidden rounded-full">
                        <AvatarFallback className="text-accent bg-primary rounded-lg">{getInitials(info.getValue())}</AvatarFallback>
                    </Avatar>
                    <span>
                        {info.getValue()} {info.row.original.id == auth.user.id && '(Yo)'}
                    </span>
                </div>
            ),
            sortingFn: 'alphanumeric',
            enableGlobalFilter: true,
        }),
        columnHelper.accessor('email', {
            header: () => <span>Correo Electrónico</span>,
            cell: (info) => {
                const email = info.getValue();
                return (
                    <div className="flex items-center justify-between gap-2">
                        <span>{email}</span>
                        {email && (
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                    navigator.clipboard.writeText(email);
                                    toast.success('Correo electrónico copiado al portapapeles');
                                }}
                            >
                                <Copy size={16} />
                            </Button>
                        )}
                    </div>
                );
            },
            sortingFn: 'alphanumeric',
            enableGlobalFilter: true,
        }),
        columnHelper.accessor('role', {
            header: () => <span>Rol</span>,
            cell: (info) => (
                <div className="flex gap-2">
                    <Badge variant={'outline'}>{ROLE_LABELS[info.getValue()]}</Badge>
                </div>
            ),
            sortingFn: 'alphanumeric',
            enableGlobalFilter: true,
            filterFn: 'equals',
        }),
    ];

    return (
        <BaseTable
            data={data} /* use local state if you mutate, else contacts */
            columns={columns}
            /* Put BOTH the custom filter */
            renderToolbarRight={(table) => (
                <>
                    <ExportButton table={table} filename="Usuarios" headers={['full_name', 'email', 'phone', 'type']} />
                </>
            )}
        />
    );
}
