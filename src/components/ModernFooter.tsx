'use client';

import React, { useState, useEffect } from 'react';
import { ArrowUp, Globe2, Sparkles, ShieldCheck, Radio, Clock, ExternalLink } from 'lucide-react';
import { handleButtonClickGlow } from '@/lib/button-glow';
import PrismLogo from '@/components/PrismLogo';

interface ModernFooterProps {
  edition: 'india' | 'international';
  onSelectEdition: (edition: 'india' | 'international') => void;
  onOpenBriefing?: () => void;
}

export default function ModernFooter({
  edition,
  onSelectEdition,
  onOpenBriefing,
}: ModernFooterProps) {
  const [utcTime, setUtcTime] = useState<string>('');
  const [istTime, setIstTime] = useState<string>('');

  useEffect(() => {
    const updateTimes = () => {
      const now = new Date();
      setUtcTime(now.toLocaleTimeString('en-US', { timeZone: 'UTC', hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' UTC');
      setIstTime(now.toLocaleTimeString('en-US', { timeZone: 'Asia/Kolkata', hour12: true, hour: '2-digit', minute: '2-digit' }) + ' IST');
    };
    updateTimes();
    const timer = setInterval(updateTimes, 1000);
    return () => clearInterval(timer);
  }, []);

  const scrollToTop = (e: React.MouseEvent) => {
    handleButtonClickGlow(e);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="mt-28 border-t border-zinc-200 bg-[#FAFAFA] text-zinc-900 select-none">
      
      {/* 1. Grand Masthead Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-12">
        <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-8 pb-12 border-b border-zinc-200">
          
          <div className="space-y-3">
            <div className="flex items-center space-x-3.5">
              <PrismLogo size="lg" />
              <div>
                <span className="font-cursive text-5xl sm:text-6xl md:text-7xl font-normal text-zinc-950 tracking-normal block leading-none">
                  Prism
                </span>
                <span className="text-[10px] sm:text-xs font-mono font-bold tracking-[0.25em] uppercase text-zinc-500 block mt-1">
                  NEWS AGGREGATOR & WIRE TELEMETRY
                </span>
              </div>
            </div>
            <p className="max-w-md text-xs sm:text-sm text-zinc-600 font-serif leading-relaxed">
              Curated real-time executive news aggregation with in-app multi-paragraph reading, instantaneous AI audio synthesis, and tactile clay architecture.
            </p>
          </div>

          {/* Telemetry Status Deck & Back To Top */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full lg:w-auto">
            {/* Live Dual Time Ribbon */}
            <div className="clay-card px-4 py-2.5 rounded-2xl flex items-center space-x-3 text-xs font-mono text-zinc-700 w-full sm:w-auto justify-between sm:justify-start">
              <div className="flex items-center space-x-1.5">
                <Clock className="w-3.5 h-3.5 text-zinc-500" />
                <span className="font-bold text-zinc-950">{istTime || 'Live IST'}</span>
              </div>
              <span className="text-zinc-300">•</span>
              <span className="text-zinc-500">{utcTime || 'UTC'}</span>
              <span className="text-zinc-300">•</span>
              <span className="inline-flex items-center text-[10px] font-bold uppercase text-zinc-900 bg-zinc-100 px-2 py-0.5 rounded-md border border-zinc-200">
                Live Feed
              </span>
            </div>

            {/* Back to top tactile clay button */}
            <button
              type="button"
              onClick={scrollToTop}
              className="clay-btn px-4 py-2.5 rounded-2xl text-xs font-bold inline-flex items-center space-x-2 text-zinc-950 cursor-pointer shadow-xs w-full sm:w-auto justify-center"
              title="Return to top of page"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 2. Structured Editorial Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 border-b border-zinc-200 text-xs">
          
          {/* Col 1: Wire Editions */}
          <div className="space-y-3">
            <h4 className="font-mono font-bold text-[11px] uppercase tracking-wider text-zinc-950">
              Wire Editions
            </h4>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => onSelectEdition('india')}
                className={`w-full text-left px-3 py-2 rounded-xl transition-all cursor-pointer font-medium ${
                  edition === 'india'
                    ? 'clay-btn-dark text-white font-bold'
                    : 'clay-btn text-zinc-700 hover:text-zinc-950'
                }`}
              >
                🇮🇳 India National Wire
              </button>
              <button
                type="button"
                onClick={() => onSelectEdition('international')}
                className={`w-full text-left px-3 py-2 rounded-xl transition-all cursor-pointer font-medium ${
                  edition === 'international'
                    ? 'clay-btn-dark text-white font-bold'
                    : 'clay-btn text-zinc-700 hover:text-zinc-950'
                }`}
              >
                🌐 Global Diplomatic Wire
              </button>
            </div>
          </div>

          {/* Col 2: Core Sections */}
          <div className="space-y-3">
            <h4 className="font-mono font-bold text-[11px] uppercase tracking-wider text-zinc-950">
              Editorial Desks
            </h4>
            <ul className="space-y-2 text-zinc-600">
              <li className="hover:text-zinc-950 transition-colors cursor-pointer">Artificial Intelligence & Tech</li>
              <li className="hover:text-zinc-950 transition-colors cursor-pointer">Global Financial Markets</li>
              <li className="hover:text-zinc-950 transition-colors cursor-pointer">Geopolitics & Defense</li>
              <li className="hover:text-zinc-950 transition-colors cursor-pointer">Macroeconomics & Policy</li>
              <li className="hover:text-zinc-950 transition-colors cursor-pointer">Quantum & Energy Science</li>
            </ul>
          </div>

          {/* Col 3: Architecture & Features */}
          <div className="space-y-3">
            <h4 className="font-mono font-bold text-[11px] uppercase tracking-wider text-zinc-950">
              Platform Features
            </h4>
            <ul className="space-y-2 text-zinc-600">
              <li className="flex items-center space-x-1.5 text-zinc-900 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Tactile Claymorphic Surfaces</span>
              </li>
              <li>In-App Complete Article Parser</li>
              <li>Instant Natural Voice Audio TTS</li>
              <li>Curated NewsData & RSS Ingestion</li>
              <li>High-Signal Wire Telemetry</li>
            </ul>
          </div>

          {/* Col 4: Executive Synthesis */}
          <div className="space-y-3">
            <h4 className="font-mono font-bold text-[11px] uppercase tracking-wider text-zinc-950">
              Executive Briefing
            </h4>
            <p className="text-zinc-600 leading-relaxed">
              Synthesized 3-minute macro wire intelligence generated by Groq high-speed AI inference.
            </p>
            {onOpenBriefing && (
              <button
                type="button"
                onClick={onOpenBriefing}
                className="clay-btn-dark px-3 py-1.5 rounded-xl text-xs font-bold text-white inline-flex items-center space-x-1.5 cursor-pointer shadow-xs"
              >
                <Sparkles className="w-3 h-3 text-white" />
                <span>Open Executive Brief</span>
              </button>
            )}
          </div>
        </div>

        {/* 3. Bottom Legal & Institutional Colophon */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500 font-mono">
          <div className="flex items-center space-x-2">
            <span className="font-cursive text-xl text-zinc-950 font-normal">Prism</span>
            <span>•</span>
            <span>All wire dispatches property of respective publisher newsrooms.</span>
          </div>

          <div className="flex items-center space-x-4">
            <span className="hover:text-zinc-950 cursor-pointer">Editorial Ethics</span>
            <span>•</span>
            <span className="hover:text-zinc-950 cursor-pointer">API Telemetry</span>
            <span>•</span>
            <span className="hover:text-zinc-950 cursor-pointer">Privacy & Terms</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
