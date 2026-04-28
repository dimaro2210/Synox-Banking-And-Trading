import React, { useEffect, useRef } from 'react';

const TradingViewTicker = () => {
    const container = useRef();

    useEffect(() => {
        if (!container.current) return;

        const script = document.createElement("script");
        script.src = "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";
        script.type = "text/javascript";
        script.async = true;
        script.innerHTML = JSON.stringify({
            "symbols": [
                {
                    "proName": "FOREXCOM:SPXUSD",
                    "title": "S&P 500 Index"
                },
                {
                    "proName": "FX_IDC:EURUSD",
                    "title": "EUR to USD"
                },
                {
                    "proName": "BITSTAMP:BTCUSD",
                    "title": "Bitcoin"
                },
                {
                    "proName": "BITSTAMP:ETHUSD",
                    "title": "Ethereum"
                },
                {
                    "proName": "NASDAQ:TSLA"
                },
                {
                    "proName": "NASDAQ:AAPL"
                },
                {
                    "proName": "OANDA:XAUUSD"
                }
            ],
            "showSymbolLogo": true,
            "isTransparent": true,
            "displayMode": "adaptive",
            "colorTheme": "dark",
            "locale": "en"
        });
        container.current.appendChild(script);

        return () => {
            if (container.current) {
                container.current.innerHTML = '';
            }
        };
    }, []);

    return (
        <div className="tradingview-widget-container wow fadeIn" data-wow-delay=".1s"
            style={{ background: '#0a1128', borderTop: '1px solid rgba(255,255,255,0.1)', borderBottom: '1px solid rgba(255,255,255,0.1)', width: '100%', overflow: 'hidden', display: 'block', boxSizing: 'border-box' }}>
            <div ref={container} className="tradingview-widget-container__widget" style={{ width: '100%' }}></div>
        </div>
    );
};

export default TradingViewTicker;
