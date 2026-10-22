import { NextRequest, NextResponse } from 'next/server';
import { parseRssFeed } from '@/lib/rss-parser';
import { NewsCategory } from '@/types/news';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, name, category } = body;

    if (!url || !url.startsWith('http')) {
      return NextResponse.json({ error: 'Valid HTTP/HTTPS URL required' }, { status: 400 });
    }

    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 VeritasEditorial/1.0',
        'Accept': 'application/rss+xml, application/xml, text/xml, */*',
      },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `Feed responded with status ${res.status}` },
        { status: 400 }
      );
    }

    const xml = await res.text();
    const source = {
      id: `custom-${encodeURIComponent(name || 'Custom')}`,
      name: name || 'Custom Feed',
      credibilityScore: 90,
      badge: 'Custom Subscription',
      websiteUrl: url,
    };

    const articles = parseRssFeed(xml, source, (category as NewsCategory) || 'all');

    return NextResponse.json({
      success: true,
      count: articles.length,
      articles,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Failed to parse custom RSS feed' },
      { status: 500 }
    );
  }
}
