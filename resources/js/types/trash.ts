import { Account, AccountProvider, AccountType, Currency } from './account';
import { Category } from './category';
import { OperationType } from './operation';

export type TrashedContact = {
    id: string;
    full_name: string;
    deleted_at: string;
};

export type TrashedAccount = {
    id: string;
    name: string;
    amount: number;
    type: AccountType;
    currency: Currency;
    account_provider?: AccountProvider;
    deleted_at: string;
};

export type TrashedOperation = {
    id: string;
    amount: number;
    account: Account;
    contact: TrashedContact;
    category: Category;
    type: OperationType;
    description: string;
    deleted_at: string;
};
