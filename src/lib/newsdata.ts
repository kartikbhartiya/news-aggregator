import { Article, NewsCategory } from '@/types/news';

const NEWSDATA_API_KEY = process.env.NEWSDATA_API_KEY || 'pub_2bc43ef290e749dcb847f0b952d04320';
const BASE_URL = 'https://newsdata.io/api/1/latest';

// In-memory cache to conserve NewsData.io API rate limit credits
interface NewsDataCache {
  [key: string]: {
    timestamp: number;
    articles: Article[];
  };
}

const cache: NewsDataCache = {};
const CACHE_TTL = 8 * 60 * 1000; // 8 minutes

function mapCategoryToNewsData(cat: NewsCategory): string {
  switch (cat) {
    case 'world':
      return 'world';
    case 'business':
    case 'markets':
      return 'business';
    case 'tech':
      return 'technology';
    case 'science':
      return 'science';
    case 'culture':
      return 'entertainment';
    default:
      return 'top';
  }
}

function mapNewsDataCategoryToApp(categories?: string[]): NewsCategory {
  if (!categories || categories.length === 0) return 'world';
  const c = categories[0].toLowerCase();
  if (c.includes('tech')) return 'tech';
  if (c.includes('business') || c.includes('economy')) return 'business';
  if (c.includes('science')) return 'science';
  if (c.includes('entertainment') || c.includes('culture') || c.includes('lifestyle')) return 'culture';
  if (c.includes('world') || c.includes('politics')) return 'world';
  return 'world';
}

export async function fetchNewsDataArticles(options?: {
  category?: NewsCategory;
  search?: string;
  forceRefresh?: boolean;
}): Promise<Article[]> {
  const apiKey = NEWSDATA_API_KEY;
  if (!apiKey) return [];

  const category = options?.category || 'all';
  const search = options?.search?.trim() || '';
  const cacheKey = `${category}-${search}`;
  const now = Date.now();

  if (!options?.forceRefresh && cache[cacheKey] && now - cache[cacheKey].timestamp < CACHE_TTL) {
    return cache[cacheKey].articles;
  }

  try {
    const url = new URL(BASE_URL);
    url.searchParams.set('apikey', apiKey);
    url.searchParams.set('language', 'en');

    if (category !== 'all') {
      url.searchParams.set('category', mapCategoryToNewsData(category));
    }
    if (search) {
      url.searchParams.set('q', search);
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 7000); // 7s timeout

    const res = await fetch(url.toString(), {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
      },
      next: { revalidate: 480 },
    });
    clearTimeout(timeout);

    if (!res.ok) {
      console.warn(`NewsData.io returned status ${res.status}`);
      return cache[cacheKey]?.articles || [];
    }

    const json = await res.json();
    if (json.status !== 'success' || !Array.isArray(json.results)) {
      return cache[cacheKey]?.articles || [];
    }

    const articles: Article[] = [];

    for (const item of json.results) {
      if (!item.title || !item.link) continue;

      const title = item.title.trim();
      const rawDesc = item.description || '';
      const description = rawDesc.replace(/<[^>]+>/g, '').trim();

      // In free tier, content often says "ONLY AVAILABLE IN PAID PLANS"
      let content = item.content;
      if (!content || content.includes('ONLY AVAILABLE IN PAID PLANS')) {
        content = `${description}\n\nFull wire coverage dispatched by ${item.source_name || 'NewsData Wire'}. Direct telemetry and primary publisher report available at source link.`;
      } else {
        content = content.replace(/<[^>]+>/g, '').trim();
      }

      const words = (title + ' ' + description).split(/\s+/).length;
      const readTime = Math.max(3, Math.round(words / 140));

      const author = Array.isArray(item.creator) && item.creator.length > 0
        ? item.creator.join(', ')
        : item.source_name || 'News Wire';

      const appCategory = options?.category && options.category !== 'all'
        ? options.category
        : mapNewsDataCategoryToApp(item.category);

      const id = `nd-${item.article_id || Buffer.from(item.link).toString('base64').slice(0, 20)}`;

      articles.push({
        id,
        title,
        description: description.slice(0, 320) + (description.length > 320 ? '...' : ''),
        content,
        url: item.link,
        source: {
          id: `newsdata-${item.source_id || 'wire'}`,
          name: item.source_name || 'Global NewsData Wire',
          credibilityScore: 94,
          badge: 'NewsData.io API',
          websiteUrl: item.source_url || item.link,
        },
        author,
        publishedAt: item.pubDate || new Date().toISOString(),
        imageUrl: item.image_url || undefined,
        category: appCategory,
        readTime,
        sentiment: 'analytical',
      });
    }

    cache[cacheKey] = {
      timestamp: now,
      articles,
    };

    return articles;
  } catch (err) {
    console.warn('NewsData.io fetch skipped or timed out:', err);
    return cache[cacheKey]?.articles || [];
  }
}

export async function checkNewsDataHealth(): Promise<{
  active: boolean;
  totalResults?: number;
  message: string;
}> {
  try {
    const url = `${BASE_URL}?apikey=${NEWSDATA_API_KEY}&language=en&category=top`;
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (res.ok) {
      const data = await res.json();
      if (data.status === 'success') {
        return {
          active: true,
          totalResults: data.totalResults,
          message: 'NewsData.io API is active and operational.',
        };
      }
    }
    return {
      active: false,
      message: `NewsData.io responded with status ${res.status}`,
    };
  } catch (err: any) {
    return {
      active: false,
      message: err?.message || 'Failed to connect to NewsData.io',
    };
  }
}
