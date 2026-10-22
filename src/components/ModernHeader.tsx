'use client';

import React from 'react';
import { NewsCategory } from '@/types/news';
import { 
  Search, 
  Bookmark, 
  Sparkles, 
  RotateCw, 
  SlidersHorizontal, 
  Database,
  Radio,
  LayoutGrid,
  List,
  Command
} from 'lucide-react';

interface ModernHeaderProps {
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
  viewMode: 'grid' | 'stream';
  onToggleViewMode: (mode: 'grid' | 'stream') => void;
}

const CATEGORIES: Array<{ id: NewsCategory; label: string; icon?: string }> = [
  { id: 'all', label: 'All Signals' },
  { id: 'tech', label: 'Tech & AI' },
  { id: 'markets', label: 'Markets' },
  { id: 'business', label: 'Economy' },
  { id: 'world', label: 'World' },
  { id: 'science', label: 'Science' },
  { id: 'culture', label: 'Culture' },
];

export default function ModernHeader({
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
  viewMode,
  onToggleViewMode,
}: ModernHeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-xl border-b border-zinc-200/80 transition-all">
      {/* Top Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
        {/* Brand & Live Status */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2.5 cursor-pointer" onClick={() => onSelectCategory('all')}>
            {/* Modern Geometric Prism Logo */}
            <div className="w-8 h-8 rounded-xl bg-zinc-950 flex items-center justify-center shadow-xs">
              <div className="w-3.5 h-3.5 rounded-sm bg-gradient-to-tr from-emerald-400 to-cyan-400 rotate-45" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-base font-extrabold tracking-tight text-zinc-950">PRISM</span>
                <span className="px-1.5 py-0.2 rounded-md bg-zinc-100 text-[10px] font-mono font-medium text-zinc-600 border border-zinc-200/80">
                  LIVE
                </span>
              </div>
            </div>
          </div>

          {/* Cloud & API Badges */}
          <div className="hidden lg:flex items-center space-x-2 pl-3 border-l border-zinc-200 text-xs">
            <button
              onClick={onOpenSettings}
              className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-zinc-50 hover:bg-zinc-100 border border-zinc-200/70 text-zinc-600 transition-colors cursor-pointer text-[11px]"
              title="NewsData.io API Connected"
            >
              <Radio className="w-3 h-3 text-emerald-500" />
              <span>NewsData.io Wire</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-live-pulse" />
            </button>

            <button
              onClick={onOpenSettings}
              className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-zinc-50 hover:bg-zinc-100 border border-zinc-200/70 text-zinc-600 transition-colors cursor-pointer text-[11px]"
              title="Supabase Cloud Synchronization"
            >
              <Database className="w-3 h-3 text-emerald-500" />
              <span>{supabaseConnected ? 'Supabase Synced' : 'Cloud Sync'}</span>
            </button>
          </div>
        </div>

        {/* Center Search Omnibox */}
        <div className="flex-1 max-w-lg hidden md:block">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Search live dispatches, tickers, companies..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-16 py-2 bg-zinc-100/70 hover:bg-zinc-100 focus:bg-white border border-zinc-200/80 focus:border-zinc-900 rounded-xl text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none transition-all shadow-2xs"
            />
            <button
              type="button"
              onClick={onOpenCommandPalette}
              className="absolute right-2 px-1.5 py-0.5 rounded-md border border-zinc-200 text-[10px] font-mono text-zinc-400 bg-white hover:bg-zinc-50 cursor-pointer shadow-2xs flex items-center space-x-0.5"
            >
              <Command className="w-2.5 h-2.5" />
              <span>K</span>
            </button>
          </div>
        </div>

        {/* Right Action Toolbar */}
        <div className="flex items-center space-x-2">
          {/* 3-Min AI Briefing */}
          <button
            onClick={onOpenBriefing}
            className="inline-flex items-center space-x-1.5 px-3 py-2 bg-zinc-950 hover:bg-zinc-800 text-white rounded-xl text-xs font-semibold tracking-tight transition-all shadow-xs hover:shadow-sm cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>AI Brief</span>
          </button>

          {/* Saved Dossier Button */}
          <button
            onClick={onOpenBookmarks}
            className="inline-flex items-center space-x-1.5 px-3 py-2 bg-white hover:bg-zinc-50 border border-zinc-200/80 rounded-xl text-xs font-medium text-zinc-800 transition-colors shadow-2xs cursor-pointer"
          >
            <Bookmark className="w-3.5 h-3.5 text-zinc-600" />
            <span className="hidden sm:inline">Saved</span>
            {bookmarkCount > 0 && (
              <span className="px-1.5 py-0.2 bg-zinc-900 text-white rounded-full text-[10px] font-mono font-medium">
                {bookmarkCount}
              </span>
            )}
          </button>

          {/* Settings */}
          <button
            onClick={onOpenSettings}
            className="p-2 bg-white hover:bg-zinc-50 border border-zinc-200/80 rounded-xl text-zinc-600 transition-colors shadow-2xs cursor-pointer"
            title="API & Cloud Settings"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>

          {/* Refresh Wire */}
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="p-2 bg-white hover:bg-zinc-50 border border-zinc-200/80 rounded-xl text-zinc-600 disabled:opacity-50 transition-colors shadow-2xs cursor-pointer"
            title="Refresh Wire"
          >
            <RotateCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-zinc-950' : ''}`} />
          </button>
        </div>
      </div>

      {/* Category Pills & View Switcher Shelf */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex items-center justify-between border-t border-zinc-150">
        {/* Category Pills */}
        <div className="flex items-center space-x-1 sm:space-x-1.5 overflow-x-auto no-scrollbar py-0.5">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-zinc-950 text-white shadow-xs'
                    : 'bg-zinc-100/70 hover:bg-zinc-200/60 text-zinc-600 hover:text-zinc-900'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Right View Switcher */}
        <div className="hidden sm:flex items-center space-x-1 bg-zinc-100/80 p-0.5 rounded-lg border border-zinc-200/60 shrink-0 ml-3">
          <button
            type="button"
            onClick={() => onToggleViewMode('grid')}
            className={`p-1 rounded-md transition-all cursor-pointer ${
              viewMode === 'grid'
                ? 'bg-white text-zinc-950 shadow-2xs font-semibold'
                : 'text-zinc-500 hover:text-zinc-800'
            }`}
            title="Bento Grid View"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onToggleViewMode('stream')}
            className={`p-1 rounded-md transition-all cursor-pointer ${
              viewMode === 'stream'
                ? 'bg-white text-zinc-950 shadow-2xs font-semibold'
                : 'text-zinc-500 hover:text-zinc-800'
            }`}
            title="Stream Feed View"
          >
            <List className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
}
