'use client';

import React from 'react';
import { NewsCategory } from '@/types/news';
import { 
  Search, 
  Bookmark, 
  Sparkles, 
  RotateCw, 
  SlidersHorizontal, 
  LayoutGrid,
  List,
  Command,
  Smartphone
} from 'lucide-react';
import { handleButtonClickGlow } from '@/lib/button-glow';

interface ModernHeaderProps {
  activeCategory: NewsCategory;
  onSelectCategory: (category: NewsCategory) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenCommandPalette: () => void;
  onOpenBriefing: () => void;
  onOpenBookmarks: () => void;
  onOpenSettings: () => void;
  onOpenInstall: () => void;
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
  onOpenInstall,
  onRefresh,
  isRefreshing,
  bookmarkCount,
  supabaseConnected,
  viewMode,
  onToggleViewMode,
}: ModernHeaderProps) {
  return (
    <header 
      data-config='{"blurAmount":0.22,"refraction":0.75,"chromAberration":0.08,"edgeHighlight":0.16,"specular":0.3,"fresnel":1.2,"cornerRadius":0,"zRadius":24,"button":false}'
      className="sticky top-0 z-40 liquid-glass-direct liquid-glass-nav transition-all"
    >
      {/* Top Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Brand & Live Status */}
        <div className="flex items-center space-x-4">
          <div
            className="flex items-center space-x-2.5 cursor-pointer apple-btn"
            onClick={(e) => {
              handleButtonClickGlow(e);
              onSelectCategory('all');
            }}
          >
            {/* Modern Geometric Prism Logo */}
            <div className="w-8 h-8 rounded-xl bg-zinc-950 flex items-center justify-center shadow-xs border border-white/20">
              <div className="w-3.5 h-3.5 rounded-sm bg-gradient-to-tr from-emerald-400 to-cyan-400 rotate-45" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-base font-extrabold tracking-tight text-zinc-950">PRISM</span>
                <span className="px-1.5 py-0.2 rounded-full bg-emerald-50 text-[10px] font-mono font-bold text-emerald-700 border border-emerald-200">
                  LIVE
                </span>
              </div>
            </div>
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
              className="w-full pl-10 pr-16 py-2 bg-white/70 hover:bg-white focus:bg-white border border-zinc-200/80 focus:border-zinc-900 rounded-xl text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none transition-all shadow-2xs"
            />
            <button
              type="button"
              onClick={(e) => {
                handleButtonClickGlow(e);
                onOpenCommandPalette();
              }}
              className="apple-btn absolute right-2 px-1.5 py-0.5 rounded-md border border-zinc-200 text-[10px] font-mono text-zinc-400 bg-white hover:bg-zinc-50 cursor-pointer shadow-2xs flex items-center space-x-0.5"
            >
              <Command className="w-2.5 h-2.5" />
              <span>K</span>
            </button>
          </div>
        </div>

        {/* Right Action Toolbar */}
        <div className="flex items-center space-x-2">
          {/* Install as Native App Button */}
          <button
            onClick={(e) => {
              handleButtonClickGlow(e);
              onOpenInstall();
            }}
            className="apple-glass-btn apple-btn hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-zinc-800 cursor-pointer"
            title="Install Prism as Native App on Mobile/Desktop"
          >
            <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
            <span>Install App</span>
          </button>

          {/* 3-Min AI Briefing */}
          <button
            onClick={(e) => {
              handleButtonClickGlow(e);
              onOpenBriefing();
            }}
            className="apple-prominent-btn apple-btn inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold tracking-tight shadow-md cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>AI Brief</span>
          </button>

          {/* Saved Dossier Button */}
          <button
            onClick={(e) => {
              handleButtonClickGlow(e);
              onOpenBookmarks();
            }}
            className="apple-glass-btn apple-btn inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-zinc-800 cursor-pointer"
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
            onClick={(e) => {
              handleButtonClickGlow(e);
              onOpenSettings();
            }}
            className="apple-glass-btn apple-btn p-2 rounded-xl text-zinc-600 cursor-pointer"
            title="API & Cloud Settings"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>

          {/* Refresh Wire */}
          <button
            onClick={(e) => {
              handleButtonClickGlow(e);
              onRefresh();
            }}
            disabled={isRefreshing}
            className="apple-glass-btn apple-btn p-2 rounded-xl text-zinc-600 disabled:opacity-50 cursor-pointer"
            title="Refresh Wire"
          >
            <RotateCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-zinc-950' : ''}`} />
          </button>
        </div>
      </div>

      {/* Category Pills & View Switcher Shelf */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex items-center justify-between border-t border-white/60">
        {/* Category Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar py-0.5">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={(e) => {
                  handleButtonClickGlow(e);
                  onSelectCategory(cat.id);
                }}
                className={`apple-btn px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'apple-prominent-btn text-white shadow-xs'
                    : 'apple-glass-btn text-zinc-600 hover:text-zinc-900'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Right View Switcher */}
        <div className="hidden sm:flex items-center space-x-1 liquid-glass-pill p-1 rounded-xl shrink-0 ml-3">
          <button
            type="button"
            onClick={(e) => {
              handleButtonClickGlow(e);
              onToggleViewMode('grid');
            }}
            className={`apple-btn p-1.5 rounded-lg transition-all cursor-pointer ${
              viewMode === 'grid'
                ? 'bg-zinc-950 text-white shadow-xs font-semibold'
                : 'text-zinc-500 hover:text-zinc-800'
            }`}
            title="Bento Grid View"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              handleButtonClickGlow(e);
              onToggleViewMode('stream');
            }}
            className={`apple-btn p-1.5 rounded-lg transition-all cursor-pointer ${
              viewMode === 'stream'
                ? 'bg-zinc-950 text-white shadow-xs font-semibold'
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
