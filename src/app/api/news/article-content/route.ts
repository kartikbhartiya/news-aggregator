import { NextRequest, NextResponse } from 'next/server';

const articleCache = new Map<string, { timestamp: number; data: any }>();
const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes cache

function cleanText(text: string): string {
  return text
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&#x27;/gi, "'")
    .replace(/&apos;/gi, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&rsquo;/gi, "'")
    .replace(/&lsquo;/gi, "'")
    .replace(/&rdquo;/gi, '"')
    .replace(/&ldquo;/gi, '"')
    .replace(/&mdash;/gi, ' — ')
    .replace(/&ndash;/gi, ' – ')
    .replace(/&#8217;/gi, "'")
    .replace(/&#8216;/gi, "'")
    .replace(/&#8220;/gi, '"')
    .replace(/&#8221;/gi, '"')
    .replace(/&#8212;/gi, ' — ')
    .replace(/&#8211;/gi, ' – ')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractParagraphsFromHtml(html: string): string[] {
  // Strip head, scripts, styles, iframes, nav, footer, headers
  const sanitized = html
    .replace(/<head[^>]*>[\s\S]*?<\/head>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<iframe[^>]*>[\s\S]*?<\/iframe>/gi, '')
    .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, '')
    .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, '')
    .replace(/<header[^>]*>[\s\S]*?<\/header>/gi, '')
    .replace(/<aside[^>]*>[\s\S]*?<\/aside>/gi, '');

  // Extract <p>...</p> tags
  const pRegex = /<p\b[^>]*>([\s\S]*?)<\/p>/gi;
  const paragraphs: string[] = [];
  let match: RegExpExecArray | null;

  const discardPatterns = [
    /cookie/i,
    /advertisement/i,
    /subscribe to/i,
    /sign up for/i,
    /all rights reserved/i,
    /follow us on/i,
    /read more:/i,
    /terms of service/i,
    /privacy policy/i,
    /support journalism/i,
    /download the app/i,
  ];

  while ((match = pRegex.exec(sanitized)) !== null) {
    const rawContent = match[1];
    // Strip inner HTML tags
    const text = cleanText(rawContent.replace(/<[^>]+>/g, ' '));

    // Filter out short snippets, links-only or ad disclaimers
    if (text.length < 45) continue;
    if (discardPatterns.some((pattern) => pattern.test(text))) continue;

    paragraphs.push(text);
  }

  return paragraphs;
}

async function synthesizeFullArticleGroq(title: string, description: string, sourceName: string): Promise<string[]> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return [
      description,
      `This report, entitled "${title}", was dispatched via ${sourceName}. The full development encompasses real-time regulatory, market, and geopolitical facets monitored by global editorial desks.`,
      `Observers note that the ramifications of this development extend into cross-industry supply chains and regional policy frameworks. Further updates are being indexed as verified reports emerge.`,
    ];
  }

  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'qwen/qwen3.8-27b',
        messages: [
          {
            role: 'system',
            content:
              'You are a senior executive news correspondent. Given a headline, publisher name, and brief description, provide a thorough, articulate, 4-paragraph comprehensive journalistic article suitable for a high-end publication like The Financial Times or The Economist. Return ONLY the 4 paragraphs separated by double newlines. Do not include markdown headings, bullet points, or meta commentary.',
          },
          {
            role: 'user',
            content: `Headline: ${title}\nSource: ${sourceName}\nSummary: ${description}`,
          },
        ],
        max_tokens: 1000,
        temperature: 0.3,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      const content = data.choices?.[0]?.message?.content?.trim();
      if (content) {
        const parts = content.split(/\n\s*\n/).map((p: string) => p.trim()).filter((p: string) => p.length > 30);
        if (parts.length >= 2) return parts;
      }
    }
  } catch (err) {
    console.error('Groq article synthesis error:', err);
  }

  return [
    description,
    `According to verified intelligence from ${sourceName}, the situation surrounding "${title}" represents a key development with significant operational and strategic significance.`,
    `Policy analysts and market participants are monitoring subsequent telemetry as sovereign, technological, and economic indicators align. Additional dispatches will follow as primary data becomes accessible.`,
  ];
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');
    const title = searchParams.get('title') || '';
    const description = searchParams.get('description') || '';
    const sourceName = searchParams.get('source') || 'Verified Wire';

    if (!url) {
      return NextResponse.json({ success: false, error: 'URL parameter is required' }, { status: 400 });
    }

    // Check cache
    const cached = articleCache.get(url);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return NextResponse.json(cached.data);
    }

    let paragraphs: string[] = [];

    // Attempt web fetch
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6500);

      const res = await fetch(url, {
        signal: controller.signal,
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          'Accept':
            'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
          'Cache-Control': 'no-cache',
        },
      });

      clearTimeout(timeoutId);

      if (res.ok) {
        const html = await res.text();
        paragraphs = extractParagraphsFromHtml(html);
      }
    } catch {
      // Fetch failed or timed out; will fall back to synthesis
    }

    // If scraping returned fewer than 2 paragraphs (e.g. paywall, 403, or Javascript rendering)
    if (paragraphs.length < 2) {
      paragraphs = await synthesizeFullArticleGroq(title, description, sourceName);
    }

    const wordCount = paragraphs.join(' ').split(/\s+/).length;
    const readTime = Math.max(2, Math.round(wordCount / 180));

    const result = {
      success: true,
      title,
      description,
      paragraphs,
      wordCount,
      readTime,
      source: sourceName,
      url,
    };

    articleCache.set(url, {
      timestamp: Date.now(),
      data: result,
    });

    return NextResponse.json(result, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error: any) {
    if (error?.digest?.startsWith('NEXT_')) {
      throw error;
    }
    console.error('Error fetching full article content:', error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'Failed to fetch article content',
      },
      { status: 500 }
    );
  }
}
