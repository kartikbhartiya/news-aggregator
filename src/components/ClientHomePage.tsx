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
import GlassFilterBar from '@/components/GlassFilterBar';
import InstallAppSheet from '@/components/InstallAppSheet';
import MobileTabBar from '@/components/MobileTabBar';
import EditorialSkeleton from '@/components/EditorialSkeleton';
import { fetchBookmarks, saveBookmarkToSupabase, removeBookmarkFromSupabase, checkSupabaseHealth } from '@/lib/supabase';
import { handleButtonClickGlow } from '@/lib/button-glow';
import { EDITORIAL_FALLBACK_ARTICLES, EDITORIAL_INDIAN_FALLBACK_ARTICLES } from '@/lib/mock-news';
import { 
  Sparkles, 
  Flame, 
  ArrowRight,
  Smartphone
} from 'lucide-react';

interface ClientHomePageProps {
  initialArticles?: Article[];
  initialEdition?: 'india' | 'international';
}

export default function ClientHomePage({ 
  initialArticles = [],
  initialEdition = 'international' 
}: ClientHomePageProps) {
  // Edition state: 'india' vs 'international'
  const [edition, setEdition] = useState<'india' | 'international'>(initialEdition);

  const [articles, setArticles] = useState<Article[]>(
    initialArticles.length > 0 
      ? initialArticles 
      : (initialEdition === 'india' ? EDITORIAL_INDIAN_FALLBACK_ARTICLES : EDITORIAL_FALLBACK_ARTICLES)
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeCategory, setActiveCategory] = useState<NewsCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSource, setSelectedSource] = useState<string>('all');
  const [readTimeFilter, setReadTimeFilter] = useState<'all' | 'short' | 'long'>('all');
  const [sortBy, setSortBy] = useState<'latest' | 'impact' | 'longread' | 'quick'>('latest');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
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
  const [isInstallOpen, setIsInstallOpen] = useState(false);
  const [mobileTab, setMobileTab] = useState<'signals' | 'search' | 'brief' | 'dossier' | 'settings'>('signals');

  const loadArticles = useCallback(async (forceRefresh = false, targetEdition?: 'india' | 'international') => {
    if (forceRefresh) setIsRefreshing(true);
    else setIsLoading(true);

    const activeEd = targetEdition || edition;

    try {
      const params = new URLSearchParams();
      params.set('edition', activeEd);
      if (activeCategory !== 'all') params.set('category', activeCategory);
      if (selectedSource !== 'all') params.set('source', selectedSource);
      if (searchQuery.trim()) params.set('q', searchQuery.trim());
      if (forceRefresh) params.set('refresh', 'true');

      const res = await fetch(`/api/news?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        if (data.articles && data.articles.length > 0) {
          setArticles(data.articles);
        }
      }
    } catch (e) {
      console.error('Failed to load aggregated articles:', e);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [edition, activeCategory, selectedSource, searchQuery]);

  // Handle switching edition between India and International
  const handleSelectEdition = (newEdition: 'india' | 'international') => {
    if (newEdition === edition) return;
    setEdition(newEdition);
    setSelectedSource('all');
    setActiveCategory('all');
    setArticles(newEdition === 'india' ? EDITORIAL_INDIAN_FALLBACK_ARTICLES : EDITORIAL_FALLBACK_ARTICLES);
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', `?edition=${newEdition}`);
    }
    loadArticles(true, newEdition);
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const sp = new URLSearchParams(window.location.search);
      const ed = sp.get('edition');
      if (ed === 'india') {
        setEdition('india');
        setArticles(EDITORIAL_INDIAN_FALLBACK_ARTICLES);
        loadArticles(true, 'india');
        return;
      }
    }
    loadArticles(false, edition);
  }, []);

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
    if (e) {
      e.stopPropagation();
      handleButtonClickGlow(e);
    }

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

  // Apply rich filters: source, reading time, verified wire, sort
  const filteredAndSortedArticles = useMemo(() => {
    let list = [...articles];

    // Source Filter
    if (selectedSource !== 'all') {
      list = list.filter((a) => a.source?.id === selectedSource || a.source?.name === selectedSource);
    }

    // Read Time Filter
    if (readTimeFilter === 'short') {
      list = list.filter((a) => a.readTime <= 3);
    } else if (readTimeFilter === 'long') {
      list = list.filter((a) => a.readTime >= 6);
    }

    // Verified Editorial Only
    if (verifiedOnly) {
      list = list.filter((a) => (a.source?.credibilityScore || 85) >= 90);
    }

    // Sort order
    if (sortBy === 'latest') {
      return list.sort(
        (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      );
    } else if (sortBy === 'impact') {
      return list.sort((a, b) => (b.source?.credibilityScore || 85) - (a.source?.credibilityScore || 85));
    } else if (sortBy === 'quick') {
      return list.sort((a, b) => a.readTime - b.readTime);
    } else if (sortBy === 'longread') {
      return list.sort((a, b) => b.readTime - a.readTime);
    }
    return list;
  }, [articles, selectedSource, readTimeFilter, verifiedOnly, sortBy]);

  const leadArticle = filteredAndSortedArticles[0];
  const sideArticles = filteredAndSortedArticles.slice(1, 3);
  const remainingArticles = filteredAndSortedArticles.slice(3);

  // Handle mobile bottom tab clicks
  const handleSelectMobileTab = (tab: 'signals' | 'search' | 'brief' | 'dossier' | 'settings') => {
    setMobileTab(tab);
    if (tab === 'search') {
      setIsCommandPaletteOpen(true);
    } else if (tab === 'brief') {
      setIsBriefingOpen(true);
    } else if (tab === 'dossier') {
      setIsBookmarksOpen(true);
    } else if (tab === 'settings') {
      setIsSettingsOpen(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-zinc-950 selection:bg-zinc-950 selection:text-white pb-20 md:pb-0">
      {/* 1. Live Financial & Geopolitical Ticker Ribbon */}
      <ModernTickerBar />

      {/* 2. Modern Liquid Glass Navigation with India vs International Toggle */}
      <ModernHeader
        activeEdition={edition}
        onSelectEdition={handleSelectEdition}
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
        onOpenInstall={() => setIsInstallOpen(true)}
        onRefresh={() => loadArticles(true)}
        isRefreshing={isRefreshing}
        bookmarkCount={bookmarks.length}
        supabaseConnected={supabaseConnected}
        viewMode={viewMode}
        onToggleViewMode={setViewMode}
      />

      {/* 3. Floating Apple Glass Filter & Sort Island */}
      <GlassFilterBar
        selectedSource={selectedSource}
        onSelectSource={setSelectedSource}
        availableSources={availableSources}
        readTimeFilter={readTimeFilter}
        onSelectReadTime={setReadTimeFilter}
        sortBy={sortBy}
        onSelectSortBy={setSortBy}
        verifiedOnly={verifiedOnly}
        onToggleVerified={() => setVerifiedOnly(!verifiedOnly)}
        totalArticles={articles.length}
        filteredCount={filteredAndSortedArticles.length}
      />

      {/* 4. Main Editorial Content Canvas */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {isLoading && articles.length === 0 ? (
          /* Premium Editorial Skeleton Screen — Zero Rotating Bars, Zero Loading Bars */
          <EditorialSkeleton edition={edition} />
        ) : filteredAndSortedArticles.length === 0 ? (
          <div className="py-24 text-center liquid-glass-panel rounded-3xl p-8 max-w-md mx-auto shadow-sm border border-zinc-200">
            <h3 className="text-lg font-bold text-zinc-900">No Dispatches Match Criteria</h3>
            <p className="mt-1 text-xs text-zinc-500">
              Try adjusting your source or duration filter, or reset all filters.
            </p>
            <button
              onClick={(e) => {
                handleButtonClickGlow(e);
                setSearchQuery('');
                setActiveCategory('all');
                setSelectedSource('all');
                setReadTimeFilter('all');
                setVerifiedOnly(false);
              }}
              className="apple-prominent-btn apple-btn mt-4 px-4 py-2 text-white rounded-xl text-xs font-bold shadow-sm"
            >
              Reset Filters
            </button>
          </div>
        ) : viewMode === 'stream' ? (
          /* ================= STREAM LIST VIEW ================= */
          <div className="liquid-glass-panel rounded-3xl shadow-sm overflow-hidden divide-y divide-zinc-200/60 border border-zinc-200">
            <div className="p-4 bg-zinc-50/80 border-b border-zinc-200/60 flex items-center justify-between text-xs text-zinc-600 font-semibold uppercase tracking-wider">
              <span>{edition === 'india' ? '🇮🇳 India Edition Stream' : '🌐 Global Wire Stream'} ({filteredAndSortedArticles.length} dispatches)</span>
              <span>Sorted by {sortBy}</span>
            </div>
            {filteredAndSortedArticles.map((art, idx) => (
              <div
                key={art.id}
                style={{ animationDelay: `${Math.min(idx * 35, 400)}ms` }}
                className="apple-item-entrance"
              >
                <ModernArticleCard
                  article={art}
                  variant="row"
                  onOpenArticle={setSelectedArticle}
                  onToggleBookmark={handleToggleBookmark}
                  isBookmarked={bookmarks.some((b) => b.id === art.id)}
                />
              </div>
            ))}
          </div>
        ) : (
          /* ================= BENTO GRID VIEW ================= */
          <div className="space-y-8">
            {/* TOP BENTO SECTION: Hero Widescreen + Side Signal Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch animate-in fade-in slide-in-from-bottom-2 duration-500">
              {/* Flagship Hero Card (8 Cols) */}
              {leadArticle && (
                <div 
                  style={{ animationDelay: '0ms' }}
                  className="lg:col-span-8 apple-item-entrance"
                >
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
                {/* AI Executive Digest Card with Specular Border */}
                <div
                  onClick={(e) => {
                    handleButtonClickGlow(e);
                    setIsBriefingOpen(true);
                  }}
                  className="apple-btn p-5 rounded-[28px] bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 text-white cursor-pointer hover:shadow-2xl transition-all duration-300 group flex flex-col justify-between border border-zinc-800 shadow-md"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-2.5 py-0.5 rounded-full bg-white/10 backdrop-blur-md text-[10px] font-mono font-bold text-amber-300 flex items-center space-x-1 border border-white/10">
                        <Sparkles className="w-3 h-3 mr-1" />
                        <span>EXECUTIVE SYNTHESIS</span>
                      </span>
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-live-pulse" />
                    </div>

                    <h4 className="text-lg font-extrabold tracking-tight text-white group-hover:text-amber-100 transition-colors">
                      3-Minute AI Intelligence Brief
                    </h4>

                    <p className="mt-2 text-xs text-zinc-300 leading-relaxed line-clamp-3 font-normal">
                      {edition === 'india' 
                        ? "Real-time AI synthesis of today's key Indian economic, market, tech, and policy developments."
                        : "Real-time AI synthesis of today's leading market, AI, and geopolitical developments."}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-zinc-300">
                    <span className="font-semibold text-emerald-400">Audio Readout Available</span>
                    <span className="inline-flex items-center text-white font-bold group-hover:translate-x-1 transition-transform">
                      Open Brief <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </span>
                  </div>
                </div>

                {/* Secondary Fast Dispatch Cards */}
                {sideArticles.map((art, idx) => (
                  <div
                    key={art.id}
                    style={{ animationDelay: `${(idx + 1) * 80}ms` }}
                    onClick={(e) => {
                      handleButtonClickGlow(e);
                      setSelectedArticle(art);
                    }}
                    className="apple-item-entrance apple-btn p-4 rounded-2xl liquid-glass-card cursor-pointer group"
                  >
                    <div className="flex items-center justify-between text-[11px] mb-1.5 font-mono">
                      <span className="font-bold text-zinc-900 uppercase">{art.source.name}</span>
                      <span className="text-zinc-500 font-semibold">{art.category}</span>
                    </div>
                    <h5 className="font-bold text-sm text-zinc-950 group-hover:text-zinc-600 transition-colors line-clamp-2 leading-snug">
                      {art.title}
                    </h5>
                    <p className="mt-1 text-xs text-zinc-500 line-clamp-1">
                      {art.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* LOWER BENTO GRID: Multi-column Modern Liquid Glass Cards with Item Cascade Animation */}
            {remainingArticles.length > 0 && (
              <div className="pt-4">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center space-x-2">
                    <Flame className="w-4 h-4 text-amber-500" />
                    <h3 className="text-sm font-extrabold uppercase tracking-wider text-zinc-950">
                      {edition === 'india' ? 'Dispatched Indian Signals' : 'Dispatched Global Signals'}
                    </h3>
                  </div>
                  <span className="text-xs font-mono text-zinc-500 font-medium">
                    {remainingArticles.length} active dispatches
                  </span>
                </div>

                {/* Bento Grid with Item Cascade Entrance */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                  {remainingArticles.map((art, idx) => (
                    <div
                      key={art.id}
                      style={{ animationDelay: `${(idx + 2) * 50}ms` }}
                      className="apple-item-entrance"
                    >
                      <ModernArticleCard
                        article={art}
                        variant="grid"
                        onOpenArticle={setSelectedArticle}
                        onToggleBookmark={handleToggleBookmark}
                        isBookmarked={bookmarks.some((b) => b.id === art.id)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* 5. Minimalist Apple White Footer */}
      <footer className="mt-20 border-t border-zinc-200/80 bg-zinc-50/60 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <div className="flex items-center space-x-3">
            <span className="font-extrabold text-zinc-950 tracking-tight">PRISM INTELLIGENCE</span>
            <span>•</span>
            <span>{edition === 'india' ? '🇮🇳 India Wire' : '🌐 Global Wire'}</span>
            <span>•</span>
            <span>NewsData.io Real-Time API</span>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={(e) => {
                handleButtonClickGlow(e);
                setIsInstallOpen(true);
              }}
              className="apple-btn font-semibold text-emerald-700 hover:text-emerald-950 cursor-pointer flex items-center space-x-1"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Install Mobile PWA</span>
            </button>
            <span>•</span>
            <button
              onClick={(e) => {
                handleButtonClickGlow(e);
                setIsSettingsOpen(true);
              }}
              className="apple-btn hover:text-zinc-950 transition-colors cursor-pointer"
            >
              Cloud & API Engine
            </button>
            <span>•</span>
            <span>
              <kbd className="px-1.5 py-0.5 rounded-md border border-zinc-200 bg-white font-mono text-[10px]">⌘K</kbd> Spotlight
            </span>
          </div>
        </div>
      </footer>

      {/* 6. iOS Native Mobile Bottom Tab Bar */}
      <MobileTabBar
        activeTab={mobileTab}
        onSelectTab={handleSelectMobileTab}
        bookmarkCount={bookmarks.length}
        onOpenInstall={() => setIsInstallOpen(true)}
        showInstallButton={true}
      />

      {/* 7. Slide-Over Reader & Modals */}
      <ModernArticleReader
        article={selectedArticle}
        onClose={() => setSelectedArticle(null)}
        isBookmarked={selectedArticle ? bookmarks.some((b) => b.id === selectedArticle.id) : false}
        onToggleBookmark={handleToggleBookmark}
      />

      <ExecutiveBriefingModal
        isOpen={isBriefingOpen}
        onClose={() => setIsBriefingOpen(false)}
        edition={edition}
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

      {/* 8. Install Mobile Web Application Sheet */}
      <InstallAppSheet
        isOpen={isInstallOpen}
        onClose={() => setIsInstallOpen(false)}
      />
    </div>
  );
}
