'use client';

import React, { useState, useEffect } from 'react';
import { Article } from '@/types/news';
import { Bookmark, Clock, ArrowUpRight, ArrowRight, Sparkles, ImageOff } from 'lucide-react';
import { handleButtonClickGlow } from '@/lib/button-glow';

function NoImageFallback({ sourceName, category, className = '' }: { sourceName: string; category?: string; className?: string }) {
  return (
    <div
      className={`relative rounded-2xl overflow-hidden bg-zinc-100 border border-zinc-200 flex flex-col items-center justify-center p-3 select-none ${className}`}
    >
      <div className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold text-zinc-900 bg-white border border-zinc-200 shadow-2xs">
        {sourceName}
      </div>
      {category && (
        <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-zinc-200 text-[9px] font-mono text-zinc-700 uppercase tracking-wider">
          {category}
        </div>
      )}
      <div className="w-9 h-9 rounded-xl bg-white border border-zinc-200 flex items-center justify-center text-zinc-400 mb-1.5 shadow-2xs">
        <ImageOff className="w-4 h-4 text-zinc-400" />
      </div>
      <span className="text-[11px] font-semibold text-zinc-700 tracking-tight">Editorial Wire Dispatch</span>
      <span className="text-[9px] font-mono uppercase tracking-widest text-zinc-400">Full Text Available</span>
    </div>
  );
}

