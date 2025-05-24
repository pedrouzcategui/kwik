import { ExchangeRate } from '@/types/exchange-rate';
import React from 'react';

type AnimatedExchangeTickerProps = {
    rates: ExchangeRate[];
};

export default function AnimatedExchangeTicker({ rates }: AnimatedExchangeTickerProps) {
    const [index, setIndex] = React.useState(0);
    const current = rates[index];
    const isUp = current.diff >= 0;
    const now = new Date();

    React.useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % rates.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [rates.length]);

    if (!rates.length) return null;

    return (
        <div className="bg-card border-border text-muted-foreground animate-fade-in-out mx-auto flex w-full items-center justify-between rounded-lg border px-6 py-2 font-mono text-sm transition-all duration-500">
            <div className="flex gap-2">
                <span className="text-yellow-400">{current.source}:</span>
                <span className="font-bold tracking-wider text-white">
                    {new Date(current.effective_date).toLocaleDateString('es-ES', {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'short',
                        day: '2-digit',
                    })}{' '}
                    <span className="text-xs text-gray-400">(Último valor cotizado) </span>
                </span>
            </div>

            <div className="flex items-center gap-2">
                <span className="text-lg font-bold tracking-wide text-white">VES {parseFloat(current.rate_to_usd).toFixed(2)}</span>
                {/* <span className={`flex items-center ${isUp ? 'text-green-500' : 'text-red-500'}`}>
                    {isUp ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                    <span>{Math.abs(current.diff).toFixed(2)}%</span>
                </span> */}
            </div>
        </div>
    );
}
