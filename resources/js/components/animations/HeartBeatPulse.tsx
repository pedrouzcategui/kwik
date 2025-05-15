import React, { useEffect, useRef } from 'react';

interface HeartbeatCanvasProps {
  status?: 'green' | 'yellow' | 'red';
  width?: number;
  height?: number;
}

const colorMap = {
  green: '#22c55e',
  yellow: '#eab308',
  red: '#ef4444',
};

const HeartbeatCanvas: React.FC<HeartbeatCanvasProps> = ({
  status = 'green',
  width = 600,
  height = 60,
}) => {
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
    
      tickCounter += 0.5;
    
      if (tickCounter % 1 === 0) { // ⏳ Add new point only every 3rd frame (tweak this)
        // Update buffer
        bufferRef.current.shift();
    
        let nextY = BASELINE + Math.random() * 4 - 2;
    
        if (Math.random() < 0.02) {
          nextY = BASELINE - (Math.random() * 20 + 15); // spike up
        } else if (Math.random() < 0.02) {
          nextY = BASELINE + (Math.random() * 20 + 15); // spike down
        }
    
        bufferRef.current.push(nextY);
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

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{ display: 'block', width: '100%', height }}
    />
  );
};

export default HeartbeatCanvas;
