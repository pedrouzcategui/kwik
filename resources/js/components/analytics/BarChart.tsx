import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { cn } from '@/lib/utils';
import React from 'react';
import { Bar, BarChart, Cell, XAxis, YAxis } from 'recharts';

const chartConfig = {} satisfies ChartConfig;

interface BarChartProps<T> {
    title: string;
    description: string;
    data: T[];
    className?: string;
}

function getChartColors() {
    if (typeof window === 'undefined') return ['#8884d8', '#82ca9d', '#ffc658'];
    const root = getComputedStyle(document.documentElement);
    return [
        root.getPropertyValue('--chart-1').trim() || '#8884d8',
        root.getPropertyValue('--chart-2').trim() || '#82ca9d',
        root.getPropertyValue('--chart-3').trim() || '#ffc658',
    ];
}

export default function BarChartCustom({ title, description, data, className }: BarChartProps<any>) {
    const [colors, setColors] = React.useState<string[]>(['#8884d8', '#82ca9d', '#ffc658']);

    React.useEffect(() => {
        setColors(getChartColors());
    }, []);

    return (
        <Card className={cn(className)}>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
                {data.length > 0 ? (
                    <ChartContainer config={chartConfig} className="h-full min-h-[250px] w-full">
                        <BarChart data={data} layout="horizontal">
                            <XAxis type="category" dataKey="currency" />
                            <YAxis type="number" />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Bar width={2} dataKey="amount" radius={4}>
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={colors[index % 3]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ChartContainer>
                ) : (
                    <div className="text-muted-foreground flex min-h-[250px] items-center justify-center">No hay datos por el momento.</div>
                )}
            </CardContent>
            <CardFooter>{/* ... */}</CardFooter>
        </Card>
    );
}
