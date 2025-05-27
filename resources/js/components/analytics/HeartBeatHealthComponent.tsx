import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import HeartbeatCanvas from '../animations/HeartBeatPulse';
import { Badge } from '../ui/badge';

interface HeartBeatHealthComponentProps {
    status: 'neutral' | 'green' | 'yellow' | 'red';
}

const HeartBeatHealthComponent: React.FC<HeartBeatHealthComponentProps> = ({ status }) => {
    const getStatusText = () => {
        switch (status) {
            case 'green':
                return { text: 'Saludable', badgeClass: 'bg-success' };
            case 'yellow':
                return { text: 'Requiere Atención', badgeClass: 'bg-yellow-600' };
            case 'red':
                return { text: 'Peligro', badgeClass: 'bg-red-600' };
            default:
                return { text: 'Neutral', badgeClass: 'bg-neutral' };
        }
    };

    const { text, badgeClass } = getStatusText();

    return (
        <Card
            className={`col-span-2 ${
            status === 'green'
                ? 'border-success/30'
                : status === 'yellow'
                ? 'border-warning/30'
                : status === 'red'
                ? 'border-danger/30'
                : 'border-neutral/30'
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
    );
};

export default HeartBeatHealthComponent;
