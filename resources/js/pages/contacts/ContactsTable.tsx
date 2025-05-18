import ContactTableDialog from '@/components/dialogs/ContactTableDialog';
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
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getInitials } from '@/lib/utils';
import { Contact } from '@/types/contact';
import { router } from '@inertiajs/react';
import { createColumnHelper } from '@tanstack/react-table';
import { Copy, EyeIcon, PencilIcon, Trash2Icon } from 'lucide-react';
import React from 'react';
import { toast } from 'sonner';
import { ContactTypeFilter } from './ContactTypeFilter';
import { ExportCsvButton } from '@/components/table/ExportCSVButton';

const columnHelper = createColumnHelper<Contact>();

interface ContactTableProps {
    contacts: Contact[];
}

export default function ContactsTable({ contacts }: ContactTableProps) {
    const [data, setData] = React.useState<Contact[]>(contacts);
    const [selectedContact, setSelectedContact] = React.useState<Contact | undefined>();
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);

    React.useEffect(() => {
        setData(contacts);
    }, [contacts]);

    const columns = [
        columnHelper.accessor('full_name', {
            header: () => <span>Nombre Completo</span>,
            cell: (info) => (
                <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8 overflow-hidden rounded-full">
                        <AvatarFallback className="text-accent bg-primary rounded-lg">{getInitials(info.getValue())}</AvatarFallback>
                    </Avatar>
                    <span>{info.getValue()}</span>
                </div>
            ),
            sortingFn: 'alphanumeric',
            enableGlobalFilter: true,
        }),
        columnHelper.accessor('email', {
            header: () => <span>Correo Electrónico</span>,
            cell: (info) => (
                <div className="flex gap-2">
                    <span>{info.getValue()}</span> <Copy size={16} />
                </div>
            ),
            sortingFn: 'alphanumeric',
            enableGlobalFilter: true,
        }),
        columnHelper.accessor('phone', {
            header: () => <span>Teléfono</span>,
            cell: (info) => (
                <div className="flex gap-2">
                    <span>{info.getValue()}</span> <Copy size={16} />
                </div>
            ),
            sortingFn: 'alphanumeric',
            enableGlobalFilter: true,
        }),
        columnHelper.accessor('type', {
            header: () => <span>Tipo</span>,
            cell: (info) => (
                <div className="flex gap-2">
                    <Badge variant={'outline'}>{info.getValue()}</Badge>
                </div>
            ),
            sortingFn: 'alphanumeric',
            enableGlobalFilter: true,
            filterFn: 'equals',
        }),
        columnHelper.display({
            id: 'actions',
            header: () => <span>Acciones</span>,
            cell: (props) => {
                const contact = props.row.original;

                return (
                    <div className="flex gap-2">
                        <Button
                            size="sm"
                            onClick={() => {
                                setSelectedContact(contact);
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
                                        ¿Estás seguro que quieres eliminar a {contact.full_name}?
                                    </AlertDialogTitle>
                                    <span>
                                        Esto eliminará todas sus operaciones relacionadas, y es posible que tus cuentas cambien drásticamente.
                                    </span>
                                </AlertDialogHeader>

                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction
                                        className="bg-destructive"
                                        onClick={() =>
                                            router.delete(`/contacts/${contact.id}`, {
                                                preserveScroll: true,
                                                onSuccess: () => {
                                                    router.reload({ only: ['contacts'] });
                                                    toast.success(`Eliminaste a ${contact.full_name}`);
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
                                    <EyeIcon />
                                </Button>
                            </AlertDialogTrigger>

                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle className="text-center text-xl">Información de {contact.full_name}</AlertDialogTitle>
                                </AlertDialogHeader>
                                <div className="space-y-2">
                                    {contact.email && (
                                        <p>
                                            <strong>Correo Electrónico:</strong> {contact.email}{' '}
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => {
                                                    if (contact.email) {
                                                        navigator.clipboard.writeText(contact.email);
                                                        toast.success('Correo electrónico copiado al portapapeles');
                                                    }
                                                }}
                                            >
                                                <Copy size={12} />
                                            </Button>
                                        </p>
                                    )}
                                    {contact.phone && (
                                        <p>
                                            <strong>Teléfono:</strong> {contact.phone}{' '}
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => {
                                                    if (contact.phone) {
                                                        navigator.clipboard.writeText(contact.phone);
                                                        toast.success('Teléfono copiado al portapapeles');
                                                    }
                                                }}
                                            >
                                                <Copy size={12} />
                                            </Button>
                                        </p>
                                    )}
                                    <p>
                                        <strong>Tipo:</strong> {contact.type}
                                    </p>
                                    {(contact.email || contact.phone) && (
                                        <Button
                                            className="mt-4 w-full"
                                            onClick={() => {
                                                const contactInfo = `Nombre: ${contact.full_name}\n${
                                                    contact.email ? `Email: ${contact.email}\n` : ''
                                                }${contact.phone ? `Teléfono: ${contact.phone}` : ''}`;
                                                navigator.clipboard.writeText(contactInfo);
                                                toast.success('Información del contacto copiada al portapapeles');
                                            }}
                                        >
                                            Copiar toda la información
                                        </Button>
                                    )}
                                </div>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cerrar</AlertDialogCancel>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                );
            },
        }),
    ];

    return (
        <BaseTable
            data={data} /* use local state if you mutate, else contacts */
            columns={columns}
            /* Put BOTH the custom filter */
            renderToolbarRight={(table) => (
                <>
                    <ContactTypeFilter table={table} />
                    <ExportCsvButton table={table} filename="contacts" headers={['full_name', 'email', 'phone', 'type']} />
                </>
            )}
            dialog={
                <ContactTableDialog
                    contact={selectedContact}
                    setSelectedContact={setSelectedContact}
                    isOpen={isDialogOpen}
                    setIsOpen={setIsDialogOpen}
                />
            }
        />
    );
}
