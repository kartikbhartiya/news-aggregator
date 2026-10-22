import { createClient } from '@supabase/supabase-js';
import { Article, CustomRssFeed } from '@/types/news';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://pubfwtqkapmffhkdtivb.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_oW1OqsQACt179fRhH8WXDw_7uXkdDl2';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const LOCAL_STORAGE_BOOKMARKS_KEY = 'veritas_news_bookmarks_v1';
const LOCAL_STORAGE_HISTORY_KEY = 'veritas_news_history_v1';
const LOCAL_STORAGE_FEEDS_KEY = 'veritas_custom_feeds_v1';

export const SUPABASE_SETUP_SQL = `-- Run this in your Supabase SQL Editor (Dashboard -> SQL Editor -> New Query)
-- To enable full cloud synchronization for Veritas Editorial News

create table if not exists public.bookmarks (
  id text primary key,
  title text not null,
  description text,
  content text,
  url text not null,
  source jsonb,
  author text,
  published_at timestamptz,
  image_url text,
  category text,
  read_time int,
  notes text,
  created_at timestamptz default now()
);

-- Enable Row Level Security (open policy for publishable key)
alter table public.bookmarks enable row level security;
create policy "Allow all operations for anon" on public.bookmarks for all using (true) with check (true);

create table if not exists public.reading_history (
  id serial primary key,
  article_id text not null unique,
  read_at timestamptz default now()
);
alter table public.reading_history enable row level security;
create policy "Allow all on history for anon" on public.reading_history for all using (true) with check (true);

create table if not exists public.custom_feeds (
  id text primary key,
  name text not null,
  url text not null,
  category text default 'all',
  created_at timestamptz default now()
);
alter table public.custom_feeds enable row level security;
create policy "Allow all on custom feeds for anon" on public.custom_feeds for all using (true) with check (true);
`;

export interface SupabaseHealth {
  connected: boolean;
  url: string;
  bookmarksTableAvailable: boolean;
  historyTableAvailable: boolean;
  customFeedsTableAvailable: boolean;
  errorMessage?: string;
  checkedAt: string;
}

export async function checkSupabaseHealth(): Promise<SupabaseHealth> {
  const result: SupabaseHealth = {
    connected: false,
    url: SUPABASE_URL,
    bookmarksTableAvailable: false,
    historyTableAvailable: false,
    customFeedsTableAvailable: false,
    checkedAt: new Date().toISOString(),
  };

  try {
    const { error: bookmarksErr } = await supabase
      .from('bookmarks')
      .select('id')
      .limit(1);

    if (!bookmarksErr) {
      result.connected = true;
      result.bookmarksTableAvailable = true;
    } else if (bookmarksErr.code === '42P01' || bookmarksErr.message.includes('does not exist')) {
      result.connected = true;
      result.bookmarksTableAvailable = false;
    } else {
      result.connected = true;
      result.errorMessage = bookmarksErr.message;
    }

    const { error: histErr } = await supabase
      .from('reading_history')
      .select('id')
      .limit(1);
    result.historyTableAvailable = !histErr;

    const { error: feedErr } = await supabase
      .from('custom_feeds')
      .select('id')
      .limit(1);
    result.customFeedsTableAvailable = !feedErr;

    return result;
  } catch (err: any) {
    result.errorMessage = err?.message || 'Connection failed';
    return result;
  }
}

// ================= Local Storage Fallbacks =================

function getLocalBookmarks(): Article[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_BOOKMARKS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function setLocalBookmarks(articles: Article[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_STORAGE_BOOKMARKS_KEY, JSON.stringify(articles));
  } catch (e) {
    console.error('LocalStorage write error:', e);
  }
}

function getLocalHistory(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function addLocalHistory(articleId: string) {
  if (typeof window === 'undefined') return;
  try {
    const current = getLocalHistory();
    if (!current.includes(articleId)) {
      localStorage.setItem(LOCAL_STORAGE_HISTORY_KEY, JSON.stringify([...current, articleId]));
    }
  } catch (e) {
    console.error('LocalStorage history error:', e);
  }
}

function getLocalFeeds(): CustomRssFeed[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_FEEDS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function setLocalFeeds(feeds: CustomRssFeed[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_STORAGE_FEEDS_KEY, JSON.stringify(feeds));
  } catch (e) {
    console.error('LocalStorage feeds error:', e);
  }
}

// ================= Unified Data Services =================

export async function fetchBookmarks(): Promise<Article[]> {
  const local = getLocalBookmarks();
  try {
    const { data, error } = await supabase
      .from('bookmarks')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data && Array.isArray(data)) {
      const mapped: Article[] = data.map((row: any) => ({
        id: row.id,
        title: row.title,
        description: row.description || '',
        content: row.content || '',
        url: row.url,
        source: row.source || { id: 'custom', name: 'Saved Source' },
        author: row.author,
        publishedAt: row.published_at || row.created_at,
        imageUrl: row.image_url,
        category: (row.category as any) || 'all',
        readTime: row.read_time || 3,
        userNotes: row.notes,
        savedAt: row.created_at,
        isSaved: true,
      }));

      // Merge with local if any unique offline bookmarks exist
      const localMap = new Map(local.map((a) => [a.id, a]));
      mapped.forEach((a) => localMap.set(a.id, a));
      const combined = Array.from(localMap.values());
      setLocalBookmarks(combined);
      return combined;
    }
  } catch (err) {
    console.warn('Supabase fetch bookmarks skipped, using local cache:', err);
  }
  return local;
}

