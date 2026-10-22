import { NextResponse } from 'next/server';
import { checkNewsDataHealth } from '@/lib/newsdata';

export async function GET() {
  const health = await checkNewsDataHealth();
  const rawKey = process.env.NEWSDATA_API_KEY || 'pub_2bc43ef290e749dcb847f0b952d04320';
  const maskedKey = `${rawKey.slice(0, 7)}...${rawKey.slice(-4)}`;

  return NextResponse.json({
    ...health,
    keyMasked: maskedKey,
    endpoint: 'https://newsdata.io/api/1/latest',
  });
}
