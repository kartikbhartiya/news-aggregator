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
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 px-3 pb-[max(10px,env(safe-area-inset-bottom))] pt-2"
    >
      <div className="max-w-md mx-auto clay-card rounded-3xl p-1.5 shadow-xl flex items-center justify-around border border-zinc-200">
        {/* Tab 1: Signals (Feed) */}
        <button
          type="button"
          onClick={(e) => {
            handleButtonClickGlow(e);
            onSelectTab('signals');
          }}
          className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl transition-all cursor-pointer ${
            activeTab === 'signals' ? 'text-zinc-950 font-bold bg-zinc-100 shadow-xs' : 'text-zinc-500'
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
          className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl transition-all cursor-pointer ${
            activeTab === 'search' ? 'text-zinc-950 font-bold bg-zinc-100 shadow-xs' : 'text-zinc-500'
          }`}
        >
          <Search className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Search</span>
        </button>

        {/* Tab 3: AI Brief (Center Prominent Dark Clay Pill) */}
        <button
          type="button"
          onClick={(e) => {
            handleButtonClickGlow(e);
            onSelectTab('brief');
          }}
          className="clay-btn-dark -my-1 flex flex-col items-center justify-center w-11 h-11 rounded-full shadow-md text-white cursor-pointer"
          title="Executive Intelligence Brief"
        >
          <Sparkles className="w-5 h-5 text-white" />
        </button>

        {/* Tab 4: Saved Dossier */}
        <button
          type="button"
          onClick={(e) => {
            handleButtonClickGlow(e);
            onSelectTab('dossier');
          }}
          className={`relative flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl transition-all cursor-pointer ${
            activeTab === 'dossier' ? 'text-zinc-950 font-bold bg-zinc-100 shadow-xs' : 'text-zinc-500'
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
          className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl transition-all cursor-pointer ${
            activeTab === 'settings' ? 'text-zinc-950 font-bold bg-zinc-100 shadow-xs' : 'text-zinc-500'
          }`}
        >
          {showInstallButton ? (
            <>
              <Smartphone className="w-5 h-5 mb-0.5 text-zinc-900" />
              <span className="text-[10px] tracking-tight font-bold text-zinc-900">App</span>
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
