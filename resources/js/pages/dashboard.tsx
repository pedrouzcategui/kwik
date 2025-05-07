import BarChart from '@/components/analytics/BarChart';
import { LineChartCustom } from '@/components/analytics/LineChart';
import TerminalLog from '@/components/analytics/LogTerminal';
import RadarChartWithDots from '@/components/analytics/RadarChartWithDots';
import { RadialChartGrid } from '@/components/analytics/RadialChartGrid';
import TradingViewWidget from '@/components/analytics/TradingViewWidget';
import DollarTicker from '@/components/animations/DollarTicker';
import HeartbeatCanvas from '@/components/animations/HeartBeatPulse';
import DatePickerWithRange from '@/components/DatePickerWithRange';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Currency } from '@/types/account';
import { Head, router } from '@inertiajs/react';
import { File, Link } from 'lucide-react';
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
    expenses_grouped_by_categories: {
        name: string;
        total: number;
    }[];
}

export default function Dashboard({ accounts_totals, expenses_grouped_by_categories }: DashboardProps) {
    // Lifting the state up, means that the state lives in the parent component, and then it sends to the children
    const [date, setDate] = useState<DateRange | undefined>({
        from: new Date(2025, 0, 1),
        to: new Date(),
    });

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
            <div className="lg:flex items-center justify-between pb-2 gap-4">
                <Button className="border-1 border-white" variant={'outline'}>
                    Export CSV <File />{' '}
                </Button>
                <Button className="border-1 border-white" variant={'outline'}>
                    Share Dashboard <Link />{' '}
                </Button>
                <div className="grow">
                    <DollarTicker />
                </div>
                <DatePickerWithRange date={date} onChange={handleDateChange} />
            </div>
            <div className="grid grid-cols-4 gap-4 pt-2 pb-4 lg:grid-cols-2 xl:grid-cols-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Total Disponible</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <span className="md:text-3xl xl:text-6xl font-bold">$100,000</span>
                    </CardContent>
                </Card>
                <Card className="border-success/30 col-span-2">
                    <CardHeader>
                        <CardTitle className="flex justify-between">
                            <span>Estado Financiero: </span> <Badge className="bg-success">Saludable</Badge>{' '}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="overflow-hidden">
                        <HeartbeatCanvas status="green" />
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Total sin Presupuestar</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <span className="text-3xl lg:text-6xl font-bold">$1000</span>
                    </CardContent>
                </Card>
            </div>
            <div>
                <div className="grid grid-cols-1 gap-4 pb-4 md:grid-cols-2 xl:grid-cols-4">
                    <BarChart
                        className="h-full"
                        data={accounts_totals}
                        title="Total en cuentas por moneda"
                        description="Representa el total de dinero agregado de todas las cuentas, agrupado por moneda"
                    />
                    <LineChartCustom />
                    <div>
                        <RadarChartWithDots
                            name={'Gastos por Categoria'}
                            description={'Gastos y Total de Gastos ordenados por categoria'}
                            data={expenses_grouped_by_categories}
                            dataKey={'name'}
                        />
                    </div>
                    <RadialChartGrid />
                </div>
            </div>
            <div className="grid grid-cols-4 gap-4 pb-4">
                <TerminalLog />
                <TradingViewWidget />
            </div>
        </AppLayout>
    );
}
