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
