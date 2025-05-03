import { Account } from "./account";
import { Category } from "./category";
import { Contact } from "./contact";

export enum OperationType {
    INCOME = 'INCOME',
    EXPENSE = 'EXPENSE',
    TRANSFER = 'TRANSFER',
}
export type OperationTypeStringUnion = `${OperationType}`;

export type Operation = {
    id: string;
    type: OperationTypeStringUnion;
    contact_id: string;
    account_id: string;
    category_id: string;
    target_account_id?: string;
    amount: number;
    description: string;
    created_at: string;
    updated_at: string;
};

export type OperationTableColumns = {
    id: string;
    type: OperationTypeStringUnion;
    contact: Contact;
    account: Account;
    category: Category;
    target_account_id?: string;
    amount: number;
    description: string;
    created_at: string;
    updated_at: string;
};