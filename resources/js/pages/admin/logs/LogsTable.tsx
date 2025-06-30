import { BaseTable } from '@/components/table/BaseTable';
import { ExportButton } from '@/components/table/ExportButton';
import { Badge } from '@/components/ui/badge';
import { Log } from '@/types/log';
import { usePage } from '@inertiajs/react';
import { createColumnHelper } from '@tanstack/react-table';
import React from 'react';

const columnHelper = createColumnHelper<Log>();

interface LogsTableProps {
    logs: Log[];
}

export default function ContactsTable({ logs }: LogsTableProps) {
    const [data, setData] = React.useState<Log[]>(logs);
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
        columnHelper.accessor('module', {
            header: () => <span>Módulo</span>,
            cell: (info) => (
                <div className="flex items-center gap-2">
                    <Badge variant={'outline'}>{info.getValue()}</Badge>
                </div>
            ),
            sortingFn: 'alphanumeric',
            enableGlobalFilter: true,
        }),
        columnHelper.accessor('action', {
            header: () => <span>Acción</span>,
            cell: (info) => (
                <div className="flex items-center gap-2">
                    <Badge variant={'outline'}>{info.getValue()}</Badge>
                </div>
            ),
            sortingFn: 'alphanumeric',
            enableGlobalFilter: true,
        }),
        columnHelper.accessor('description', {
            header: () => <span>Descripción</span>,
            cell: (info) => (
                <div className="flex items-center gap-2">
                    <span>{info.getValue()}</span>
                </div>
            ),
            sortingFn: 'alphanumeric',
            enableGlobalFilter: true,
        }),
    ];

    return (
        <BaseTable
            data={data} /* use local state if you mutate, else contacts */
            columns={columns}
            /* Put BOTH the custom filter */
            renderToolbarRight={(table) => (
                <>
                    <ExportButton table={table} filename="Logs" headers={['created_at', 'module', 'action', 'description']} />
                </>
            )}
        />
    );
}
