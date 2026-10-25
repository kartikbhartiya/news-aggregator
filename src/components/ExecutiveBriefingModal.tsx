'use client';

import React, { useState, useEffect } from 'react';
import { ExecutiveBriefing } from '@/types/news';
import { X, Play, Pause, Sparkles, Shield, Clock, TrendingUp, Check, RotateCw, Volume2 } from 'lucide-react';
import { handleButtonClickGlow } from '@/lib/button-glow';

interface ExecutiveBriefingModalProps {
  isOpen: boolean;
  onClose: () => void;
  edition?: 'india' | 'international';
}

export default function ExecutiveBriefingModal({
  isOpen,
  onClose,
  edition = 'international',
}: ExecutiveBriefingModalProps) {
  const [briefing, setBriefing] = useState<ExecutiveBriefing | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [activeTopic, setActiveTopic] = useState<'all' | 'tech' | 'markets' | 'world'>('all');

  const loadBriefing = async (topic = activeTopic, refresh = false) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/news/briefing?category=${topic}&refresh=${refresh}&edition=${edition}`);
      if (res.ok) {
        const data = await res.json();
        setBriefing(data);
      }
    } catch (e) {
      console.error('Failed to load dynamic briefing:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    loadBriefing(activeTopic, false);
  }, [isOpen, activeTopic, edition]);

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

  const handleToggleAudio = (e: React.MouseEvent) => {
    handleButtonClickGlow(e);
    if (typeof window === 'undefined' || !('speechSynthesis' in window) || !briefing) return;

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    window.speechSynthesis.cancel();
    const narrationText = `Prism Executive Intelligence Brief for ${briefing.date}. Strategic Lead: ${briefing.leadHighlight}. Global Pulse: ${briefing.globalPulse}. Market Outlook: ${briefing.marketOutlook}. ` +
      briefing.keyDevelopments.map((d, i) => `Signal ${i + 1}: ${d.title}. ${d.summary}`).join('. ');

    const utterance = new SpeechSynthesisUtterance(narrationText);
    utterance.rate = playbackSpeed;
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const naturalVoice = voices.find((v) => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha')));
    if (naturalVoice) utterance.voice = naturalVoice;

    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    window.speechSynthesis.speak(utterance);
    setIsPlayingAudio(true);
  };

  const handleSpeedCycle = (e: React.MouseEvent) => {
    handleButtonClickGlow(e);
    const nextSpeed = playbackSpeed === 1 ? 1.25 : playbackSpeed === 1.25 ? 1.5 : 1;
    setPlaybackSpeed(nextSpeed);
    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      setTimeout(() => handleToggleAudio(e), 100);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-zinc-950/45 backdrop-blur-md flex justify-center items-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl liquid-glass-panel rounded-3xl sm:rounded-[36px] shadow-2xl my-auto flex flex-col max-h-[90vh] overflow-hidden border border-white/70 animate-in zoom-in-95 duration-200">
        {/* Apple Style Glass Header */}
        <div className="px-6 py-4.5 border-b border-zinc-200/60 bg-white/70 backdrop-blur-xl flex items-center justify-between gap-4">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-400 to-amber-600 flex items-center justify-center text-white shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-500">
                AI INTELLIGENCE SYNTHESIS
              </div>
              <h3 className="text-base font-extrabold text-zinc-950 tracking-tight">
                3-Minute Executive Brief
              </h3>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {briefing && (
              <div className="flex items-center rounded-xl bg-white/80 border border-zinc-200/70 p-0.5 shadow-2xs">
                <button
                  type="button"
                  onClick={handleToggleAudio}
                  className={`apple-btn px-3 py-1.5 rounded-lg text-xs font-semibold inline-flex items-center space-x-1.5 transition-all cursor-pointer ${
                    isPlayingAudio
                      ? 'bg-zinc-950 text-white shadow-xs'
                      : 'text-zinc-800 hover:bg-zinc-100'
                  }`}
                >
                  {isPlayingAudio ? (
                    <>
                      <Pause className="w-3.5 h-3.5" />
                      <span>Pause</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5" />
                      <span>Listen</span>
                    </>
                  )}
                </button>
                {isPlayingAudio && (
                  <button
                    type="button"
                    onClick={handleSpeedCycle}
                    className="apple-btn px-2 py-1.5 text-[10px] font-mono text-zinc-600 hover:text-zinc-950"
                  >
                    {playbackSpeed}x
                  </button>
                )}
              </div>
            )}

            <button
              type="button"
              onClick={(e) => {
                handleButtonClickGlow(e);
                loadBriefing(activeTopic, true);
              }}
              className="apple-glass-btn apple-btn p-2 rounded-xl text-zinc-600"
              title="Re-synthesize latest live signals"
            >
              <RotateCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>

            <button
              type="button"
              onClick={(e) => {
                handleButtonClickGlow(e);
                onClose();
              }}
              className="apple-glass-btn apple-btn p-2 rounded-xl text-zinc-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Topic Filter Tabs */}
        <div className="px-6 py-2 bg-zinc-50/70 border-b border-zinc-200/60 flex items-center space-x-2 overflow-x-auto no-scrollbar">
          <span className="text-[10px] font-mono uppercase text-zinc-400 font-bold mr-1">Focus:</span>
          {(['all', 'tech', 'markets', 'world'] as const).map((topic) => (
            <button
              key={topic}
              type="button"
              onClick={(e) => {
                handleButtonClickGlow(e);
                setActiveTopic(topic);
              }}
              className={`apple-btn px-3 py-1 rounded-full text-xs font-semibold capitalize transition-all cursor-pointer ${
                activeTopic === topic
                  ? 'bg-zinc-900 text-white shadow-xs'
                  : 'bg-white/80 hover:bg-white text-zinc-600 border border-zinc-200/60'
              }`}
            >
              {topic === 'all' ? 'All Signals' : topic}
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-6">
          {isLoading && !briefing ? (
            <div className="py-20 text-center space-y-3">
              <div className="w-8 h-8 rounded-full border-2 border-zinc-900 border-t-transparent animate-spin mx-auto" />
              <div className="text-sm font-bold text-zinc-800">Synthesizing Real-Time Wire Intelligence...</div>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                Analyzing breaking stories from NewsData.io, NYT, BBC, and tech feeds
              </p>
            </div>
          ) : briefing ? (
            <>
              {/* Audio Waveform Indicator when playing */}
              {isPlayingAudio && (
                <div className="p-3.5 rounded-2xl bg-zinc-950 text-white flex items-center justify-between animate-pulse">
                  <div className="flex items-center space-x-2 text-xs font-mono">
                    <Volume2 className="w-4 h-4 text-emerald-400" />
                    <span>AUDIO BRIEFING PLAYING • {playbackSpeed}X SPEED</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    {[40, 75, 55, 95, 60, 80, 45].map((h, i) => (
                      <div
                        key={i}
                        className="w-1 bg-emerald-400 rounded-full animate-bounce"
                        style={{ height: `${h * 0.25}px`, animationDelay: `${i * 120}ms` }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Lead Strategic Highlight */}
              <div className="p-5 rounded-3xl bg-white/90 border border-zinc-200/80 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/80">
                    STRATEGIC LEAD
                  </span>
                  <span className="text-zinc-500">{briefing.date}</span>
                </div>
                <h4 className="text-lg sm:text-xl font-extrabold text-zinc-950 tracking-tight leading-snug">
                  {briefing.leadHighlight}
                </h4>
              </div>

              {/* Macro Indicators */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="p-4 rounded-2xl bg-white/80 border border-zinc-200/70">
                  <div className="text-[10px] font-mono font-bold uppercase text-zinc-400 mb-1">
                    Global Pulse
                  </div>
                  <p className="text-xs text-zinc-800 leading-relaxed font-medium">
                    {briefing.globalPulse}
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-white/80 border border-zinc-200/70">
                  <div className="text-[10px] font-mono font-bold uppercase text-zinc-400 mb-1">
                    Capital & Market Outlook
                  </div>
                  <p className="text-xs text-zinc-800 leading-relaxed font-medium">
                    {briefing.marketOutlook}
                  </p>
                </div>
              </div>

              {/* Key Developments */}
              <div className="space-y-3 pt-2">
                <div className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-900">
                  Key Strategic Developments ({briefing.keyDevelopments.length})
                </div>

                <div className="space-y-3">
                  {briefing.keyDevelopments.map((dev, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-white/90 border border-zinc-200/70 hover:border-zinc-300 transition-all flex flex-col justify-between"
                    >
                      <div className="flex items-center justify-between text-[11px] font-mono mb-1.5">
                        <span className="font-bold text-zinc-900 uppercase">
                          {idx + 1}. {dev.category}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                            dev.impact === 'Critical'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : dev.impact === 'High'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-zinc-100 text-zinc-700'
                          }`}
                        >
                          {dev.impact} Impact
                        </span>
                      </div>

                      <h5 className="font-bold text-sm text-zinc-950 leading-snug">
                        {dev.title}
                      </h5>
                      <p className="mt-1 text-xs text-zinc-600 leading-relaxed font-normal">
                        {dev.summary}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
