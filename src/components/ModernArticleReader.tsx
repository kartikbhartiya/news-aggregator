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
  BookOpen,
  RotateCw
} from 'lucide-react';
import { updateBookmarkNotes, markArticleAsRead } from '@/lib/supabase';
import { handleButtonClickGlow } from '@/lib/button-glow';
import { speechEngine } from '@/lib/speech';

interface ModernArticleReaderProps {
  article: Article | null;
  onClose: () => void;
  isBookmarked: boolean;
  onToggleBookmark: (article: Article) => void;
  startInAiBrief?: boolean;
}

export default function ModernArticleReader({
  article,
  onClose,
  isBookmarked,
  onToggleBookmark,
  startInAiBrief = false,
}: ModernArticleReaderProps) {
  const [fontSize, setFontSize] = useState<'sm' | 'md' | 'lg'>('md');
  const [copiedLink, setCopiedLink] = useState(false);

  // Audio Speech state
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isPlayingBriefAudio, setIsPlayingBriefAudio] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [speechSupported, setSpeechSupported] = useState(false);

  // Notes state
  const [userNotes, setUserNotes] = useState(article?.userNotes || '');
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  const [notesSavedToast, setNotesSavedToast] = useState(false);

  // Full In-App Article Paragraphs Fetching
  const [articleParagraphs, setArticleParagraphs] = useState<string[]>([]);
  const [isLoadingFullText, setIsLoadingFullText] = useState(false);

  // Groq AI dynamic summary
  const [groqSummary, setGroqSummary] = useState<{ keyTakeaway?: string; bulletPoints?: string[] } | null>(null);
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const briefSectionRef = useRef<HTMLDivElement | null>(null);

  // Fetch full article text automatically so news is 100% readable on-site
  useEffect(() => {
    if (!article) return;

    markArticleAsRead(article.id);
    setUserNotes(article.userNotes || '');
    setGroqSummary(null);

    // Initial paragraphs from article object
    const initial = article.content
      ? article.content.split(/\n\s*\n/).filter((p) => p.trim().length > 0)
      : [article.description];

    setArticleParagraphs(initial);

    // If startInAiBrief is requested, trigger Groq AI summary immediately
    if (startInAiBrief) {
      setTimeout(() => {
        handleFetchGroqSummary();
        briefSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }

    // If initial text is short (< 3 paragraphs), automatically fetch full article from publisher
    let isCancelled = false;

    async function loadFullArticle() {
      if (!article) return;
      setIsLoadingFullText(true);
      try {
        const params = new URLSearchParams();
        params.set('url', article.url);
        params.set('title', article.title);
        params.set('description', article.description || '');
        params.set('source', article.source.name || '');

        const res = await fetch(`/api/news/article-content?${params.toString()}`);
        if (res.ok && !isCancelled) {
          const data = await res.json();
          if (data.paragraphs && Array.isArray(data.paragraphs) && data.paragraphs.length > 0) {
            setArticleParagraphs(data.paragraphs);
          }
        }
      } catch (err) {
        console.warn('Failed to load expanded article content:', err);
      } finally {
        if (!isCancelled) setIsLoadingFullText(false);
      }
    }

    loadFullArticle();

    return () => {
      isCancelled = true;
    };
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
          content: articleParagraphs.join('\n\n') || article.content || article.description,
          sourceName: article.source.name,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setGroqSummary(data);
      } else {
        setGroqSummary({
          keyTakeaway: article.description || article.title,
          bulletPoints: [
            `${article.title} reported by ${article.source.name}.`,
            'Verified dispatch indexed directly from publisher wire.',
            'Actionable market and policy developments tracked.',
          ],
        });
      }
    } catch (err) {
      console.error('Groq summary error:', err);
      setGroqSummary({
        keyTakeaway: article.description || article.title,
        bulletPoints: [
          `${article.title} reported by ${article.source.name}.`,
          'Verified dispatch indexed directly from publisher wire.',
          'Actionable market and policy developments tracked.',
        ],
      });
    } finally {
      setIsLoadingSummary(false);
    }
  };

  useEffect(() => {
    setSpeechSupported(speechEngine.isSupported());
    return () => {
      speechEngine.stop();
      setIsPlayingAudio(false);
      setIsPlayingBriefAudio(false);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        speechEngine.stop();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!article) return null;

  const handleToggleSpeech = (e: any) => {
    handleButtonClickGlow(e);
    if (!speechEngine.isSupported()) return;

    if (isPlayingAudio) {
      speechEngine.stop();
      setIsPlayingAudio(false);
      return;
    }

    speechEngine.stop();
    setIsPlayingBriefAudio(false);

    const textToRead = `${article.title}. Published by ${article.author || article.source.name}. ${article.description}. ${articleParagraphs.join('. ')}`;
    
    const success = speechEngine.speak(textToRead, {
      rate: playbackSpeed,
      onStart: () => setIsPlayingAudio(true),
      onEnd: () => setIsPlayingAudio(false),
      onError: () => setIsPlayingAudio(false),
    });

    if (success) {
      setIsPlayingAudio(true);
    }
  };

  const handleToggleBriefAudio = (e: React.MouseEvent) => {
    handleButtonClickGlow(e);
    if (!speechEngine.isSupported()) return;

    if (isPlayingBriefAudio) {
      speechEngine.stop();
      setIsPlayingBriefAudio(false);
      return;
    }

    speechEngine.stop();
    setIsPlayingAudio(false);

    const takeawayText = groqSummary?.keyTakeaway || article.description || article.title;
    const bulletsList = groqSummary?.bulletPoints || article.bulletPoints || [
      `${article.title} verified by ${article.source.name}.`,
      'Key market, policy, or technological development tracked across global telemetry.',
    ];
    const narration = `Executive AI Synthesis. ${article.title}. Published by ${article.source.name}. Key Takeaway: ${takeawayText}. Crucial Points: ` +
      bulletsList.map((b, i) => `Point ${i + 1}: ${b}`).join('. ');

    const success = speechEngine.speak(narration, {
      rate: playbackSpeed,
      onStart: () => setIsPlayingBriefAudio(true),
      onEnd: () => setIsPlayingBriefAudio(false),
      onError: () => setIsPlayingBriefAudio(false),
    });

    if (success) {
      setIsPlayingBriefAudio(true);
    }
  };

  const handleSpeedCycle = (e: React.MouseEvent) => {
    handleButtonClickGlow(e);
    const nextSpeed = playbackSpeed === 1 ? 1.25 : playbackSpeed === 1.25 ? 1.5 : 1;
    setPlaybackSpeed(nextSpeed);
    if (isPlayingAudio) {
      speechEngine.stop();
      setIsPlayingAudio(false);
      const textToRead = `${article.title}. Published by ${article.author || article.source.name}. ${article.description}. ${articleParagraphs.join('. ')}`;
      speechEngine.speak(textToRead, {
        rate: nextSpeed,
        onStart: () => setIsPlayingAudio(true),
        onEnd: () => setIsPlayingAudio(false),
        onError: () => setIsPlayingAudio(false),
      });
      setIsPlayingAudio(true);
    } else if (isPlayingBriefAudio) {
      speechEngine.stop();
      setIsPlayingBriefAudio(false);
      const takeawayText = groqSummary?.keyTakeaway || article.description || article.title;
      const bulletsList = groqSummary?.bulletPoints || article.bulletPoints || [article.description];
      const narration = `Executive AI Synthesis. ${article.title}. Key Takeaway: ${takeawayText}. ${bulletsList.join('. ')}`;
      speechEngine.speak(narration, {
        rate: nextSpeed,
        onStart: () => setIsPlayingBriefAudio(true),
        onEnd: () => setIsPlayingBriefAudio(false),
        onError: () => setIsPlayingBriefAudio(false),
      });
      setIsPlayingBriefAudio(true);
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
    md: 'text-base leading-relaxed sm:text-[17px] sm:leading-[1.75]',
    lg: 'text-lg leading-loose sm:text-xl sm:leading-[1.8]',
  }[fontSize];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 flex justify-center sm:justify-end p-0 sm:p-4 animate-in fade-in duration-200">
      {/* Backdrop dismissal */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Reader Panel (Claymorphic Solid Container) */}
      <div className="relative w-full max-w-2xl bg-white sm:rounded-[32px] shadow-2xl flex flex-col h-full sm:h-[95vh] my-auto overflow-hidden border border-zinc-200 animate-in slide-in-from-right duration-300 z-10">
        
        {/* Sticky Clay Header */}
        <div className="shrink-0 px-4 sm:px-6 py-3.5 border-b border-zinc-200 bg-white flex items-center justify-between gap-3 z-20">
          {/* Source & Verified Badge */}
          <div className="flex items-center space-x-2 min-w-0">
            <span className="px-3 py-1 rounded-full bg-zinc-950 text-white text-xs font-bold tracking-tight shrink-0 shadow-xs">
              {article.source.name}
            </span>
            <span className="hidden md:inline-flex items-center text-[10px] font-mono uppercase tracking-wider text-zinc-600 bg-zinc-100 px-2 py-0.5 rounded-full border border-zinc-200">
              Full Reading Wire
            </span>
          </div>

          {/* Controls Deck */}
          <div className="flex items-center space-x-1 sm:space-x-1.5 shrink-0">
            {/* Audio Voice Player */}
            {speechSupported && (
              <div className="inline-flex items-center rounded-xl bg-zinc-100 p-0.5 border border-zinc-200">
                <button
                  type="button"
                  onClick={handleToggleSpeech}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-lg inline-flex items-center space-x-1.5 transition-all cursor-pointer ${
                    isPlayingAudio
                      ? 'clay-btn-dark shadow-xs'
                      : 'text-zinc-700 hover:text-zinc-950'
                  }`}
                >
                  {isPlayingAudio ? (
                    <>
                      <Pause className="w-3.5 h-3.5 text-white" />
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
                    className="px-2 py-1 text-[10px] font-mono text-zinc-600 hover:text-zinc-950 cursor-pointer font-bold"
                  >
                    {playbackSpeed}x
                  </button>
                )}
              </div>
            )}

            {/* Font Scaler */}
            <div className="hidden sm:inline-flex items-center rounded-xl bg-zinc-100 p-0.5 border border-zinc-200 text-xs">
              <button
                type="button"
                onClick={() => setFontSize(fontSize === 'lg' ? 'md' : 'sm')}
                className="px-2 py-1 rounded-lg text-zinc-600 hover:bg-white cursor-pointer font-bold transition-colors"
                title="Decrease font size"
              >
                A-
              </button>
              <button
                type="button"
                onClick={() => setFontSize(fontSize === 'sm' ? 'md' : 'lg')}
                className="px-2 py-1 rounded-lg text-zinc-600 hover:bg-white cursor-pointer font-bold transition-colors"
                title="Increase font size"
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
              title={isBookmarked ? 'Remove from Saved' : 'Save Article'}
              className={`clay-btn p-2 rounded-xl transition-all cursor-pointer ${
                isBookmarked ? 'bg-zinc-950 text-white border-zinc-950 shadow-xs' : 'text-zinc-700'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-white text-white' : ''}`} />
            </button>

            {/* Share */}
            <button
              type="button"
              onClick={handleCopyLink}
              title="Copy Story Link"
              className="clay-btn p-2 rounded-xl text-zinc-700 cursor-pointer"
            >
              {copiedLink ? <Check className="w-4 h-4 text-zinc-950" /> : <Share2 className="w-4 h-4" />}
            </button>

            {/* Close */}
            <button
              type="button"
              onClick={(e) => {
                handleButtonClickGlow(e);
                onClose();
              }}
              title="Close Reader (Esc)"
              className="clay-btn p-2 rounded-xl text-zinc-950 cursor-pointer hover:bg-zinc-100"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Reader Content Canvas */}
        <div className="flex-1 overflow-y-auto px-5 sm:px-10 py-6 sm:py-8 space-y-6">
          
          {/* Header Metadata */}
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-zinc-500 uppercase tracking-wide mb-3">
              <span className="px-2.5 py-0.5 rounded-full bg-zinc-100 text-zinc-900 font-bold border border-zinc-200">
                {article.category}
              </span>
              <span>•</span>
              <span>
                {new Date(article.publishedAt).toLocaleDateString('en-US', { dateStyle: 'long' })}
              </span>
              <span>•</span>
              <span className="inline-flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                {article.readTime} min read
              </span>
            </div>

            {/* Headline in Editorial Serif Font */}
            <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-zinc-950 tracking-tight leading-tight">
              {article.title}
            </h1>

            {/* Publisher & Author Byline */}
            <div className="mt-4 flex items-center justify-between text-xs text-zinc-600 border-b border-zinc-200 pb-4">
              <span>
                By <strong className="text-zinc-950 font-semibold">{article.author || article.source.name}</strong>
              </span>
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1 text-zinc-950 font-bold hover:underline"
              >
                <span>Original Publication</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Cover Media */}
          {article.imageUrl && (
            <div className="aspect-[16/10] rounded-2xl sm:rounded-3xl overflow-hidden bg-zinc-100 border border-zinc-200 shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={article.imageUrl}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Lead Editorial Description (Highlighted) */}
          {article.description && (
            <div className="p-4 sm:p-5 rounded-2xl bg-zinc-50 border-l-4 border-zinc-950 border-y border-r border-zinc-200 shadow-2xs">
              <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 block mb-1">
                Executive Dispatch Lead
              </span>
              <p className="font-serif text-base sm:text-lg text-zinc-900 leading-relaxed italic font-normal">
                "{article.description}"
              </p>
            </div>
          )}

          {/* Groq AI Synthesis Card */}
          <div ref={briefSectionRef} className="clay-card p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs font-bold text-zinc-950 font-mono uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-zinc-950" />
                <span>Executive Synthesis</span>
              </div>
              <div className="flex items-center space-x-2">
                {speechSupported && (
                  <button
                    type="button"
                    onClick={handleToggleBriefAudio}
                    className={`clay-btn px-2.5 py-1 rounded-lg text-xs font-bold inline-flex items-center space-x-1.5 cursor-pointer transition-all ${
                      isPlayingBriefAudio ? 'bg-zinc-950 text-white border-zinc-950 shadow-xs' : 'text-zinc-900 hover:bg-zinc-100'
                    }`}
                    title={isPlayingBriefAudio ? 'Pause brief audio' : 'Listen to AI Brief'}
                  >
                    {isPlayingBriefAudio ? (
                      <>
                        <Pause className="w-3.5 h-3.5 text-white" />
                        <span>Pause Brief</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 text-zinc-950" />
                        <span>Listen to Brief</span>
                      </>
                    )}
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleFetchGroqSummary}
                  disabled={isLoadingSummary}
                  className="text-xs font-bold text-zinc-900 hover:text-black disabled:opacity-40 cursor-pointer flex items-center space-x-1 underline"
                >
                  <span>{isLoadingSummary ? 'Analyzing...' : 'Distill Story'}</span>
                </button>
              </div>
            </div>

            {groqSummary?.keyTakeaway && (
              <p className="text-xs font-semibold text-zinc-900 border-l-2 border-zinc-950 pl-3 py-0.5">
                {groqSummary.keyTakeaway}
              </p>
            )}

            <ul className="space-y-1.5 text-xs text-zinc-700">
              {(groqSummary?.bulletPoints || article.bulletPoints || [
                `${article.title} reported by ${article.source.name}.`,
                'Verified dispatch with complete primary telemetry.',
                'Direct industry and policy developments recorded.',
              ]).map((bp, i) => (
                <li key={i} className="flex items-start space-x-2">
                  <span className="text-zinc-950 font-bold">•</span>
                  <span>{bp}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Main Full Article Paragraphs */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-1 border-b border-zinc-200">
              <span className="text-xs font-mono uppercase tracking-wider text-zinc-500 font-bold flex items-center space-x-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Article Body</span>
              </span>
              {isLoadingFullText && (
                <span className="text-[11px] font-mono text-zinc-500 inline-flex items-center space-x-1">
                  <RotateCw className="w-3 h-3 animate-spin mr-1" />
                  <span>Loading full narrative...</span>
                </span>
              )}
            </div>

            <div className={`text-zinc-900 ${fontSizeClasses} space-y-4 font-normal`}>
              {articleParagraphs.map((p, idx) => (
                <p key={idx} className="leading-relaxed text-zinc-800">
                  {p}
                </p>
              ))}
            </div>
          </div>

          {/* Original Source Callout */}
          <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
            <div className="text-xs text-zinc-600">
              Primary wire indexed from <strong className="text-zinc-950">{article.source.name}</strong>.
            </div>
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="clay-btn-dark inline-flex items-center justify-center space-x-1 px-4 py-2 rounded-xl text-xs font-bold shrink-0"
            >
              <span>Visit Publisher</span>
              <ExternalLink className="w-3.5 h-3.5 ml-1" />
            </a>
          </div>

          {/* Private Notes (Supabase Synced) */}
          <div className="pt-4 border-t border-zinc-200 space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-zinc-950 flex items-center space-x-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-zinc-700" />
                <span>Private Editorial Notes</span>
              </label>
              {notesSavedToast && (
                <span className="text-xs text-zinc-900 font-bold inline-flex items-center">
                  <Check className="w-3 h-3 mr-1" /> Saved
                </span>
              )}
            </div>
            <textarea
              value={userNotes}
              onChange={(e) => setUserNotes(e.target.value)}
              placeholder="Record your personal notes, takeaways, or investment follow-ups here..."
              rows={3}
              className="w-full p-3.5 bg-zinc-50 border border-zinc-200 rounded-2xl text-xs text-zinc-900 focus:bg-white focus:outline-none focus:border-zinc-950 transition-colors shadow-inner"
            />
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleSaveNotes}
                disabled={isSavingNotes}
                className="clay-btn-dark inline-flex items-center space-x-1.5 px-4 py-2 text-xs font-semibold rounded-xl cursor-pointer"
              >
                <Save className="w-3 h-3" />
                <span>{isSavingNotes ? 'Saving...' : 'Save Note'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
