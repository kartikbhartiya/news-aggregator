import { NextRequest, NextResponse } from 'next/server';
import { fetchAllAggregatedNews } from '@/lib/news-fetcher';
import { NewsCategory } from '@/types/news';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = (searchParams.get('category') as NewsCategory) || 'all';
    const sourceId = searchParams.get('source') || 'all';
    const search = searchParams.get('search') || '';
    const forceRefresh = searchParams.get('refresh') === 'true';

    const articles = await fetchAllAggregatedNews({
      category,
      sourceId,
      search,
      forceRefresh,
    });

    return NextResponse.json(
      {
        success: true,
        count: articles.length,
        timestamp: new Date().toISOString(),
        articles,
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=180, stale-while-revalidate=360',
        },
      }
    );
  } catch (error: any) {
    if (error?.digest?.startsWith('NEXT_')) {
      throw error;
    }
    console.error('API /api/news error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'Failed to aggregate news',
      },
      { status: 500 }
    );
  }
}
