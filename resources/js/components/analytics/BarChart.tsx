import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { cn } from '@/lib/utils';
import { TrendingUp } from 'lucide-react';
import { Bar, BarChart, Cell, XAxis, YAxis } from 'recharts';

const chartConfig = {} satisfies ChartConfig;
const COLORS = ['#34D399', '#60A5FA', '#F472B6'];

interface BarChartProps<T> {
    title: string;
    description: string;
    data: T[];
    className?: string;
}

export default function BarChartCustom({ title, description, data, className }: BarChartProps<any>) {
    return (
        <Card className={cn(className)}>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="min-h-[250px] h-full w-full">
                    <BarChart data={data} layout="horizontal">
                        <XAxis type="category" dataKey="currency" />
                        <YAxis type="number" />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar width={2} dataKey="amount" radius={4}>
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Bar>
                    </BarChart>
                </ChartContainer>
            </CardContent>
            <CardFooter>
                {/* <div className="flex w-full items-start gap-2 text-sm">*/}
                    {/* <div className="grid gap-2">*/}
                        {/* <div className="flex items-center gap-2 leading-none font-medium">*/}
                            {/* Some Text <TrendingUp className="h-4 w-4" />*/}
                        {/* </div>*/}
                        {/* <div className="text-muted-foreground flex items-center gap-2 leading-none">January - June 2024</div>*/}
                    {/* </div>*/}
                {/* </div>*/}
            </CardFooter>
        </Card>
    );
}
