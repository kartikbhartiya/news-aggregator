'use client';

import React, { useState } from 'react';
import { Article } from '@/types/news';
import { 
  X, 
  Trash2, 
  BookOpen, 
  Download, 
  MessageSquare, 
  Search, 
  Check,
  Bookmark
} from 'lucide-react';
import { removeBookmarkFromSupabase, updateBookmarkNotes } from '@/lib/supabase';
import { handleButtonClickGlow } from '@/lib/button-glow';

interface BookmarksDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  bookmarks: Article[];
  onSelectArticle: (article: Article) => void;
  onBookmarkRemoved: (articleId: string) => void;
}

export default function BookmarksDrawer({
  isOpen,
  onClose,
  bookmarks,
  onSelectArticle,
  onBookmarkRemoved,
}: BookmarksDrawerProps) {
  const [filterQuery, setFilterQuery] = useState('');
  const [activeNoteEditId, setActiveNoteEditId] = useState<string | null>(null);
  const [noteText, setNoteText] = useState('');
  const [copiedExport, setCopiedExport] = useState(false);

  if (!isOpen) return null;

  const filteredBookmarks = bookmarks.filter((art) => {
    if (!filterQuery) return true;
    const q = filterQuery.toLowerCase();
    return (
      art.title.toLowerCase().includes(q) ||
      art.description.toLowerCase().includes(q) ||
      art.source.name.toLowerCase().includes(q) ||
      (art.userNotes && art.userNotes.toLowerCase().includes(q))
    );
  });

  const handleRemove = async (articleId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    handleButtonClickGlow(e);
    await removeBookmarkFromSupabase(articleId);
    onBookmarkRemoved(articleId);
  };

  const handleStartEditNote = (article: Article, e: React.MouseEvent) => {
    e.stopPropagation();
    handleButtonClickGlow(e);
    setActiveNoteEditId(article.id);
    setNoteText(article.userNotes || '');
  };

  const handleSaveNote = async (articleId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    handleButtonClickGlow(e);
    await updateBookmarkNotes(articleId, noteText);
    const target = bookmarks.find((b) => b.id === articleId);
    if (target) target.userNotes = noteText;
    setActiveNoteEditId(null);
  };

  const handleExportMarkdown = (e: React.MouseEvent) => {
    handleButtonClickGlow(e);
    const md = `# Prism Intelligence — Curated Reading Dossier
Exported on ${new Date().toLocaleDateString('en-US', { dateStyle: 'full' })}
Total Articles: ${bookmarks.length}

${bookmarks
  .map(
    (b, i) => `### ${i + 1}. ${b.title}
- **Source**: ${b.source.name}
- **Published**: ${b.publishedAt}
- **URL**: ${b.url}
- **Category**: ${b.category}
- **Summary**: ${b.description}
${b.userNotes ? `- **Research Notes**: ${b.userNotes}\n` : ''}`
  )
  .join('\n---\n\n')}`;

    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `prism-dossier-${new Date().toISOString().slice(0, 10)}.md`;
    a.click();
    URL.revokeObjectURL(url);
    setCopiedExport(true);
    setTimeout(() => setCopiedExport(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-zinc-950/40 backdrop-blur-md flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-xl liquid-glass-panel h-full shadow-2xl flex flex-col border-l border-white/60 animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-zinc-200/60 bg-white/70 backdrop-blur-xl flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-zinc-950 text-white flex items-center justify-center shadow-xs">
              <Bookmark className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 font-bold">
                SUPABASE CLOUD DOSSIER
              </div>
              <h3 className="text-lg font-extrabold text-zinc-950 tracking-tight">
                Saved Dispatches ({bookmarks.length})
              </h3>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {bookmarks.length > 0 && (
              <button
                type="button"
                onClick={handleExportMarkdown}
                className="apple-glass-btn apple-btn inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-zinc-700 cursor-pointer"
                title="Export Dossier as Markdown"
              >
                {copiedExport ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Download className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">Export</span>
              </button>
            )}

            <button
              onClick={(e) => {
                handleButtonClickGlow(e);
                onClose();
              }}
              className="apple-glass-btn apple-btn p-2 rounded-xl text-zinc-600 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Search saved items */}
        {bookmarks.length > 0 && (
          <div className="p-3 border-b border-zinc-200/60 bg-white/50">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search saved dispatches or research notes..."
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-white border border-zinc-200/80 rounded-xl text-xs text-zinc-900 focus:outline-none focus:border-zinc-900 shadow-2xs"
              />
            </div>
          </div>
        )}

        {/* Bookmarks List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 divide-y divide-zinc-200/50">
          {bookmarks.length === 0 ? (
            <div className="py-24 text-center">
              <BookOpen className="w-10 h-10 text-zinc-300 mx-auto mb-3" />
              <h4 className="text-base font-bold text-zinc-900">Your Dossier is Empty</h4>
              <p className="mt-1 text-xs text-zinc-500 max-w-xs mx-auto">
                Bookmark dispatches from the live wire. Saved items synchronize to Supabase cloud automatically.
              </p>
            </div>
          ) : filteredBookmarks.length === 0 ? (
            <div className="py-12 text-center text-xs text-zinc-500">
              No saved dispatches match &ldquo;{filterQuery}&rdquo;
            </div>
          ) : (
            filteredBookmarks.map((art) => (
              <div
                key={art.id}
                onClick={(e) => {
                  handleButtonClickGlow(e);
                  onSelectArticle(art);
                  onClose();
                }}
                className="py-4 group hover:bg-white/60 -mx-2 px-3 rounded-2xl transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500 mb-1">
                  <span className="font-bold text-zinc-950 uppercase">{art.source.name}</span>
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-700 text-[10px] uppercase font-semibold">
                      {art.category}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => handleRemove(art.id, e)}
                      className="apple-btn text-zinc-400 hover:text-rose-600 transition-colors p-1"
                      title="Remove from dossier"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h4 className="font-bold text-sm sm:text-base text-zinc-950 group-hover:text-zinc-600 transition-colors leading-snug">
                  {art.title}
                </h4>

                <p className="mt-1 text-xs text-zinc-600 line-clamp-2 leading-relaxed">
                  {art.description}
                </p>

                {/* Research Notes Section */}
                <div className="mt-2.5 pt-2 border-t border-dashed border-zinc-200">
                  {activeNoteEditId === art.id ? (
                    <div onClick={(e) => e.stopPropagation()} className="space-y-2">
                      <textarea
                        value={noteText}
                        onChange={(e) => setNoteText(e.target.value)}
                        placeholder="Edit your private notes..."
                        rows={2}
                        className="w-full p-2.5 border border-zinc-300 rounded-xl text-xs text-zinc-900 focus:outline-none focus:border-zinc-900 bg-white"
                      />
                      <div className="flex justify-end space-x-2">
                        <button
                          type="button"
                          onClick={() => setActiveNoteEditId(null)}
                          className="apple-btn px-2.5 py-1 text-xs text-zinc-600 hover:bg-zinc-100 rounded-lg"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleSaveNote(art.id, e)}
                          className="apple-prominent-btn apple-btn px-3 py-1 text-xs rounded-lg font-bold"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between">
                      <div className="text-[11px] text-zinc-500 italic flex items-center space-x-1.5">
                        <MessageSquare className="w-3 h-3 text-zinc-400 shrink-0" />
                        <span className="line-clamp-1">
                          {art.userNotes || 'No notes attached yet'}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => handleStartEditNote(art, e)}
                        className="apple-btn text-[11px] font-semibold text-zinc-700 hover:text-zinc-950 underline ml-2 shrink-0"
                      >
                        {art.userNotes ? 'Edit' : '+ Note'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
