import { NextRequest, NextResponse } from 'next/server';
import { ExecutiveBriefing } from '@/types/news';
import { fetchAllAggregatedNews } from '@/lib/news-fetcher';
import { generateGroqBriefing } from '@/lib/groq';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || 'all';
    const forceRefresh = searchParams.get('refresh') === 'true';
    const edition = (searchParams.get('edition') || 'international') as 'india' | 'international';

    // Fetch the real-time aggregated articles
    const articles = await fetchAllAggregatedNews({
      category: category as any,
      forceRefresh,
      edition,
    });

    const today = new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });

    // Synthesize using Groq AI
    const groqResult = await generateGroqBriefing(articles, edition, category);

    const briefing: ExecutiveBriefing = {
      id: `briefing-${edition}-${Date.now()}`,
      edition: edition === 'india' ? 'PRISM INDIA EXECUTIVE INTELLIGENCE BRIEF' : 'PRISM GLOBAL EXECUTIVE INTELLIGENCE BRIEF',
      date: today,
      leadHighlight: groqResult.leadHighlight,
      globalPulse: groqResult.globalPulse,
      marketOutlook: groqResult.marketOutlook,
      keyDevelopments: groqResult.keyDevelopments,
    };

    return NextResponse.json(briefing, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=180',
      },
    });
  } catch (error: any) {
    if (error?.digest?.startsWith('NEXT_')) {
      throw error;
    }
    console.error('Briefing API error:', error);
    return NextResponse.json(
      {
        id: `briefing-fallback`,
        edition: 'PRISM EXECUTIVE INTELLIGENCE BRIEF',
        date: new Date().toLocaleDateString('en-US', { dateStyle: 'full' }),
        leadHighlight: 'Accelerating AI computing architectures meet sovereign infrastructure capital reallocation in international markets.',
        globalPulse: 'Monitored and steady across major exchange hubs.',
        marketOutlook: 'Capital yield spreads hold narrow margins; technology sector drives quarterly momentum.',
        keyDevelopments: [
          {
            title: 'Next-Generation Neural Accelerators Deploy at Edge',
            summary: 'Sub-100W inference engines process complex models locally without datacenter latency.',
            category: 'Technology',
            impact: 'Critical',
            timeAgo: 'Just now',
          },
        ],
      },
      { status: 200 }
    );
  }
}
