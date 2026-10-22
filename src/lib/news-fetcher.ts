import { Article, NewsCategory } from '@/types/news';
import { CURATED_FEEDS } from './curated-sources';
import { parseRssFeed } from './rss-parser';
import { EDITORIAL_FALLBACK_ARTICLES } from './mock-news';
import { fetchNewsDataArticles } from './newsdata';

// In-memory cache for ultra-fast server response
interface CacheEntry {
  timestamp: number;
  data: Article[];
}

let globalCache: CacheEntry | null = null;
const CACHE_TTL_MS = 3 * 60 * 1000; // 3 minutes

async function fetchHackerNewsArticles(): Promise<Article[]> {
  try {
    const res = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json', {
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];
    const storyIds: number[] = await res.json();
    const topIds = storyIds.slice(0, 10);

    const storyPromises = topIds.map(async (id) => {
      try {
        const itemRes = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`, {
          next: { revalidate: 300 },
        });
        if (!itemRes.ok) return null;
        return itemRes.json();
      } catch {
        return null;
      }
    });

    const rawStories = await Promise.all(storyPromises);
    const articles: Article[] = [];

    for (const item of rawStories) {
      if (!item || !item.title) continue;
      const url = item.url || `https://news.ycombinator.com/item?id=${item.id}`;
      const title = item.title;
      const author = item.by || 'Hacker News Community';
      const score = item.score || 0;
      const comments = item.descendants || 0;
      const description = `Community discussion with ${score} points and ${comments} comments on Hacker News. Submitted by ${author}.`;
      const id = `hn-${item.id}`;

      articles.push({
        id,
        title,
        description,
        content: `${title}\n\n${description}\n\nOriginal source discussion available on Hacker News and linked domain.`,
        url,
        source: {
          id: 'hackernews',
          name: 'Hacker News Wire',
          credibilityScore: 95,
          badge: 'Developer Signal',
          websiteUrl: 'https://news.ycombinator.com',
        },
        author: `HN: @${author}`,
        publishedAt: new Date(item.time * 1000).toISOString(),
        imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1200&auto=format&fit=crop',
        category: 'tech',
        readTime: 3,
        sentiment: 'analytical',
      });
    }

    return articles;
  } catch (err) {
    console.warn('Hacker News fetch error:', err);
    return [];
  }
}

async function fetchFeedSafe(feedConfig: typeof CURATED_FEEDS[0]): Promise<Article[]> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 6000); // 6s timeout per feed

  try {
    const res = await fetch(feedConfig.url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 VeritasEditorial/1.0',
        'Accept': 'application/rss+xml, application/xml, text/xml, */*',
      },
      next: { revalidate: 300 },
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      return [];
    }

    const xmlText = await res.text();
    return parseRssFeed(xmlText, feedConfig.source, feedConfig.category);
  } catch (err) {
    clearTimeout(timeoutId);
    return [];
  }
}

export async function fetchAllAggregatedNews(options?: {
  category?: NewsCategory;
  sourceId?: string;
  search?: string;
  forceRefresh?: boolean;
}): Promise<Article[]> {
  const now = Date.now();

  let allArticles: Article[] = [];

  // Check in-memory cache
  if (!options?.forceRefresh && globalCache && now - globalCache.timestamp < CACHE_TTL_MS) {
    allArticles = globalCache.data;
  } else {
    // Parallel fetch from NewsData.io API + curated feeds + Hacker News
    const feedPromises = CURATED_FEEDS.map((feed) => fetchFeedSafe(feed));
    const [newsDataArticles, hnArticles, ...feedResults] = await Promise.all([
      fetchNewsDataArticles({
        category: options?.category,
        search: options?.search,
        forceRefresh: options?.forceRefresh,
      }),
      fetchHackerNewsArticles(),
      ...feedPromises,
    ]);

    const gathered = [
      ...EDITORIAL_FALLBACK_ARTICLES,
      ...newsDataArticles,
      ...hnArticles,
      ...feedResults.flat(),
    ];

    // Deduplicate by URL and title similarity
    const seenUrls = new Set<string>();
    const seenTitles = new Set<string>();
    const uniqueArticles: Article[] = [];

    for (const art of gathered) {
      const cleanUrl = art.url.toLowerCase().split('?')[0];
      const normTitle = art.title.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 40);

      if (!seenUrls.has(cleanUrl) && !seenTitles.has(normTitle)) {
        seenUrls.add(cleanUrl);
        seenTitles.add(normTitle);
        uniqueArticles.push(art);
      }
    }

    // Sort by publication date descending
    uniqueArticles.sort((a, b) => {
      const timeA = new Date(a.publishedAt).getTime() || 0;
      const timeB = new Date(b.publishedAt).getTime() || 0;
      return timeB - timeA;
    });

    // Designate first impactful story as lead story if none explicitly set
    if (uniqueArticles.length > 0 && !uniqueArticles.some((a) => a.isLeadStory)) {
      uniqueArticles[0].isLeadStory = true;
    }

    allArticles = uniqueArticles;
    globalCache = {
      timestamp: now,
      data: allArticles,
    };
  }

  // Filter by category
  let filtered = allArticles;
  if (options?.category && options.category !== 'all') {
    filtered = filtered.filter((a) => a.category === options.category);
  }

  // Filter by source
  if (options?.sourceId && options.sourceId !== 'all') {
    filtered = filtered.filter((a) => a.source.id === options.sourceId);
  }

  // Filter by search query
  if (options?.search && options.search.trim()) {
    const q = options.search.toLowerCase().trim();
    filtered = filtered.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q) ||
        a.source.name.toLowerCase().includes(q) ||
        (a.author && a.author.toLowerCase().includes(q))
    );
  }

  return filtered;
}
