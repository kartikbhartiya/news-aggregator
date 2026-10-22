'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Article, NewsCategory } from '@/types/news';
import ModernHeader from '@/components/ModernHeader';
import ModernTickerBar from '@/components/ModernTickerBar';
import ModernArticleCard from '@/components/ModernArticleCard';
import ModernArticleReader from '@/components/ModernArticleReader';
import ExecutiveBriefingModal from '@/components/ExecutiveBriefingModal';
import BookmarksDrawer from '@/components/BookmarksDrawer';
import SupabaseSettingsModal from '@/components/SupabaseSettingsModal';
import CommandPalette from '@/components/CommandPalette';
import { fetchBookmarks, saveBookmarkToSupabase, removeBookmarkFromSupabase, checkSupabaseHealth } from '@/lib/supabase';
import { 
  Filter, 
  ArrowUpDown, 
  Sparkles, 
  Radio, 
  ExternalLink, 
  Layers,
  Flame,
  ArrowRight
} from 'lucide-react';

export default function HomePage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeCategory, setActiveCategory] = useState<NewsCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSource, setSelectedSource] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'latest' | 'impact' | 'longread'>('latest');
  const [viewMode, setViewMode] = useState<'grid' | 'stream'>('grid');

  // Supabase & Local state
  const [bookmarks, setBookmarks] = useState<Article[]>([]);
  const [supabaseConnected, setSupabaseConnected] = useState(false);

  // Modals state
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [isBriefingOpen, setIsBriefingOpen] = useState(false);
  const [isBookmarksOpen, setIsBookmarksOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  const loadArticles = useCallback(async (forceRefresh = false) => {
    if (forceRefresh) setIsRefreshing(true);
    else setIsLoading(true);

    try {
      const params = new URLSearchParams();
      if (activeCategory !== 'all') params.set('category', activeCategory);
      if (selectedSource !== 'all') params.set('source', selectedSource);
      if (searchQuery.trim()) params.set('search', searchQuery.trim());
      if (forceRefresh) params.set('refresh', 'true');

      const res = await fetch(`/api/news?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        if (data.articles) {
          setArticles(data.articles);
        }
      }
    } catch (e) {
      console.error('Failed to load aggregated articles:', e);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [activeCategory, selectedSource, searchQuery]);

  useEffect(() => {
    loadArticles();
  }, [loadArticles]);

  useEffect(() => {
    async function initSupabase() {
      const health = await checkSupabaseHealth();
      setSupabaseConnected(health.connected);
      const saved = await fetchBookmarks();
      setBookmarks(saved);
    }
    initSupabase();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleToggleBookmark = async (article: Article, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    const isAlreadyBookmarked = bookmarks.some((b) => b.id === article.id);
    if (isAlreadyBookmarked) {
      setBookmarks((prev) => prev.filter((b) => b.id !== article.id));
      await removeBookmarkFromSupabase(article.id);
    } else {
      const updatedArticle = { ...article, isSaved: true, savedAt: new Date().toISOString() };
      setBookmarks((prev) => [updatedArticle, ...prev]);
      await saveBookmarkToSupabase(updatedArticle);
    }
  };

  const handleBookmarkRemoved = (articleId: string) => {
    setBookmarks((prev) => prev.filter((b) => b.id !== articleId));
  };

  const availableSources = useMemo(() => {
    const map = new Map<string, string>();
    articles.forEach((a) => {
      if (a.source?.id && a.source?.name) {
        map.set(a.source.id, a.source.name);
      }
    });
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [articles]);

  const sortedArticles = useMemo(() => {
    const copy = [...articles];
    if (sortBy === 'latest') {
      return copy.sort(
        (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      );
    } else if (sortBy === 'impact') {
      return copy.sort((a, b) => (b.source.credibilityScore || 90) - (a.source.credibilityScore || 90));
    } else if (sortBy === 'longread') {
      return copy.sort((a, b) => b.readTime - a.readTime);
    }
    return copy;
  }, [articles, sortBy]);

  const leadArticle = sortedArticles[0];
  const sideArticles = sortedArticles.slice(1, 3);
  const remainingArticles = sortedArticles.slice(3);

  return (
    <div className="min-h-screen flex flex-col bg-[#FBFBFC] text-zinc-900 selection:bg-zinc-950 selection:text-white">
      {/* 1. Modern Financial Ticker Ribbon */}
      <ModernTickerBar />

      {/* 2. Sleek Modern Header */}
      <ModernHeader
        activeCategory={activeCategory}
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          setSelectedSource('all');
        }}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onOpenBriefing={() => setIsBriefingOpen(true)}
        onOpenBookmarks={() => setIsBookmarksOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onRefresh={() => loadArticles(true)}
        isRefreshing={isRefreshing}
        bookmarkCount={bookmarks.length}
        supabaseConnected={supabaseConnected}
        viewMode={viewMode}
        onToggleViewMode={setViewMode}
      />

      {/* 3. Source Filtering & Sorting Pill Bar */}
      <div className="border-b border-zinc-200/70 bg-white/50 backdrop-blur-xs py-2 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Source Chips */}
          <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar py-0.5">
            <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mr-1 flex items-center">
              <Filter className="w-3 h-3 mr-1" /> Source:
            </span>
            <button
              onClick={() => setSelectedSource('all')}
              className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                selectedSource === 'all'
                  ? 'bg-zinc-900 text-white'
                  : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
              }`}
            >
              All Signals ({articles.length})
            </button>
            {availableSources.slice(0, 7).map((src) => (
              <button
                key={src.id}
                onClick={() => setSelectedSource(src.id)}
                className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                  selectedSource === src.id
                    ? 'bg-zinc-900 text-white'
                    : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                }`}
              >
                {src.name}
              </button>
            ))}
          </div>

          {/* Sort Order Dropdown */}
          <div className="flex items-center space-x-2 shrink-0 ml-auto">
            <span className="text-[11px] font-semibold text-zinc-400 uppercase flex items-center">
              <ArrowUpDown className="w-3 h-3 mr-1" /> Order:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-white border border-zinc-200/80 rounded-lg text-zinc-800 text-xs py-1 px-2.5 focus:outline-none focus:border-zinc-900 cursor-pointer shadow-2xs font-medium"
            >
              <option value="latest">Latest Dispatches</option>
              <option value="impact">Highest Reliability</option>
              <option value="longread">In-Depth Reads</option>
            </select>
          </div>
        </div>
      </div>

      {/* 4. Main Modern Content Canvas */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {isLoading && articles.length === 0 ? (
          <div className="py-32 text-center">
            <div className="relative w-10 h-10 mx-auto mb-4">
              <div className="w-10 h-10 rounded-full border-2 border-zinc-900 border-t-transparent animate-spin" />
            </div>
            <div className="text-base font-bold text-zinc-900">Ingesting Live Dispatches...</div>
            <p className="mt-1 text-xs text-zinc-500">
              Connecting to NewsData.io API, NYT, BBC, The Verge, and Hacker News streams
            </p>
          </div>
        ) : articles.length === 0 ? (
          <div className="py-24 text-center bg-white border border-zinc-200/80 rounded-3xl p-8 max-w-md mx-auto shadow-xs">
            <h3 className="text-lg font-bold text-zinc-900">No Dispatches Match Criteria</h3>
            <p className="mt-1 text-xs text-zinc-500">
              Try adjusting your search query or selecting &ldquo;All Signals&rdquo;.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('all');
                setSelectedSource('all');
              }}
              className="mt-4 px-4 py-2 bg-zinc-900 text-white rounded-xl text-xs font-semibold"
            >
              Reset Filters
            </button>
          </div>
        ) : viewMode === 'stream' ? (
          /* ================= STREAM LIST VIEW (Linear / Raycast Style) ================= */
          <div className="bg-white border border-zinc-200/80 rounded-3xl shadow-xs overflow-hidden divide-y divide-zinc-150">
            <div className="p-4 bg-zinc-50/60 border-b border-zinc-200/80 flex items-center justify-between text-xs text-zinc-500 font-semibold uppercase tracking-wider">
              <span>Live Wire Stream ({articles.length} dispatches)</span>
              <span>Sorted by {sortBy}</span>
            </div>
            {sortedArticles.map((art) => (
              <ModernArticleCard
                key={art.id}
                article={art}
                variant="row"
                onOpenArticle={setSelectedArticle}
                onToggleBookmark={handleToggleBookmark}
                isBookmarked={bookmarks.some((b) => b.id === art.id)}
              />
            ))}
          </div>
        ) : (
          /* ================= BENTO GRID VIEW ================= */
          <div className="space-y-8">
            {/* TOP BENTO SECTION: Hero Widescreen + Side Signal Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              {/* Flagship Hero Card (8 Cols) */}
              {leadArticle && (
                <div className="lg:col-span-8">
                  <ModernArticleCard
                    article={leadArticle}
                    variant="hero"
                    onOpenArticle={setSelectedArticle}
                    onToggleBookmark={handleToggleBookmark}
                    isBookmarked={bookmarks.some((b) => b.id === leadArticle.id)}
                  />
                </div>
              )}

              {/* Side Signal Bento Column (4 Cols) */}
              <div className="lg:col-span-4 flex flex-col justify-between gap-4">
                {/* AI Executive Digest Card */}
                <div
                  onClick={() => setIsBriefingOpen(true)}
                  className="p-5 rounded-3xl bg-gradient-to-br from-zinc-900 to-zinc-950 text-white cursor-pointer hover:shadow-xl transition-all duration-300 group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-2.5 py-0.5 rounded-full bg-white/10 backdrop-blur-md text-[10px] font-mono font-medium text-amber-300 flex items-center space-x-1">
                        <Sparkles className="w-3 h-3 mr-1" />
                        <span>TODAY&apos;S SYNTHESIS</span>
                      </span>
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-live-pulse" />
                    </div>

                    <h4 className="text-lg font-bold tracking-tight text-white group-hover:text-amber-100 transition-colors">
                      3-Minute Global Intelligence Brief
                    </h4>

                    <p className="mt-2 text-xs text-zinc-300 leading-relaxed line-clamp-3">
                      Synthesizing critical inflections across AI architecture, sovereign debt rollovers, and maritime shipping conduits.
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-zinc-300">
                    <span className="font-medium">Listen Audio Brief</span>
                    <span className="inline-flex items-center text-white font-semibold group-hover:translate-x-1 transition-transform">
                      Open <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </span>
                  </div>
                </div>

                {/* Secondary Fast Dispatch Cards */}
                {sideArticles.map((art) => (
                  <div
                    key={art.id}
                    onClick={() => setSelectedArticle(art)}
                    className="p-4 rounded-2xl bg-white border border-zinc-200/80 hover:border-zinc-300 hover:shadow-md transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between text-[11px] mb-1.5">
                      <span className="font-semibold text-zinc-900 uppercase">{art.source.name}</span>
                      <span className="text-zinc-400 font-mono text-[10px]">{art.category}</span>
                    </div>
                    <h5 className="font-bold text-sm text-zinc-900 group-hover:text-zinc-600 transition-colors line-clamp-2 leading-snug">
                      {art.title}
                    </h5>
                    <p className="mt-1 text-xs text-zinc-500 line-clamp-1">
                      {art.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* LOWER BENTO GRID: Multi-column Modern Cards */}
            {remainingArticles.length > 0 && (
              <div className="pt-4">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center space-x-2">
                    <Flame className="w-4 h-4 text-amber-500" />
                    <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-900">
                      Dispatched Signals
                    </h3>
                  </div>
                  <span className="text-xs font-mono text-zinc-400">
                    {remainingArticles.length} active dispatches
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                  {remainingArticles.map((art) => (
                    <ModernArticleCard
                      key={art.id}
                      article={art}
                      variant="grid"
                      onOpenArticle={setSelectedArticle}
                      onToggleBookmark={handleToggleBookmark}
                      isBookmarked={bookmarks.some((b) => b.id === art.id)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* 5. Modern Minimalist Footer */}
      <footer className="mt-20 border-t border-zinc-200/70 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <div className="flex items-center space-x-3">
            <span className="font-bold text-zinc-900">PRISM INTELLIGENCE</span>
            <span>•</span>
            <span>NewsData.io Live Stream</span>
            <span>•</span>
            <span>Supabase Cloud Synced</span>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="hover:text-zinc-900 transition-colors cursor-pointer"
            >
              Cloud & API Settings
            </button>
            <span>•</span>
            <span>
              Press <kbd className="px-1.5 py-0.5 rounded border border-zinc-200 bg-zinc-50 font-mono text-[10px]">⌘K</kbd> to search
            </span>
          </div>
        </div>
      </footer>

      {/* 6. Slide-Over Reader & Modals */}
      <ModernArticleReader
        article={selectedArticle}
        onClose={() => setSelectedArticle(null)}
        isBookmarked={selectedArticle ? bookmarks.some((b) => b.id === selectedArticle.id) : false}
        onToggleBookmark={handleToggleBookmark}
      />

      <ExecutiveBriefingModal
        isOpen={isBriefingOpen}
        onClose={() => setIsBriefingOpen(false)}
      />

      <BookmarksDrawer
        isOpen={isBookmarksOpen}
        onClose={() => setIsBookmarksOpen(false)}
        bookmarks={bookmarks}
        onSelectArticle={(art) => setSelectedArticle(art)}
        onBookmarkRemoved={handleBookmarkRemoved}
      />

      <SupabaseSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onCustomFeedAdded={() => loadArticles(true)}
      />

      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        articles={articles}
        onSelectArticle={(art) => setSelectedArticle(art)}
        onSelectCategory={(cat) => setActiveCategory(cat)}
        onOpenBriefing={() => setIsBriefingOpen(true)}
        onOpenBookmarks={() => setIsBookmarksOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onRefresh={() => loadArticles(true)}
      />
    </div>
  );
}
