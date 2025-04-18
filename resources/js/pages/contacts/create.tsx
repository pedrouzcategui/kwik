import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import React, { ChangeEvent, FormEvent } from 'react';

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

export default function create() {
    const [contact, setContact] = React.useState<ContactForm>({
        full_name: '',
        email: '',
        phone: '',
    });

    function handleChange(e: ChangeEvent<HTMLInputElement>) {
        setContact((prevState) => {
            return {
                ...prevState,
                [e.target.name]: e.target.value,
            };
        });
    }

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        router.post('/api/contacts', contact);
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Contactos" />
            <form onSubmit={handleSubmit}>
                <div>
                    <Label>Nombre Completo</Label>
                    <Input name="full_name" type="text" value={contact.full_name} onChange={handleChange} />
                </div>
                <div>
                    <Label>Email</Label>
                    <Input name="email" type="email" value={contact.email} onChange={handleChange} />
                </div>
                <div>
                    <Label>Teléfono</Label>
                    <Input name="phone" type="phone" value={contact.phone} onChange={handleChange} />
                </div>
                <Button type="submit">Crear Contacto</Button>
            </form>
        </AppLayout>
    );
}
