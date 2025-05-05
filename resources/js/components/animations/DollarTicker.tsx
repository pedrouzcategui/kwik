import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { format } from 'date-fns';
import React from 'react';

const rates = [
  {
    source: 'BCV',
    value: 39.45,
    diff: 0.23,
  },
  {
    source: 'Paralelo',
    value: 40.12,
    diff: -0.45,
  },
];

export default function AnimatedExchangeTicker() {
  const [index, setIndex] = React.useState(0);
  const current = rates[index];
  const isUp = current.diff >= 0;
  const now = new Date();

  React.useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % rates.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full  mx-auto bg-card border border-border rounded-lg px-6 py-2 flex items-center justify-between text-sm font-mono text-muted-foreground animate-fade-in-out transition-all duration-500">
      <div className="flex gap-2">
        <span className="text-yellow-400">{current.source}:</span>
        <span className="text-white font-bold tracking-wider">
          {format(now, 'eee MMM dd yyyy')}
        </span>
        <span className="text-white">|</span>
        <span className="text-white">{format(now, 'HH:mm:ss')}</span>
      </div>

      <div className="flex gap-2 items-center">
        <span className="text-white text-lg font-bold tracking-wide">
          VES {current.value.toFixed(2)}
        </span>
        <span className={`flex items-center ${isUp ? 'text-green-500' : 'text-red-500'}`}>
          {isUp ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
          <span>{Math.abs(current.diff).toFixed(2)}%</span>
        </span>
      </div>
    </div>
  );
}
