'use client';

import React, { useRef } from 'react';
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
  Smartphone,
  Globe2,
  Zap,
  User,
  Flame
} from 'lucide-react';
import { handleButtonClickGlow } from '@/lib/button-glow';
import LiquidGlassButton from '@/components/LiquidGlassButton';
import { UserProfile } from '@/lib/auth';

interface ModernHeaderProps {
  activeEdition: 'india' | 'international';
  onSelectEdition: (edition: 'india' | 'international') => void;
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
  onOpenShorts?: () => void;
  onOpenAuth?: () => void;
  onOpenProfile?: () => void;
  currentUser?: UserProfile | null;
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

/**
 * ModernHeader
 * High-craft Apple floating glass navigation island.
 * Features:
 * - Floating curved capsule with Apple specular sheen and soft multi-pass depth.
 * - Interactive WebGL Liquid Glass buttons with hover brightening and press feedback.
 * - Responsive Spotlight omnibox (⌘K).
 * - Real-time Edition Switcher (🇮🇳 India vs 🌐 Global).
 * - Integrated VisionOS-grade category navigation rail.
 */
export default function ModernHeader({
  activeEdition,
  onSelectEdition,
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
  onOpenShorts,
  onOpenAuth,
  onOpenProfile,
  currentUser,
}: ModernHeaderProps) {
  const searchInputRef = useRef<HTMLInputElement>(null);

  return (
    <header className="sticky top-2 sm:top-3.5 z-40 max-w-7xl mx-auto px-3 sm:px-6 transition-all duration-300">
      {/* Elevated Floating Liquid Glass Island */}
      <div className="relative rounded-[26px] sm:rounded-[32px] bg-white/85 backdrop-blur-2xl border border-zinc-200/80 shadow-[0_16px_40px_-8px_rgba(0,0,0,0.06),0_2px_8px_-2px_rgba(0,0,0,0.02)] p-2.5 sm:p-3 overflow-hidden">
        
        {/* Subtle Specular Sheen & Optical Backing for WebGL Shader Refraction */}
        <div 
          aria-hidden="true" 
          className="absolute inset-0 bg-gradient-to-r from-emerald-500/[0.04] via-teal-500/[0.03] to-cyan-500/[0.04] pointer-events-none" 
        />
        <div 
          aria-hidden="true" 
          className="absolute top-0 inset-x-8 h-[1px] bg-gradient-to-r from-transparent via-white to-transparent pointer-events-none" 
        />

        {/* 1. TOP COMMAND ROW */}
        <div className="relative z-10 flex items-center justify-between gap-3">
          
          {/* Brand & Edition Switcher */}
          <div className="flex items-center space-x-2.5 sm:space-x-3.5 shrink-0">
            {/* PRISM Emblem Logo */}
            <div
              className="flex items-center space-x-2.5 cursor-pointer apple-btn select-none group"
              onClick={(e) => {
                handleButtonClickGlow(e);
                onSelectCategory('all');
              }}
            >
              {/* Jewel Emblem */}
              <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-2xl bg-zinc-950 flex items-center justify-center shadow-md border border-zinc-800 transition-transform group-hover:scale-105 duration-200">
                <div className="w-3.5 h-3.5 rounded-sm bg-gradient-to-tr from-emerald-400 via-teal-300 to-cyan-400 rotate-45 shadow-xs animate-pulse" />
              </div>
              <div className="hidden min-[380px]:block">
                <div className="flex items-center space-x-1.5">
                  <span className="text-sm sm:text-base font-extrabold tracking-tight text-zinc-950">PRISM</span>
                  <span className="px-1.5 py-0.2 rounded-full bg-emerald-50 text-[9px] font-mono font-bold text-emerald-700 border border-emerald-200">
                    LIVE
                  </span>
                </div>
              </div>
            </div>

            {/* India vs International Edition Switcher (Liquid Glass Pills) */}
            <div className="inline-flex items-center p-0.5 rounded-full bg-zinc-100/90 border border-zinc-200/80 shadow-2xs">
              <LiquidGlassButton
                active={activeEdition === 'india'}
                variant="pill"
                onClick={() => onSelectEdition('india')}
                title="Switch to India Edition (The Hindu, NDTV, Livemint, Times of India, NewsData India)"
                className="px-2.5 sm:px-3 py-1 text-xs font-semibold"
                config={{ cornerRadius: 9999, refraction: 0.8, specular: 0.4 }}
              >
                <span className="text-xs">🇮🇳</span>
                <span className="hidden sm:inline">India</span>
              </LiquidGlassButton>

              <LiquidGlassButton
                active={activeEdition === 'international'}
                variant="pill"
                onClick={() => onSelectEdition('international')}
                title="Switch to Global Edition (NYT, BBC, Verge, Hacker News, Global Wire)"
                className="px-2.5 sm:px-3 py-1 text-xs font-semibold"
                config={{ cornerRadius: 9999, refraction: 0.8, specular: 0.4 }}
              >
                <Globe2 className="w-3.5 h-3.5 text-zinc-600 sm:hidden" />
                <span className="hidden sm:inline">🌐 Global</span>
              </LiquidGlassButton>
            </div>
          </div>

          {/* Center Apple Spotlight Search Omnibox */}
          <div className="flex-1 max-w-md hidden md:block">
            <div 
              onClick={() => searchInputRef.current?.focus()}
              className="relative flex items-center bg-zinc-100/70 hover:bg-zinc-100/95 focus-within:bg-white border border-zinc-200/80 focus-within:border-zinc-900 rounded-2xl transition-all duration-200 shadow-2xs px-3 py-1.5 cursor-text"
            >
              <Search className="w-3.5 h-3.5 text-zinc-400 mr-2 shrink-0" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search live dispatches, tickers, companies..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full bg-transparent text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleButtonClickGlow(e);
                  onOpenCommandPalette();
                }}
                className="apple-btn shrink-0 ml-1.5 px-1.5 py-0.5 rounded-md border border-zinc-200 text-[10px] font-mono text-zinc-400 bg-white hover:bg-zinc-50 cursor-pointer shadow-2xs flex items-center space-x-0.5"
                title="Open Command Spotlight (⌘K)"
              >
                <Command className="w-2.5 h-2.5" />
                <span>K</span>
              </button>
            </div>
          </div>

