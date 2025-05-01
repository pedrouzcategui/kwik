import AreaChart from '@/components/analytics/AreaChart';
import AreaChartStacked from '@/components/analytics/AreaChartStacked';
import BarChart from '@/components/analytics/BarChart';
import DatePickerWithRange from '@/components/DatePickerWithRange';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Currency } from '@/types/account';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { DateRange } from 'react-day-picker';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];
interface DashboardProps {
    accounts_totals: {
        currency: `${Currency}`;
        amount: number;
    }[];
}

export default function Dashboard({ accounts_totals }: DashboardProps) {
    // Lifting the state up, means that the state lives in the parent component, and then it sends to the children
    const [date, setDate] = useState<DateRange | undefined>({
        from: new Date(2025, 0, 1),
        to: new Date(),
    });

    console.log(accounts_totals);

    const handleDateChange = (newDate: DateRange | undefined) => {
        setDate(newDate);

        if (newDate?.from && newDate?.to) {
            router.get(
                route('dashboard'),
                {
                    end_date: newDate.to.toISOString().split('T')[0],
                    start_date: newDate.from.toISOString().split('T')[0],
                },
                {
                    preserveScroll: true,
                    preserveState: true,
                    replace: true,
                },
            );
        }
    };
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <DatePickerWithRange date={date} onChange={handleDateChange} />
            <div className="p-4">
                <div className="grid gap-4 lg:grid-cols-4">
                    <div>
                        <BarChart data={accounts_totals} />
                    </div>
                    <div>
                        <AreaChart />
                    </div>
                    <div>
                        <AreaChartStacked />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
