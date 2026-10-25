'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Article } from '@/types/news';
import { Bookmark, Clock, ArrowUpRight, Volume2, ShieldCheck, Share2, Sparkles } from 'lucide-react';
import { handleButtonClickGlow } from '@/lib/button-glow';

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
  const [imageError, setImageError] = useState(false);

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

  // 1. HERO BENTO CARD (Widescreen Flagship)
  if (variant === 'hero') {
    return (
      <div
        data-config='{"blurAmount":0.22,"refraction":0.8,"chromAberration":0.08,"edgeHighlight":0.2,"specular":0.35,"fresnel":1.25,"cornerRadius":32,"zRadius":42,"button":true}'
        onClick={handleCardClick}
        className={`group relative liquid-glass-direct liquid-glass-panel rounded-[32px] p-6 sm:p-8 cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden ${className}`}
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
                <span className="px-2.5 py-1 rounded-full liquid-glass-pill text-zinc-800 text-[11px] font-semibold">
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

              {/* Title */}
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-zinc-950 tracking-tight leading-[1.18] group-hover:text-zinc-700 transition-colors">
                {article.title}
              </h2>

              {/* Description */}
              <p className="mt-3 text-zinc-600 text-sm sm:text-base leading-relaxed line-clamp-3 font-normal">
                {article.description}
              </p>

              {/* Bullet Signals */}
              {article.bulletPoints && article.bulletPoints.length > 0 && (
                <div className="mt-4 p-3.5 rounded-2xl bg-white/70 border border-zinc-200/60 space-y-1.5 shadow-2xs">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-bold flex items-center space-x-1">
                    <Sparkles className="w-3 h-3 text-emerald-500" />
                    <span>Key Strategic Takeaways</span>
                  </div>
                  {article.bulletPoints.slice(0, 2).map((bp, i) => (
                    <div key={i} className="flex items-start text-xs text-zinc-700 font-medium">
                      <span className="mr-2 text-emerald-500 font-bold">•</span>
                      <span className="line-clamp-1">{bp}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-zinc-200/60 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <span className="apple-prominent-btn apple-btn inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold shadow-md">
                  <span>Read Full Dispatch</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </span>

                <button
                  type="button"
                  onClick={handleBookmarkClick}
                  className={`apple-glass-btn apple-btn p-2 rounded-xl transition-colors cursor-pointer ${
                    isBookmarked ? 'bg-amber-100 text-amber-800 border-amber-300' : 'text-zinc-600'
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
          <div className="lg:col-span-5 relative aspect-[16/10] rounded-[24px] overflow-hidden bg-zinc-100 border border-white/60 shadow-inner">
            {article.imageUrl && !imageError ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={article.imageUrl}
                alt={article.title}
                onError={() => setImageError(true)}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-zinc-100 to-zinc-200 text-zinc-400 text-sm font-semibold p-4 text-center">
                PRISM Global Wire
              </div>
            )}
            <div className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full liquid-glass-pill text-zinc-900 text-[10px] font-mono font-bold shadow-xs">
              TOP SIGNAL
            </div>
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
        className="group px-4 py-3.5 bg-white/70 hover:bg-white/95 border-b border-zinc-200/60 flex items-center justify-between gap-4 transition-all cursor-pointer"
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
      data-config='{"blurAmount":0.2,"refraction":0.75,"chromAberration":0.07,"edgeHighlight":0.18,"specular":0.3,"fresnel":1.15,"cornerRadius":26,"zRadius":36,"button":true}'
      onClick={handleCardClick}
      className={`group liquid-glass-direct liquid-glass-card rounded-[26px] p-5 flex flex-col justify-between cursor-pointer ${className}`}
    >
      <div>
        {/* Card Thumbnail with Specular Border */}
        {article.imageUrl && !imageError && (
          <div className="relative aspect-[16/10] mb-3.5 rounded-2xl overflow-hidden bg-zinc-100 border border-white/60 shadow-xs">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={article.imageUrl}
              alt={article.title}
              onError={() => setImageError(true)}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full liquid-glass-pill text-[10px] font-bold text-zinc-800 shadow-xs">
              {article.source.name}
            </div>
          </div>
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
      <div className="mt-4 pt-3 border-t border-zinc-200/50 flex items-center justify-between text-xs text-zinc-500">
        <span className="text-[11px] font-mono">{article.readTime} min read</span>
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
  );
}
