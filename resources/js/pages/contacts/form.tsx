import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PhoneInput } from '@/components/ui/phone-input';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Contact } from '@/types/contact';
import { Head, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Anadir Contacto',
        href: '/contacts/add',
    },
];

type ContactForm = {
    full_name: string;
    email?: string;
    phone?: string;
};

type ContactFormComponentProps = {
    contact?: Contact;
};

export default function ContactForm({ contact }: ContactFormComponentProps) {
    const { data, setData, post, put, processing, errors, wasSuccessful, reset } = useForm<ContactForm>({
        full_name: contact?.full_name ?? '',
        email: contact?.email ?? '',
        phone: contact?.phone ?? '',
    });

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        if (contact) {
            put(`/contacts/${contact.id}`);
        } else {
            post('/contacts');
        }
        if (wasSuccessful) {
            reset();
            console.log('Contacto Creado!');
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Contactos" />
            <form onSubmit={handleSubmit} className="mx-auto flex w-1/2 flex-col gap-3 py-24">
                <div>
                    <Label className="mb-2 block">Nombre Completo</Label>
                    <Input name="full_name" type="text" value={data.full_name} onChange={(e) => setData('full_name', e.target.value)} />
                </div>
                <div>
                    <Label className="mb-2 block">Email</Label>
                    <Input name="email" type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} />
                </div>
                <div>
                    <Label className="mb-2 block">Teléfono</Label>
                    <PhoneInput name="phone" type="phone" value={data.phone} onChange={(value) => setData('phone', value)} />
                </div>
                <Button disabled={processing} className="w-full" size={'lg'} type="submit">
                    {contact ? 'Editar' : 'Crear'} Contacto
                </Button>
            </form>
        </AppLayout>
    );
}
