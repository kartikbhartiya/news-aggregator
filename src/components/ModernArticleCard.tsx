'use client';

import React, { useState, useEffect } from 'react';
import { Article } from '@/types/news';
import { Bookmark, Clock, ArrowUpRight, ArrowRight, Sparkles, ImageOff } from 'lucide-react';
import { handleButtonClickGlow } from '@/lib/button-glow';

function NoImageFallback({ sourceName, category, className = '' }: { sourceName: string; category?: string; className?: string }) {
  return (
    <div
      className={`relative rounded-2xl overflow-hidden bg-zinc-100 border border-zinc-200 flex flex-col items-center justify-center p-4 select-none ${className}`}
    >
      <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full text-[11px] font-bold text-zinc-900 bg-white border border-zinc-200 shadow-2xs">
        {sourceName}
      </div>
      {category && (
        <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-zinc-200 text-[10px] font-mono text-zinc-700 uppercase tracking-wider">
          {category}
        </div>
      )}
      <div className="w-10 h-10 rounded-xl bg-white border border-zinc-200 flex items-center justify-center text-zinc-400 mb-2 shadow-2xs">
        <ImageOff className="w-4 h-4 text-zinc-400" />
      </div>
      <span className="text-xs font-semibold text-zinc-700 tracking-tight">Editorial Wire Dispatch</span>
      <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 mt-0.5">Full Text Available</span>
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
      {/* Crisp Solid Tactile Pill Badge */}
      <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full text-[11px] font-extrabold text-zinc-950 bg-white border border-zinc-200 shadow-xs z-10">
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

  const handleCardClick = (e: React.MouseEvent) => {
    handleButtonClickGlow(e);
    onOpenArticle(article);
  };

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleButtonClickGlow(e);
    onToggleBookmark(article, e);
  };

  // 1. HERO BENTO CARD (Widescreen Flagship Editorial)
  if (variant === 'hero') {
    return (
      <div
        onClick={handleCardClick}
        className={`group relative clay-card p-5 sm:p-8 cursor-pointer overflow-hidden ${className}`}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          
          {/* Left Narrative */}
          <div className="lg:col-span-7 flex flex-col justify-between h-full space-y-4">
            <div>
              {/* Category & Source Metadata */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="px-2.5 py-0.5 rounded-full bg-zinc-950 text-white text-[10px] font-mono font-bold tracking-wider uppercase">
                  {article.category}
                </span>
                <span className="clay-pill px-2.5 py-0.5 text-zinc-900 text-[11px] font-bold">
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

              {/* Headline in Editorial Serif Font */}
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-extrabold text-zinc-950 tracking-tight leading-[1.2] group-hover:text-zinc-700 transition-colors">
                {article.title}
              </h2>

              {/* Fully Readable Real Description */}
              <p className="mt-3.5 text-zinc-700 text-sm sm:text-base leading-relaxed font-normal">
                {article.description}
              </p>

              {/* Key Bullet Signals if available */}
              {article.bulletPoints && article.bulletPoints.length > 0 && (
                <div className="mt-4 p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-1.5">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-600 font-bold flex items-center space-x-1">
                    <Sparkles className="w-3 h-3 text-zinc-950" />
                    <span>Key Strategic Takeaways</span>
                  </div>
                  {article.bulletPoints.slice(0, 2).map((bp, i) => (
                    <div key={i} className="flex items-start text-xs text-zinc-800 font-medium">
                      <span className="mr-2 text-zinc-950 font-bold">•</span>
                      <span className="line-clamp-1">{bp}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-zinc-200 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center space-x-2">
                {/* In-Website Full Reader Button */}
                <button
                  type="button"
                  onClick={handleCardClick}
                  className="clay-btn-dark px-4 py-2 rounded-xl text-xs font-bold inline-flex items-center space-x-1.5 cursor-pointer shadow-sm"
                >
                  <span>Read Full Story</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                {/* Bookmark Button */}
                <button
                  type="button"
                  onClick={handleBookmarkClick}
                  className={`clay-btn p-2 rounded-xl cursor-pointer ${
                    isBookmarked ? 'bg-zinc-950 text-white border-zinc-950 shadow-xs' : 'text-zinc-700'
                  }`}
                  title={isBookmarked ? 'Saved to Dossier' : 'Save'}
                >
                  <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-white text-white' : ''}`} />
                </button>

                {/* External Link */}
                {article.url && (
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="clay-btn p-2 rounded-xl text-zinc-500 hover:text-zinc-950 cursor-pointer"
                    title="Open on publisher website"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                )}
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
                className="aspect-[16/10] rounded-2xl sm:rounded-3xl"
              />
            ) : (
              <NoImageFallback
                sourceName={article.source.name}
                category={article.category}
                className="aspect-[16/10] rounded-2xl sm:rounded-3xl"
              />
            )}
          </div>
        </div>
      </div>
    );
  }

  // 2. STREAM ROW (Linear Feed)
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

        <div className="shrink-0 flex items-center space-x-2.5 text-xs text-zinc-500 font-mono">
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

  // 3. BENTO GRID CARD
  return (
    <div
      onClick={handleCardClick}
      className={`group clay-card p-5 flex flex-col justify-between cursor-pointer ${className}`}
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
          <span className="font-mono font-bold text-zinc-950 uppercase tracking-wider text-[10px]">
            {article.category}
          </span>
          <span className="text-zinc-300">•</span>
          <span className="text-zinc-500 font-mono text-[10px]">{formattedDate}</span>
        </div>

        {/* Headline in Editorial Serif Font */}
        <h3 className="font-serif font-bold text-lg sm:text-xl text-zinc-950 tracking-tight leading-snug group-hover:text-zinc-700 transition-colors line-clamp-2">
          {article.title}
        </h3>

        {/* Excerpt / Description */}
        <p className="mt-2 text-zinc-700 text-xs sm:text-sm leading-relaxed line-clamp-3 font-normal">
          {article.description}
        </p>
      </div>

      {/* Footer Meta */}
      <div className="mt-4 pt-3 border-t border-zinc-200 flex items-center justify-between text-xs text-zinc-500">
        <div className="flex items-center space-x-2">
          <span className="text-[11px] font-mono text-zinc-500">{article.readTime} min read</span>
          <span className="text-zinc-300">•</span>
          <button
            type="button"
            onClick={handleCardClick}
            className="text-zinc-950 font-bold inline-flex items-center space-x-1 cursor-pointer hover:underline"
            title="Read in PRISM"
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
              title="Open external publisher"
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
