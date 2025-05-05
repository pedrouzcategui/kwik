export type Contact = {
    id: string;
    full_name: string;
    email?: string;
    phone?: string;
    type: `${ContactType}`;
    created_at: string;
    updated_at: string;
};

export enum ContactType {
    NATURAL = 'NATURAL',
    NON_PROFIT = 'NON-PROFIT',
    GOVERNMENT = 'GOVERNMENT',
    BUSINESS = 'BUSINESS',
}
