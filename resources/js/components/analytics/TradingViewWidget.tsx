import React, { useEffect, useRef } from 'react';

function TradingViewWidget() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
    script.type = 'text/javascript';
    script.async = true;
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: "FX_IDC:USDVES",
      interval: "1",
      hide_top_toolbar: true,
      allow_symbol_change: false,
      theme: 'dark',
      timezone: "Etc/UTC",
    });

    containerRef.current.appendChild(script);
  }, []);

  return (
    <div
      className="tradingview-widget-container col-span-2"
      ref={containerRef}
      style={{ height: '100%', width: '100%' }}
    >
      <div className="tradingview-widget-container__widget" style={{ height: 'calc(100% - 32px)', width: '100%' }}></div>
    </div>
  );
}

export default TradingViewWidget;
