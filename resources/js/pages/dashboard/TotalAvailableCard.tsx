import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { currencyMap } from '@/lib/utils';
import { Currency } from '@/types/account';

interface TotalAvailableCardProps {
    total_amount: number;
    currency: `${Currency}`;
}

export default function TotalAvailableCard({ total_amount, currency }: TotalAvailableCardProps) {
    return (
        <Card className="col-span-4 sm:col-span-1">
            <CardHeader>
                <CardTitle>Total Disponible</CardTitle>
                <CardDescription>Operaciones normalizadas a dólar a tasa oficial</CardDescription>
            </CardHeader>
            <CardContent>
                <span className="text-2xl font-bold text-wrap sm:text-3xl lg:text-4xl xl:text-4xl">
                    {currencyMap[currency]} {total_amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
            </CardContent>
        </Card>
    );
}
