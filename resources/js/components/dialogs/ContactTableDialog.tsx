import { Contact } from '@/types/contact';
import { Dispatch, SetStateAction } from 'react';
import ContactForm from '../forms/ContactForm';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';

type ContactTableDialog = {
    contact?: Contact;
    isOpen: boolean;
    setIsOpen: (x: boolean) => any;
    setSelectedContact: Dispatch<SetStateAction<Contact | undefined>>;
};

export default function ContactTableDialog({ contact, setSelectedContact, isOpen, setIsOpen }: ContactTableDialog) {
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger
                asChild
                onClick={() => {
                    setIsOpen(true);
                    setSelectedContact(undefined);
                }}
            >
                <Button>Crear Nuevo Contacto</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="mb-4">{contact ? 'Editar' : 'Crear'} Contacto</DialogTitle>
                    <ContactForm contact={contact} setIsOpen={setIsOpen} />
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}
