import { OperationType } from './operation';

export type Category = {
    id: string;
    name: string;
    icon: string;
    color: string;
    type: OperationType;
};
