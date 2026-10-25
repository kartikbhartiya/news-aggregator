import { NextRequest, NextResponse } from 'next/server';
import { sendDailyDigestEmail } from '@/lib/mailer';
import { fetchAllAggregatedNews } from '@/lib/news-fetcher';
import { EDITORIAL_FALLBACK_ARTICLES, EDITORIAL_INDIAN_FALLBACK_ARTICLES } from '@/lib/mock-news';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, userName, edition = 'international', categories = [] } = body;

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid recipient email is required' }, { status: 400 });
    }

    // Fetch live articles matching edition & preferences
    let articles = await fetchAllAggregatedNews({
      edition: edition as any,
      forceRefresh: false,
    });

    if (!articles || articles.length === 0) {
      articles = edition === 'india' ? EDITORIAL_INDIAN_FALLBACK_ARTICLES : EDITORIAL_FALLBACK_ARTICLES;
    }

    // Filter if categories specified
    if (categories && Array.isArray(categories) && categories.length > 0 && !categories.includes('all')) {
      const filtered = articles.filter(a => categories.includes(a.category));
      if (filtered.length >= 3) {
        articles = filtered;
      }
    }

    const result = await sendDailyDigestEmail({
      toEmail: email,
      userName: userName || email.split('@')[0],
      edition,
      articles,
    });

    return NextResponse.json({
      success: true,
      messageId: result.messageId,
      recipient: email,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('SMTP Dispatch error:', error);
    return NextResponse.json(
      {
        error: error?.message || 'Failed to dispatch email via Hostinger SMTP',
        code: error?.code,
      },
      { status: 500 }
    );
  }
}
