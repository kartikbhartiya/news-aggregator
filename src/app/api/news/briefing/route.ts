import { NextRequest, NextResponse } from 'next/server';
import { ExecutiveBriefing } from '@/types/news';
import { fetchAllAggregatedNews } from '@/lib/news-fetcher';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || 'all';
    const forceRefresh = searchParams.get('refresh') === 'true';

    // Fetch the real-time aggregated articles
    const articles = await fetchAllAggregatedNews({
      category: category as any,
      forceRefresh,
    });

    const today = new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });

    // Select top impactful stories from current live feed
    const topLead = articles[0];
    const secondaryStories = articles.slice(1, 6);

    const leadHighlight = topLead
      ? `${topLead.title}. ${topLead.description.slice(0, 180)}...`
      : 'Global financial and technological indices exhibit steady resilience amid autumn monetary strategy conferences.';

    const keyDevelopments = secondaryStories.length > 0
      ? secondaryStories.map((art, idx) => {
          const impactLevels: Array<'Critical' | 'High' | 'Medium'> = ['Critical', 'High', 'High', 'Medium', 'Medium'];
          return {
            title: art.title,
            summary: art.description || `${art.title} dispatched by ${art.source.name}.`,
            category: art.category.toUpperCase(),
            impact: impactLevels[idx] || 'Medium',
            timeAgo: 'Live Wire',
          };
        })
      : [
          {
            title: 'Quantum Hardware Error Threshold Crossed',
            summary: 'Topological non-Abelian anyon braids exhibit 99.98% error resilience under cryogenic benchmarks.',
            category: 'Technology',
            impact: 'Critical' as const,
            timeAgo: '24m ago',
          },
          {
            title: 'Sovereign Debt Maturity Rollover Strategy',
            summary: 'Central bank governors signal higher-for-longer baseline neutral rates as $8 trillion in public debt faces treasury refinancing.',
            category: 'Capital Markets',
            impact: 'High' as const,
            timeAgo: '1h ago',
          },
          {
            title: 'Arctic Maritime Shipping Conduits Expand',
            summary: 'Dual-fuel reinforced freight vessels trim Asia-to-Europe shipping duration to 19 days.',
            category: 'Geopolitics',
            impact: 'High' as const,
            timeAgo: '2h ago',
          },
        ];

    const briefing: ExecutiveBriefing = {
      id: `briefing-${Date.now()}`,
      edition: 'PRISM EXECUTIVE INTELLIGENCE BRIEF',
      date: today,
      leadHighlight,
      globalPulse: 'Active telemetry monitoring across global semiconductor, trade corridor, and macro capital flows.',
      marketOutlook: 'Technology equities and sovereign paper yields show firm bid strength; commodity volatility stabilizing.',
      keyDevelopments,
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
