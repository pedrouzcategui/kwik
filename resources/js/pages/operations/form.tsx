import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Account } from '@/types/account';
import { Contact } from '@/types/contact';
import { Operation, OperationTypeStringUnion } from '@/types/operation';
import { Head, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Añadir Operación',
        href: '/operations/create',
    },
];

type OperationFormComponentProps = {
    user: {
        contacts: Contact[];
        accounts: Account[];
    };
    operation?: Operation;
};

type OperationForm = {
    contact_id: string;
    account_id: string;
    account_target_id?: string;
    amount: number;
    type: OperationTypeStringUnion;
    description?: string;
};

export default function OperationForm({ user, operation }: OperationFormComponentProps) {
    const { data, setData, post, put, processing } = useForm<OperationForm>({
        contact_id: operation?.contact.id ?? '',
        account_id: operation?.account.id ?? '',
        account_target_id: operation?.targetAccount?.id ?? '',
        amount: operation?.amount ?? 0,
        type: (operation?.type as OperationTypeStringUnion) ?? '',
        description: operation?.description ?? '',
    });
    console.log(data);
    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        if (operation) {
            put(`/operations/${operation.id}`);
        } else {
            post('/operations');
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Operaciones" />
            <form onSubmit={handleSubmit} className="mx-auto flex w-1/2 flex-col gap-3 py-24">
                <div>
                    <Label className="mb-2 block">Contacto</Label>
                    <Select name="contact_id" value={data.contact_id} onValueChange={(contact_id) => setData('contact_id', contact_id)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Selecciona tu contacto" />
                        </SelectTrigger>
                        <SelectContent>
                            {user.contacts.map((contact: Contact) => (
                                <SelectItem key={contact.id} value={contact.id}>
                                    {contact.full_name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <Label className="mb-2 block">Tipo de Operacion</Label>
                    <Select name="type" value={data.type} onValueChange={(type) => setData('type', type as OperationTypeStringUnion)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Selecciona tu tipo de operacion" />{' '}
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="INCOME">Ingreso</SelectItem>
                            <SelectItem value="EXPENSE">Gasto</SelectItem>
                            <SelectItem value="TRANSFER">Transferencia</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <Label className="mb-2 block">Cuenta Origen</Label>
                    <Select value={data.account_id} onValueChange={(account_id) => setData('account_id', account_id)}>
                        <SelectTrigger>
                            <SelectValue placeholder={'Selecciona tu cuenta de origen'} />
                        </SelectTrigger>
                        <SelectContent>
                            {user.accounts.map((account: Account) => (
                                <SelectItem key={account.id} value={account.id}>
                                    {account.name} - {account.currency}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <Label>Monto</Label>
                    <Input name="amount" type="number" onChange={(e) => setData('amount', parseInt(e.target.value))} />
                </div>
                <Button disabled={processing} className="w-full" size={'lg'} type="submit">
                    {operation ? 'Editar' : 'Crear'} Operacion
                </Button>
            </form>
        </AppLayout>
    );
}
