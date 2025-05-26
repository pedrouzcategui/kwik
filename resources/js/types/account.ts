export enum Currency {
    USD = 'USD',
    EUR = 'EUR',
    VES = 'VES',
}
export enum AccountType {
    CORRIENTE = 'Corriente',
    AHORROS = 'Ahorros',
}

export type AccountProvider = {
    id: string;
    name: string;
};
export type Account = {
    id: string;
    name: string;
    currency: Currency;
    type: AccountType;
    amount: number;
    account_provider_id: string;
};
