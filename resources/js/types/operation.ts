import { Account } from './account';
import { Contact } from './contact';

export enum OperationType {
    INCOME = 'INCOME',
    EXPENSE = 'EXPENSE',
    TRANSFER = 'TRANSFER',
}
export type OperationTypeStringUnion = `${OperationType}`;

export type Operation = {
    id: string;
    type: OperationTypeStringUnion;
    contact: Contact;
    account: Account;
    targetAccount?: Account;
    amount: number;
    description: string;
    created_at: string;
    updated_at: string;
};
