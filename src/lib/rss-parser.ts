import { XMLParser } from 'fast-xml-parser';
import { Article, ArticleSource, NewsCategory } from '@/types/news';

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  textNodeName: '#text',
  trimValues: true,
  parseTagValue: false,
});

function cleanHtml(html: any): string {
  if (!html) return '';
  let str = '';
  if (typeof html === 'string') {
    str = html;
  } else if (typeof html === 'object' && html !== null) {
    str = typeof html['#text'] === 'string' ? html['#text'] : String(html['#text'] || '');
  } else {
    str = String(html);
  }
  return str
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractImageUrl(item: any): string | undefined {
  // 1. media:content
  if (item['media:content']) {
    const mc = item['media:content'];
    if (Array.isArray(mc)) {
      const img = mc.find((c: any) => c['@_medium'] === 'image' || (c['@_type'] && c['@_type'].startsWith('image/')) || c['@_url']);
      if (img && img['@_url']) return img['@_url'];
    } else if (mc['@_url']) {
      return mc['@_url'];
    }
  }

  // 2. media:thumbnail
  if (item['media:thumbnail']) {
    const mt = item['media:thumbnail'];
    if (Array.isArray(mt) && mt[0]?.['@_url']) return mt[0]['@_url'];
    if (mt['@_url']) return mt['@_url'];
  }

  // 3. enclosure
  if (item.enclosure) {
    const enc = item.enclosure;
    if (Array.isArray(enc)) {
      const img = enc.find((e: any) => e['@_type'] && e['@_type'].startsWith('image/'));
      if (img && img['@_url']) return img['@_url'];
    } else if (enc['@_type'] && enc['@_type'].startsWith('image/')) {
      return enc['@_url'];
    } else if (enc['@_url']) {
      return enc['@_url'];
    }
  }

  // 4. regex from content or description
  const rawText = item['content:encoded'] || item.content || item.description || '';
  if (typeof rawText === 'string') {
    const match = rawText.match(/<img[^>]+src=["']([^"'>]+)["']/i);
    if (match && match[1] && !match[1].includes('feedburner') && !match[1].includes('1x1')) {
      return match[1];
    }
  }

  return undefined;
}

export function parseRssFeed(
  xmlData: string,
  sourceInfo: ArticleSource,
  category: NewsCategory
): Article[] {
  const articles: Article[] = [];

  try {
    const parsed = parser.parse(xmlData);

    // RSS 2.0
    let items = parsed?.rss?.channel?.item;
    
    // Atom 1.0 fallback
    if (!items && parsed?.feed?.entry) {
      items = parsed.feed.entry;
    }

    if (!items) return [];
    if (!Array.isArray(items)) {
      items = [items];
    }

    for (const raw of items) {
      const title = cleanHtml(raw.title || '');
      if (!title || title.length < 5) continue;

      let link = raw.link;
      if (typeof link === 'object' && link['@_href']) {
        link = link['@_href'];
      }
      if (Array.isArray(link)) {
        const alt = link.find((l: any) => l['@_rel'] === 'alternate') || link[0];
        link = alt?.['@_href'] || alt || '';
      }
      if (!link) continue;

      const rawDesc = raw.description || raw.summary || raw['content:encoded'] || '';
      const description = cleanHtml(rawDesc);
      const rawContent = raw['content:encoded'] || raw.content || raw.description || '';
      const content = cleanHtml(rawContent || description);

      const pubDate = raw.pubDate || raw.published || raw.updated || new Date().toISOString();
      const author = cleanHtml(raw['dc:creator'] || raw.author?.name || raw.author || sourceInfo.name);

      const imageUrl = extractImageUrl(raw);

      // Estimate reading time (roughly 200 words/min)
      const words = (title + ' ' + description + ' ' + content).split(/\s+/).length;
      const readTime = Math.max(2, Math.round(words / 150));

      // Hash id from url
      const id = Buffer.from(link).toString('base64').replace(/[/+=]/g, '').slice(0, 24);

      articles.push({
        id,
        title,
        description: description.slice(0, 320) + (description.length > 320 ? '...' : ''),
        content: content.length > 50 ? content : description,
        url: link,
        source: sourceInfo,
        author: author || sourceInfo.name,
        publishedAt: pubDate,
        imageUrl,
        category,
        readTime,
        sentiment: 'analytical',
      });
    }
  } catch (err) {
    console.warn(`Failed to parse RSS for ${sourceInfo.name}:`, err);
  }

  return articles;
}
