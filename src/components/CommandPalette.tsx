'use client';

import React, { useState, useEffect } from 'react';
import { Article, NewsCategory } from '@/types/news';
import { 
  Search, 
  Sparkles, 
  Bookmark, 
  Database, 
  RotateCw, 
  CornerDownLeft,
  Command
} from 'lucide-react';
import { handleButtonClickGlow } from '@/lib/button-glow';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  articles: Article[];
  onSelectArticle: (article: Article) => void;
  onSelectCategory: (cat: NewsCategory) => void;
  onOpenBriefing: () => void;
  onOpenBookmarks: () => void;
  onOpenSettings: () => void;
  onRefresh: () => void;
}

export default function CommandPalette({
  isOpen,
  onClose,
  articles,
  onSelectArticle,
  onSelectCategory,
  onOpenBriefing,
  onOpenBookmarks,
  onOpenSettings,
  onRefresh,
}: CommandPaletteProps) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredArticles = query
    ? articles.filter(
        (a) =>
          a.title.toLowerCase().includes(query.toLowerCase()) ||
          a.source.name.toLowerCase().includes(query.toLowerCase()) ||
          a.category.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 8)
    : [];

  const categories: Array<{ id: NewsCategory; label: string }> = [
    { id: 'all', label: 'All Signals' },
    { id: 'tech', label: 'Technology & AI' },
    { id: 'markets', label: 'Capital Markets' },
    { id: 'business', label: 'Economy' },
    { id: 'world', label: 'World' },
    { id: 'science', label: 'Science' },
    { id: 'culture', label: 'Culture' },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-zinc-950/45 backdrop-blur-md flex justify-center p-4 sm:p-12 animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl liquid-glass-panel rounded-3xl shadow-2xl my-auto flex flex-col max-h-[80vh] overflow-hidden border border-white/70">
        {/* Input bar */}
        <div className="p-4 border-b border-zinc-200/60 flex items-center space-x-3 bg-white/70 backdrop-blur-xl">
          <Search className="w-4 h-4 text-zinc-400 shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Type a headline, company, category, or command..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none font-sans bg-transparent"
          />
          <kbd className="px-2 py-0.5 text-[10px] font-mono text-zinc-400 border border-zinc-200 rounded-md bg-white">
            ESC
          </kbd>
        </div>

        {/* Results / Navigation list */}
        <div className="overflow-y-auto p-3 space-y-4 max-h-[60vh]">
          {/* If search query entered and matches found */}
          {query && filteredArticles.length > 0 && (
            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 px-3 pb-1">
                Articles Matching &ldquo;{query}&rdquo;
              </div>
              <div className="space-y-1">
                {filteredArticles.map((art) => (
                  <button
                    key={art.id}
                    onClick={(e) => {
                      handleButtonClickGlow(e);
                      onSelectArticle(art);
                      onClose();
                    }}
                    className="apple-btn w-full text-left px-3.5 py-2.5 hover:bg-white/80 rounded-2xl flex items-center justify-between group transition-all cursor-pointer"
                  >
                    <div className="truncate pr-3">
                      <div className="font-bold text-sm text-zinc-950 group-hover:text-zinc-600 truncate">
                        {art.title}
                      </div>
                      <div className="text-[10px] font-mono text-zinc-400 flex items-center space-x-2 mt-0.5">
                        <span className="uppercase text-zinc-700 font-semibold">{art.source.name}</span>
                        <span>•</span>
                        <span>{art.category}</span>
                      </div>
                    </div>
                    <CornerDownLeft className="w-3.5 h-3.5 text-zinc-300 group-hover:text-zinc-700 shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {query && filteredArticles.length === 0 && (
            <div className="p-6 text-center text-xs text-zinc-500 font-sans">
              No dispatches found matching &ldquo;{query}&rdquo;
            </div>
          )}

          {/* Quick Actions */}
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 px-3 pb-1">
              Quick Actions
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={(e) => {
                  handleButtonClickGlow(e);
                  onOpenBriefing();
                  onClose();
                }}
                className="apple-glass-btn apple-btn w-full text-left px-3.5 py-2.5 rounded-2xl flex items-center space-x-2.5 transition-colors cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span className="text-xs text-zinc-900 font-bold">3-Min AI Executive Brief</span>
              </button>

              <button
                type="button"
                onClick={(e) => {
                  handleButtonClickGlow(e);
                  onOpenBookmarks();
                  onClose();
                }}
                className="apple-glass-btn apple-btn w-full text-left px-3.5 py-2.5 rounded-2xl flex items-center space-x-2.5 transition-colors cursor-pointer"
              >
                <Bookmark className="w-4 h-4 text-zinc-700" />
                <span className="text-xs text-zinc-900 font-bold">Open Saved Dossier</span>
              </button>

              <button
                type="button"
                onClick={(e) => {
                  handleButtonClickGlow(e);
                  onOpenSettings();
                  onClose();
                }}
                className="apple-glass-btn apple-btn w-full text-left px-3.5 py-2.5 rounded-2xl flex items-center space-x-2.5 transition-colors cursor-pointer"
              >
                <Database className="w-4 h-4 text-emerald-600" />
                <span className="text-xs text-zinc-900 font-bold">Cloud & API Engine</span>
              </button>

              <button
                type="button"
                onClick={(e) => {
                  handleButtonClickGlow(e);
                  onRefresh();
                  onClose();
                }}
                className="apple-glass-btn apple-btn w-full text-left px-3.5 py-2.5 rounded-2xl flex items-center space-x-2.5 transition-colors cursor-pointer"
              >
                <RotateCw className="w-4 h-4 text-zinc-700" />
                <span className="text-xs text-zinc-900 font-bold">Refresh Global Wire</span>
              </button>
            </div>
          </div>

          {/* Jump to Category */}
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 px-3 pb-1">
              Jump to Category
            </div>
            <div className="flex flex-wrap gap-1.5 px-3">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={(e) => {
                    handleButtonClickGlow(e);
                    onSelectCategory(cat.id);
                    onClose();
                  }}
                  className="apple-glass-btn apple-btn px-3 py-1 text-xs rounded-full cursor-pointer font-bold text-zinc-800"
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="p-3.5 border-t border-zinc-200/60 bg-white/70 text-[10px] font-mono text-zinc-400 flex items-center justify-between">
          <span>Navigate with arrow keys • Enter to select</span>
          <span>Apple Spotlight Command</span>
        </div>
      </div>
    </div>
  );
}
