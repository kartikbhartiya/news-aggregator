'use client';

import React, { useEffect, useState } from 'react';
import { MarketTickerItem } from '@/types/news';
import { MARKET_TICKER_ITEMS } from '@/lib/market-ticker';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';

export default function ModernTickerBar() {
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
    <div className="border-b border-zinc-200/70 bg-white/70 backdrop-blur-md text-xs select-none overflow-hidden">
      <div className="max-w-7xl mx-auto flex items-center px-4 sm:px-6">
        {/* Modern Live Pulse Badge */}
        <div className="shrink-0 flex items-center gap-1.5 py-2 pr-4 border-r border-zinc-200/80 z-10 text-zinc-700">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="text-[11px] font-semibold tracking-wide text-zinc-900 uppercase">
            LIVE SIGNALS
          </span>
        </div>

        {/* Scrolling Modern Ticker Stream */}
        <div className="overflow-hidden relative flex-1 py-1.5">
          <div className="animate-ticker flex items-center space-x-6 whitespace-nowrap pl-4">
            {[...tickers, ...tickers].map((item, idx) => (
              <div
                key={`${item.symbol}-${idx}`}
                className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-lg bg-zinc-50 border border-zinc-200/60 hover:bg-zinc-100 transition-colors text-[11px]"
              >
                <span className="font-semibold text-zinc-900">{item.symbol}</span>
                <span className="text-zinc-500 font-mono text-[10px]">{item.price}</span>
                <span
                  className={`inline-flex items-center text-[10px] font-mono font-medium ${
                    item.isPositive ? 'text-emerald-600' : 'text-rose-600'
                  }`}
                >
                  {item.isPositive ? (
                    <TrendingUp className="w-2.5 h-2.5 mr-0.5 inline" />
                  ) : (
                    <TrendingDown className="w-2.5 h-2.5 mr-0.5 inline" />
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
