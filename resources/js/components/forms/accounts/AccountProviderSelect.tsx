import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AccountProvider } from '@/types/account';
import { router } from '@inertiajs/react';
import axios, { AxiosError } from 'axios';
import { FormEvent, useState } from 'react';
import { toast } from 'sonner';

type CategorySelectProps = {
    account_providers: AccountProvider[];
    selectedAccountProviderId: string;
    setData: (x: string, y: any) => any;
};

const INITIAL_STATE = {
    name: '',
    code: '',
};

export default function AccountProvidersSelect({ account_providers, selectedAccountProviderId, setData }: CategorySelectProps) {
    const [newAccountProvider, setNewAccountProvider] = useState(INITIAL_STATE);
    const [open, setOpen] = useState(false);

    const handleOnChange = (e: FormEvent<HTMLInputElement>) => {
        const { name, value } = e.currentTarget;
        setNewAccountProvider((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleCreateAccountProvider = async () => {
        // If empty account provider name, show error
        if (!newAccountProvider.name.trim()) return;
        try {
            const response = await axios.post('/account-providers', newAccountProvider);

            const newProvider: AccountProvider = response.data;
            toast.success(`El proveedor de cuenta ${newProvider.name} ha sido creado`);
            setData('account_provider_id', newProvider.id);
            setNewAccountProvider(INITIAL_STATE);
            setOpen(false);
            router.reload({ only: ['accounts', 'providers'] });
        } catch (error) {
            const err = error as AxiosError;
            if (err.response?.status === 422) {
                console.log('Validation errors:', err.response.data);
            } else {
                console.error('Unexpected error:', error);
            }
        }
    };

    return (
        <div className="space-y-2">
            <Label className="block">Proveedor de Cuenta</Label>
            <div className="flex items-end gap-2">
                <Select
                    value={selectedAccountProviderId}
                    onValueChange={(value: string) => {
                        setData('account_provider_id', value);
                    }}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Selecciona tu proveedor de la cuenta" />
                    </SelectTrigger>
                    <SelectContent>
                        {account_providers.map((provider) => (
                            <SelectItem key={provider.id} value={String(provider.id)}>
                                {provider.code} - {provider.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button type="button" variant="outline">
                            + Nuevo Proveedor De Cuenta
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Crear nuevo proveedor de cuenta</DialogTitle>
                        </DialogHeader>
                        <div className="flex flex-col gap-4 py-2">
                            <Label>Nombre del proveedor de cuenta</Label>
                            <Input value={newAccountProvider.name} name="name" onChange={handleOnChange} placeholder="Ejemplo: Bank of América" />
                            <Label>Código del proveedor de cuenta</Label>
                            <Input type="text" name="code" onInput={handleOnChange} placeholder="Ejemplo: 123456789" />
                            <span className="text-xs text-gray-500">Si no asignas un código, nosotros agregaremos uno de manera aleatoria</span>
                        </div>
                        <DialogFooter>
                            <Button type="button" onClick={handleCreateAccountProvider}>
                                Crear proveedor de cuenta
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}
