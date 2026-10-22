'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Article } from '@/types/news';
import { 
  X, 
  Bookmark, 
  ExternalLink, 
  Share2, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  Type, 
  Check, 
  Clock, 
  ShieldCheck,
  FileText,
  Save,
  MessageSquare
} from 'lucide-react';
import { updateBookmarkNotes, markArticleAsRead } from '@/lib/supabase';

interface ArticleReaderModalProps {
  article: Article | null;
  onClose: () => void;
  isBookmarked: boolean;
  onToggleBookmark: (article: Article) => void;
}

export default function ArticleReaderModal({
  article,
  onClose,
  isBookmarked,
  onToggleBookmark,
}: ArticleReaderModalProps) {
  // Reader display options
  const [fontChoice, setFontChoice] = useState<'serif' | 'sans'>('serif');
  const [fontSize, setFontSize] = useState<'sm' | 'md' | 'lg' | 'xl'>('md');
  const [copiedLink, setCopiedLink] = useState(false);

  // Audio Speech state
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [speechSupported, setSpeechSupported] = useState(false);

  // Notes state
  const [userNotes, setUserNotes] = useState(article?.userNotes || '');
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  const [notesSavedToast, setNotesSavedToast] = useState(false);

  // Keep track of utterance ref
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Mark article as read when opened
  useEffect(() => {
    if (article) {
      markArticleAsRead(article.id);
      setUserNotes(article.userNotes || '');
    }
  }, [article]);

  // Check speech synthesis support
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

  // Keyboard escape listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!article) return null;

  // Handle Text-to-Speech
  const handleToggleSpeech = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    window.speechSynthesis.cancel();
    const textToRead = `${article.title}. By ${article.author || article.source.name}. ${article.description}. ${article.content}`;
    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.rate = playbackSpeed;
    utterance.pitch = 1.0;

    // Try to pick a natural English voice
    const voices = window.speechSynthesis.getVoices();
    const englishVoice = voices.find((v) => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Premium')));
    if (englishVoice) {
      utterance.voice = englishVoice;
    }

    utterance.onend = () => {
      setIsPlayingAudio(false);
    };

    utterance.onerror = () => {
      setIsPlayingAudio(false);
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setIsPlayingAudio(true);
  };

  const handleSpeedCycle = () => {
    const nextSpeed = playbackSpeed === 1 ? 1.25 : playbackSpeed === 1.25 ? 1.5 : 1;
    setPlaybackSpeed(nextSpeed);
    if (isPlayingAudio) {
      // restart with new speed
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

  // Font size class mapping
  const fontSizeClasses = {
    sm: 'text-sm sm:text-base leading-relaxed',
    md: 'text-base sm:text-lg leading-relaxed',
    lg: 'text-lg sm:text-xl leading-relaxed',
    xl: 'text-xl sm:text-2xl leading-loose',
  }[fontSize];

  // Formatted paragraphs
  const paragraphs = article.content
    ? article.content.split(/\n\s*\n/).filter((p) => p.trim().length > 0)
    : [article.description];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white border border-stone-200 shadow-2xl rounded-none my-auto flex flex-col max-h-[92vh] overflow-hidden">
        {/* Sticky Editorial Header */}
        <div className="shrink-0 px-4 sm:px-8 py-3.5 border-b border-stone-200 bg-white/95 backdrop-blur-sm flex items-center justify-between gap-4 z-20">
          {/* Source & Reliability */}
          <div className="flex items-center space-x-3">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-stone-900">
              {article.source.name}
            </span>
            <span className="text-stone-300">•</span>
            <span className="inline-flex items-center text-[11px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 border border-emerald-200">
              <ShieldCheck className="w-3 h-3 mr-1 text-emerald-600" />
              {article.source.credibilityScore || 96}% Verified Wire
            </span>
          </div>

          {/* Reader Controls */}
          <div className="flex items-center space-x-2">
            {/* Audio Reader */}
            {speechSupported && (
              <div className="inline-flex items-center border border-stone-200 rounded-none bg-stone-50">
                <button
                  type="button"
                  onClick={handleToggleSpeech}
                  className={`px-2.5 py-1.5 text-xs font-medium inline-flex items-center space-x-1.5 transition-colors cursor-pointer ${
                    isPlayingAudio
                      ? 'bg-amber-100 text-amber-950 font-semibold'
                      : 'text-stone-700 hover:bg-stone-100'
                  }`}
                  title="Listen to dispatch audio readout"
                >
                  {isPlayingAudio ? (
                    <>
                      <Pause className="w-3.5 h-3.5 text-amber-900" />
                      <span>Pause Audio</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 text-stone-700" />
                      <span>Audio Narration</span>
                    </>
                  )}
                </button>
                {isPlayingAudio && (
                  <button
                    type="button"
                    onClick={handleSpeedCycle}
                    className="px-2 py-1.5 border-l border-stone-200 text-[10px] font-mono text-stone-600 hover:bg-stone-100 cursor-pointer"
                  >
                    {playbackSpeed}x
                  </button>
                )}
              </div>
            )}

            {/* Typography Serif/Sans Toggle */}
            <div className="hidden sm:inline-flex items-center border border-stone-200 bg-stone-50 text-xs">
              <button
                type="button"
                onClick={() => setFontChoice('serif')}
                className={`px-2 py-1.5 font-serif cursor-pointer ${
                  fontChoice === 'serif' ? 'bg-white font-bold text-stone-900 shadow-xs' : 'text-stone-500'
                }`}
              >
                Serif
              </button>
              <button
                type="button"
                onClick={() => setFontChoice('sans')}
                className={`px-2 py-1.5 font-sans cursor-pointer ${
                  fontChoice === 'sans' ? 'bg-white font-bold text-stone-900 shadow-xs' : 'text-stone-500'
                }`}
              >
                Sans
              </button>
            </div>

            {/* Text Size Controls */}
            <div className="hidden sm:inline-flex items-center border border-stone-200 bg-stone-50 text-xs">
              <button
                type="button"
                onClick={() => setFontSize(fontSize === 'xl' ? 'lg' : fontSize === 'lg' ? 'md' : 'sm')}
                className="px-2 py-1.5 text-stone-600 hover:bg-stone-100 cursor-pointer"
                title="Decrease font size"
              >
                A-
              </button>
              <button
                type="button"
                onClick={() => setFontSize(fontSize === 'sm' ? 'md' : fontSize === 'md' ? 'lg' : 'xl')}
                className="px-2 py-1.5 text-stone-600 hover:bg-stone-100 cursor-pointer"
                title="Increase font size"
              >
                A+
              </button>
            </div>

            {/* Save to Supabase Bookmark */}
            <button
              type="button"
              onClick={() => onToggleBookmark(article)}
              className={`p-2 border transition-colors cursor-pointer ${
                isBookmarked
                  ? 'bg-amber-50 text-amber-900 border-amber-300'
                  : 'bg-white hover:bg-stone-100 text-stone-600 border-stone-200'
              }`}
              title={isBookmarked ? 'Saved in Dossier' : 'Save to Dossier'}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-600 text-amber-600' : ''}`} />
            </button>

            {/* Copy Link */}
            <button
              type="button"
              onClick={handleCopyLink}
              className="p-2 bg-white hover:bg-stone-100 border border-stone-200 text-stone-600 transition-colors cursor-pointer"
              title="Copy link"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
            </button>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="p-2 bg-white hover:bg-stone-100 border border-stone-200 text-stone-800 transition-colors cursor-pointer"
              title="Close reader (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Reader Body */}
        <div className="overflow-y-auto px-6 sm:px-12 md:px-16 py-8 sm:py-10 bg-white">
          <div className="max-w-2xl mx-auto">
            {/* Meta Top Line */}
            <div className="flex flex-wrap items-center space-x-2 text-xs font-mono uppercase tracking-wider text-stone-500 mb-4">
              <span className="font-semibold text-stone-900">{article.category}</span>
              <span>•</span>
              <span>{new Date(article.publishedAt).toLocaleDateString('en-US', { dateStyle: 'long' })}</span>
              <span>•</span>
              <span className="inline-flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                {article.readTime} min read
              </span>
            </div>

            {/* Article Title */}
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl leading-tight text-stone-950 font-normal tracking-tight">
              {article.title}
            </h1>

            {/* Byline & Author */}
            <div className="mt-4 pb-6 border-b border-stone-200 flex items-center justify-between flex-wrap gap-2 text-xs text-stone-600">
              <div>
                <span className="text-stone-400">By </span>
                <span className="font-semibold text-stone-900">{article.author || article.source.name}</span>
                <span className="text-stone-400"> for </span>
                <span className="text-stone-800 font-medium">{article.source.name}</span>
              </div>
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1 text-stone-900 font-medium hover:underline text-xs"
              >
                <span>Original Publication</span>
                <ExternalLink className="w-3 h-3 ml-0.5" />
              </a>
            </div>

            {/* Lead Image if available */}
            {article.imageUrl && (
              <figure className="my-7">
                <div className="aspect-[16/10] overflow-hidden bg-stone-100 border border-stone-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={article.imageUrl}
                    alt={article.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <figcaption className="mt-2 text-[11px] font-mono text-stone-500 text-right">
                  Archival Photography / Wire Dispatch Record
                </figcaption>
              </figure>
            )}

            {/* Bullet takeaways box */}
            {article.bulletPoints && article.bulletPoints.length > 0 && (
              <div className="my-6 p-4 sm:p-5 bg-stone-50 border-l-2 border-stone-900">
                <div className="text-[11px] font-mono uppercase font-bold tracking-wider text-stone-900 mb-2">
                  Executive Dispatch Takeaways
                </div>
                <ul className="space-y-2 text-xs sm:text-sm text-stone-700">
                  {article.bulletPoints.map((bp, i) => (
                    <li key={i} className="flex items-start">
                      <span className="mr-2 text-stone-400 font-bold">—</span>
                      <span>{bp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Main Article Body */}
            <div
              className={`prose prose-stone max-w-none text-stone-800 ${
                fontChoice === 'serif' ? 'font-serif' : 'font-sans'
              } ${fontSizeClasses}`}
            >
              {paragraphs.map((p, idx) => (
                <p key={idx} className={`mb-5 ${idx === 0 ? 'drop-cap' : ''}`}>
                  {p}
                </p>
              ))}
            </div>

            {/* Original Source Callout Box */}
            <div className="mt-10 p-5 border border-stone-200 bg-stone-50/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="text-xs font-mono font-semibold text-stone-900 uppercase">
                  Source Document Verification
                </div>
                <p className="mt-1 text-xs text-stone-600">
                  Aggregated from {article.source.name}. View the unedited original wire reporting directly on their servers.
                </p>
              </div>
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 inline-flex items-center space-x-1.5 px-3 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium tracking-tight transition-colors"
              >
                <span>Open at {article.source.name}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Personal Dossier Research Notes Box */}
            <div className="mt-8 pt-6 border-t border-stone-200">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-mono font-semibold uppercase text-stone-800 flex items-center space-x-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-stone-500" />
                  <span>Dossier Research Notes (Cloud Synced)</span>
                </label>
                {notesSavedToast && (
                  <span className="text-xs font-mono text-emerald-700 inline-flex items-center">
                    <Check className="w-3 h-3 mr-1" /> Saved
                  </span>
                )}
              </div>
              <textarea
                value={userNotes}
                onChange={(e) => setUserNotes(e.target.value)}
                placeholder="Add private commentary, investment notes, or research quotes to persist with this article in Supabase..."
                rows={3}
                className="w-full p-3 bg-stone-50/50 border border-stone-200 text-xs text-stone-900 focus:bg-white focus:outline-none focus:border-stone-900 font-sans"
              />
              <div className="mt-2 flex justify-end">
                <button
                  type="button"
                  onClick={handleSaveNotes}
                  disabled={isSavingNotes}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium cursor-pointer transition-colors"
                >
                  <Save className="w-3 h-3" />
                  <span>{isSavingNotes ? 'Saving to Cloud...' : 'Save Notes'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
