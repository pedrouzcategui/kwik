import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Account } from '@/types/account';
import { Category } from '@/types/category';
import { Contact } from '@/types/contact';
import { OperationTableColumns, OperationTypeStringUnion } from '@/types/operation';
import { router, useForm } from '@inertiajs/react';
import { Dispatch, FormEvent, SetStateAction } from 'react';
import { toast } from 'sonner';
import CategoriesSelect from './CategoriesSelect';

type OperationFormComponentProps = {
    user: {
        contacts: Contact[];
        accounts: Account[];
    };
    categories: Category[];
    operation?: OperationTableColumns;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
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

export default function OperationForm({ user, operation, categories, setIsOpen }: OperationFormComponentProps) {
    const { data, setData, post, put, processing, errors } = useForm<OperationForm>({
        contact_id: operation?.contact.id ?? '',
        account_id: operation?.account.id ?? '',
        account_target_id: operation?.target_account_id ?? '',
        amount: operation?.amount ?? 0,
        type: (operation?.type as OperationTypeStringUnion) ?? null,
        description: operation?.description ?? '',
        category_id: operation?.category.id ?? '',
    });

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        if (operation) {
            put(`/operations/${operation.id}`, {
                onSuccess: () => {
                    setIsOpen(false);
                    toast.success('Operacion Actualizada Exitosamente');
                },
            });
        } else {
            post('/operations', {
                onSuccess: () => {
                    setIsOpen(false);
                    router.reload({ only: ['operations'] });
                    toast.success('Operacion Creada Exitosamente');
                },
                onError: (e) => {
                    console.log(e);
                },
            });
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex max-h-[80vh] flex-col gap-3 overflow-y-auto">
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
                <InputError message={errors.contact_id} className="mt-2" />
            </div>
            <div>
                <Label className="mb-2 block">Tipo de Operacion</Label>
                <Select
                    name="type"
                    value={data.type}
                    disabled={!!operation}
                    onValueChange={(type) => setData('type', type as OperationTypeStringUnion)}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Selecciona tu tipo de operacion" />{' '}
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectItem value="INCOME">Ingreso</SelectItem>
                            <SelectItem value="EXPENSE">Gasto</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
                <InputError message={errors.type} className="mt-2" />
            </div>
            <div>
                <CategoriesSelect
                    disabled={data.type == null}
                    operationType={data.type}
                    categories={categories}
                    selectedCategoryId={data.category_id}
                    setData={setData}
                />
                <InputError message={errors.category_id} className="mt-2" />
            </div>
            <div>
                <Label className="mb-2 block">Cuenta</Label>
                <Select value={data.account_id} disabled={!!operation} onValueChange={(account_id) => setData('account_id', account_id)}>
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
                <InputError message={errors.account_id} className="mt-2" />
            </div>
            <div>
                <Label>Monto</Label>
                <Input
                    name="amount"
                    disabled={!!operation}
                    type="number"
                    value={data.amount}
                    onChange={(e) => setData('amount', parseInt(e.target.value))}
                />
                <InputError message={errors.amount} className="mt-2" />
            </div>
            <div>
                <Label>Descripcion</Label>
                <Textarea onChange={(e) => setData('description', e.target.value)} name="description">
                    {operation?.description}
                </Textarea>
                <InputError message={errors.description} className="mt-2" />
            </div>
            <Button disabled={processing} className="w-full" size={'lg'} type="submit">
                {operation ? 'Editar' : 'Crear'} Operacion
            </Button>
        </form>
    );
}
