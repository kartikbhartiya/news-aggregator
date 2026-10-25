'use client';

import React, { useState, useEffect } from 'react';
import { Article } from '@/types/news';
import { Bookmark, Clock, ArrowUpRight, ArrowRight, Sparkles, ImageOff } from 'lucide-react';
import { handleButtonClickGlow } from '@/lib/button-glow';

function NoImageFallback({ sourceName, category, className = '' }: { sourceName: string; category?: string; className?: string }) {
  return (
    <div
      className={`relative rounded-2xl overflow-hidden bg-gradient-to-br from-zinc-100 via-zinc-50 to-zinc-100/70 border border-zinc-200/70 flex flex-col items-center justify-center p-4 select-none ${className}`}
    >
      <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold text-zinc-800 bg-white/95 border border-zinc-200/80 shadow-2xs">
        {sourceName}
      </div>
      {category && (
        <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-zinc-200/60 text-[10px] font-mono text-zinc-600 uppercase tracking-wider">
          {category}
        </div>
      )}
      <div className="w-11 h-11 rounded-2xl bg-white border border-zinc-200/70 flex items-center justify-center text-zinc-400 mb-2 shadow-2xs group-hover:scale-105 transition-transform duration-300">
        <ImageOff className="w-5 h-5 text-zinc-400" />
      </div>
      <span className="text-xs font-semibold text-zinc-700 tracking-tight">No Image Available</span>
      <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 mt-0.5">Wire Dispatch • Text Only</span>
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
    <div className={`relative rounded-2xl overflow-hidden bg-zinc-100 border border-zinc-200/70 shadow-2xs group select-none ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        onError={() => setImgError(true)}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 block"
      />
      {/* High-visibility Apple frosted badge */}
      <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full text-[11px] font-extrabold text-zinc-950 bg-white/95 backdrop-blur-xl border border-zinc-200/80 shadow-xs z-10">
        {badgeText}
      </div>
      {priorityBadge && (
        <div className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full bg-zinc-950 text-white text-[10px] font-mono font-bold tracking-wider shadow-xs z-10">
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
  onToggleBookmark: (article: Article, e: React.MouseEvent) => void;
  isBookmarked: boolean;
  className?: string;
}

export default function ModernArticleCard({
  article,
  variant = 'grid',
  onOpenArticle,
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

  // Open article in-app on this website as requested
  const handleCardClick = (e: React.MouseEvent) => {
    handleButtonClickGlow(e);
    onOpenArticle(article);
  };

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleButtonClickGlow(e);
    onToggleBookmark(article, e);
  };

  const handleAiReaderClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleButtonClickGlow(e);
    onOpenArticle(article);
  };

  // 1. HERO BENTO CARD (Widescreen Flagship)
  if (variant === 'hero') {
    return (
      <div
        onClick={handleCardClick}
        className={`group relative bg-white/95 hover:bg-white backdrop-blur-md rounded-[32px] p-6 sm:p-8 cursor-pointer shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_16px_36px_rgba(0,0,0,0.08)] border border-zinc-200/90 hover:border-zinc-300 transition-all duration-300 overflow-hidden ${className}`}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Narrative */}
          <div className="lg:col-span-7 flex flex-col justify-between h-full space-y-4">
            <div>
              {/* Category & Source Metadata */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="px-3 py-1 rounded-full bg-zinc-950 text-white text-[11px] font-bold tracking-wide uppercase shadow-xs">
                  {article.category}
                </span>
                <span className="px-2.5 py-1 rounded-full bg-zinc-100 text-zinc-800 text-[11px] font-semibold border border-zinc-200">
                  {article.source.name}
                </span>
                <span className="text-zinc-300 text-xs">•</span>
                <span className="text-zinc-500 text-xs font-mono">{formattedDate}</span>
                <span className="text-zinc-300 text-xs">•</span>
                <span className="text-zinc-500 text-xs flex items-center font-mono">
                  <Clock className="w-3 h-3 mr-1" />
                  {article.readTime} min read
                </span>
              </div>

              {/* Title - clickable to open in new tab */}
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-zinc-950 tracking-tight leading-[1.18] group-hover:text-zinc-700 transition-colors">
                {article.title}
              </h2>

              {/* Description */}
              <p className="mt-3 text-zinc-600 text-sm sm:text-base leading-relaxed line-clamp-3 font-normal">
                {article.description}
              </p>

              {/* Bullet Signals */}
              {article.bulletPoints && article.bulletPoints.length > 0 && (
                <div className="mt-4 p-3.5 rounded-2xl bg-zinc-50/80 border border-zinc-200/80 space-y-1.5 shadow-2xs">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-bold flex items-center space-x-1">
                    <Sparkles className="w-3 h-3 text-emerald-600" />
                    <span>Key Strategic Takeaways</span>
                  </div>
                  {article.bulletPoints.slice(0, 2).map((bp, i) => (
                    <div key={i} className="flex items-start text-xs text-zinc-700 font-medium">
                      <span className="mr-2 text-emerald-600 font-bold">•</span>
                      <span className="line-clamp-1">{bp}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-zinc-200/70 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                {/* In-Website Reader Button */}
                <button
                  type="button"
                  onClick={handleCardClick}
                  className="apple-prominent-btn apple-btn inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white shadow-sm cursor-pointer"
                >
                  <span>Read In PRISM</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                {/* AI Summary / Reader Modal */}
                <button
                  type="button"
                  onClick={handleAiReaderClick}
                  className="apple-btn inline-flex items-center space-x-1 px-3 py-2 rounded-xl text-xs font-semibold text-zinc-700 bg-zinc-100 hover:bg-zinc-200/80 border border-zinc-200 transition-colors cursor-pointer"
                  title="Read AI Summary & Takeaways"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>AI Summary</span>
                </button>

                {/* External link fallback */}
                {article.url && (
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="p-2 rounded-xl text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 border border-transparent hover:border-zinc-200 transition-colors cursor-pointer"
                    title="Open on publisher website"
                  >
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                )}

                {/* Bookmark Button */}
                <button
                  type="button"
                  onClick={handleBookmarkClick}
                  className={`apple-btn p-2 rounded-xl border transition-colors cursor-pointer ${
                    isBookmarked 
                      ? 'bg-amber-50 text-amber-800 border-amber-300' 
                      : 'bg-zinc-100 text-zinc-600 border-zinc-200 hover:bg-zinc-200'
                  }`}
                  title={isBookmarked ? 'Saved to Dossier' : 'Save'}
                >
                  <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-500 text-amber-500' : ''}`} />
                </button>
              </div>

              {article.author && (
                <span className="text-xs text-zinc-500 font-medium truncate max-w-xs">
                  By {article.author}
                </span>
              )}
            </div>
          </div>

          {/* Right Visual Image */}
          <div className="lg:col-span-5">
            {article.imageUrl && article.imageUrl.trim() !== '' ? (
              <ArticleThumbnail
                src={article.imageUrl}
                alt={article.title}
                badgeText={article.source.name}
                priorityBadge="TOP SIGNAL"
                className="aspect-[16/10] rounded-[24px]"
              />
            ) : (
              <NoImageFallback
                sourceName={article.source.name}
                category={article.category}
                className="aspect-[16/10] rounded-[24px]"
              />
            )}
          </div>
        </div>
      </div>
    );
  }

  // 2. STREAM ROW (Linear/Raycast Dense Feed)
  if (variant === 'row') {
    return (
      <div
        onClick={handleCardClick}
        className="group px-4 py-3.5 bg-white/80 hover:bg-white border-b border-zinc-200/70 flex items-center justify-between gap-4 transition-all cursor-pointer"
      >
        <div className="flex items-center space-x-3 truncate">
          <span className="shrink-0 px-2 py-0.5 rounded-md bg-zinc-100 text-[10px] font-bold text-zinc-700 uppercase border border-zinc-200/60">
            {article.category}
          </span>
          <span className="font-bold text-zinc-900 group-hover:text-zinc-600 text-sm truncate">
            {article.title}
          </span>
          <span className="hidden md:inline text-xs text-zinc-500 truncate max-w-sm">
            {article.description}
          </span>
        </div>

        <div className="shrink-0 flex items-center space-x-3 text-xs text-zinc-400 font-mono">
          <span className="text-zinc-700 font-semibold">{article.source.name}</span>
          <span>{formattedDate}</span>
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="apple-btn p-1 hover:text-zinc-900 transition-colors"
            title="Open in new tab"
          >
            <ArrowUpRight className="w-3.5 h-3.5 text-zinc-500" />
          </a>
          <button
            type="button"
            onClick={handleBookmarkClick}
            className="apple-btn p-1 hover:text-zinc-900 transition-colors"
          >
            <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-amber-500 text-amber-500' : ''}`} />
          </button>
        </div>
      </div>
    );
  }

  // 3. BENTO GRID CARD
  return (
    <div
      onClick={handleCardClick}
      className={`group bg-white/95 hover:bg-white backdrop-blur-md rounded-[26px] p-5 flex flex-col justify-between cursor-pointer border border-zinc-200/90 hover:border-zinc-300 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_28px_rgba(0,0,0,0.08)] transition-all duration-300 ${className}`}
    >
      <div>
        {/* Card Thumbnail */}
        {article.imageUrl && article.imageUrl.trim() !== '' ? (
          <ArticleThumbnail
            src={article.imageUrl}
            alt={article.title}
            badgeText={article.source.name}
            className="aspect-[16/10] mb-3.5"
          />
        ) : (
          <NoImageFallback
            sourceName={article.source.name}
            category={article.category}
            className="aspect-[16/10] mb-3.5"
          />
        )}

        {/* Category & Time */}
        <div className="flex items-center space-x-2 text-[11px] mb-2">
          <span className="font-bold text-zinc-900 uppercase tracking-wide">
            {article.category}
          </span>
          <span className="text-zinc-300">•</span>
          <span className="text-zinc-500 font-mono text-[10px]">{formattedDate}</span>
        </div>

        {/* Title */}
        <h3 className="font-extrabold text-base sm:text-lg text-zinc-950 tracking-tight leading-snug group-hover:text-zinc-600 transition-colors line-clamp-2">
          {article.title}
        </h3>

        {/* Excerpt */}
        <p className="mt-2 text-zinc-600 text-xs sm:text-sm leading-relaxed line-clamp-2 font-normal">
          {article.description}
        </p>
      </div>

      {/* Footer Meta */}
      <div className="mt-4 pt-3 border-t border-zinc-200/60 flex items-center justify-between text-xs text-zinc-500">
        <div className="flex items-center space-x-2">
          <span className="text-[11px] font-mono">{article.readTime} min read</span>
          <span className="text-zinc-300">•</span>
          {/* Direct In-App Reader link */}
          <button
            type="button"
            onClick={handleCardClick}
            className="text-zinc-800 hover:text-zinc-950 font-bold inline-flex items-center space-x-1 cursor-pointer hover:underline"
            title="Read in PRISM"
          >
            <span>Read</span>
            <ArrowRight className="w-3 h-3 ml-0.5" />
          </button>
          {article.url && (
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-zinc-400 hover:text-zinc-700 ml-1"
              title="Open external publisher page"
            >
              <ArrowUpRight className="w-3 h-3" />
            </a>
          )}
        </div>

        <div className="flex items-center space-x-1.5">
          {/* AI Brief Quick Reader Button */}
          <button
            type="button"
            onClick={handleAiReaderClick}
            className="text-[11px] font-semibold text-zinc-500 hover:text-zinc-950 inline-flex items-center space-x-1 px-2 py-1 rounded-lg hover:bg-zinc-100 transition-colors cursor-pointer"
            title="Read AI Summary"
          >
            <Sparkles className="w-3 h-3 text-emerald-600" />
            <span className="hidden sm:inline">AI Brief</span>
          </button>

          {/* Bookmark Button */}
          <button
            type="button"
            onClick={handleBookmarkClick}
            className={`apple-btn p-1.5 rounded-xl border transition-colors cursor-pointer ${
              isBookmarked
                ? 'bg-amber-100 text-amber-800 border-amber-300'
                : 'hover:bg-zinc-100 text-zinc-400 hover:text-zinc-800 border-transparent'
            }`}
            title={isBookmarked ? 'Saved' : 'Save'}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-amber-500 text-amber-500' : ''}`} />
          </button>
        </div>
      </div>
    </div>
  );
}
