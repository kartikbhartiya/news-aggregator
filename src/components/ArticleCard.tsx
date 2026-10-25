'use client';

import React from 'react';
import { Article } from '@/types/news';
import { Bookmark, Clock, ExternalLink, Headphones, Share2, Check } from 'lucide-react';

interface ArticleCardProps {
  article: Article;
  variant?: 'lead' | 'featured' | 'wire' | 'standard';
  onOpenArticle: (article: Article) => void;
  onToggleBookmark: (article: Article, e: React.MouseEvent) => void;
  isBookmarked: boolean;
  isRead?: boolean;
}

export default function ArticleCard({
  article,
  variant = 'standard',
  onOpenArticle,
  onToggleBookmark,
  isBookmarked,
  isRead,
}: ArticleCardProps) {
  const [formattedDate, setFormattedDate] = React.useState<string>('Recently');

  React.useEffect(() => {
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

  // Handle image error fallback gracefully
  const [imageError, setImageError] = React.useState(false);

  // 1. LEAD STORY (Flagship Hero)
  if (variant === 'lead') {
    return (
      <article
        onClick={() => onOpenArticle(article)}
        className="group relative bg-white border border-stone-200 hover:border-stone-400 transition-all p-5 sm:p-7 cursor-pointer shadow-xs"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Left Column: Headline & Meta (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between h-full">
            <div>
              {/* Category & Wire Tag */}
              <div className="flex items-center space-x-2.5 mb-3">
                <span className="text-[10px] uppercase font-mono font-bold tracking-widest px-2 py-0.5 bg-stone-900 text-white">
                  FLAGSHIP DISPATCH
                </span>
                <span className="text-stone-300">•</span>
                <span className="text-[11px] font-medium text-stone-600 uppercase tracking-wider">
                  {article.source.name}
                </span>
                {article.source.credibilityScore && (
                  <span className="hidden sm:inline-block text-[10px] font-mono text-emerald-800 bg-emerald-50 px-1.5 py-0.5 border border-emerald-200">
                    {article.source.credibilityScore}% Reliability
                  </span>
                )}
              </div>

              {/* Title */}
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl leading-tight text-stone-900 font-normal group-hover:text-stone-700 transition-colors">
                {article.title}
              </h2>

              {/* Excerpt */}
              <p className="mt-3 text-stone-600 text-sm sm:text-base leading-relaxed font-sans line-clamp-3">
                {article.description}
              </p>

              {/* Bullet points if available */}
              {article.bulletPoints && article.bulletPoints.length > 0 && (
                <div className="mt-4 pt-3 border-t border-stone-150 space-y-1.5">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-stone-400 font-semibold">
                    Key Developments
                  </div>
                  {article.bulletPoints.map((bp, i) => (
                    <div key={i} className="flex items-start text-xs text-stone-700">
                      <span className="mr-2 text-stone-400">•</span>
                      <span>{bp}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom Meta & Actions */}
            <div className="mt-6 pt-4 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3 text-xs text-stone-500">
              <div className="flex items-center space-x-3">
                {article.author && (
                  <span className="font-medium text-stone-800">{article.author}</span>
                )}
                <span>•</span>
                <span>{formattedDate}</span>
                <span>•</span>
                <span className="inline-flex items-center">
                  <Clock className="w-3 h-3 mr-1 text-stone-400" />
                  {article.readTime} min read
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={(e) => onToggleBookmark(article, e)}
                  title={isBookmarked ? 'Saved to Dossier' : 'Save to Dossier'}
                  className={`p-1.5 rounded border transition-colors cursor-pointer ${
                    isBookmarked
                      ? 'bg-amber-50 text-amber-900 border-amber-300'
                      : 'bg-white hover:bg-stone-100 text-stone-600 border-stone-200'
                  }`}
                >
                  <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-amber-600 text-amber-600' : ''}`} />
                </button>

                <span className="inline-flex items-center text-xs font-medium text-stone-900 group-hover:translate-x-0.5 transition-transform">
                  Read Analysis →
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Image (5 cols) */}
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-[16/10] overflow-hidden bg-stone-100 border border-stone-200">
              {article.imageUrl && !imageError ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={article.imageUrl}
                  alt={article.title}
                  onError={() => setImageError(true)}
                  className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-stone-100 text-stone-400 font-serif text-lg p-6 text-center italic">
                  The Veritas Dispatch • Editorial Record
                </div>
              )}
              <div className="absolute top-2 right-2 bg-stone-900/80 backdrop-blur-xs text-white text-[10px] font-mono px-2 py-0.5">
                {article.category.toUpperCase()}
              </div>
            </div>
            {article.author && (
              <div className="mt-1 text-[10px] font-mono text-stone-400 text-right">
                Wire Photo & Archival Intelligence
              </div>
            )}
          </div>
        </div>
      </article>
    );
  }

  // 2. FEATURED STORY (Medium Column)
  if (variant === 'featured') {
    return (
      <article
        onClick={() => onOpenArticle(article)}
        className="group relative bg-white border border-stone-200 hover:border-stone-400 transition-all p-5 flex flex-col justify-between cursor-pointer shadow-xs"
      >
        <div>
          {article.imageUrl && !imageError && (
            <div className="relative aspect-[16/9] mb-4 overflow-hidden bg-stone-100 border border-stone-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={article.imageUrl}
                alt={article.title}
                onError={() => setImageError(true)}
                className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
              />
              <div className="absolute top-2 left-2 bg-white/90 text-stone-900 text-[9px] font-mono uppercase px-1.5 py-0.5 border border-stone-200">
                {article.source.name}
              </div>
            </div>
          )}

          <div className="flex items-center space-x-2 text-[10px] uppercase font-mono text-stone-500 mb-1.5">
            <span className="font-semibold text-stone-800">{article.category}</span>
            <span>•</span>
            <span>{formattedDate}</span>
          </div>

          <h3 className="font-serif text-lg sm:text-xl leading-snug text-stone-900 font-normal group-hover:text-stone-700 transition-colors">
            {article.title}
          </h3>

          <p className="mt-2 text-stone-600 text-xs sm:text-sm leading-relaxed line-clamp-2">
            {article.description}
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-stone-150 flex items-center justify-between text-xs text-stone-500">
          <span className="text-[11px]">{article.readTime} min read</span>
          <button
            type="button"
            onClick={(e) => onToggleBookmark(article, e)}
            className="p-1 text-stone-400 hover:text-stone-800 transition-colors cursor-pointer"
          >
            <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-amber-600 text-amber-600' : ''}`} />
          </button>
        </div>
      </article>
    );
  }

  // 3. FAST WIRE (Chronological Ticker Stream)
  if (variant === 'wire') {
    return (
      <article
        onClick={() => onOpenArticle(article)}
        className="group py-3.5 border-b border-stone-200 hover:bg-stone-50/70 transition-colors cursor-pointer px-1"
      >
        <div className="flex items-baseline space-x-2 text-[10px] font-mono text-stone-500 mb-1">
          <span className="font-semibold text-amber-900 bg-amber-50 px-1 py-0.2 rounded border border-amber-200">
            {formattedDate}
          </span>
          <span className="text-stone-700 font-medium">{article.source.name}</span>
          <span className="text-stone-300">•</span>
          <span className="uppercase text-[9px] tracking-wider text-stone-400">{article.category}</span>
        </div>

        <h4 className="font-serif text-sm sm:text-base text-stone-900 leading-snug font-normal group-hover:text-stone-700 transition-colors">
          {article.title}
        </h4>

        <div className="mt-1 flex items-center justify-between text-[11px] text-stone-400">
          <span className="line-clamp-1 text-stone-500 font-sans">{article.description}</span>
          <button
            type="button"
            onClick={(e) => onToggleBookmark(article, e)}
            className="ml-2 text-stone-400 hover:text-stone-900 transition-colors shrink-0"
          >
            <Bookmark className={`w-3 h-3 ${isBookmarked ? 'fill-amber-600 text-amber-600' : ''}`} />
          </button>
        </div>
      </article>
    );
  }

  // 4. STANDARD GRID CARD
  return (
    <article
      onClick={() => onOpenArticle(article)}
      className="group bg-white border border-stone-200 hover:border-stone-400 transition-all p-4 flex flex-col justify-between cursor-pointer shadow-xs"
    >
      <div>
        {article.imageUrl && !imageError && (
          <div className="relative aspect-[16/10] mb-3 overflow-hidden bg-stone-100 border border-stone-200">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={article.imageUrl}
              alt={article.title}
              onError={() => setImageError(true)}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute top-1.5 left-1.5 bg-stone-900/90 text-white text-[9px] font-mono px-1.5 py-0.2">
              {article.source.name}
            </div>
          </div>
        )}

        <div className="flex items-center space-x-2 text-[10px] font-mono text-stone-500 mb-1">
          <span className="text-stone-800 font-medium uppercase">{article.category}</span>
          <span>•</span>
          <span>{formattedDate}</span>
        </div>

        <h3 className="font-serif text-base sm:text-lg leading-snug text-stone-900 font-normal group-hover:text-stone-700 transition-colors line-clamp-2">
          {article.title}
        </h3>

        <p className="mt-1.5 text-stone-600 text-xs leading-relaxed line-clamp-2 font-sans">
          {article.description}
        </p>
      </div>

      <div className="mt-3 pt-2.5 border-t border-stone-150 flex items-center justify-between text-xs text-stone-500">
        <span className="text-[11px]">{article.readTime} min read</span>
        <div className="flex items-center space-x-1">
          <button
            type="button"
            onClick={(e) => onToggleBookmark(article, e)}
            className="p-1 text-stone-400 hover:text-stone-800 transition-colors"
          >
            <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-amber-600 text-amber-600' : ''}`} />
          </button>
        </div>
      </div>
    </article>
  );
}
