'use client';

import React, { useState, useEffect } from 'react';
import { NewsCategory } from '@/types/news';
import { 
  Search, 
  Bookmark, 
  Sparkles, 
  RotateCw, 
  SlidersHorizontal, 
  Database,
  Volume2,
  Radio
} from 'lucide-react';

interface MastheadProps {
  activeCategory: NewsCategory;
  onSelectCategory: (category: NewsCategory) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenCommandPalette: () => void;
  onOpenBriefing: () => void;
  onOpenBookmarks: () => void;
  onOpenSettings: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  bookmarkCount: number;
  supabaseConnected: boolean;
}

const CATEGORIES: Array<{ id: NewsCategory; label: string }> = [
  { id: 'all', label: 'All Editions' },
  { id: 'world', label: 'World & Geopolitics' },
  { id: 'markets', label: 'Capital Markets' },
  { id: 'business', label: 'Global Economy' },
  { id: 'tech', label: 'Technology & AI' },
  { id: 'science', label: 'Science & Discovery' },
  { id: 'culture', label: 'Culture & Ideas' },
];

export default function Masthead({
  activeCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  onOpenCommandPalette,
  onOpenBriefing,
  onOpenBookmarks,
  onOpenSettings,
  onRefresh,
  isRefreshing,
  bookmarkCount,
  supabaseConnected,
}: MastheadProps) {
  const [currentDate, setCurrentDate] = useState('');
  const [worldTimes, setWorldTimes] = useState({ london: '', ny: '', tokyo: '' });

  useEffect(() => {
    const now = new Date();
    setCurrentDate(
      now.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    );

    const updateClocks = () => {
      const d = new Date();
      setWorldTimes({
        london: d.toLocaleTimeString('en-GB', { timeZone: 'Europe/London', hour: '2-digit', minute: '2-digit' }),
        ny: d.toLocaleTimeString('en-US', { timeZone: 'America/New_York', hour: '2-digit', minute: '2-digit', hour12: false }),
        tokyo: d.toLocaleTimeString('en-JP', { timeZone: 'Asia/Tokyo', hour: '2-digit', minute: '2-digit', hour12: false }),
      });
    };
    updateClocks();
    const interval = setInterval(updateClocks, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="bg-white border-b border-stone-200">
      {/* Editorial Top Metadata Ribbon */}
      <div className="border-b border-stone-150 text-[11px] text-stone-500 py-1.5 px-4 sm:px-8 bg-stone-50/60">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-y-1">
          {/* Left: Date & Volume */}
          <div className="flex items-center space-x-3 font-mono tracking-tight text-stone-600">
            <span className="font-medium text-stone-800">{currentDate || 'International Daily Edition'}</span>
            <span className="text-stone-300">|</span>
            <span className="uppercase tracking-widest text-[10px]">Vol. CXLIV No. 48</span>
            <span className="text-stone-300">|</span>
            <span className="text-stone-600">Global Wire Aggregator</span>
          </div>

          {/* Right: World Time Hubs & Supabase Cloud Status */}
          <div className="flex items-center space-x-4 font-mono text-[11px]">
            <div className="hidden md:flex items-center space-x-3 text-stone-500">
              <span>LDN <strong className="text-stone-800 font-normal">{worldTimes.london}</strong></span>
              <span>NYC <strong className="text-stone-800 font-normal">{worldTimes.ny}</strong></span>
              <span>TYO <strong className="text-stone-800 font-normal">{worldTimes.tokyo}</strong></span>
            </div>
            <span className="hidden md:inline text-stone-300">|</span>
            <button
              onClick={onOpenSettings}
              title="NewsData.io Global Wire API Connected"
              className="hidden sm:inline-flex items-center space-x-1.5 px-2 py-0.5 rounded bg-white border border-stone-200 hover:border-stone-400 transition-colors text-stone-700 font-sans cursor-pointer"
            >
              <Radio className="w-3 h-3 text-emerald-600" />
              <span className="text-[10px] font-medium tracking-tight">NewsData.io API</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-live-pulse" />
            </button>
            <button
              onClick={onOpenSettings}
              title="Supabase Cloud Synchronization Status"
              className="inline-flex items-center space-x-1.5 px-2 py-0.5 rounded bg-white border border-stone-200 hover:border-stone-400 transition-colors text-stone-700 font-sans cursor-pointer"
            >
              <Database className="w-3 h-3 text-emerald-600" />
              <span className="text-[10px] font-medium tracking-tight">
                {supabaseConnected ? 'Supabase Synced' : 'Supabase Cloud'}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Prestigious Brand Masthead */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-7 sm:py-9">
        <div className="text-center relative">
          {/* Latin Subtitle / Motto */}
          <div className="text-[10px] uppercase font-mono tracking-[0.25em] text-stone-500 mb-1.5">
            VERITAS IN NUMERIS ET LITTERIS • EST. MMXXVI
          </div>

          {/* Masthead Title */}
          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl tracking-tight text-stone-900 font-normal hover:opacity-95 transition-opacity">
            <a href="/" className="inline-block hover:no-underline">
              THE VERITAS DISPATCH
            </a>
          </h1>

          {/* Sub-Headline */}
          <p className="mt-2 text-xs sm:text-sm text-stone-600 max-w-2xl mx-auto font-sans tracking-normal leading-relaxed">
            Multi-Source Editorial Wire, Financial Intelligence & Sovereign Analytical Dispatches
          </p>

          {/* Refined Double Divider Rule */}
          <div className="mt-6 pt-1 border-t border-stone-900 relative">
            <div className="border-t border-stone-300 mt-[2px]" />
          </div>
        </div>

        {/* Global Toolbar & Controls */}
        <div className="mt-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pt-2">
          {/* Search Bar / Command Palette Trigger */}
          <div className="relative flex-1 max-w-md">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 pointer-events-none" />
              <input
                type="text"
                placeholder="Search world dispatches, companies, topics..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-9 pr-16 py-2 bg-stone-50/80 border border-stone-200 rounded-none text-xs text-stone-900 placeholder-stone-400 focus:bg-white focus:outline-none focus:border-stone-900 transition-colors"
              />
              <button
                type="button"
                onClick={onOpenCommandPalette}
                className="absolute right-2 px-1.5 py-0.5 rounded border border-stone-200 text-[10px] font-mono text-stone-500 bg-white hover:bg-stone-50 cursor-pointer shadow-xs"
                title="Open Command Palette (⌘K)"
              >
                ⌘K
              </button>
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center flex-wrap gap-2 justify-end">
            {/* Morning Briefing Modal Button */}
            <button
              onClick={onOpenBriefing}
              className="inline-flex items-center space-x-1.5 px-3 py-2 bg-stone-900 hover:bg-stone-800 text-stone-50 text-xs font-medium tracking-tight transition-colors shadow-xs cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>3-Min Briefing</span>
            </button>

            {/* Bookmarks / Saved Dossier Button */}
            <button
              onClick={onOpenBookmarks}
              className="inline-flex items-center space-x-1.5 px-3 py-2 bg-white hover:bg-stone-50 border border-stone-200 text-xs font-medium text-stone-800 transition-colors cursor-pointer"
            >
              <Bookmark className="w-3.5 h-3.5 text-stone-600" />
              <span>Dossier</span>
              {bookmarkCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 bg-stone-900 text-white rounded-full text-[10px] font-mono">
                  {bookmarkCount}
                </span>
              )}
            </button>

            {/* Custom Feeds & Settings */}
            <button
              onClick={onOpenSettings}
              className="inline-flex items-center space-x-1.5 px-2.5 py-2 bg-white hover:bg-stone-50 border border-stone-200 text-xs font-medium text-stone-700 transition-colors cursor-pointer"
              title="Cloud Settings & Custom RSS Subscriptions"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-stone-600" />
              <span className="hidden sm:inline">Settings</span>
            </button>

            {/* Refresh Wire Button */}
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="inline-flex items-center space-x-1 px-2.5 py-2 bg-white hover:bg-stone-50 border border-stone-200 text-xs text-stone-600 disabled:opacity-50 transition-colors cursor-pointer"
              title="Refresh feeds from wire sources"
            >
              <RotateCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-stone-900' : ''}`} />
              <span className="sr-only">Refresh Wire</span>
            </button>
          </div>
        </div>

        {/* Section Navigation Shelf */}
        <nav className="mt-5 border-t border-stone-200 pt-1 overflow-x-auto no-scrollbar">
          <ul className="flex items-center space-x-1 sm:space-x-3 py-1 whitespace-nowrap text-xs">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <li key={cat.id}>
                  <button
                    onClick={() => onSelectCategory(cat.id)}
                    className={`px-3 py-1.5 tracking-tight transition-all text-xs font-medium cursor-pointer relative ${
                      isActive
                        ? 'text-stone-950 font-semibold bg-stone-100/80 border-b-2 border-stone-900'
                        : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                    }`}
                  >
                    {cat.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}
