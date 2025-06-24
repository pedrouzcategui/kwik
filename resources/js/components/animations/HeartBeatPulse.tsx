import React, { useEffect, useRef } from 'react';

interface HeartbeatCanvasProps {
    status?: 'green' | 'yellow' | 'red' | 'neutral';
    width?: number;
    height?: number;
}

const colorMap = {
    green: '#22c55e',
    yellow: '#eab308',
    red: '#ef4444',
    neutral: '#9ca3af', // Neutral color
};

const HeartbeatCanvas: React.FC<HeartbeatCanvasProps> = ({ status = 'green', width = 600, height = 60 }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const bufferRef = useRef<number[]>([]);
    const animationRef = useRef<number>(null);

    const BASELINE = height / 2;
    const MAX_POINTS = width;

    useEffect(() => {
        const buffer = bufferRef.current;

        // Initialize flat line buffer
        buffer.length = 0;
        for (let i = 0; i < MAX_POINTS; i++) {
            buffer.push(BASELINE);
        }

        let tickCounter = 0;

        function draw() {
            const canvas = canvasRef.current;
            if (!canvas) return;

            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            let tickIncrement = 0.5; // Default for green
            let spikeProbability = 0.02;

            if (status === 'yellow') {
                tickIncrement = 0.4; // Slower for yellow
                spikeProbability = 0.01;
            } else if (status === 'red') {
                tickIncrement = 0.1; // Slowest for red
                spikeProbability = 0.005;
            } else if (status === 'neutral') {
                tickIncrement = 0; // No movement for neutral
            }

            tickCounter += tickIncrement;

            if (tickCounter >= 1) {
                tickCounter = 0;

                if (status !== 'neutral') {
                    // Update buffer
                    bufferRef.current.shift();

                    let nextY = BASELINE + Math.random() * 4 - 2;

                    if (Math.random() < spikeProbability) {
                        nextY = BASELINE - (Math.random() * 20 + 15); // spike up
                    } else if (Math.random() < spikeProbability) {
                        nextY = BASELINE + (Math.random() * 20 + 15); // spike down
                    }

                    bufferRef.current.push(nextY);
                }
            }

            // Redraw waveform
            ctx.clearRect(0, 0, width, height);
            ctx.beginPath();
            ctx.strokeStyle = colorMap[status] || '#22c55e';
            ctx.lineWidth = 2;

            bufferRef.current.forEach((y, i) => {
                if (i === 0) ctx.moveTo(i, y);
                else ctx.lineTo(i, y);
            });

            ctx.stroke();

            animationRef.current = requestAnimationFrame(draw);
        }

        draw();

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [status, width, height]);

    return <canvas ref={canvasRef} width={width} height={height} style={{ display: 'block', width: '100%', height }} />;
};

export default HeartbeatCanvas;
