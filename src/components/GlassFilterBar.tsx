'use client';

import React, { useState } from 'react';
import { 
  Clock, 
  ChevronDown, 
  Check, 
  Sparkles,
  Zap,
  BookOpen,
  Filter
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
    latest: { label: 'Latest Wire', icon: Clock },
    impact: { label: 'Top Impact', icon: Sparkles },
    quick: { label: 'Quick Reads', icon: Zap },
    longread: { label: 'Deep Dives', icon: BookOpen },
  };

  const currentSort = sortLabels[sortBy] || sortLabels.latest;
  const SortIcon = currentSort.icon;

  const currentSourceName = 
    selectedSource === 'all' 
      ? `All Publishers (${totalArticles})` 
      : availableSources.find(s => s.id === selectedSource)?.name || selectedSource;

  return (
    <div className={`relative max-w-7xl mx-auto px-3 sm:px-6 py-2 ${className}`}>
      {/* Tactile Sculpted Clay Filter Strip */}
      <div className="clay-card rounded-2xl p-2 sm:p-2.5 flex flex-wrap items-center justify-between gap-2.5 transition-all">
        
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
              className="clay-btn inline-flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-semibold text-zinc-900 cursor-pointer"
            >
              <Filter className="w-3.5 h-3.5 text-zinc-600" />
              <span className="truncate max-w-[130px] sm:max-w-[200px]">{currentSourceName}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-zinc-400 transition-transform ${isSourceMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Source Menu Popover (Pure Opaque White Clay Card) */}
            {isSourceMenuOpen && (
              <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-zinc-200 p-1.5 z-50 max-h-80 overflow-y-auto ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-150">
                <button
                  type="button"
                  onClick={(e) => {
                    handleButtonClickGlow(e);
                    onSelectSource('all');
                    setIsSourceMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs cursor-pointer transition-colors ${
                    selectedSource === 'all' 
                      ? 'bg-zinc-950 text-white font-bold shadow-xs' 
                      : 'text-zinc-800 hover:bg-zinc-100 font-medium'
                  }`}
                >
                  <span>All Publishers ({totalArticles})</span>
                  {selectedSource === 'all' && <Check className="w-3.5 h-3.5" />}
                </button>
                <div className="my-1 border-t border-zinc-100" />
                {availableSources.map((source) => (
                  <button
                    key={source.id}
                    type="button"
                    onClick={(e) => {
                      handleButtonClickGlow(e);
                      onSelectSource(source.id);
                      setIsSourceMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs cursor-pointer transition-colors ${
                      selectedSource === source.id 
                        ? 'bg-zinc-950 text-white font-bold shadow-xs' 
                        : 'text-zinc-800 hover:bg-zinc-100 font-medium'
                    }`}
                  >
                    <span className="truncate mr-2">{source.name}</span>
                    {selectedSource === source.id && <Check className="w-3.5 h-3.5 shrink-0" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Reading Time Pill Group (Clay Inset Track) */}
          <div className="clay-inset p-0.5 rounded-full inline-flex items-center">
            <button
              type="button"
              onClick={(e) => {
                handleButtonClickGlow(e);
                onSelectReadTime('all');
              }}
              className={`px-2.5 sm:px-3 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                readTimeFilter === 'all'
                  ? 'clay-pill-active'
                  : 'text-zinc-600 hover:text-zinc-950'
              }`}
            >
              All Times
            </button>

            <button
              type="button"
              onClick={(e) => {
                handleButtonClickGlow(e);
                onSelectReadTime('short');
              }}
              className={`px-2.5 sm:px-3 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                readTimeFilter === 'short'
                  ? 'clay-pill-active'
                  : 'text-zinc-600 hover:text-zinc-950'
              }`}
            >
              &lt; 3m
            </button>

            <button
              type="button"
              onClick={(e) => {
                handleButtonClickGlow(e);
                onSelectReadTime('long');
              }}
              className={`px-2.5 sm:px-3 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                readTimeFilter === 'long'
                  ? 'clay-pill-active'
                  : 'text-zinc-600 hover:text-zinc-950'
              }`}
            >
              6m+ Deep
            </button>
          </div>

          {/* Verified Editorial Toggle */}
          <button
            type="button"
            onClick={(e) => {
              handleButtonClickGlow(e);
              onToggleVerified();
            }}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold inline-flex items-center space-x-1.5 transition-all cursor-pointer ${
              verifiedOnly
                ? 'clay-pill-active'
                : 'clay-btn text-zinc-700'
            }`}
          >
            <span>Verified Desk</span>
          </button>
        </div>

        {/* Right Side: Sort Order & Count */}
        <div className="flex items-center space-x-2">
          {/* Dispatch Count */}
          <span className="text-[11px] font-mono text-zinc-500 hidden sm:inline">
            Showing <strong className="text-zinc-900">{filteredCount}</strong> stories
          </span>

          {/* Sort Dropdown Popover */}
          <div className="relative">
            <button
              type="button"
              onClick={(e) => {
                handleButtonClickGlow(e);
                setIsSortMenuOpen(!isSortMenuOpen);
                setIsSourceMenuOpen(false);
              }}
              className="clay-btn inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-zinc-900 cursor-pointer"
            >
              <SortIcon className="w-3.5 h-3.5 text-zinc-700" />
              <span>{currentSort.label}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-zinc-400 transition-transform ${isSortMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {isSortMenuOpen && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-zinc-200 p-1.5 z-50 ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-150">
                {(Object.keys(sortLabels) as Array<keyof typeof sortLabels>).map((key) => {
                  const ItemIcon = sortLabels[key].icon;
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
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs cursor-pointer transition-colors ${
                        isSelected 
                          ? 'bg-zinc-950 text-white font-bold shadow-xs' 
                          : 'text-zinc-800 hover:bg-zinc-100 font-medium'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <ItemIcon className="w-3.5 h-3.5" />
                        <span>{sortLabels[key].label}</span>
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
