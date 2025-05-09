import { BaseTable } from '@/components/BaseTable';
import ContactTableDialog from '@/components/dialogs/ContactTableDialog';
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
import {
  createColumnHelper,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { Copy, PencilIcon, Trash2Icon } from 'lucide-react';
import React from 'react';
import { toast } from 'sonner';

const columnHelper = createColumnHelper<Contact>();

interface ContactTableProps {
  contacts: Contact[];
}

export default function ContactsTable({ contacts }: ContactTableProps) {
  const [data, setData] = React.useState<Contact[]>(contacts);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = React.useState('');
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
            <AvatarFallback className="text-accent bg-primary rounded-lg">
              {getInitials(info.getValue())}
            </AvatarFallback>
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
                    Esto eliminará todas sus operaciones relacionadas, y es posible que tus cuentas cambien
                    drásticamente.
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
          </div>
        );
      },
    }),
  ];

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <>
      <BaseTable
        data={contacts}
        columns={columns}
        modelName="Contact"
        dialog={
          <ContactTableDialog
            contact={selectedContact}
            setSelectedContact={setSelectedContact}
            isOpen={isDialogOpen}
            setIsOpen={setIsDialogOpen}
          />
        }
      />
    </>
  );
}
