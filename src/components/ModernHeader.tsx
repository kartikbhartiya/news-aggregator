'use client';

import React, { useRef, useState } from 'react';
import { NewsCategory } from '@/types/news';
import { 
  Search, 
  Bookmark, 
  Sparkles, 
  RotateCw, 
  LayoutGrid, 
  List, 
  Command, 
  Globe2, 
  User,
  X 
} from 'lucide-react';
import { handleButtonClickGlow } from '@/lib/button-glow';
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

const CATEGORIES: Array<{ id: NewsCategory; label: string }> = [
  { id: 'all', label: 'All Signals' },
  { id: 'tech', label: 'Tech & AI' },
  { id: 'markets', label: 'Markets' },
  { id: 'business', label: 'Economy' },
  { id: 'world', label: 'World' },
  { id: 'science', label: 'Science' },
  { id: 'culture', label: 'Culture' },
];

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
  onRefresh,
  isRefreshing,
  bookmarkCount,
  viewMode,
  onToggleViewMode,
  onOpenAuth,
  onOpenProfile,
  currentUser,
}: ModernHeaderProps) {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  return (
    <header className="sticky top-2 sm:top-3 z-40 max-w-7xl w-full mx-auto px-3 sm:px-6 transition-all duration-300">
      {/* Sculpted Clay Navigation Island */}
      <div className="clay-nav rounded-2xl sm:rounded-3xl p-2.5 sm:p-3.5 space-y-2.5">
        
        {/* TOP COMMAND ROW */}
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Brand & Edition Switcher */}
          <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
            {/* PRISM Emblem Logo */}
            <div
              className="flex items-center space-x-2 cursor-pointer select-none group"
              onClick={(e) => {
                handleButtonClickGlow(e);
                onSelectCategory('all');
              }}
            >
              <div className="clay-btn-dark w-8 h-8 sm:w-9 sm:h-9 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0">
                <span className="font-serif font-black text-sm sm:text-base text-white">P</span>
              </div>
              <div className="block">
                <span className="font-serif text-base sm:text-lg font-extrabold tracking-tight text-zinc-950">
                  PRISM
                </span>
              </div>
            </div>

            {/* India vs International Edition Switcher (Tactile Clay Track) */}
            <div className="clay-inset p-0.5 rounded-full inline-flex items-center">
              <button
                type="button"
                onClick={(e) => {
                  handleButtonClickGlow(e);
                  onSelectEdition('india');
                }}
                title="Switch to India National Edition"
                className={`px-2.5 sm:px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  activeEdition === 'india'
                    ? 'clay-pill-active'
                    : 'text-zinc-600 hover:text-zinc-950'
                }`}
              >
                <span className="mr-1">🇮🇳</span>
                <span className="hidden sm:inline">India</span>
                <span className="sm:hidden text-[11px]">IN</span>
              </button>

              <button
                type="button"
                onClick={(e) => {
                  handleButtonClickGlow(e);
                  onSelectEdition('international');
                }}
                title="Switch to Global Edition"
                className={`px-2.5 sm:px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  activeEdition === 'international'
                    ? 'clay-pill-active'
                    : 'text-zinc-600 hover:text-zinc-950'
                }`}
              >
                <span className="hidden sm:inline mr-1">🌐</span>
                <Globe2 className="w-3 h-3 text-zinc-600 sm:hidden inline mr-0.5" />
                <span className="hidden sm:inline">Global</span>
                <span className="sm:hidden text-[11px]">Global</span>
              </button>
            </div>
          </div>

          {/* Center Search Omnibox (Desktop & Tablet) */}
          <div className="flex-1 max-w-md hidden md:block">
            <div 
              onClick={() => searchInputRef.current?.focus()}
              className="clay-inset rounded-2xl px-3 py-1.5 flex items-center transition-all duration-200 cursor-text"
            >
              <Search className="w-3.5 h-3.5 text-zinc-400 mr-2 shrink-0" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search dispatches, companies, tickers..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full bg-transparent text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSearchChange('');
                  }}
                  className="mr-1 text-zinc-400 hover:text-zinc-900 cursor-pointer p-0.5"
                  title="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleButtonClickGlow(e);
                  onOpenCommandPalette();
                }}
                className="clay-btn shrink-0 ml-1 px-1.5 py-0.5 rounded-md text-[10px] font-mono text-zinc-500 cursor-pointer flex items-center space-x-0.5"
                title="Open Command Spotlight (⌘K)"
              >
                <Command className="w-2.5 h-2.5" />
                <span>K</span>
              </button>
            </div>
          </div>

          {/* Right Action Deck */}
          <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
            
            {/* Mobile Search Toggle */}
            <button
              type="button"
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              className="clay-btn md:hidden p-2 rounded-xl text-zinc-700 cursor-pointer"
              title="Toggle search"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* AI Executive Intelligence Brief (Clean Dark Clay Pill - Zero Green Lights) */}
            <button
              type="button"
              onClick={(e) => {
                handleButtonClickGlow(e);
                onOpenBriefing();
              }}
              title="Open 3-Minute Executive Intelligence Brief"
              className="clay-btn-dark px-3 sm:px-3.5 py-1.5 rounded-full text-xs font-bold inline-flex items-center space-x-1.5 cursor-pointer shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-zinc-200" />
              <span className="hidden sm:inline">Executive Brief</span>
              <span className="sm:hidden">Brief</span>
            </button>

            {/* Saved Dossier Button */}
            <button
              type="button"
              onClick={(e) => {
                handleButtonClickGlow(e);
                onOpenBookmarks();
              }}
              title="Saved Articles Dossier"
              className="clay-btn px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-semibold text-zinc-800 inline-flex items-center cursor-pointer"
            >
              <Bookmark className="w-3.5 h-3.5 text-zinc-700" />
              <span className="hidden sm:inline ml-1">Saved</span>
              {bookmarkCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 bg-zinc-950 text-white rounded-full text-[10px] font-mono font-bold">
                  {bookmarkCount}
                </span>
              )}
            </button>

            {/* Account Profile / Auth Button */}
            {currentUser ? (
              <button
                type="button"
                onClick={(e) => {
                  handleButtonClickGlow(e);
                  if (onOpenProfile) onOpenProfile();
                }}
                title={currentUser.fullName || currentUser.email}
                className="clay-btn p-1.5 rounded-full text-zinc-800 cursor-pointer flex items-center justify-center w-8 h-8"
              >
                <span className="text-xs font-mono font-bold text-zinc-950 uppercase">
                  {(currentUser.fullName || currentUser.email).charAt(0)}
                </span>
              </button>
            ) : (
              <button
                type="button"
                onClick={(e) => {
                  handleButtonClickGlow(e);
                  if (onOpenAuth) onOpenAuth();
                }}
                className="clay-btn px-2.5 py-1.5 rounded-full text-xs font-semibold text-zinc-800 cursor-pointer hidden min-[440px]:inline-flex items-center space-x-1"
              >
                <User className="w-3 h-3 text-zinc-600" />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>

        {/* MOBILE EXPANDED SEARCH BAR */}
        {mobileSearchOpen && (
          <div className="md:hidden pt-1 animate-in fade-in slide-in-from-top-1 duration-150">
            <div className="clay-inset rounded-2xl px-3 py-2 flex items-center">
              <Search className="w-4 h-4 text-zinc-400 mr-2 shrink-0" />
              <input
                autoFocus
                type="text"
                placeholder="Search dispatches, companies, tickers..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full bg-transparent text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => onSearchChange('')}
                  className="mr-1 text-zinc-400 hover:text-zinc-900 cursor-pointer p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* BOTTOM ROW: CATEGORY STRIP & VIEW SWITCHER */}
        <div className="pt-2 border-t border-zinc-200/80 flex items-center justify-between gap-2">
          
          {/* Scrollable Category Track with Clay Pills */}
          <nav
            aria-label="Editorial Categories"
            className="flex-1 overflow-x-auto no-scrollbar flex items-center space-x-1.5 py-0.5 scroll-smooth"
          >
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={(e) => {
                    handleButtonClickGlow(e);
                    onSelectCategory(cat.id);
                  }}
                  className={`clay-pill px-3 py-1 text-xs font-bold whitespace-nowrap cursor-pointer transition-all ${
                    isActive ? 'clay-pill-active' : 'text-zinc-700'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </nav>

          {/* Quick Controls: Refresh & View Toggle */}
          <div className="flex items-center space-x-1 shrink-0 pl-1">
            {/* Live Wire Refresh Button */}
            <button
              type="button"
              onClick={(e) => {
                handleButtonClickGlow(e);
                onRefresh();
              }}
              disabled={isRefreshing}
              title="Refresh News Wire"
              className="clay-btn p-1.5 rounded-xl text-zinc-700 cursor-pointer disabled:opacity-50"
            >
              <RotateCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-zinc-950' : ''}`} />
            </button>

            {/* Grid vs Stream View Toggle */}
            <div className="clay-inset p-0.5 rounded-xl inline-flex items-center">
              <button
                type="button"
                onClick={() => onToggleViewMode('grid')}
                title="Bento Grid Layout"
                className={`p-1 rounded-lg transition-all cursor-pointer ${
                  viewMode === 'grid' ? 'bg-zinc-950 text-white shadow-xs' : 'text-zinc-500 hover:text-zinc-900'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onToggleViewMode('stream')}
                title="Stream Feed Layout"
                className={`p-1 rounded-lg transition-all cursor-pointer ${
                  viewMode === 'stream' ? 'bg-zinc-950 text-white shadow-xs' : 'text-zinc-500 hover:text-zinc-900'
                }`}
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
