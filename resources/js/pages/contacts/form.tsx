import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
            <form onSubmit={handleSubmit}>
                <div>
                    <Label>Nombre Completo</Label>
                    <Input name="full_name" type="text" value={data.full_name} onChange={(e) => setData('full_name', e.target.value)} />
                </div>
                <div>
                    <Label>Email</Label>
                    <Input name="email" type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} />
                </div>
                <div>
                    <Label>Teléfono</Label>
                    <Input name="phone" type="phone" value={data.phone} onChange={(e) => setData('phone', e.target.value)} />
                </div>
                <Button disabled={processing} type="submit">
                    {contact ? 'Editar' : 'Crear'} Contacto
                </Button>
            </form>
        </AppLayout>
    );
}
