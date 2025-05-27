import { Account, AccountProvider, AccountType, Currency } from '@/types/account';
import { router, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

// To convert Enum into STRING UNIONS we do this
// enum AuthMethods {
//     push = 'Push',
//     sms = 'Sms',
//     voice = 'Voice'
// }
//
// type AuthMethodStrings = `${AuthMethods}`
//
// above is the same as:
// type AuthMethodStrings = "Push" | "Sms" | "Voice"

type CurrencyStrings = `${Currency}`;
type AccountTypeStrings = `${AccountType}`;

type AccountForm = {
    name: string;
    currency: CurrencyStrings;
    type: AccountTypeStrings;
    account_provider_id: string;
};
type AccountFormComponentProps = {
    account?: Account;
    providers: AccountProvider[];
    setIsOpen: (x: boolean) => any;
};

export default function AccountForm({ account, providers, setIsOpen }: AccountFormComponentProps) {
    
    const { data, setData, processing, post, put } = useForm<AccountForm>({
        name: account?.name ?? '',
        currency: account?.currency ?? 'USD',
        type: account?.type ?? 'CHECKING',
        account_provider_id: account?.account_provider_id.toString() ?? '',
    });
    console.log(account, data);

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        if (account) {
            put(`/accounts/${account.id}`, {
                onSuccess: () => {
                    setIsOpen(false);
                    toast.success('Cuenta Editada Exitosamente');
                    router.reload({only: ['accounts']}); // Reload the page to reflect changes
                },
                
            });
        } else {
            post('/accounts', {
                onSuccess: () => {
                    setIsOpen(false);
                    toast.success('Cuenta Creada Exitosamente');
                },
            });
        }
    }
    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div>
                <Label className="mb-2 block">Nombre de la cuenta</Label>
                <Input name="name" type="text" value={data.name} onChange={(e) => setData('name', e.target.value)} />
            </div>
            <div>
                <Label className="mb-2 block">Moneda</Label>
                <Select
                    name="currency"
                    value={data.currency}
                    onValueChange={(value) => setData('currency', value as CurrencyStrings)}
                    disabled={!!account} // Disable if account is not null
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Selecciona tu moneda" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="EUR">EUR</SelectItem>
                        <SelectItem value="VES">VES</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div>
                <Label className="mb-2 block">Tipo de Cuenta</Label>
                <Select name="type" value={data.type} onValueChange={(value) => setData('type', value as AccountTypeStrings)}>
                    <SelectTrigger>
                        <SelectValue placeholder="Selecciona tu Tipo de Cuenta" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="CHECKING">Corriente</SelectItem>
                        <SelectItem value="SAVINGS">Ahorro</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div>
                <Label className="mb-2 block">Proveedor de la cuenta</Label>
                <Select
                    name="account_provider_id" // ← match your form key!
                    value={data.account_provider_id}
                    onValueChange={(value) => setData('account_provider_id', value)}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Selecciona tu proveedor de la cuenta" />
                    </SelectTrigger>
                    <SelectContent>
                        {providers.map((provider) => (
                            <SelectItem
                                key={provider.id}
                                value={String(provider.id)} // ← ensure it's a string
                            >
                                {provider.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <Button disabled={processing} className="w-full" size={'lg'} type="submit">
                {account ? 'Editar' : 'Crear'} Cuenta
            </Button>
        </form>
    );
}
