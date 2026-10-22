'use client';

import React, { useState, useEffect } from 'react';
import { Article, NewsCategory } from '@/types/news';
import { 
  Search, 
  Sparkles, 
  Bookmark, 
  Database, 
  RotateCw, 
  Compass, 
  FileText,
  CornerDownLeft
} from 'lucide-react';

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
    { id: 'all', label: 'All Editions' },
    { id: 'world', label: 'World & Geopolitics' },
    { id: 'markets', label: 'Capital Markets' },
    { id: 'tech', label: 'Technology & AI' },
    { id: 'science', label: 'Science & Discovery' },
    { id: 'culture', label: 'Culture & Ideas' },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex justify-center p-4 sm:p-12 animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-white border border-stone-200 shadow-2xl rounded-none my-auto flex flex-col max-h-[80vh] overflow-hidden">
        {/* Input bar */}
        <div className="p-4 border-b border-stone-200 flex items-center space-x-3 bg-white">
          <Search className="w-4 h-4 text-stone-400 shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Type a headline, company, category, or quick command..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full text-sm text-stone-900 placeholder-stone-400 focus:outline-none font-sans"
          />
          <kbd className="px-1.5 py-0.5 text-[10px] font-mono text-stone-400 border border-stone-200 rounded">
            ESC
          </kbd>
        </div>

        {/* Results / Navigation list */}
        <div className="overflow-y-auto p-3 space-y-4 max-h-[60vh]">
          {/* If search query entered and matches found */}
          {query && filteredArticles.length > 0 && (
            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-stone-400 px-3 pb-1">
                Articles Matching &ldquo;{query}&rdquo;
              </div>
              <div className="space-y-1">
                {filteredArticles.map((art) => (
                  <button
                    key={art.id}
                    onClick={() => {
                      onSelectArticle(art);
                      onClose();
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-stone-100 flex items-center justify-between group transition-colors cursor-pointer"
                  >
                    <div className="truncate pr-3">
                      <div className="font-serif text-sm text-stone-900 group-hover:text-stone-700 truncate font-normal">
                        {art.title}
                      </div>
                      <div className="text-[10px] font-mono text-stone-400 flex items-center space-x-2 mt-0.5">
                        <span className="uppercase text-stone-700">{art.source.name}</span>
                        <span>•</span>
                        <span>{art.category}</span>
                      </div>
                    </div>
                    <CornerDownLeft className="w-3.5 h-3.5 text-stone-300 group-hover:text-stone-700 shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {query && filteredArticles.length === 0 && (
            <div className="p-6 text-center text-xs text-stone-500 font-sans">
              No dispatches found matching &ldquo;{query}&rdquo;
            </div>
          )}

          {/* Quick Actions */}
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-stone-400 px-3 pb-1">
              Quick Editorial Actions
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
              <button
                type="button"
                onClick={() => {
                  onOpenBriefing();
                  onClose();
                }}
                className="w-full text-left px-3 py-2 hover:bg-stone-100 flex items-center space-x-2.5 transition-colors cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span className="text-xs text-stone-800 font-medium">3-Min Executive Briefing</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onOpenBookmarks();
                  onClose();
                }}
                className="w-full text-left px-3 py-2 hover:bg-stone-100 flex items-center space-x-2.5 transition-colors cursor-pointer"
              >
                <Bookmark className="w-4 h-4 text-stone-600" />
                <span className="text-xs text-stone-800 font-medium">Open Reading Dossier</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onOpenSettings();
                  onClose();
                }}
                className="w-full text-left px-3 py-2 hover:bg-stone-100 flex items-center space-x-2.5 transition-colors cursor-pointer"
              >
                <Database className="w-4 h-4 text-emerald-600" />
                <span className="text-xs text-stone-800 font-medium">Supabase Cloud Settings</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onRefresh();
                  onClose();
                }}
                className="w-full text-left px-3 py-2 hover:bg-stone-100 flex items-center space-x-2.5 transition-colors cursor-pointer"
              >
                <RotateCw className="w-4 h-4 text-stone-600" />
                <span className="text-xs text-stone-800 font-medium">Refresh Global Wire</span>
              </button>
            </div>
          </div>

          {/* Jump to Category */}
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-stone-400 px-3 pb-1">
              Jump to Section Shelf
            </div>
            <div className="flex flex-wrap gap-1 px-3">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    onSelectCategory(cat.id);
                    onClose();
                  }}
                  className="px-2.5 py-1 text-xs border border-stone-200 hover:border-stone-900 hover:bg-stone-50 transition-colors cursor-pointer font-medium text-stone-800"
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="p-3 border-t border-stone-200 bg-stone-50/70 text-[10px] font-mono text-stone-400 flex items-center justify-between">
          <span>Navigate with arrow keys • Enter to select</span>
          <span>Veritas Command Engine</span>
        </div>
      </div>
    </div>
  );
}
