import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PhoneInput } from '@/components/ui/phone-input';
import { Contact, ContactType } from '@/types/contact';
import { useForm } from '@inertiajs/react';
import { FormEvent } from 'react';
import { toast } from 'sonner';
import InputError from '../input-error';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

type ContactForm = {
    full_name: string;
    email?: string;
    phone?: string;
    type: `${ContactType}`;
};

type ContactFormComponentProps = {
    contact?: Contact;
    setIsOpen: (x: boolean) => any;
};
export default function ContactForm({ contact, setIsOpen }: ContactFormComponentProps) {
    const { data, setData, post, put, processing, errors } = useForm<ContactForm>({
        full_name: contact?.full_name ?? '',
        email: contact?.email ?? '',
        phone: contact?.phone ?? '',
        type: contact?.type ?? 'NATURAL',
    });

    function handleSubmit(e: FormEvent) {
        e.preventDefault();

        if (contact) {
            put(`/contacts/${contact.id}`, {
                onSuccess: () => {
                    setIsOpen(false);
                    toast.success('Contacto Editado Exitosamente');
                },
                onError: (errors) => {
                    console.log(errors);
                },
            });
        } else {
            post('/contacts', {
                onSuccess: () => {
                    setIsOpen(false);
                    toast.success('Contacto Creado Exitosamente');
                },
            });
        }
        if (errors) {
            console.log(errors);
            return;
        }
    }
    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 *:mb-3">
            <div>
                <Label className="mb-2 block">Nombre Completo</Label>
                <Input name="full_name" type="text" value={data.full_name} onChange={(e) => setData('full_name', e.target.value)} />
                <InputError message={errors.full_name} />
            </div>
            <div>
                <Label className="mb-2 block">Email</Label>
                <Input name="email" type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} />
                <InputError message={errors.email} />
            </div>
            <div>
                <Label className="mb-2 block">Teléfono</Label>
                <PhoneInput name="phone" type="phone" value={data.phone} onChange={(value) => setData('phone', value)} />
                <Label className="text-xs text-gray-500">
                    Por favor, ingresa tu numero de telefono en formato internacional, incluyendo el codigo del pais.
                </Label>
                <InputError message={errors.phone} />
            </div>
            <div>
                <Label className="mb-2 block">Tipo de Contacto</Label>
                <Select value={data.type} onValueChange={(value) => setData('type', value as ContactType)}>
                    <SelectTrigger>
                        <SelectValue placeholder="Selecciona tu contacto" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectItem value="NATURAL">Persona Natural</SelectItem>
                            <SelectItem value="BUSINESS">Empresa</SelectItem>
                            <SelectItem value="INSTITUTIONAL">Institucional</SelectItem>
                            <SelectItem value="GOVERNMENT">Gubernamental</SelectItem>
                            <SelectItem value="NON-PROFIT">Organizaciones sin fines de lucro</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
            <Button disabled={processing} className="w-full" size={'lg'} type="submit">
                {contact ? 'Editar' : 'Crear'} Contacto
            </Button>
        </form>
    );
}
