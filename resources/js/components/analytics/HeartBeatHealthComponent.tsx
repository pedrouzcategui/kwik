import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import React from 'react';
import HeartbeatCanvas from '../animations/HeartBeatPulse';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

interface HeartBeatHealthComponentProps {
    status: 'neutral' | 'green' | 'yellow' | 'red';
}

const HeartBeatHealthComponent: React.FC<HeartBeatHealthComponentProps> = ({ status }) => {
    const getStatusText = () => {
        switch (status) {
            case 'green':
                return { text: 'Saludable', badgeClass: 'bg-green-700' };
            case 'yellow':
                return { text: 'Requiere Atención', badgeClass: 'bg-yellow-600' };
            case 'red':
                return { text: 'Peligro', badgeClass: 'bg-red-600' };
            default:
                return { text: 'Neutral', badgeClass: 'bg-gray-600' };
        }
    };

    const { text, badgeClass } = getStatusText();

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger className="col-span-2">
                    <Card
                        className={`${
                            status === 'green'
                                ? 'border-success/30'
                                : status === 'yellow'
                                  ? 'border-yellow-600'
                                  : status === 'red'
                                    ? 'border-danger/30'
                                    : 'border-gray-600/30'
                        }`}
                    >
                        <CardHeader>
                            <CardTitle className="flex justify-between">
                                <span>Estado Financiero: </span> <Badge className={badgeClass}>{text}</Badge>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="overflow-hidden">
                            <HeartbeatCanvas status={status} />
                        </CardContent>
                    </Card>
                </TooltipTrigger>
                <TooltipContent>
                    <div>
                        <ul className="space-y-2 text-sm">
                            <li>
                                💡 El estado de tu salud financiera se determina por la relación entre tus ingresos y gastos, así como por tu
                                capacidad de ahorro e inversión.
                            </li>
                            <li>✅ Un estado saludable indica que tus ingresos superan tus gastos.</li>
                            <li>⚠️ Un estado peligroso sugiere que tus gastos superan tus ingresos.</li>
                        </ul>
                    </div>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};

export default HeartBeatHealthComponent;
