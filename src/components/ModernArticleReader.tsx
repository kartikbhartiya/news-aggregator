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
import { handleButtonClickGlow } from '@/lib/button-glow';

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

  // Groq AI dynamic summary
  const [groqSummary, setGroqSummary] = useState<{ keyTakeaway?: string; bulletPoints?: string[] } | null>(null);
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (article) {
      markArticleAsRead(article.id);
      setUserNotes(article.userNotes || '');
      setGroqSummary(null);
    }
  }, [article]);

  const handleFetchGroqSummary = async () => {
    if (!article) return;
    setIsLoadingSummary(true);
    try {
      const res = await fetch('/api/news/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: article.title,
          content: article.content || article.description,
          sourceName: article.source.name,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setGroqSummary(data);
      }
    } catch (err) {
      console.error('Groq summary error:', err);
    } finally {
      setIsLoadingSummary(false);
    }
  };

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

  const handleToggleSpeech = (e: any) => {
    handleButtonClickGlow(e);
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    window.speechSynthesis.cancel();
    const textToRead = `${article.title}. Dispatched by ${article.author || article.source.name}. ${article.description}. ${article.content}`;
    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.rate = playbackSpeed;

    const voices = window.speechSynthesis.getVoices();
    const englishVoice = voices.find((v: any) => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha')));
    if (englishVoice) utterance.voice = englishVoice;

    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setIsPlayingAudio(true);
  };

  const handleSpeedCycle = (e: React.MouseEvent) => {
    handleButtonClickGlow(e);
    const nextSpeed = playbackSpeed === 1 ? 1.25 : playbackSpeed === 1.25 ? 1.5 : 1;
    setPlaybackSpeed(nextSpeed);
    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      setTimeout(() => handleToggleSpeech(e), 100);
    }
  };

  const handleCopyLink = (e: React.MouseEvent) => {
    handleButtonClickGlow(e);
    navigator.clipboard.writeText(article.url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleSaveNotes = async (e: React.MouseEvent) => {
    handleButtonClickGlow(e);
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-zinc-950/40 backdrop-blur-md flex justify-center sm:justify-end p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl liquid-glass-panel sm:rounded-[36px] shadow-2xl flex flex-col h-full sm:h-[95vh] my-auto overflow-hidden border border-white/70 animate-in slide-in-from-right duration-300">
        {/* Sticky Modern Reader Header */}
        <div className="shrink-0 px-6 py-4 border-b border-zinc-200/60 bg-white/75 backdrop-blur-xl flex items-center justify-between gap-4 z-20">
          {/* Source & Verified Pill */}
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 rounded-full bg-zinc-900 text-white text-xs font-bold tracking-tight shadow-2xs">
              {article.source.name}
            </span>
            <span className="hidden sm:inline-flex items-center text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/70">
              <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-600" />
              Verified Wire
            </span>
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-1.5">
            {/* Audio Voice Player */}
            {speechSupported && (
              <div className="inline-flex items-center rounded-xl bg-white/80 p-0.5 border border-zinc-200/70 shadow-2xs">
                <button
                  type="button"
                  onClick={handleToggleSpeech}
                  className={`apple-btn px-2.5 py-1 text-xs font-semibold rounded-lg inline-flex items-center space-x-1.5 transition-colors cursor-pointer ${
                    isPlayingAudio
                      ? 'bg-zinc-950 text-white shadow-xs'
                      : 'text-zinc-700 hover:bg-zinc-100'
                  }`}
                >
                  {isPlayingAudio ? (
                    <>
                      <Pause className="w-3.5 h-3.5 text-emerald-400" />
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
                    className="apple-btn px-2 py-1 text-[10px] font-mono text-zinc-600 hover:text-zinc-950 cursor-pointer"
                  >
                    {playbackSpeed}x
                  </button>
                )}
              </div>
            )}

            {/* Font Scaler */}
            <div className="hidden sm:inline-flex items-center rounded-xl bg-white/80 p-0.5 border border-zinc-200/70 text-xs shadow-2xs">
              <button
                type="button"
                onClick={() => setFontSize(fontSize === 'lg' ? 'md' : 'sm')}
                className="apple-btn px-2 py-1 rounded-lg text-zinc-600 hover:bg-zinc-100 cursor-pointer font-bold"
              >
                A-
              </button>
              <button
                type="button"
                onClick={() => setFontSize(fontSize === 'sm' ? 'md' : 'lg')}
                className="apple-btn px-2 py-1 rounded-lg text-zinc-600 hover:bg-zinc-100 cursor-pointer font-bold"
              >
                A+
              </button>
            </div>

            {/* Bookmark */}
            <button
              type="button"
              onClick={(e) => {
                handleButtonClickGlow(e);
                onToggleBookmark(article);
              }}
              className={`apple-glass-btn apple-btn p-2 rounded-xl transition-colors cursor-pointer ${
                isBookmarked ? 'bg-amber-100 text-amber-800 border-amber-300' : 'text-zinc-600'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-500 text-amber-500' : ''}`} />
            </button>

            {/* Share */}
            <button
              type="button"
              onClick={handleCopyLink}
              className="apple-glass-btn apple-btn p-2 rounded-xl text-zinc-600 transition-colors cursor-pointer"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
            </button>

            {/* Close */}
            <button
              type="button"
              onClick={(e) => {
                handleButtonClickGlow(e);
                onClose();
              }}
              className="apple-glass-btn apple-btn p-2 rounded-xl text-zinc-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Reader Body */}
        <div className="overflow-y-auto px-6 sm:px-10 py-8 space-y-6">
          {/* Header Metadata */}
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-zinc-400 uppercase tracking-wide mb-2">
              <span className="text-zinc-950">{article.category}</span>
              <span>•</span>
              <span className="font-mono text-zinc-500">
                {new Date(article.publishedAt).toLocaleDateString('en-US', { dateStyle: 'medium' })}
              </span>
              <span>•</span>
              <span className="inline-flex items-center font-mono text-zinc-500">
                <Clock className="w-3 h-3 mr-1" />
                {article.readTime} min read
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 tracking-tight leading-tight">
              {article.title}
            </h1>

            <div className="mt-3 flex items-center justify-between text-xs text-zinc-500 border-b border-zinc-200/60 pb-4">
              <span>By <strong className="text-zinc-900">{article.author || article.source.name}</strong></span>
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1 text-zinc-900 font-semibold hover:underline"
              >
                <span>Original Wire</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Cover Media */}
          {article.imageUrl && (
            <div className="aspect-[16/10] rounded-3xl overflow-hidden bg-zinc-100 border border-white/70 shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={article.imageUrl}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Groq AI Key Takeaways Card */}
          <div className="p-5 rounded-3xl bg-zinc-50 border border-zinc-200/80 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs font-bold text-zinc-950 font-mono uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>Executive AI Distillation (Groq)</span>
              </div>
              <button
                type="button"
                onClick={handleFetchGroqSummary}
                disabled={isLoadingSummary}
                className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 disabled:opacity-40 cursor-pointer flex items-center space-x-1"
              >
                <span>{isLoadingSummary ? 'Synthesizing...' : 'Re-Synthesize'}</span>
              </button>
            </div>

            {groqSummary?.keyTakeaway && (
              <p className="text-xs font-semibold text-zinc-900 border-l-2 border-emerald-500 pl-2.5 py-0.5 italic">
                "{groqSummary.keyTakeaway}"
              </p>
            )}

            <ul className="space-y-1.5 text-xs text-zinc-700 font-sans">
              {(groqSummary?.bulletPoints || article.bulletPoints || [
                `${article.title} reported by ${article.source.name}.`,
                'High-confidence verified wire dispatch.',
                'Actionable market and industry policy signals.',
              ]).map((bp, i) => (
                <li key={i} className="flex items-start space-x-2">
                  <span className="text-emerald-600 font-bold">•</span>
                  <span>{bp}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Main Body */}
          <div className={`text-zinc-800 ${fontSizeClasses} space-y-4 font-normal`}>
            {paragraphs.map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}
          </div>

          {/* Original Source Callout */}
          <div className="p-4.5 rounded-3xl bg-white/80 border border-zinc-200/70 flex items-center justify-between shadow-xs">
            <div className="text-xs text-zinc-600">
              Wire report indexed from <strong>{article.source.name}</strong>.
            </div>
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="apple-prominent-btn apple-btn inline-flex items-center space-x-1 px-3.5 py-2 rounded-xl text-xs font-semibold shadow-xs"
            >
              <span>Visit Publisher</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Supabase Research Notes Box */}
          <div className="pt-4 border-t border-zinc-200/60 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-zinc-900 flex items-center space-x-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-zinc-500" />
                <span>Private Notes (Supabase Cloud Synced)</span>
              </label>
              {notesSavedToast && (
                <span className="text-xs text-emerald-700 font-bold inline-flex items-center">
                  <Check className="w-3 h-3 mr-1" /> Saved
                </span>
              )}
            </div>
            <textarea
              value={userNotes}
              onChange={(e) => setUserNotes(e.target.value)}
              placeholder="Save your personal insights, investment takeaways, or follow-ups here..."
              rows={3}
              className="w-full p-3.5 bg-white/80 border border-zinc-200/80 rounded-2xl text-xs text-zinc-900 focus:bg-white focus:outline-none focus:border-zinc-900 transition-colors shadow-2xs"
            />
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleSaveNotes}
                disabled={isSavingNotes}
                className="apple-prominent-btn apple-btn inline-flex items-center space-x-1.5 px-4 py-2 text-xs font-semibold rounded-xl cursor-pointer shadow-xs"
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
