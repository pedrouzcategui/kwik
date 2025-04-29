import AreaChart from '@/components/analytics/AreaChart';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Currency } from '@/types/account';
import { Head } from '@inertiajs/react';
import { TrendingUp } from 'lucide-react';
import { Bar, BarChart, Cell, XAxis, YAxis } from 'recharts';

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

const chartConfig = {} satisfies ChartConfig;

const COLORS = ['#34D399', '#60A5FA', '#F472B6'];

export default function Dashboard({ accounts_totals }: DashboardProps) {
    console.log(accounts_totals);
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="p-4">
                <div className="grid lg:grid-cols-4 gap-4">
                    <div>
                        <Card className='bg-slate-800'>
                            <CardHeader>
                                <CardTitle>Amount per Currency</CardTitle>
                                <CardDescription>Displays total amount per currency</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ChartContainer config={chartConfig} className="h-full w-full">
                                    <BarChart layout="horizontal" data={accounts_totals}>
                                        <XAxis type="category" dataKey="currency" />
                                        <YAxis type="number" />
                                        <ChartTooltip content={<ChartTooltipContent />} />
                                        <Bar width={2} dataKey="amount" radius={4}>
                                            {accounts_totals.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ChartContainer>
                            </CardContent>
                            <CardFooter>
                                <div className="flex w-full items-start gap-2 text-sm">
                                    <div className="grid gap-2">
                                        <div className="flex items-center gap-2 leading-none font-medium">
                                            Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
                                        </div>
                                        <div className="text-muted-foreground flex items-center gap-2 leading-none">January - June 2024</div>
                                    </div>
                                </div>
                            </CardFooter>
                        </Card>
                    </div>
                    <div>
                        <AreaChart />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
