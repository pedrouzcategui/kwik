import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from 'recharts';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
const chartData = [
    { month: 'January', desktop: 186 },
    { month: 'February', desktop: 305 },
    { month: 'March', desktop: 237 },
    { month: 'April', desktop: 273 },
    { month: 'May', desktop: 209 },
    { month: 'June', desktop: 214 },
];

const chartConfig = {
    desktop: {
        label: 'Desktop',
        color: 'hsl(var(--chart-1))',
    },
} satisfies ChartConfig;

type PolygonalChartProps<T> = {
    name: string;
    description: string;
    data: T[];
    dataKey: string;
};

export default function PolygonalChart({ name, description, data, dataKey }: PolygonalChartProps<any>) {
    return (
        <Card className="h-full">
            <CardHeader className="items-center">
                <CardTitle>{name}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent className="pb-0">
                <ChartContainer config={chartConfig} className="aspect-square max-h-[250px] w-full">
                    <RadarChart data={data}>
                        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                        <PolarAngleAxis dataKey={dataKey} />
                        <PolarGrid />
                        <Radar
                            dataKey="total"
                            fill="#F472B6"
                            fillOpacity={0.6}
                            dot={{
                                r: 4,
                                fillOpacity: 1,
                            }}
                        />
                    </RadarChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm">
                {/* <div className="flex items-center gap-2 font-medium leading-none"> */}
                {/* Trending up by 5.2% this month <TrendingUp className="h-4 w-4" /> */}
                {/* </div> */}
                {/* <div className="flex items-center gap-2 leading-none text-muted-foreground"> */}
                {/* January - June 2024 */}
                {/* </div> */}
            </CardFooter>
        </Card>
    );
}
