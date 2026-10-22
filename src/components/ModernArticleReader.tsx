'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Article } from '@/types/news';
import { 
  X, 
  Bookmark, 
  ExternalLink, 
  Share2, 
  Play, 
  Pause, 
  Check, 
  Clock, 
  ShieldCheck,
  Save,
  MessageSquare,
  Sparkles,
  Volume2
} from 'lucide-react';
import { updateBookmarkNotes, markArticleAsRead } from '@/lib/supabase';

interface ModernArticleReaderProps {
  article: Article | null;
  onClose: () => void;
  isBookmarked: boolean;
  onToggleBookmark: (article: Article) => void;
}

export default function ModernArticleReader({
  article,
  onClose,
  isBookmarked,
  onToggleBookmark,
}: ModernArticleReaderProps) {
  const [fontSize, setFontSize] = useState<'sm' | 'md' | 'lg'>('md');
  const [copiedLink, setCopiedLink] = useState(false);

  // Audio Speech state
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [speechSupported, setSpeechSupported] = useState(false);

  // Notes state
  const [userNotes, setUserNotes] = useState(article?.userNotes || '');
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  const [notesSavedToast, setNotesSavedToast] = useState(false);

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (article) {
      markArticleAsRead(article.id);
      setUserNotes(article.userNotes || '');
    }
  }, [article]);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setSpeechSupported(true);
    }
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!article) return null;

  const handleToggleSpeech = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    window.speechSynthesis.cancel();
    const textToRead = `${article.title}. Reported by ${article.author || article.source.name}. ${article.description}. ${article.content}`;
    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.rate = playbackSpeed;

    const voices = window.speechSynthesis.getVoices();
    const englishVoice = voices.find((v) => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google')));
    if (englishVoice) utterance.voice = englishVoice;

    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setIsPlayingAudio(true);
  };

  const handleSpeedCycle = () => {
    const nextSpeed = playbackSpeed === 1 ? 1.25 : playbackSpeed === 1.25 ? 1.5 : 1;
    setPlaybackSpeed(nextSpeed);
    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      setTimeout(handleToggleSpeech, 100);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(article.url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleSaveNotes = async () => {
    setIsSavingNotes(true);
    await updateBookmarkNotes(article.id, userNotes);
    setIsSavingNotes(false);
    setNotesSavedToast(true);
    setTimeout(() => setNotesSavedToast(false), 2000);
  };

  const fontSizeClasses = {
    sm: 'text-sm leading-relaxed',
    md: 'text-base leading-relaxed',
    lg: 'text-lg leading-loose',
  }[fontSize];

  const paragraphs = article.content
    ? article.content.split(/\n\s*\n/).filter((p) => p.trim().length > 0)
    : [article.description];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-zinc-900/40 backdrop-blur-sm flex justify-center sm:justify-end p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white sm:rounded-3xl shadow-2xl flex flex-col h-full sm:h-[95vh] my-auto overflow-hidden border border-zinc-200 animate-in slide-in-from-right duration-300">
        {/* Sticky Modern Reader Header */}
        <div className="shrink-0 px-6 py-4 border-b border-zinc-200/80 bg-white/95 backdrop-blur-md flex items-center justify-between gap-4 z-20">
          {/* Source & Verified Pill */}
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-1 rounded-full bg-zinc-100 text-zinc-900 text-xs font-bold tracking-tight">
              {article.source.name}
            </span>
            <span className="hidden sm:inline-flex items-center text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/70">
              <ShieldCheck className="w-3 h-3 mr-1 text-emerald-600" />
              Verified Wire
            </span>
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-1.5">
            {/* Audio Voice Player */}
            {speechSupported && (
              <div className="inline-flex items-center rounded-xl bg-zinc-100 p-0.5 border border-zinc-200/60">
                <button
                  type="button"
                  onClick={handleToggleSpeech}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-lg inline-flex items-center space-x-1.5 transition-colors cursor-pointer ${
                    isPlayingAudio
                      ? 'bg-zinc-950 text-white shadow-xs'
                      : 'text-zinc-700 hover:bg-white'
                  }`}
                >
                  {isPlayingAudio ? (
                    <>
                      <Pause className="w-3.5 h-3.5" />
                      <span>Pause</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 text-zinc-900" />
                      <span>Listen</span>
                    </>
                  )}
                </button>
                {isPlayingAudio && (
                  <button
                    type="button"
                    onClick={handleSpeedCycle}
                    className="px-2 py-1 text-[11px] font-mono text-zinc-600 hover:text-zinc-950 cursor-pointer"
                  >
                    {playbackSpeed}x
                  </button>
                )}
              </div>
            )}

            {/* Font Scaler */}
            <div className="hidden sm:inline-flex items-center rounded-xl bg-zinc-100 p-0.5 border border-zinc-200/60 text-xs">
              <button
                type="button"
                onClick={() => setFontSize(fontSize === 'lg' ? 'md' : 'sm')}
                className="px-2 py-1 rounded-lg text-zinc-600 hover:bg-white cursor-pointer"
              >
                A-
              </button>
              <button
                type="button"
                onClick={() => setFontSize(fontSize === 'sm' ? 'md' : 'lg')}
                className="px-2 py-1 rounded-lg text-zinc-600 hover:bg-white cursor-pointer"
              >
                A+
              </button>
            </div>

            {/* Bookmark */}
            <button
              type="button"
              onClick={() => onToggleBookmark(article)}
              className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                isBookmarked
                  ? 'bg-amber-50 text-amber-700 border-amber-300'
                  : 'bg-white hover:bg-zinc-100 text-zinc-600 border-zinc-200'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-500' : ''}`} />
            </button>

            {/* Share */}
            <button
              type="button"
              onClick={handleCopyLink}
              className="p-2 rounded-xl bg-white hover:bg-zinc-100 border border-zinc-200 text-zinc-600 transition-colors cursor-pointer"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
            </button>

            {/* Close */}
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-white hover:bg-zinc-100 border border-zinc-200 text-zinc-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Reader Body */}
        <div className="overflow-y-auto px-6 sm:px-10 py-8 space-y-6">
          {/* Header Metadata */}
          <div>
            <div className="flex items-center space-x-2 text-xs font-semibold text-zinc-400 uppercase tracking-wide mb-2">
              <span className="text-zinc-900">{article.category}</span>
              <span>•</span>
              <span className="font-mono text-zinc-500">
                {new Date(article.publishedAt).toLocaleDateString('en-US', { dateStyle: 'medium' })}
              </span>
              <span>•</span>
              <span className="inline-flex items-center font-mono text-zinc-500">
                <Clock className="w-3 h-3 mr-1" />
                {article.readTime} min
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 tracking-tight leading-tight">
              {article.title}
            </h1>

            <div className="mt-3 flex items-center justify-between text-xs text-zinc-500 border-b border-zinc-150 pb-4">
              <span>By <strong className="text-zinc-900">{article.author || article.source.name}</strong></span>
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1 text-zinc-900 font-semibold hover:underline"
              >
                <span>Original Link</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Cover Media */}
          {article.imageUrl && (
            <div className="aspect-[16/10] rounded-2xl overflow-hidden bg-zinc-100 border border-zinc-200/80">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={article.imageUrl}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Key Takeaways Card */}
          {article.bulletPoints && article.bulletPoints.length > 0 && (
            <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/80 space-y-2">
              <div className="flex items-center space-x-1.5 text-xs font-bold text-zinc-900">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>AI Key Takeaways</span>
              </div>
              <ul className="space-y-1.5 text-xs text-zinc-700">
                {article.bulletPoints.map((bp, i) => (
                  <li key={i} className="flex items-start">
                    <span className="mr-2 text-emerald-500 font-bold">•</span>
                    <span>{bp}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Main Body */}
          <div className={`text-zinc-800 ${fontSizeClasses} space-y-4 font-normal`}>
            {paragraphs.map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}
          </div>

          {/* Original Source Callout */}
          <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/70 flex items-center justify-between">
            <div className="text-xs text-zinc-600">
              Wire report indexed from <strong>{article.source.name}</strong>.
            </div>
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-zinc-950 text-white text-xs font-semibold hover:bg-zinc-800 transition-colors"
            >
              <span>Visit Publisher</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Supabase Research Notes Box */}
          <div className="pt-4 border-t border-zinc-150 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-zinc-900 flex items-center space-x-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-zinc-500" />
                <span>Private Notes (Supabase Cloud Synced)</span>
              </label>
              {notesSavedToast && (
                <span className="text-xs text-emerald-700 font-medium inline-flex items-center">
                  <Check className="w-3 h-3 mr-1" /> Saved
                </span>
              )}
            </div>
            <textarea
              value={userNotes}
              onChange={(e) => setUserNotes(e.target.value)}
              placeholder="Save your personal insights, investment takeaways, or follow-ups here..."
              rows={3}
              className="w-full p-3 bg-zinc-50 border border-zinc-200/80 rounded-xl text-xs text-zinc-900 focus:bg-white focus:outline-none focus:border-zinc-900 transition-colors"
            />
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleSaveNotes}
                disabled={isSavingNotes}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-semibold rounded-xl cursor-pointer transition-colors shadow-xs"
              >
                <Save className="w-3 h-3" />
                <span>{isSavingNotes ? 'Saving...' : 'Save to Cloud'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
