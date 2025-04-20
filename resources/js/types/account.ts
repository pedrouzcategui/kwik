enum Currency {
    USD = 'USD',
    EUR = 'EUR',
    VES = 'VES',
}
enum AccountType {
    CHECKING = 'CHECKING',
    SAVINGS = 'SAVINGS',
    INVESTMENT = 'INVESTMENT',
    CRYPTO = 'CRYPTO',
}
export type Account = {
    id: string;
    name: string;
    currency: Currency;
    type: AccountType;
    amount: number;
};