          {/* Right Action Deck */}
          <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
            {/* PRISM News Shorts (YT Shorts style) */}
            {onOpenShorts && (
              <LiquidGlassButton
                onClick={() => onOpenShorts()}
                title="Open PRISM News Shorts (Vertical QuickSignals)"
                className="px-2.5 sm:px-3 py-1.5 text-xs font-bold text-amber-500"
                config={{ cornerRadius: 18, refraction: 0.78, specular: 0.4 }}
              >
                <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500 mr-1" />
                <span className="hidden sm:inline">Shorts</span>
              </LiquidGlassButton>
            )}

            {/* Install PWA Button (Desktop/Tablet) */}
            <div className="hidden lg:block">
              <LiquidGlassButton
                onClick={() => onOpenInstall()}
                title="Install Prism as Native App"
                className="px-3 py-1.5 text-xs font-semibold"
                config={{ cornerRadius: 18, refraction: 0.75, specular: 0.35 }}
              >
                <Smartphone className="w-3.5 h-3.5 text-emerald-600 mr-1" />
                <span>Install</span>
              </LiquidGlassButton>
            </div>

            {/* AI Executive Intelligence Brief (Dark Liquid Glass Pill) */}
            <LiquidGlassButton
              variant="dark"
              onClick={() => onOpenBriefing()}
              title="Open 3-Minute AI Executive Intelligence Brief"
              className="px-3 sm:px-3.5 py-1.5 text-xs font-bold tracking-tight shadow-sm"
              config={{ cornerRadius: 18, refraction: 0.82, specular: 0.5, edgeHighlight: 0.28 }}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300 mr-1 animate-pulse" />
              <span className="hidden sm:inline">AI Brief</span>
              <span className="sm:hidden">Brief</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 ml-1.5 animate-ping" />
            </LiquidGlassButton>