export async function saveBookmarkToSupabase(article: Article): Promise<boolean> {
  // Update local storage first for instant optimistic response
  const local = getLocalBookmarks();
  const updatedArticle = { ...article, isSaved: true, savedAt: new Date().toISOString() };
  const filtered = local.filter((a) => a.id !== article.id);
  setLocalBookmarks([updatedArticle, ...filtered]);

  try {
    const { error } = await supabase.from('bookmarks').upsert({
      id: article.id,
      title: article.title,
      description: article.description,
      content: article.content,
      url: article.url,
      source: article.source,
      author: article.author,
      published_at: article.publishedAt,
      image_url: article.imageUrl,
      category: article.category,
      read_time: article.readTime,
      notes: article.userNotes || null,
      created_at: new Date().toISOString(),
    });

    if (error) {
      console.warn('Supabase bookmark upsert warning:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Supabase offline or error saving bookmark:', err);
    return false;
  }
}

export async function removeBookmarkFromSupabase(articleId: string): Promise<boolean> {
  const local = getLocalBookmarks().filter((a) => a.id !== articleId);
  setLocalBookmarks(local);

  try {
    const { error } = await supabase.from('bookmarks').delete().eq('id', articleId);
    return !error;
  } catch {
    return false;
  }
}

export async function updateBookmarkNotes(articleId: string, notes: string): Promise<boolean> {
  const local = getLocalBookmarks().map((a) =>
    a.id === articleId ? { ...a, userNotes: notes } : a
  );
  setLocalBookmarks(local);

  try {
    const { error } = await supabase
      .from('bookmarks')
      .update({ notes })
      .eq('id', articleId);
    return !error;
  } catch {
    return false;
  }
}

export async function markArticleAsRead(articleId: string): Promise<void> {
  addLocalHistory(articleId);
  try {
    await supabase.from('reading_history').upsert({ article_id: articleId });
  } catch {
    // Non-blocking
  }
}

export async function fetchReadHistory(): Promise<string[]> {
  const local = getLocalHistory();
  try {
    const { data } = await supabase.from('reading_history').select('article_id');
    if (data && Array.isArray(data)) {
      const set = new Set([...local, ...data.map((r: any) => r.article_id)]);
      return Array.from(set);
    }
  } catch {
    // Fall back to local
  }
  return local;
}

export async function fetchCustomFeedsList(): Promise<CustomRssFeed[]> {
  const local = getLocalFeeds();
  try {
    const { data } = await supabase.from('custom_feeds').select('*').order('created_at', { ascending: false });
    if (data && Array.isArray(data)) {
      const mapped: CustomRssFeed[] = data.map((r: any) => ({
        id: r.id,
        name: r.name,
        url: r.url,
        category: r.category,
        addedAt: r.created_at,
      }));
      setLocalFeeds(mapped);
      return mapped;
    }
  } catch {
    // Local fallback
  }
  return local;
}

export async function addCustomRssFeed(feed: Omit<CustomRssFeed, 'addedAt'>): Promise<CustomRssFeed> {
  const newFeed: CustomRssFeed = {
    ...feed,
    addedAt: new Date().toISOString(),
  };
  const local = [newFeed, ...getLocalFeeds().filter((f) => f.id !== feed.id)];
  setLocalFeeds(local);

  try {
    await supabase.from('custom_feeds').upsert({
      id: newFeed.id,
      name: newFeed.name,
      url: newFeed.url,
      category: newFeed.category,
      created_at: newFeed.addedAt,
    });
  } catch {
    // Local saved
  }
  return newFeed;
}

export async function deleteCustomRssFeed(id: string): Promise<void> {
  const local = getLocalFeeds().filter((f) => f.id !== id);
  setLocalFeeds(local);
  try {
    await supabase.from('custom_feeds').delete().eq('id', id);
  } catch {
    // Local deleted
  }
}
