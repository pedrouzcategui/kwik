import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
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

export default function create() {
    const { data, setData, post, processing, errors, wasSuccessful, reset } = useForm<ContactForm>({
        full_name: '',
        email: '',
        phone: '',
    });

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        post('/contacts');
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
                    Crear Contacto
                </Button>
            </form>
        </AppLayout>
    );
}
