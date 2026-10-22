'use client';

import React, { useState, useEffect } from 'react';
import { ExecutiveBriefing } from '@/types/news';
import { X, Play, Pause, Sparkles, Shield, Clock, TrendingUp, Check } from 'lucide-react';

interface ExecutiveBriefingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ExecutiveBriefingModal({
  isOpen,
  onClose,
}: ExecutiveBriefingModalProps) {
  const [briefing, setBriefing] = useState<ExecutiveBriefing | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    async function loadBriefing() {
      setIsLoading(true);
      try {
        const res = await fetch('/api/news/briefing');
        if (res.ok) {
          const data = await res.json();
          setBriefing(data);
        }
      } catch (e) {
        console.error('Failed to load briefing:', e);
      } finally {
        setIsLoading(false);
      }
    }
    loadBriefing();
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleToggleAudio = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window) || !briefing) return;

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    window.speechSynthesis.cancel();
    const narrationText = `Veritas Daily Executive Briefing for ${briefing.date}. ${briefing.leadHighlight}. Global Pulse: ${briefing.globalPulse}. Market Outlook: ${briefing.marketOutlook}. ` +
      briefing.keyDevelopments.map((d) => `${d.title}. ${d.summary}`).join('. ');

    const utterance = new SpeechSynthesisUtterance(narrationText);
    utterance.rate = 1.05;
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);
    window.speechSynthesis.speak(utterance);
    setIsPlayingAudio(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-white border border-stone-200 shadow-2xl rounded-none my-auto flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header Ribbon */}
        <div className="px-6 py-4 border-b border-stone-200 bg-stone-50/70 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-live-pulse" />
            <span className="text-xs font-mono font-semibold uppercase tracking-widest text-stone-900">
              EXECUTIVE INTELLIGENCE SYNTHESIS
            </span>
          </div>

          <div className="flex items-center space-x-2">
            {briefing && (
              <button
                type="button"
                onClick={handleToggleAudio}
                className={`inline-flex items-center space-x-1.5 px-2.5 py-1 text-xs font-medium border transition-colors cursor-pointer ${
                  isPlayingAudio
                    ? 'bg-amber-100 text-amber-950 border-amber-300'
                    : 'bg-white hover:bg-stone-100 text-stone-700 border-stone-200'
                }`}
              >
                {isPlayingAudio ? (
                  <>
                    <Pause className="w-3.5 h-3.5 text-amber-900" />
                    <span>Pause Audio</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 text-stone-700" />
                    <span>Listen (3 Min)</span>
                  </>
                )}
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 text-stone-500 hover:text-stone-900 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-6">
          {isLoading || !briefing ? (
            <div className="py-16 text-center">
              <div className="animate-spin w-6 h-6 border-2 border-stone-800 border-t-transparent mx-auto mb-3" />
              <div className="font-mono text-xs text-stone-500">Synthesizing global wire dispatches...</div>
            </div>
          ) : (
            <>
              {/* Date & Edition */}
              <div className="border-b border-stone-200 pb-4">
                <div className="text-[10px] font-mono uppercase tracking-widest text-stone-400">
                  {briefing.edition}
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl font-normal text-stone-900 mt-1">
                  Global Morning Synthesis
                </h2>
                <div className="text-xs font-mono text-stone-500 mt-1">{briefing.date}</div>
              </div>

              {/* Lead Highlight Hero Quote */}
              <div className="p-4 sm:p-5 bg-stone-50 border-l-3 border-stone-900">
                <div className="text-[10px] font-mono uppercase font-bold tracking-wider text-stone-500 mb-1">
                  Lead Strategic Inflection
                </div>
                <p className="font-serif text-base sm:text-lg text-stone-900 italic leading-relaxed">
                  &ldquo;{briefing.leadHighlight}&rdquo;
                </p>
              </div>

              {/* Macro Indicators */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 border border-stone-200 bg-white">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-stone-500">
                    Geopolitical Pulse
                  </div>
                  <div className="text-xs text-stone-800 mt-1 leading-relaxed">
                    {briefing.globalPulse}
                  </div>
                </div>

                <div className="p-3.5 border border-stone-200 bg-white">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-stone-500">
                    Capital Markets Outlook
                  </div>
                  <div className="text-xs text-stone-800 mt-1 leading-relaxed">
                    {briefing.marketOutlook}
                  </div>
                </div>
              </div>

              {/* Key Developments List */}
              <div>
                <div className="text-xs font-mono uppercase font-bold tracking-wider text-stone-900 mb-3 border-b border-stone-200 pb-2">
                  5 Key Developments Today
                </div>

                <div className="space-y-4">
                  {briefing.keyDevelopments.map((dev, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 border border-stone-200 hover:border-stone-400 transition-colors bg-white flex flex-col justify-between"
                    >
                      <div className="flex items-center justify-between text-[10px] font-mono mb-1.5">
                        <span className="font-semibold text-stone-900 uppercase">
                          {idx + 1}. {dev.category}
                        </span>
                        <div className="flex items-center space-x-2">
                          <span
                            className={`px-1.5 py-0.2 rounded font-mono font-medium ${
                              dev.impact === 'Critical'
                                ? 'bg-rose-100 text-rose-800'
                                : dev.impact === 'High'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-stone-100 text-stone-700'
                            }`}
                          >
                            {dev.impact} Impact
                          </span>
                          <span className="text-stone-400">{dev.timeAgo}</span>
                        </div>
                      </div>

                      <h4 className="font-serif text-base text-stone-900 font-medium leading-snug">
                        {dev.title}
                      </h4>

                      <p className="mt-1 text-xs text-stone-600 leading-relaxed font-sans">
                        {dev.summary}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
