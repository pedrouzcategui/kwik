import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from 'recharts';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import React from 'react';

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

function getChartColors() {
    if (typeof window === 'undefined') return ['#8884d8', '#82ca9d', '#ffc658'];
    const root = getComputedStyle(document.documentElement);
    return [
        root.getPropertyValue('--chart-1').trim() || '#8884d8',
        root.getPropertyValue('--chart-2').trim() || '#82ca9d',
        root.getPropertyValue('--chart-3').trim() || '#ffc658',
    ];
}

export default function PolygonalChart({ name, description, data, dataKey }: PolygonalChartProps<any>) {
    const [colors, setColors] = React.useState<string[]>(['#8884d8', '#82ca9d', '#ffc658']);

    React.useEffect(() => {
        setColors(getChartColors());
    }, []);

    return (
        <Card className="h-full">
            <CardHeader className="items-center">
                <CardTitle>{name}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent className="pb-0">
                {data.length > 0 ? (
                    <ChartContainer config={chartConfig} className="aspect-square max-h-[250px] w-full">
                        <RadarChart data={data}>
                            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                            <PolarAngleAxis dataKey={dataKey} />
                            <PolarGrid />
                            <Radar
                                dataKey="total"
                                fill={colors[0]}
                                fillOpacity={0.6}
                                dot={{
                                    r: 4,
                                    fillOpacity: 1,
                                }}
                            />
                        </RadarChart>
                    </ChartContainer>
                ) : (
                    <div className="text-muted-foreground flex min-h-[250px] items-center justify-center">No hay datos por el momento.</div>
                )}
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
