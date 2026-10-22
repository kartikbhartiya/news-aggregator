'use client';

import React, { useEffect, useState } from 'react';
import { MarketTickerItem } from '@/types/news';
import { MARKET_TICKER_ITEMS } from '@/lib/market-ticker';
import { TrendingUp, TrendingDown, Radio } from 'lucide-react';

export default function MarketTickerBar() {
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
    <div className="border-y border-stone-200/80 bg-white/80 backdrop-blur-sm text-xs select-none overflow-hidden">
      <div className="max-w-7xl mx-auto flex items-center">
        {/* Wire label */}
        <div className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-stone-900 text-stone-100 font-mono text-[10px] uppercase tracking-wider font-semibold border-r border-stone-800 z-10">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-live-pulse" />
          <span>MARKETS WIRE</span>
        </div>

        {/* Scrolling items */}
        <div className="overflow-hidden relative flex-1 py-1.5">
          <div className="animate-ticker flex items-center space-x-8 whitespace-nowrap pl-4">
            {[...tickers, ...tickers].map((item, idx) => (
              <div key={`${item.symbol}-${idx}`} className="inline-flex items-center space-x-2 text-[11px]">
                <span className="font-semibold text-stone-900 tracking-tight">{item.symbol}</span>
                <span className="text-stone-500 font-mono">{item.price}</span>
                <span
                  className={`inline-flex items-center text-[10px] font-mono font-medium px-1 py-0.5 rounded ${
                    item.isPositive
                      ? 'text-emerald-700 bg-emerald-50'
                      : 'text-rose-700 bg-rose-50'
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
