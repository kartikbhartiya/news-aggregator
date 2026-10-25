'use client';

import React, { useEffect, useState } from 'react';
import { MarketTickerItem } from '@/types/news';
import { MARKET_TICKER_ITEMS } from '@/lib/market-ticker';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { handleButtonClickGlow } from '@/lib/button-glow';

export default function ModernTickerBar({ className = '' }: { className?: string }) {
  const [tickers, setTickers] = useState<MarketTickerItem[]>(MARKET_TICKER_ITEMS);

  useEffect(() => {
    async function loadMarkets() {
      try {
        const res = await fetch('/api/news/markets');
        if (res.ok) {
          const data = await res.json();
          if (data.tickers && Array.isArray(data.tickers)) {
            setTickers(data.tickers);
          }
        }
      } catch {
        // Fall back to static
      }
    }
    loadMarkets();
  }, []);

  return (
    <div className={`border-b border-zinc-200 bg-white text-xs select-none overflow-hidden ${className}`}>
      <div className="max-w-7xl mx-auto flex items-center px-3 sm:px-6">
        
        {/* Architectural Desk Label (Zero Green Lights / Zero Pings) */}
        <div className="shrink-0 flex items-center gap-1.5 py-2 pr-3.5 border-r border-zinc-200 z-10 text-zinc-950">
          <Activity className="w-3.5 h-3.5 text-zinc-950" />
          <span className="text-[10px] font-mono font-bold tracking-wider uppercase">
            MARKET WIRE
          </span>
        </div>

        {/* Scrolling Ticker Stream (Pure Black & White Clay Pills) */}
        <div className="overflow-hidden relative flex-1 py-1.5">
          <div className="animate-ticker flex items-center space-x-3 whitespace-nowrap pl-3">
            {[...tickers, ...tickers].map((item, idx) => (
              <div
                key={`${item.symbol}-${idx}`}
                onClick={(e) => handleButtonClickGlow(e)}
                className="clay-pill inline-flex items-center space-x-2 px-3 py-1 text-[11px] cursor-pointer hover:bg-zinc-50"
              >
                <span className="font-bold text-zinc-950 font-sans">{item.symbol}</span>
                <span className="text-zinc-600 font-mono text-[10px]">{item.price}</span>
                <span
                  className={`inline-flex items-center text-[10px] font-mono font-bold ${
                    item.isPositive ? 'text-zinc-950' : 'text-zinc-500'
                  }`}
                >
                  {item.isPositive ? (
                    <TrendingUp className="w-2.5 h-2.5 mr-0.5 inline text-zinc-950" />
                  ) : (
                    <TrendingDown className="w-2.5 h-2.5 mr-0.5 inline text-zinc-500" />
                  )}
                  {item.change}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
