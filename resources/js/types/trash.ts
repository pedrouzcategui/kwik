import { Account } from './account';
import { Contact } from './contact';
import { OperationType } from './operation';

export type TrashedContact = {
    id: string;
    full_name: string;
};

export type TrashedAccount = {
    id: string;
    name: string;
};

export type TrashedOperation = {
    id: string;
    amount: number;
    account: Account;
    contact: Contact;
    type: OperationType;
    description: string;
};
