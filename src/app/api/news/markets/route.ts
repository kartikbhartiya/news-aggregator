import { NextResponse } from 'next/server';
import { MARKET_TICKER_ITEMS } from '@/lib/market-ticker';

export async function GET() {
  return NextResponse.json({
    updatedAt: new Date().toISOString(),
    tickers: MARKET_TICKER_ITEMS,
  });
}