            {/* Saved Dossier Button */}
            <LiquidGlassButton
              onClick={() => onOpenBookmarks()}
              title="Saved Dossier & Bookmarks"
              className="px-2.5 sm:px-3 py-1.5 text-xs font-medium"
              config={{ cornerRadius: 18, refraction: 0.75 }}
            >
              <Bookmark className="w-3.5 h-3.5 text-zinc-600" />
              <span className="hidden sm:inline ml-1">Saved</span>
              {bookmarkCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 bg-zinc-950 text-white rounded-full text-[10px] font-mono font-bold">
                  {bookmarkCount}
                </span>
              )}
            </LiquidGlassButton>

            {/* Account Profile / Supabase Auth Button */}
            {currentUser ? (
              <LiquidGlassButton
                onClick={() => onOpenProfile?.()}
                title={`Profile: ${currentUser.fullName || currentUser.email}`}
                className="px-2.5 sm:px-3 py-1.5 text-xs font-semibold"
                config={{ cornerRadius: 18, refraction: 0.75 }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.fullName || 'User'}
                  className="w-4 h-4 rounded-full mr-1.5 object-cover"
                />
                <span className="hidden md:inline max-w-[80px] truncate">
                  {currentUser.fullName?.split(' ')[0] || 'Dossier'}
                </span>
              </LiquidGlassButton>
            ) : (
              <LiquidGlassButton
                onClick={() => onOpenAuth?.()}
                title="Sign In with Password or Sign Up with 6-Digit OTP"
                className="px-2.5 sm:px-3 py-1.5 text-xs font-bold text-zinc-950"
                config={{ cornerRadius: 18, refraction: 0.75 }}
              >
                <User className="w-3.5 h-3.5 text-zinc-900 mr-1" />
                <span className="hidden sm:inline">Sign In</span>
              </LiquidGlassButton>
            )}

            {/* Settings (Cloud & API Engine) */}
            <LiquidGlassButton
              onClick={() => onOpenSettings()}
              title="Cloud & API Engine Settings"
              className="p-2 text-zinc-600"
              config={{ cornerRadius: 16, refraction: 0.75 }}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
            </LiquidGlassButton>

            {/* View Switcher: Bento Grid vs Stream View */}
            <div className="hidden sm:inline-flex items-center p-0.5 rounded-xl bg-zinc-100 border border-zinc-200/80 shadow-2xs">
              <button
                type="button"
                onClick={(e) => {
                  handleButtonClickGlow(e);
                  onToggleViewMode('grid');
                }}
                className={`apple-btn p-1.5 rounded-lg transition-all cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-zinc-950 text-white shadow-xs'
                    : 'text-zinc-500 hover:text-zinc-800'
                }`}
                title="Bento Grid Architecture"
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
                    ? 'bg-zinc-950 text-white shadow-xs'
                    : 'text-zinc-500 hover:text-zinc-800'
                }`}
                title="Continuous Wire Stream"
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Wire Refresh Button */}
            <LiquidGlassButton
              onClick={() => onRefresh()}
              disabled={isRefreshing}
              title="Refresh Live Wire"
              className="p-2 text-zinc-600"
              config={{ cornerRadius: 16, refraction: 0.75 }}
            >
              <RotateCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-zinc-950' : ''}`} />
            </LiquidGlassButton>
          </div>
        </div>

        {/* 2. INTEGRATED CATEGORY NAVIGATION RAIL */}
        <div className="relative z-10 pt-2 sm:pt-2.5 mt-1 sm:mt-1.5 border-t border-zinc-200/50 flex items-center justify-between">
          <div className="flex items-center space-x-1.5 sm:space-x-2 overflow-x-auto no-scrollbar py-0.5 w-full">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <LiquidGlassButton
                  key={cat.id}
                  active={isActive}
                  variant="pill"
                  onClick={() => onSelectCategory(cat.id)}
                  className="px-3.5 py-1 text-xs font-semibold whitespace-nowrap"
                  config={{ 
                    cornerRadius: 9999, 
                    refraction: 0.78, 
                    specular: isActive ? 0.45 : 0.3,
                    edgeHighlight: 0.22 
                  }}
                >
                  {cat.label}
                </LiquidGlassButton>
              );
            })}
          </div>
        </div>

      </div>
    </header>
  );
}
