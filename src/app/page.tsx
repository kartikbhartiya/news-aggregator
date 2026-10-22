'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Article, NewsCategory } from '@/types/news';
import Masthead from '@/components/Masthead';
import MarketTickerBar from '@/components/MarketTickerBar';
import ArticleCard from '@/components/ArticleCard';
import ArticleReaderModal from '@/components/ArticleReaderModal';
import ExecutiveBriefingModal from '@/components/ExecutiveBriefingModal';
import BookmarksDrawer from '@/components/BookmarksDrawer';
import SupabaseSettingsModal from '@/components/SupabaseSettingsModal';
import CommandPalette from '@/components/CommandPalette';
import { fetchBookmarks, saveBookmarkToSupabase, removeBookmarkFromSupabase, checkSupabaseHealth } from '@/lib/supabase';
import { 
  Filter, 
  ArrowUpDown, 
  RotateCw, 
  Sparkles, 
  Radio, 
  ExternalLink, 
  Shield, 
  Newspaper,
  ChevronRight
} from 'lucide-react';

export default function HomePage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeCategory, setActiveCategory] = useState<NewsCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSource, setSelectedSource] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'latest' | 'impact' | 'longread'>('latest');

  // Supabase & Local state
  const [bookmarks, setBookmarks] = useState<Article[]>([]);
  const [supabaseConnected, setSupabaseConnected] = useState(false);

  // Modals state
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [isBriefingOpen, setIsBriefingOpen] = useState(false);
  const [isBookmarksOpen, setIsBookmarksOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // Initialize data
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

  // Initial load
  useEffect(() => {
    loadArticles();
  }, [loadArticles]);

  // Load bookmarks & verify Supabase status on mount
  useEffect(() => {
    async function initSupabase() {
      const health = await checkSupabaseHealth();
      setSupabaseConnected(health.connected);
      const saved = await fetchBookmarks();
      setBookmarks(saved);
    }
    initSupabase();
  }, []);

  // Keyboard shortcut listener for Command Palette (⌘K / Ctrl+K)
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

  // Bookmarking handler
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

  // Compute available sources from current articles
  const availableSources = useMemo(() => {
    const map = new Map<string, string>();
    articles.forEach((a) => {
      if (a.source?.id && a.source?.name) {
        map.set(a.source.id, a.source.name);
      }
    });
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [articles]);

  // Sort and split articles for broadsheet presentation
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
  const featuredArticles = sortedArticles.slice(1, 3);
  const wireArticles = sortedArticles.slice(3, 11);
  const remainingArticles = sortedArticles.slice(11);

  // Breaking wire headline for ticker
  const breakingHeadline = useMemo(() => {
    return articles.find((a) => a.isBreaking) || leadArticle;
  }, [articles, leadArticle]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] text-[#18181B] selection:bg-[#FEF08A]">
      {/* 1. Global Financial Markets Ribbon */}
      <MarketTickerBar />

      {/* 2. Bespoke Editorial Masthead */}
      <Masthead
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
      />

      {/* 3. Breaking Wire Banner (If active) */}
      {breakingHeadline && (
        <aside aria-label="Breaking wire" className="border-b border-stone-200 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 py-2 flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2.5 overflow-hidden">
              <span className="shrink-0 flex items-center space-x-1 px-1.5 py-0.5 bg-rose-600 text-white font-mono text-[9px] uppercase font-bold tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-live-pulse" />
                <span>FAST WIRE</span>
              </span>
              <button
                onClick={() => setSelectedArticle(breakingHeadline)}
                className="font-serif text-stone-900 hover:text-stone-600 truncate text-xs sm:text-sm font-normal text-left cursor-pointer"
              >
                {breakingHeadline.title}
              </button>
            </div>
            <div className="hidden md:flex items-center space-x-2 shrink-0 font-mono text-[10px] text-stone-400 pl-4">
              <span>{breakingHeadline.source.name}</span>
              <span>•</span>
              <button
                onClick={() => setSelectedArticle(breakingHeadline)}
                className="text-stone-900 font-semibold underline hover:no-underline cursor-pointer"
              >
                Read Dispatch
              </button>
            </div>
          </div>
        </aside>
      )}

      {/* 4. Filter & Source Controls Bar */}
      <div className="border-b border-stone-200 bg-stone-50/50 py-2.5 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Source Filter Pills */}
          <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar py-0.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400 mr-1 flex items-center">
              <Filter className="w-3 h-3 mr-1" /> Source:
            </span>
            <button
              onClick={() => setSelectedSource('all')}
              className={`px-2 py-1 text-[11px] font-mono tracking-tight transition-colors cursor-pointer ${
                selectedSource === 'all'
                  ? 'bg-stone-900 text-white font-medium'
                  : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-100'
              }`}
            >
              All Sources ({articles.length})
            </button>
            {availableSources.slice(0, 6).map((src) => (
              <button
                key={src.id}
                onClick={() => setSelectedSource(src.id)}
                className={`px-2 py-1 text-[11px] font-mono tracking-tight transition-colors cursor-pointer ${
                  selectedSource === src.id
                    ? 'bg-stone-900 text-white font-medium'
                    : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-100'
                }`}
              >
                {src.name}
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center space-x-2 shrink-0 ml-auto font-mono text-xs">
            <span className="text-[10px] uppercase text-stone-400 flex items-center">
              <ArrowUpDown className="w-3 h-3 mr-1" /> Order:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-white border border-stone-200 text-stone-800 text-[11px] py-1 px-2 focus:outline-none focus:border-stone-900 cursor-pointer"
            >
              <option value="latest">Latest Dispatches</option>
              <option value="impact">Editorial Reliability</option>
              <option value="longread">Longform Reads</option>
            </select>
          </div>
        </div>
      </div>

      {/* 5. Main Broadsheet Newspaper Grid */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-8 sm:py-10">
        {isLoading && articles.length === 0 ? (
          <div className="py-28 text-center">
            <div className="animate-spin w-8 h-8 border-2 border-stone-900 border-t-transparent mx-auto mb-4" />
            <div className="font-serif text-lg text-stone-800">Aggregating International Wire Dispatches...</div>
            <p className="mt-1 font-mono text-xs text-stone-500">
              Connecting to NYT, BBC, NPR, The Verge, Ars Technica, and Hacker News streams
            </p>
          </div>
        ) : articles.length === 0 ? (
          <div className="py-24 text-center bg-white border border-stone-200 p-8 max-w-xl mx-auto shadow-xs">
            <Newspaper className="w-10 h-10 text-stone-400 mx-auto mb-3" />
            <h3 className="font-serif text-xl text-stone-900 font-normal">No Dispatches Match Criteria</h3>
            <p className="mt-1 text-xs text-stone-600 font-sans">
              No articles found for &ldquo;{searchQuery}&rdquo; in category &ldquo;{activeCategory}&rdquo;.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('all');
                setSelectedSource('all');
              }}
              className="mt-4 px-3 py-1.5 bg-stone-900 text-white text-xs font-medium cursor-pointer"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="space-y-12">
            {/* FRONT PAGE HERO GRID: 8 Cols Lead & Sub-leads + 4 Cols Fast Wire */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* LEFT COLUMN: Flagship Story & In-Depth Analytical Pieces (8 Cols) */}
              <div className="lg:col-span-8 space-y-8">
                {/* Flagship Lead Story */}
                {leadArticle && (
                  <ArticleCard
                    article={leadArticle}
                    variant="lead"
                    onOpenArticle={setSelectedArticle}
                    onToggleBookmark={handleToggleBookmark}
                    isBookmarked={bookmarks.some((b) => b.id === leadArticle.id)}
                  />
                )}

                {/* Sub-Lead Stories: Side-by-side (2 cols) */}
                {featuredArticles.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between border-b border-stone-900 pb-1 mb-4">
                      <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-stone-900">
                        In-Depth Analytical Investigations
                      </h3>
                      <span className="text-[10px] font-mono text-stone-400 uppercase">Veritas Special Reports</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {featuredArticles.map((art) => (
                        <ArticleCard
                          key={art.id}
                          article={art}
                          variant="featured"
                          onOpenArticle={setSelectedArticle}
                          onToggleBookmark={handleToggleBookmark}
                          isBookmarked={bookmarks.some((b) => b.id === art.id)}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* RIGHT COLUMN: Continuous Real-Time Fast Wire Stream (4 Cols) */}
              <div className="lg:col-span-4 bg-white border border-stone-200 p-5 shadow-xs">
                {/* Column Masthead */}
                <div className="border-b-2 border-stone-900 pb-2 mb-3 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-live-pulse" />
                    <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-stone-900">
                      CONTINUOUS WIRE
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono text-stone-500 uppercase">Live Feeds</span>
                </div>

                {/* Live Wire Dispatches */}
                <div className="divide-y divide-stone-150">
                  {wireArticles.map((art) => (
                    <ArticleCard
                      key={art.id}
                      article={art}
                      variant="wire"
                      onOpenArticle={setSelectedArticle}
                      onToggleBookmark={handleToggleBookmark}
                      isBookmarked={bookmarks.some((b) => b.id === art.id)}
                    />
                  ))}
                </div>

                {/* Wire Institutional Note Box */}
                <div className="mt-6 pt-4 border-t border-stone-200 bg-stone-50/80 -mx-5 -mb-5 p-4 text-[11px] font-sans text-stone-600">
                  <div className="font-mono text-[10px] font-bold text-stone-900 uppercase mb-1">
                    Editorial Wire Index
                  </div>
                  <p className="leading-relaxed">
                    Continuously indexing verified wire transcripts from BBC News, The New York Times, The Verge, Ars Technica, and Hacker News.
                  </p>
                </div>
              </div>
            </div>

            {/* LOWER BROADSHEET SHELVES: Remaining Stories in Multi-Column Grid */}
            {remainingArticles.length > 0 && (
              <div className="pt-6 border-t border-stone-200">
                <div className="flex items-center justify-between border-b border-stone-900 pb-1 mb-6">
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-stone-900">
                    The Global Journal & Editorial Dossiers
                  </h3>
                  <span className="text-[10px] font-mono text-stone-500">
                    Showing {remainingArticles.length} Further Wire Dispatches
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                  {remainingArticles.map((art) => (
                    <ArticleCard
                      key={art.id}
                      article={art}
                      variant="standard"
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

      {/* 6. Dignified Editorial Broadsheet Footer */}
      <footer className="mt-16 border-t border-stone-300 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-8 border-b border-stone-200">
            {/* Brand column */}
            <div className="md:col-span-5">
              <div className="text-[10px] uppercase font-mono tracking-widest text-stone-400 mb-1">
                VERITAS INTELLIGENCE PLATFORM
              </div>
              <h4 className="font-serif text-2xl text-stone-900 font-normal">
                THE VERITAS DISPATCH
              </h4>
              <p className="mt-2 text-xs text-stone-600 max-w-sm leading-relaxed font-sans">
                A super-premium, editorial multi-source news aggregator built for discriminating readers who demand depth, typography craftsmanship, zero clutter, and cloud synchronization.
              </p>
              <div className="mt-4 flex items-center space-x-3 text-xs font-mono text-stone-500">
                <span>Supabase: {supabaseConnected ? 'Connected' : 'Active'}</span>
                <span>•</span>
                <span>RSS 2.0 & Atom</span>
                <span>•</span>
                <span>Speech Synthesis</span>
              </div>
            </div>

            {/* Quick Links */}
            <div className="md:col-span-3 text-xs font-mono space-y-2">
              <div className="font-bold text-stone-900 uppercase text-[11px] mb-2">
                Editorial Shelves
              </div>
              <div><button onClick={() => setActiveCategory('world')} className="hover:underline text-stone-600 cursor-pointer">World & Geopolitics</button></div>
              <div><button onClick={() => setActiveCategory('markets')} className="hover:underline text-stone-600 cursor-pointer">Capital Markets & Yields</button></div>
              <div><button onClick={() => setActiveCategory('tech')} className="hover:underline text-stone-600 cursor-pointer">Technology & AI Frontiers</button></div>
              <div><button onClick={() => setActiveCategory('science')} className="hover:underline text-stone-600 cursor-pointer">Science & Fusion Energy</button></div>
              <div><button onClick={() => setActiveCategory('culture')} className="hover:underline text-stone-600 cursor-pointer">Culture & Longform Ideas</button></div>
            </div>

            {/* Cloud & Architecture Details */}
            <div className="md:col-span-4 text-xs font-mono space-y-2">
              <div className="font-bold text-stone-900 uppercase text-[11px] mb-2">
                Cloud Architecture
              </div>
              <div className="text-stone-600 text-[11px] leading-relaxed">
                Supabase Instance: <br />
                <span className="font-mono text-stone-900">https://pubfwtqkapmffhkdtivb.supabase.co</span>
              </div>
              <div className="pt-2">
                <button
                  onClick={() => setIsSettingsOpen(true)}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 border border-stone-200 text-stone-800 text-xs font-sans font-medium transition-colors cursor-pointer"
                >
                  <span>Open Database Schema & Setup</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-stone-500 gap-2">
            <div>
              © 2026 The Veritas Dispatch. All rights reserved. Architectural White Edition.
            </div>
            <div>
              Press <kbd className="px-1 py-0.5 border border-stone-300 rounded bg-stone-50 text-[10px]">⌘K</kbd> to open Command Palette
            </div>
          </div>
        </div>
      </footer>

      {/* 7. Interactive Modals & Drawers */}
      <ArticleReaderModal
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
