'use client';

import React, { useState, useEffect } from 'react';
import { Article } from '@/types/news';
import { 
  X, 
  ChevronUp, 
  ChevronDown, 
  Volume2, 
  VolumeX, 
  Bookmark, 
  Share2, 
  Sparkles, 
  ArrowUpRight, 
  Flame,
  Check
} from 'lucide-react';
import { handleButtonClickGlow } from '@/lib/button-glow';

interface NewsShortsModalProps {
  isOpen: boolean;
  onClose: () => void;
  articles: Article[];
  onOpenArticle: (article: Article) => void;
  onToggleBookmark: (article: Article) => void;
  bookmarkedIds: string[];
}

export default function NewsShortsModal({
  isOpen,
  onClose,
  articles,
  onOpenArticle,
  onToggleBookmark,
  bookmarkedIds,
}: NewsShortsModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  // Filter to stories with images
  const shortStories = articles.filter(a => a.imageUrl || a.isLeadStory || a.bulletPoints?.length).slice(0, 15);
  const current = shortStories[currentIndex] || shortStories[0];

  useEffect(() => {
    if (!isOpen) {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsSpeaking(false);
      return;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowDown') handleNext();
      if (e.key === 'ArrowUp') handlePrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isOpen, currentIndex, shortStories.length]);

  if (!isOpen || !current) return null;

  const handleNext = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setCurrentIndex((prev) => (prev + 1) % shortStories.length);
  };

  const handlePrev = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setCurrentIndex((prev) => (prev - 1 + shortStories.length) % shortStories.length);
  };

  const handleToggleAudio = (e: React.MouseEvent) => {
    handleButtonClickGlow(e);
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      window.speechSynthesis.cancel();
      const textToRead = `${current.title}. Key takeaways: ${(current.bulletPoints || []).join('. ') || current.description}`;
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.rate = 1.05;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  const handleShare = (e: React.MouseEvent) => {
    handleButtonClickGlow(e);
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(current.url || window.location.href);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    }
  };

  const isBookmarked = bookmarkedIds.includes(current.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-zinc-950/85 backdrop-blur-xl animate-in fade-in duration-200">
      {/* Shorts Container — 9:16 Aspect Ratio Frame */}
      <div 
        className="relative w-full h-full sm:h-[88vh] sm:max-w-sm sm:rounded-[36px] overflow-hidden bg-zinc-950 text-white shadow-2xl flex flex-col justify-between border sm:border-zinc-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Full Bleed Background Image with Gradient Overlay */}
        <div className="absolute inset-0 pointer-events-none">
          {current.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={`/api/proxy-image?url=${encodeURIComponent(current.imageUrl)}`}
              alt={current.title}
              className="w-full h-full object-cover opacity-50 scale-105"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-zinc-900 to-zinc-950" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/70 to-zinc-950/40" />
        </div>

        {/* Top Header Bar */}
        <div className="relative z-20 p-5 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-1 rounded-full bg-amber-400 text-zinc-950 text-[10px] font-mono font-bold flex items-center space-x-1 shadow-sm">
              <Flame className="w-3 h-3 fill-zinc-950" />
              <span>PRISM SHORTS</span>
            </span>
            <span className="text-[11px] font-mono text-zinc-300 font-medium">
              {currentIndex + 1} / {shortStories.length}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Story Body & AI Distillation */}
        <div className="relative z-20 px-6 py-4 space-y-4">
          {/* Source & Category Pill */}
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 rounded-full bg-white/95 text-zinc-950 text-xs font-bold shadow-md">
              {current.source.name}
            </span>
            <span className="px-2 py-0.5 rounded-full bg-white/10 text-emerald-400 font-mono text-[10px] font-bold uppercase border border-white/10">
              {current.category}
            </span>
          </div>

          {/* Headline */}
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight leading-snug text-white drop-shadow-md">
            {current.title}
          </h2>

          {/* AI Bullet Takeaways */}
          <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 space-y-2">
            <div className="text-[10px] font-mono uppercase tracking-wider text-amber-300 font-bold flex items-center space-x-1">
              <Sparkles className="w-3 h-3" />
              <span>QUICK AI INTELLIGENCE</span>
            </div>
            <ul className="space-y-1.5 text-xs text-zinc-200 leading-relaxed font-sans">
              {(current.bulletPoints && current.bulletPoints.length > 0
                ? current.bulletPoints
                : [
                    current.description || 'Verified signal dispatched by institutional news wire.',
                    'Strategic market and industrial policy ramifications actively tracked.',
                  ]
              ).slice(0, 3).map((bp, i) => (
                <li key={i} className="flex items-start space-x-2">
                  <span className="text-emerald-400 font-bold mt-0.5">•</span>
                  <span>{bp}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Actions & Reader Trigger */}
        <div className="relative z-20 p-5 space-y-3">
          {/* Action Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {/* TTS Listen Button */}
              <button
                type="button"
                onClick={handleToggleAudio}
                className={`apple-btn p-3 rounded-full transition-all cursor-pointer flex items-center space-x-1.5 text-xs font-bold ${
                  isSpeaking ? 'bg-emerald-500 text-zinc-950 shadow-md' : 'bg-white/10 text-white hover:bg-white/20'
                }`}
                title={isSpeaking ? 'Stop Audio' : 'Listen to Short'}
              >
                {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                <span>{isSpeaking ? 'Listening' : 'Listen'}</span>
              </button>

              {/* Bookmark Button */}
              <button
                type="button"
                onClick={() => onToggleBookmark(current)}
                className={`apple-btn p-3 rounded-full transition-all cursor-pointer ${
                  isBookmarked ? 'bg-amber-400 text-zinc-950 shadow-md' : 'bg-white/10 text-white hover:bg-white/20'
                }`}
                title={isBookmarked ? 'Saved to Dossier' : 'Save'}
              >
                <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-zinc-950' : ''}`} />
              </button>

              {/* Share Button */}
              <button
                type="button"
                onClick={handleShare}
                className="apple-btn p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all cursor-pointer"
                title="Copy Link"
              >
                {copiedShare ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
              </button>
            </div>

            {/* Read Full Ad-Free Story Button */}
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenArticle(current);
              }}
              className="apple-prominent-btn apple-btn px-4 py-2.5 rounded-full text-xs font-bold text-white bg-white/20 hover:bg-white hover:text-zinc-950 transition-all cursor-pointer flex items-center space-x-1 border border-white/20"
            >
              <span>Full Story</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Vertical Swipe Navigation Arrows */}
          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="apple-btn px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/15 text-xs text-zinc-400 hover:text-white transition-all disabled:opacity-20 cursor-pointer flex items-center space-x-1"
            >
              <ChevronUp className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <span className="text-[10px] font-mono text-zinc-500">
              Press ↑ / ↓ or Swipe
            </span>

            <button
              type="button"
              onClick={handleNext}
              className="apple-btn px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/15 text-xs text-zinc-400 hover:text-white transition-all cursor-pointer flex items-center space-x-1"
            >
              <span>Next</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
