'use client';

import React, { useState } from 'react';
import { 
  Filter, 
  ArrowUpDown, 
  Clock, 
  ShieldCheck, 
  ChevronDown, 
  Check, 
  Sparkles,
  Zap,
  BookOpen,
  Radio
} from 'lucide-react';
import { handleButtonClickGlow } from '@/lib/button-glow';

interface SourceOption {
  id: string;
  name: string;
}

interface GlassFilterBarProps {
  selectedSource: string;
  onSelectSource: (sourceId: string) => void;
  availableSources: SourceOption[];
  readTimeFilter: 'all' | 'short' | 'long';
  onSelectReadTime: (time: 'all' | 'short' | 'long') => void;
  sortBy: 'latest' | 'impact' | 'longread' | 'quick';
  onSelectSortBy: (sort: 'latest' | 'impact' | 'longread' | 'quick') => void;
  verifiedOnly: boolean;
  onToggleVerified: () => void;
  totalArticles: number;
  filteredCount: number;
  className?: string;
}

export default function GlassFilterBar({
  selectedSource,
  onSelectSource,
  availableSources,
  readTimeFilter,
  onSelectReadTime,
  sortBy,
  onSelectSortBy,
  verifiedOnly,
  onToggleVerified,
  totalArticles,
  filteredCount,
  className = '',
}: GlassFilterBarProps) {
  const [isSourceMenuOpen, setIsSourceMenuOpen] = useState(false);
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);

  const sortLabels = {
    latest: { label: 'Latest Dispatches', icon: Clock },
    impact: { label: 'Trending & Impact', icon: Sparkles },
    quick: { label: 'Quick Reads First', icon: Zap },
    longread: { label: 'Deep Dives (6m+)', icon: BookOpen },
  };

  const currentSort = sortLabels[sortBy] || sortLabels.latest;
  const SortIcon = currentSort.icon;

  const currentSourceName = 
    selectedSource === 'all' 
      ? `All Sources (${totalArticles})` 
      : availableSources.find(s => s.id === selectedSource)?.name || selectedSource;

  return (
    <div className={`relative max-w-7xl mx-auto px-4 sm:px-6 py-2 ${className}`}>
      {/* Floating Apple Glass Island */}
      <div 
        data-config='{"blurAmount":0.22,"refraction":0.78,"chromAberration":0.08,"edgeHighlight":0.16,"specular":0.3,"fresnel":1.2,"cornerRadius":26,"zRadius":36,"button":false}'
        className="liquid-glass-direct apple-glass-island rounded-2xl sm:rounded-[26px] p-2 sm:p-2.5 flex flex-wrap items-center justify-between gap-2.5 transition-all shadow-md"
      >
        {/* Left Side: Source Selector & Verified Toggle */}
        <div className="flex items-center space-x-2 flex-wrap gap-y-2">
          {/* Source Dropdown Popover */}
          <div className="relative">
            <button
              type="button"
              onClick={(e) => {
                handleButtonClickGlow(e);
                setIsSourceMenuOpen(!isSourceMenuOpen);
                setIsSortMenuOpen(false);
              }}
              className="apple-btn apple-glass-btn inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-xs font-semibold text-zinc-900 cursor-pointer shadow-2xs border border-white/80 hover:bg-white/90"
            >
              <Radio className="w-3.5 h-3.5 text-zinc-600" />
              <span className="truncate max-w-[140px] sm:max-w-[200px]">{currentSourceName}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-zinc-400 transition-transform ${isSourceMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Source Menu Popover */}
            {isSourceMenuOpen && (
              <div 
                className="absolute top-full left-0 mt-2 w-64 liquid-glass-panel rounded-2xl shadow-xl border border-white/80 p-1.5 z-50 max-h-72 overflow-y-auto no-scrollbar animate-in fade-in zoom-in-95 duration-150"
              >
                <button
                  type="button"
                  onClick={(e) => {
                    handleButtonClickGlow(e);
                    onSelectSource('all');
                    setIsSourceMenuOpen(false);
                  }}
                  className={`apple-btn w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium cursor-pointer transition-colors ${
                    selectedSource === 'all' 
                      ? 'bg-zinc-950 text-white font-semibold' 
                      : 'text-zinc-700 hover:bg-white/80'
                  }`}
                >
                  <span>All Sources ({totalArticles})</span>
                  {selectedSource === 'all' && <Check className="w-3.5 h-3.5" />}
                </button>
                <div className="my-1 border-t border-zinc-200/50" />
                {availableSources.map((source) => (
                  <button
                    key={source.id}
                    type="button"
                    onClick={(e) => {
                      handleButtonClickGlow(e);
                      onSelectSource(source.id);
                      setIsSourceMenuOpen(false);
                    }}
                    className={`apple-btn w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium cursor-pointer transition-colors ${
                      selectedSource === source.id 
                        ? 'bg-zinc-950 text-white font-semibold' 
                        : 'text-zinc-700 hover:bg-white/80'
                    }`}
                  >
                    <span className="truncate mr-2">{source.name}</span>
                    {selectedSource === source.id && <Check className="w-3.5 h-3.5 shrink-0" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Reading Time Segmented Control */}
          <div className="inline-flex items-center p-0.5 rounded-full bg-white/60 border border-white/80 shadow-2xs">
            <button
              type="button"
              onClick={(e) => {
                handleButtonClickGlow(e);
                onSelectReadTime('all');
              }}
              className={`apple-btn px-3 py-1 rounded-full text-xs font-semibold cursor-pointer transition-all ${
                readTimeFilter === 'all'
                  ? 'bg-zinc-950 text-white shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              Any Time
            </button>
            <button
              type="button"
              onClick={(e) => {
                handleButtonClickGlow(e);
                onSelectReadTime('short');
              }}
              className={`apple-btn px-3 py-1 rounded-full text-xs font-semibold cursor-pointer transition-all ${
                readTimeFilter === 'short'
                  ? 'bg-zinc-950 text-white shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              &lt; 3m Quick
            </button>
            <button
              type="button"
              onClick={(e) => {
                handleButtonClickGlow(e);
                onSelectReadTime('long');
              }}
              className={`apple-btn px-3 py-1 rounded-full text-xs font-semibold cursor-pointer transition-all ${
                readTimeFilter === 'long'
                  ? 'bg-zinc-950 text-white shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              6m+ Deep
            </button>
          </div>

          {/* Editorial Verified Only Toggle */}
          <button
            type="button"
            onClick={(e) => {
              handleButtonClickGlow(e);
              onToggleVerified();
            }}
            className={`apple-btn inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold cursor-pointer transition-all border ${
              verifiedOnly
                ? 'bg-emerald-600 text-white border-emerald-500 shadow-xs'
                : 'bg-white/60 text-zinc-700 border-white/80 hover:bg-white/80'
            }`}
            title="Filter by verified wire dispatches with confirmed attribution"
          >
            <ShieldCheck className={`w-3.5 h-3.5 ${verifiedOnly ? 'text-white' : 'text-emerald-600'}`} />
            <span>Verified Wire</span>
          </button>
        </div>

        {/* Right Side: Sort Order Popover & Stats Pill */}
        <div className="flex items-center space-x-2 shrink-0 ml-auto">
          {/* Result Count Indicator */}
          <span className="hidden md:inline-flex items-center px-2.5 py-1 rounded-full bg-white/50 text-[11px] font-mono font-medium text-zinc-600 border border-white/60">
            {filteredCount} {filteredCount === 1 ? 'Dispatch' : 'Dispatches'}
          </span>

          {/* Sort Menu Popover */}
          <div className="relative">
            <button
              type="button"
              onClick={(e) => {
                handleButtonClickGlow(e);
                setIsSortMenuOpen(!isSortMenuOpen);
                setIsSourceMenuOpen(false);
              }}
              className="apple-btn apple-glass-btn inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold text-zinc-900 cursor-pointer shadow-2xs border border-white/80 hover:bg-white/90"
            >
              <SortIcon className="w-3.5 h-3.5 text-zinc-600" />
              <span>{currentSort.label}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-zinc-400 transition-transform ${isSortMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {isSortMenuOpen && (
              <div 
                className="absolute top-full right-0 mt-2 w-52 liquid-glass-panel rounded-2xl shadow-xl border border-white/80 p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150"
              >
                {(Object.keys(sortLabels) as Array<keyof typeof sortLabels>).map((key) => {
                  const item = sortLabels[key];
                  const ItemIcon = item.icon;
                  const isSelected = sortBy === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={(e) => {
                        handleButtonClickGlow(e);
                        onSelectSortBy(key);
                        setIsSortMenuOpen(false);
                      }}
                      className={`apple-btn w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium cursor-pointer transition-colors ${
                        isSelected 
                          ? 'bg-zinc-950 text-white font-semibold' 
                          : 'text-zinc-700 hover:bg-white/80'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <ItemIcon className="w-3.5 h-3.5" />
                        <span>{item.label}</span>
                      </div>
                      {isSelected && <Check className="w-3.5 h-3.5" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
