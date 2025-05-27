export enum Currency {
    USD = 'USD',
    EUR = 'EUR',
    VES = 'VES',
}
export enum AccountType {
    CHECKING = 'CHECKING',
    SAVINGS = 'SAVINGS',
}

export type AccountProvider = {
    id: string;
    code: string;
    name: string;
};

export type Account = {
    id: string;
    name: string;
    currency: Currency;
    type: AccountType;
    amount: number;
    account_provider_id: string;
    account_provider?: AccountProvider;
};