function ArticleThumbnail({ 
  src, 
  alt, 
  badgeText, 
  priorityBadge, 
  className = '' 
}: { 
  src: string; 
  alt: string; 
  badgeText: string; 
  priorityBadge?: string; 
  className?: string; 
}) {
  const [imgError, setImgError] = useState(false);

  if (imgError || !src) {
    return <NoImageFallback sourceName={badgeText} className={className} />;
  }

  return (
    <div className={`relative rounded-2xl overflow-hidden bg-zinc-100 border border-zinc-200 shadow-2xs group select-none ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        onError={() => setImgError(true)}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 block"
      />
      {/* Publisher Badge */}
      <div className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold text-zinc-950 bg-white border border-zinc-200 shadow-xs z-10 truncate max-w-[150px]">
        {badgeText}
      </div>
      {priorityBadge && (
        <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-zinc-950 text-white text-[9px] font-mono font-bold tracking-wider shadow-xs z-10">
          {priorityBadge}
        </div>
      )}
    </div>
  );
}

interface ModernArticleCardProps {
  article: Article;
  variant?: 'hero' | 'grid' | 'row';
  onOpenArticle: (article: Article) => void;
  onOpenAiBrief?: (article: Article) => void;
  onToggleBookmark: (article: Article, e: React.MouseEvent) => void;
  isBookmarked: boolean;
  className?: string;
}

export default function ModernArticleCard({
  article,
  variant = 'grid',
  onOpenArticle,
  onOpenAiBrief,
  onToggleBookmark,
  isBookmarked,
  className = '',
}: ModernArticleCardProps) {
  const [formattedDate, setFormattedDate] = useState<string>('Recently');

  useEffect(() => {
    try {
      const d = new Date(article.publishedAt);
      const diffMs = Date.now() - d.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);

      if (diffMins < 1) setFormattedDate('Just now');
      else if (diffMins < 60) setFormattedDate(`${diffMins}m ago`);
      else if (diffHours < 24) setFormattedDate(`${diffHours}h ago`);
      else setFormattedDate(d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
    } catch {
      setFormattedDate('Recently');
    }
  }, [article.publishedAt]);

  const handleCardClick = (e: React.MouseEvent) => {
    handleButtonClickGlow(e);
    onOpenArticle(article);
  };

  const handleAiBriefClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleButtonClickGlow(e);
    if (onOpenAiBrief) {
      onOpenAiBrief(article);
    } else {
      onOpenArticle(article);
    }
  };

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleButtonClickGlow(e);
    onToggleBookmark(article, e);
  };

  // 1. STREAM ROW VIEW
  if (variant === 'row') {
    return (
      <div
        onClick={handleCardClick}
        className="group px-4 py-3.5 bg-white hover:bg-zinc-50 border-b border-zinc-200 flex items-center justify-between gap-3 transition-all cursor-pointer"
      >
        <div className="flex items-center space-x-3 truncate">
          <span className="shrink-0 px-2 py-0.5 rounded-md bg-zinc-100 text-[10px] font-bold text-zinc-800 uppercase border border-zinc-200">
            {article.category}
          </span>
          <span className="font-serif font-bold text-zinc-950 group-hover:text-zinc-700 text-sm sm:text-base truncate">
            {article.title}
          </span>
          <span className="hidden md:inline text-xs text-zinc-600 truncate max-w-sm">
            {article.description}
          </span>
        </div>

        <div className="shrink-0 flex items-center space-x-2 text-xs text-zinc-500 font-mono">
          <button
            type="button"
            onClick={handleAiBriefClick}
            className="clay-btn px-2.5 py-1 rounded-lg text-xs font-semibold inline-flex items-center space-x-1 cursor-pointer text-zinc-900"
            title="Read AI Brief"
          >
            <Sparkles className="w-3.5 h-3.5 text-zinc-950" />
            <span className="hidden sm:inline">AI Brief</span>
          </button>
          <span className="text-zinc-900 font-bold hidden sm:inline">{article.source.name}</span>
          <span>{formattedDate}</span>
          <button
            type="button"
            onClick={handleBookmarkClick}
            className="p-1 text-zinc-500 hover:text-zinc-950 cursor-pointer"
          >
            <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-zinc-950 text-zinc-950' : ''}`} />
          </button>
        </div>
      </div>
    );
  }

  // 2. UNIFORM GRID CARD (Every card identical in size: h-[450px] w-full)
  return (
    <div
      onClick={handleCardClick}
      className={`group clay-card p-4 sm:p-5 flex flex-col justify-between h-[450px] w-full cursor-pointer overflow-hidden ${className}`}
    >
      <div>
        {/* Fixed Uniform Thumbnail (Height 176px / 11rem) */}
        <div className="h-44 w-full mb-3 shrink-0 relative">
          {article.imageUrl && article.imageUrl.trim() !== '' ? (
            <ArticleThumbnail
              src={article.imageUrl}
              alt={article.title}
              badgeText={article.source.name}
              className="h-full w-full"
            />
          ) : (
            <NoImageFallback
              sourceName={article.source.name}
              category={article.category}
              className="h-full w-full"
            />
          )}
        </div>

        {/* Metadata Row (Fixed Height) */}
        <div className="h-5 flex items-center space-x-2 text-[11px] mb-1.5 shrink-0">
          <span className="font-mono font-bold text-zinc-950 uppercase tracking-wider text-[10px]">
            {article.category}
          </span>
          <span className="text-zinc-300">•</span>
          <span className="text-zinc-500 font-mono text-[10px]">{formattedDate}</span>
          <span className="text-zinc-300">•</span>
          <span className="text-[10px] font-mono text-zinc-500">{article.readTime}m read</span>
        </div>

        {/* Title (Fixed 2-Line Height) */}
        <h3 className="font-serif font-bold text-base sm:text-lg text-zinc-950 tracking-tight leading-snug line-clamp-2 h-[3.25rem] overflow-hidden shrink-0 group-hover:text-zinc-700 transition-colors">
          {article.title}
        </h3>

        {/* Description Excerpt (Fixed 3-Line Height) */}
        <p className="mt-1 text-zinc-600 text-xs sm:text-sm leading-relaxed line-clamp-3 h-[3.75rem] overflow-hidden font-normal shrink-0">
          {article.description}
        </p>
      </div>

      {/* Footer Meta & Working AI Brief Button (Pinned to Bottom) */}
      <div className="mt-auto pt-2.5 border-t border-zinc-200 flex items-center justify-between text-xs text-zinc-500 shrink-0 h-11">
        <div className="flex items-center space-x-1.5">
          {/* Working AI Brief Button */}
          <button
            type="button"
            onClick={handleAiBriefClick}
            className="clay-btn px-2.5 py-1 rounded-lg text-xs font-bold inline-flex items-center space-x-1 hover:bg-zinc-100 cursor-pointer text-zinc-950 shadow-2xs"
            title="Open AI Executive Brief for this story"
          >
            <Sparkles className="w-3.5 h-3.5 text-zinc-950" />
            <span>AI Brief</span>
          </button>

          {/* Full Story Read Link */}
          <button
            type="button"
            onClick={handleCardClick}
            className="text-zinc-700 hover:text-zinc-950 font-bold inline-flex items-center space-x-1 cursor-pointer hover:underline text-xs ml-1"
            title="Read full story"
          >
            <span>Read</span>
            <ArrowRight className="w-3 h-3 ml-0.5" />
          </button>
        </div>

        <div className="flex items-center space-x-1.5">
          {/* External Publisher Link */}
          {article.url && (
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="p-1.5 text-zinc-400 hover:text-zinc-900 cursor-pointer"
              title="Open publisher website"
            >
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          )}

          {/* Bookmark Button */}
          <button
            type="button"
            onClick={handleBookmarkClick}
            className={`clay-btn p-1.5 rounded-lg cursor-pointer ${
              isBookmarked ? 'bg-zinc-950 text-white border-zinc-950 shadow-xs' : 'text-zinc-500'
            }`}
            title={isBookmarked ? 'Saved' : 'Save'}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-white text-white' : ''}`} />
          </button>
        </div>
      </div>
    </div>
  );
}
