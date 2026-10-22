'use client';

import React, { useState, useMemo } from 'react';
import { Article } from '@/types/news';
import { Bookmark, Clock, ArrowUpRight, Volume2, ShieldCheck, Share2 } from 'lucide-react';

interface ModernArticleCardProps {
  article: Article;
  variant?: 'hero' | 'grid' | 'row';
  onOpenArticle: (article: Article) => void;
  onToggleBookmark: (article: Article, e: React.MouseEvent) => void;
  isBookmarked: boolean;
}

export default function ModernArticleCard({
  article,
  variant = 'grid',
  onOpenArticle,
  onToggleBookmark,
  isBookmarked,
}: ModernArticleCardProps) {
  const [imageError, setImageError] = useState(false);

  const formattedDate = useMemo(() => {
    try {
      const d = new Date(article.publishedAt);
      const diffMs = Date.now() - d.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);

      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch {
      return 'Recently';
    }
  }, [article.publishedAt]);

  // 1. HERO BENTO CARD (Widescreen Flagship)
  if (variant === 'hero') {
    return (
      <div
        onClick={() => onOpenArticle(article)}
        className="group relative bg-white border border-zinc-200/80 hover:border-zinc-300 rounded-3xl p-6 sm:p-8 cursor-pointer shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left: Article Narrative */}
          <div className="lg:col-span-7 flex flex-col justify-between h-full space-y-4">
            <div>
              {/* Category & Source Metadata */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="px-2.5 py-0.5 rounded-full bg-zinc-950 text-white text-[11px] font-semibold tracking-wide uppercase">
                  {article.category}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-zinc-100 text-zinc-700 text-[11px] font-medium border border-zinc-200/60">
                  {article.source.name}
                </span>
                <span className="text-zinc-400 text-xs font-mono">•</span>
                <span className="text-zinc-500 text-xs font-mono">{formattedDate}</span>
                <span className="text-zinc-400 text-xs font-mono">•</span>
                <span className="text-zinc-500 text-xs flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  {article.readTime} min
                </span>
              </div>

              {/* Title */}
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-zinc-950 tracking-tight leading-[1.15] group-hover:text-zinc-700 transition-colors">
                {article.title}
              </h2>

              {/* Description */}
              <p className="mt-3 text-zinc-600 text-sm sm:text-base leading-relaxed line-clamp-3">
                {article.description}
              </p>

              {/* Key Bullet Highlights if present */}
              {article.bulletPoints && article.bulletPoints.length > 0 && (
                <div className="mt-4 p-3.5 rounded-xl bg-zinc-50 border border-zinc-200/60 space-y-1.5">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-bold">
                    Key Signals
                  </div>
                  {article.bulletPoints.slice(0, 2).map((bp, i) => (
                    <div key={i} className="flex items-start text-xs text-zinc-700">
                      <span className="mr-2 text-emerald-500 font-bold">•</span>
                      <span className="line-clamp-1">{bp}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom Controls */}
            <div className="pt-4 border-t border-zinc-150 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-zinc-950 text-white text-xs font-semibold group-hover:bg-zinc-800 transition-colors">
                  <span>Read Full Wire</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </span>

                <button
                  type="button"
                  onClick={(e) => onToggleBookmark(article, e)}
                  className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                    isBookmarked
                      ? 'bg-amber-50 text-amber-700 border-amber-300'
                      : 'bg-white hover:bg-zinc-100 text-zinc-600 border-zinc-200/80'
                  }`}
                  title={isBookmarked ? 'Saved' : 'Save'}
                >
                  <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-500' : ''}`} />
                </button>
              </div>

              {article.author && (
                <span className="text-xs text-zinc-500 font-medium truncate max-w-xs">
                  By {article.author}
                </span>
              )}
            </div>
          </div>

          {/* Right: Modern Visual Image */}
          <div className="lg:col-span-5 relative aspect-[16/10] rounded-2xl overflow-hidden bg-zinc-100 border border-zinc-200/80">
            {article.imageUrl && !imageError ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={article.imageUrl}
                alt={article.title}
                onError={() => setImageError(true)}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-zinc-100 to-zinc-200 text-zinc-400 text-sm font-semibold p-4 text-center">
                PRISM Global Wire Intelligence
              </div>
            )}
            <div className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-zinc-950/80 backdrop-blur-md text-white text-[10px] font-mono">
              FEATURED
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. STREAM ROW (Dense Linear-style Feed)
  if (variant === 'row') {
    return (
      <div
        onClick={() => onOpenArticle(article)}
        className="group px-4 py-3 bg-white hover:bg-zinc-50 border-b border-zinc-200/70 flex items-center justify-between gap-4 transition-colors cursor-pointer"
      >
        <div className="flex items-center space-x-3 truncate">
          <span className="shrink-0 px-2 py-0.5 rounded-md bg-zinc-100 text-[10px] font-medium text-zinc-600 uppercase border border-zinc-200/60">
            {article.category}
          </span>
          <span className="font-semibold text-zinc-900 group-hover:text-zinc-700 text-sm truncate">
            {article.title}
          </span>
          <span className="hidden md:inline text-xs text-zinc-400 truncate max-w-sm">
            {article.description}
          </span>
        </div>

        <div className="shrink-0 flex items-center space-x-3 text-xs text-zinc-400 font-mono">
          <span className="text-zinc-600 font-medium">{article.source.name}</span>
          <span>{formattedDate}</span>
          <button
            type="button"
            onClick={(e) => onToggleBookmark(article, e)}
            className="p-1 hover:text-zinc-900 transition-colors"
          >
            <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-amber-500 text-amber-500' : ''}`} />
          </button>
        </div>
      </div>
    );
  }

  // 3. STANDARD BENTO GRID CARD
  return (
    <div
      onClick={() => onOpenArticle(article)}
      className="group bg-white border border-zinc-200/80 hover:border-zinc-300 rounded-2xl p-4 sm:p-5 flex flex-col justify-between cursor-pointer shadow-xs hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
    >
      <div>
        {/* Card Thumbnail */}
        {article.imageUrl && !imageError && (
          <div className="relative aspect-[16/10] mb-3.5 rounded-xl overflow-hidden bg-zinc-100 border border-zinc-200/60">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={article.imageUrl}
              alt={article.title}
              onError={() => setImageError(true)}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-white/90 backdrop-blur-xs text-[10px] font-semibold text-zinc-800 shadow-2xs">
              {article.source.name}
            </div>
          </div>
        )}

        {/* Category & Time */}
        <div className="flex items-center space-x-2 text-[11px] mb-2">
          <span className="font-semibold text-zinc-800 uppercase tracking-wide">
            {article.category}
          </span>
          <span className="text-zinc-300">•</span>
          <span className="text-zinc-500 font-mono text-[10px]">{formattedDate}</span>
        </div>

        {/* Title */}
        <h3 className="font-bold text-base sm:text-lg text-zinc-950 tracking-tight leading-snug group-hover:text-zinc-700 transition-colors line-clamp-2">
          {article.title}
        </h3>

        {/* Excerpt */}
        <p className="mt-2 text-zinc-600 text-xs sm:text-sm leading-relaxed line-clamp-2">
          {article.description}
        </p>
      </div>

      {/* Footer Meta */}
      <div className="mt-4 pt-3 border-t border-zinc-150 flex items-center justify-between text-xs text-zinc-500">
        <span className="text-[11px] font-mono">{article.readTime} min read</span>
        <button
          type="button"
          onClick={(e) => onToggleBookmark(article, e)}
          className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
            isBookmarked
              ? 'bg-amber-50 text-amber-700 border-amber-300'
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
