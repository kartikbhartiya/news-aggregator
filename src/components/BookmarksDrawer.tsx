'use client';

import React, { useState } from 'react';
import { Article } from '@/types/news';
import { 
  X, 
  Trash2, 
  ExternalLink, 
  BookOpen, 
  Download, 
  FileText, 
  MessageSquare,
  Search,
  Check
} from 'lucide-react';
import { removeBookmarkFromSupabase, updateBookmarkNotes } from '@/lib/supabase';

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
    await removeBookmarkFromSupabase(articleId);
    onBookmarkRemoved(articleId);
  };

  const handleStartEditNote = (article: Article, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveNoteEditId(article.id);
    setNoteText(article.userNotes || '');
  };

  const handleSaveNote = async (articleId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await updateBookmarkNotes(articleId, noteText);
    const target = bookmarks.find((b) => b.id === articleId);
    if (target) target.userNotes = noteText;
    setActiveNoteEditId(null);
  };

  const handleExportMarkdown = () => {
    const md = `# Veritas Dispatch — Curated Reading Dossier
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
    a.download = `veritas-dossier-${new Date().toISOString().slice(0, 10)}.md`;
    a.click();
    URL.revokeObjectURL(url);
    setCopiedExport(true);
    setTimeout(() => setCopiedExport(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-900/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col border-l border-stone-200 animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-stone-200 bg-stone-50/70 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-stone-500">
              SUPABASE CLOUD DOSSIER
            </div>
            <h2 className="font-serif text-xl sm:text-2xl font-normal text-stone-900 mt-0.5">
              Saved Intelligence Records ({bookmarks.length})
            </h2>
          </div>

          <div className="flex items-center space-x-2">
            {bookmarks.length > 0 && (
              <button
                type="button"
                onClick={handleExportMarkdown}
                className="inline-flex items-center space-x-1 px-2.5 py-1.5 text-xs font-medium border border-stone-200 bg-white hover:bg-stone-100 text-stone-700 transition-colors cursor-pointer"
                title="Export Dossier as Markdown"
              >
                {copiedExport ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Download className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">Export</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 text-stone-500 hover:text-stone-900 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search saved items */}
        {bookmarks.length > 0 && (
          <div className="p-3 border-b border-stone-200 bg-stone-50/40">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search saved dispatches or research notes..."
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-white border border-stone-200 text-xs focus:outline-none focus:border-stone-900"
              />
            </div>
          </div>
        )}

        {/* Bookmarks List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 divide-y divide-stone-200">
          {bookmarks.length === 0 ? (
            <div className="py-20 text-center">
              <BookOpen className="w-8 h-8 text-stone-300 mx-auto mb-3" />
              <div className="font-serif text-lg text-stone-800">Your Dossier is Empty</div>
              <p className="mt-1 text-xs text-stone-500 max-w-xs mx-auto">
                Bookmark dispatches from the wire to build your curated research record. Saved items synchronize to Supabase cloud automatically.
              </p>
            </div>
          ) : filteredBookmarks.length === 0 ? (
            <div className="py-12 text-center text-xs text-stone-500">
              No saved dispatches match &ldquo;{filterQuery}&rdquo;
            </div>
          ) : (
            filteredBookmarks.map((art) => (
              <div
                key={art.id}
                onClick={() => {
                  onSelectArticle(art);
                  onClose();
                }}
                className="py-4 group hover:bg-stone-50/80 -mx-2 px-2 transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between text-[10px] font-mono text-stone-500 mb-1">
                  <span className="font-semibold text-stone-800 uppercase">{art.source.name}</span>
                  <div className="flex items-center space-x-2">
                    <span>{art.category}</span>
                    <button
                      type="button"
                      onClick={(e) => handleRemove(art.id, e)}
                      className="text-stone-400 hover:text-rose-600 transition-colors p-1"
                      title="Remove from dossier"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h3 className="font-serif text-base text-stone-900 font-normal group-hover:text-stone-700 leading-snug">
                  {art.title}
                </h3>

                <p className="mt-1 text-xs text-stone-600 line-clamp-2 leading-relaxed font-sans">
                  {art.description}
                </p>

                {/* Research Notes Section */}
                <div className="mt-2.5 pt-2 border-t border-dashed border-stone-200">
                  {activeNoteEditId === art.id ? (
                    <div onClick={(e) => e.stopPropagation()} className="space-y-2">
                      <textarea
                        value={noteText}
                        onChange={(e) => setNoteText(e.target.value)}
                        placeholder="Edit your private notes..."
                        rows={2}
                        className="w-full p-2 border border-stone-300 text-xs text-stone-900 focus:outline-none focus:border-stone-900"
                      />
                      <div className="flex justify-end space-x-2">
                        <button
                          type="button"
                          onClick={() => setActiveNoteEditId(null)}
                          className="px-2 py-1 text-[11px] text-stone-500 hover:bg-stone-100"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleSaveNote(art.id, e)}
                          className="px-2 py-1 text-[11px] bg-stone-900 text-white font-medium"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between">
                      <div className="text-[11px] text-stone-500 italic flex items-center space-x-1">
                        <MessageSquare className="w-3 h-3 text-stone-400 shrink-0" />
                        <span className="line-clamp-1">
                          {art.userNotes || 'No notes attached yet'}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => handleStartEditNote(art, e)}
                        className="text-[10px] font-mono text-stone-400 hover:text-stone-800 underline ml-2 shrink-0"
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
