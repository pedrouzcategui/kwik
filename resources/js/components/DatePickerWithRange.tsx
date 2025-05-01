import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format, isAfter, isBefore, isSameDay } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useState } from 'react';
import { DateRange } from 'react-day-picker';

type Props = {
    date: DateRange | undefined;
    onChange: (range: DateRange | undefined) => void;
    className?: string;
};

export default function DatePickerWithRange({ date, onChange, className }: Props) {
    const [internalDate, setInternalDate] = useState<DateRange | undefined>(date);

    const handleDayClick = (day: Date) => {
        if (!internalDate?.from || (internalDate.from && internalDate.to)) {
            // Start new range
            const newRange = { from: day, to: undefined };
            setInternalDate(newRange);
            onChange(newRange);
        } else {
            const from = internalDate.from;

            if (isBefore(day, from)) {
                const newRange = { from: day, to: from };
                setInternalDate(newRange);
                onChange(newRange);
            } else if (isAfter(day, from)) {
                const newRange = { from, to: day };
                setInternalDate(newRange);
                onChange(newRange);
            } else if (isSameDay(day, from)) {
                // Reset selection if same day clicked
                const newRange = { from: day, to: undefined };
                setInternalDate(newRange);
                onChange(newRange);
            }
        }
    };

    return (
        <div className={cn('grid gap-2', className)}>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        id="date"
                        variant={'outline'}
                        className={cn('w-[300px] justify-start text-left font-normal', !date && 'text-muted-foreground')}
                    >
                        <CalendarIcon />
                        {internalDate?.from ? (
                            internalDate.to ? (
                                <>
                                    {format(internalDate.from, 'LLL dd, y')} - {format(internalDate.to, 'LLL dd, y')}
                                </>
                            ) : (
                                format(internalDate.from, 'LLL dd, y')
                            )
                        ) : (
                            <span>Pick a date</span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        initialFocus
                        mode="range"
                        selected={internalDate}
                        numberOfMonths={2}
                        onDayClick={handleDayClick}
                        defaultMonth={internalDate?.from}
                    />
                </PopoverContent>
            </Popover>
        </div>
    );
}
