import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Account } from '@/types/account';
import { Category } from '@/types/category';
import { Contact } from '@/types/contact';
import { Operation, OperationTableColumns, OperationTypeStringUnion } from '@/types/operation';
import { Head, useForm } from '@inertiajs/react';
import { Dispatch, FormEvent, SetStateAction } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Editar Operación',
        href: '/operations/edit',
    },
];

type OperationFormComponentProps = {
    user: {
        contacts: Contact[];
        accounts: Account[];
    };
    categories: Category[];
    operation?: OperationTableColumns;
    setIsOpen: Dispatch<SetStateAction<boolean>>
};

type OperationForm = {
    contact_id: string;
    category_id: string;
    account_id: string;
    account_target_id?: string;
    amount: number;
    type: OperationTypeStringUnion;
    description?: string;
};

export default function OperationForm({ user, operation, categories, setIsOpen}: OperationFormComponentProps) {
    const { data, setData, post, put, processing } = useForm<OperationForm>({
        contact_id: operation?.contact.id ?? '',
        account_id: operation?.account.id ?? '',
        account_target_id: operation?.target_account_id ?? '',
        amount: operation?.amount ?? 0,
        type: (operation?.type as OperationTypeStringUnion) ?? '',
        description: operation?.description ?? '',
        category_id: operation?.category.id ?? ''
    });
    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        if (operation) {
            put(`/operations/${operation.id}`, {
                onSuccess: () => {
                    setIsOpen(false);
                    toast.success('Operacion Actualizada Exitosamente')
                }
            });
        } else {
            post('/operations', {
                onSuccess: () => {
                    setIsOpen(false);
                    toast.success('Operacion Creado Exitosamente')
                },
                onError: (e) => {
                    console.log(e)
                }
            });
        }
    }

    return (
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
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
                    <Label className="mb-2 block">Categoria</Label>
                    <Select value={data.category_id} onValueChange={(category_id) => setData('category_id', category_id)}>
                        <SelectTrigger>
                            <SelectValue placeholder={'Selecciona la categoria de tu operacion'} />
                        </SelectTrigger>
                        <SelectContent>
                            {categories.map((category: Category) => (
                                <SelectItem key={category.id} value={category.id}>
                                    <div>{category.name}</div>
                                </SelectItem>
                            ))}
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
                                    <div>{account.name} -</div>
                                    <span className="text-xs">
                                        {account.currency} {account.amount}
                                    </span>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <Label>Monto</Label>
                    <Input name="amount" type="number" value={data.amount} onChange={(e) => setData('amount', parseInt(e.target.value))} />
                </div>
                <div>
                    <Label>Descripcion</Label>
                    <Textarea onChange={(e) => setData('description', e.target.value)} name="description" >{operation?.description}</Textarea>
                </div>
                <Button disabled={processing} className="w-full" size={'lg'} type="submit">
                    {operation ? 'Editar' : 'Crear'} Operacion
                </Button>
            </form>
    );
}
