'use client';

import React from 'react';
import { Newspaper, Search, Sparkles, Bookmark, SlidersHorizontal, Smartphone } from 'lucide-react';
import { handleButtonClickGlow } from '@/lib/button-glow';

interface MobileTabBarProps {
  activeTab: 'signals' | 'search' | 'brief' | 'dossier' | 'settings';
  onSelectTab: (tab: 'signals' | 'search' | 'brief' | 'dossier' | 'settings') => void;
  bookmarkCount: number;
  onOpenInstall: () => void;
  showInstallButton: boolean;
}

export default function MobileTabBar({
  activeTab,
  onSelectTab,
  bookmarkCount,
  onOpenInstall,
  showInstallButton,
}: MobileTabBarProps) {
  return (
    <nav
      aria-label="Mobile Bottom Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 px-3 pb-[max(12px,env(safe-area-inset-bottom))] pt-2"
    >
      <div className="max-w-md mx-auto liquid-glass-nav rounded-3xl p-1.5 shadow-xl flex items-center justify-around border border-white/70">
        {/* Tab 1: Signals (Feed) */}
        <button
          type="button"
          onClick={(e) => {
            handleButtonClickGlow(e);
            onSelectTab('signals');
          }}
          className={`apple-btn flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl transition-all cursor-pointer ${
            activeTab === 'signals' ? 'text-zinc-950 font-bold bg-white/70 shadow-xs' : 'text-zinc-500'
          }`}
        >
          <Newspaper className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Signals</span>
        </button>

        {/* Tab 2: Search */}
        <button
          type="button"
          onClick={(e) => {
            handleButtonClickGlow(e);
            onSelectTab('search');
          }}
          className={`apple-btn flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl transition-all cursor-pointer ${
            activeTab === 'search' ? 'text-zinc-950 font-bold bg-white/70 shadow-xs' : 'text-zinc-500'
          }`}
        >
          <Search className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Search</span>
        </button>

        {/* Tab 3: AI Brief (Center Prominent) */}
        <button
          type="button"
          onClick={(e) => {
            handleButtonClickGlow(e);
            onSelectTab('brief');
          }}
          className="apple-prominent-btn apple-btn -my-2 flex flex-col items-center justify-center w-12 h-12 rounded-full shadow-lg border border-white/30 text-white cursor-pointer"
          title="3-Minute AI Intelligence Brief"
        >
          <Sparkles className="w-5 h-5 text-amber-300" />
        </button>

        {/* Tab 4: Saved Dossier */}
        <button
          type="button"
          onClick={(e) => {
            handleButtonClickGlow(e);
            onSelectTab('dossier');
          }}
          className={`apple-btn relative flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl transition-all cursor-pointer ${
            activeTab === 'dossier' ? 'text-zinc-950 font-bold bg-white/70 shadow-xs' : 'text-zinc-500'
          }`}
        >
          <Bookmark className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Saved</span>
          {bookmarkCount > 0 && (
            <span className="absolute top-1 right-2 w-4 h-4 rounded-full bg-zinc-950 text-white text-[9px] font-bold flex items-center justify-center">
              {bookmarkCount}
            </span>
          )}
        </button>

        {/* Tab 5: Settings / Install */}
        <button
          type="button"
          onClick={(e) => {
            handleButtonClickGlow(e);
            if (showInstallButton) {
              onOpenInstall();
            } else {
              onSelectTab('settings');
            }
          }}
          className={`apple-btn flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl transition-all cursor-pointer ${
            activeTab === 'settings' ? 'text-zinc-950 font-bold bg-white/70 shadow-xs' : 'text-zinc-500'
          }`}
        >
          {showInstallButton ? (
            <>
              <Smartphone className="w-5 h-5 mb-0.5 text-emerald-600 animate-bounce" />
              <span className="text-[10px] tracking-tight font-bold text-emerald-700">Add App</span>
            </>
          ) : (
            <>
              <SlidersHorizontal className="w-5 h-5 mb-0.5" />
              <span className="text-[10px] tracking-tight">Settings</span>
            </>
          )}
        </button>
      </div>
    </nav>
  );
}
