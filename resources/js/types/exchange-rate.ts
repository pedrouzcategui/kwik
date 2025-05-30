import { Currency } from './account';

type SourceType = 'official' | 'black_market';

export type ExchangeRate = {
    currency_code: `${Currency}`;
    rate_to_usd: string;
    source_type: SourceType;
    source: string;
    diff: number;
    effective_date: string;
};
