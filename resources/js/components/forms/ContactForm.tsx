import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PhoneInput } from "@/components/ui/phone-input";
import { Contact } from "@/types/contact";
import { useForm } from "@inertiajs/react";
import { FormEvent } from "react";
import { toast } from "sonner";

type ContactForm = {
    full_name: string;
    email?: string;
    phone?: string;
};

type ContactFormComponentProps = {
    contact?: Contact;
    setIsOpen: (x: boolean) => any
};
export default function ContactForm({contact, setIsOpen}: ContactFormComponentProps) {
    const { data, setData, post, put, processing } = useForm<ContactForm>({
        full_name: contact?.full_name ?? '',
        email: contact?.email ?? '',
        phone: contact?.phone ?? '',
    });

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        if (contact) {
            put(`/contacts/${contact.id}`, {
                onSuccess: () => {
                    setIsOpen(false);
                    toast.success('Contacto Editado Exitosamente')
                }
            });
        } else {
            post('/contacts', {
                onSuccess: () => {
                    setIsOpen(false);
                    toast.success('Contacto Creado Exitosamente')
                }
            });
        }
    }
    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
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
    );
}
