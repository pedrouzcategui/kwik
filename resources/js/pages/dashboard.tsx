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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Currency } from '@/types/account';
import { ExchangeRate } from '@/types/exchange-rate';
import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { DateRange } from 'react-day-picker';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Panel de Analíticas',
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
    logs: Log[];
    dollar_rates: ExchangeRate[];
    total_account_amount_in_usd: number;
}

export default function Dashboard({
    accounts_totals,
    expenses_grouped_by_categories,
    logs,
    dollar_rates,
    total_account_amount_in_usd,
}: DashboardProps) {
    // Lifting the state up, means that the state lives in the parent component, and then it sends to the children
    const { auth } = usePage().props;
    const [date, setDate] = useState<DateRange | undefined>({
        from: new Date(auth.user.created_at),
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
            <Head title="Panel de Analíticas" />
            <div className="items-center justify-between gap-4 pb-2 lg:flex">
                {/* <Button className="border-1 border-white" variant={'outline'}>
                    Export CSV <File />{' '}
                </Button>
                <Button className="border-1 border-white" variant={'outline'}>
                    Share Dashboard <Link />{' '}
                </Button> */}
                <div className="grow">
                    <DollarTicker rates={dollar_rates} />
                </div>
                <DatePickerWithRange disabledBeforeDate={new Date(auth.user.created_at)} date={date} onChange={handleDateChange} />
            </div>
            <div className="grid grid-cols-4 gap-4 pt-2 pb-4 lg:grid-cols-2 xl:grid-cols-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Total Disponible</CardTitle>
                        <CardDescription>Operaciones normalizadas a dólar a tasa oficial</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <span className="text-2xl font-bold text-wrap sm:text-3xl lg:text-4xl xl:text-5xl">
                            ${total_account_amount_in_usd.toLocaleString()}
                        </span>
                    </CardContent>
                </Card>
                {/* This needs to be a component */}
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
                        <span className="text-3xl font-bold lg:text-6xl">$1,000</span>
                    </CardContent>
                </Card>
                {/* END: This needs to be a component */}
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
                    <RadarChartWithDots
                        name={'Gastos por Categoria'}
                        description={'Gastos y Total de Gastos ordenados por categoria'}
                        data={expenses_grouped_by_categories}
                        dataKey={'name'}
                    />
                    <RadialChartGrid />
                </div>
            </div>
            <div className="grid grid-cols-4 gap-4 pb-4">
                <TerminalLog logs={logs} />
                <TradingViewWidget />
            </div>
        </AppLayout>
    );
}
