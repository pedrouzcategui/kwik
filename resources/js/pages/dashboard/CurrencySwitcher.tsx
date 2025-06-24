import { DollarSign, Euro } from 'lucide-react';

import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Currency } from '@/types/account';

type CurrencySwitcherProps = {
    currency: `${Currency}`;
    handleChange: (value: string) => any;
};

export function CurrencySwitcher({ currency, handleChange }: CurrencySwitcherProps) {
    return (
        <ToggleGroup type="single" value={currency} onValueChange={handleChange}>
            <ToggleGroupItem value="VES" aria-label="Bolívares Soberanos">
                VES
            </ToggleGroupItem>
            <ToggleGroupItem value="USD" aria-label="Dólares Americanos">
                <DollarSign />
            </ToggleGroupItem>
            <ToggleGroupItem value="EUR" aria-label="Euros">
                <Euro />
            </ToggleGroupItem>
        </ToggleGroup>
    );
}
