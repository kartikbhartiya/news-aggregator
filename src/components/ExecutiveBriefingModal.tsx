'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ExecutiveBriefing } from '@/types/news';
import { X, Play, Pause, Sparkles, Shield, Clock, TrendingUp, RotateCw, Volume2, VolumeX } from 'lucide-react';
import { handleButtonClickGlow } from '@/lib/button-glow';
import { speechEngine } from '@/lib/speech';

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
  const [speechAvailable, setSpeechAvailable] = useState(true);

  // Persistent ref prevents Chrome V8 garbage collector from terminating speech
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

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

  // Audio setup & cleanup
  useEffect(() => {
    setSpeechAvailable(speechEngine.isSupported());

    return () => {
      speechEngine.stop();
      setIsPlayingAudio(false);
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        speechEngine.stop();
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      speechEngine.stop();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleToggleAudio = (e: React.MouseEvent) => {
    handleButtonClickGlow(e);
    if (!speechEngine.isSupported() || !briefing) return;

    if (isPlayingAudio) {
      speechEngine.stop();
      setIsPlayingAudio(false);
      return;
    }

    const narrationText = `Prism Executive Intelligence Brief. Date: ${briefing.date}. ` +
      `Strategic Lead: ${briefing.leadHighlight}. ` +
      `Global Pulse: ${briefing.globalPulse}. ` +
      `Market Outlook: ${briefing.marketOutlook}. ` +
      briefing.keyDevelopments.map((d, i) => `Key Signal ${i + 1}: ${d.title}. ${d.summary}`).join('. ');

    const success = speechEngine.speak(narrationText, {
      rate: playbackSpeed,
      onStart: () => setIsPlayingAudio(true),
      onEnd: () => setIsPlayingAudio(false),
      onError: () => setIsPlayingAudio(false),
    });

    if (success) {
      setIsPlayingAudio(true);
    }
  };

  const handleSpeedCycle = (e: React.MouseEvent) => {
    handleButtonClickGlow(e);
    const nextSpeed = playbackSpeed === 1 ? 1.25 : playbackSpeed === 1.25 ? 1.5 : 1;
    setPlaybackSpeed(nextSpeed);
    if (isPlayingAudio && briefing) {
      speechEngine.stop();
      setIsPlayingAudio(false);
      const narrationText = `Prism Executive Intelligence Brief. Date: ${briefing.date}. ` +
        `Strategic Lead: ${briefing.leadHighlight}. ` +
        `Global Pulse: ${briefing.globalPulse}. ` +
        `Market Outlook: ${briefing.marketOutlook}. ` +
        briefing.keyDevelopments.map((d, i) => `Key Signal ${i + 1}: ${d.title}. ${d.summary}`).join('. ');
      speechEngine.speak(narrationText, {
        rate: nextSpeed,
        onStart: () => setIsPlayingAudio(true),
        onEnd: () => setIsPlayingAudio(false),
        onError: () => setIsPlayingAudio(false),
      });
      setIsPlayingAudio(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 flex justify-center items-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={onClose} />
      
      {/* Modal Container */}
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl my-auto flex flex-col max-h-[90vh] overflow-hidden border border-zinc-200 animate-in zoom-in-95 duration-200 z-10">
        
        {/* Header */}
        <div className="px-5 sm:px-6 py-4 border-b border-zinc-200 bg-white flex items-center justify-between gap-3">
          <div className="flex items-center space-x-2.5">
            <div className="clay-btn-dark w-8 h-8 rounded-xl flex items-center justify-center text-white shadow-xs">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-500">
                EXECUTIVE INTELLIGENCE
              </div>
              <h3 className="font-serif text-base sm:text-lg font-bold text-zinc-950 tracking-tight">
                3-Minute Editorial Brief
              </h3>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {briefing && speechAvailable && (
              <div className="flex items-center rounded-xl bg-zinc-100 border border-zinc-200 p-0.5">
                <button
                  type="button"
                  onClick={handleToggleAudio}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold inline-flex items-center space-x-1.5 transition-all cursor-pointer ${
                    isPlayingAudio
                      ? 'clay-btn-dark shadow-xs'
                      : 'text-zinc-800 hover:bg-white'
                  }`}
                >
                  {isPlayingAudio ? (
                    <>
                      <Pause className="w-3.5 h-3.5 text-white" />
                      <span>Pause</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 text-zinc-900" />
                      <span>Listen</span>
                    </>
                  )}
                </button>
                {isPlayingAudio && (
                  <button
                    type="button"
                    onClick={handleSpeedCycle}
                    className="px-2 py-1.5 text-[10px] font-mono text-zinc-600 hover:text-zinc-950 font-bold"
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
              className="clay-btn p-2 rounded-xl text-zinc-700 cursor-pointer"
              title="Re-synthesize latest wire signals"
            >
              <RotateCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-zinc-950' : ''}`} />
            </button>

            <button
              type="button"
              onClick={(e) => {
                handleButtonClickGlow(e);
                onClose();
              }}
              className="clay-btn p-2 rounded-xl text-zinc-950 cursor-pointer hover:bg-zinc-100"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Focus Topic Pills */}
        <div className="px-5 sm:px-6 py-2 bg-zinc-50 border-b border-zinc-200 flex items-center space-x-1.5 overflow-x-auto no-scrollbar">
          <span className="text-[10px] font-mono uppercase text-zinc-400 font-bold mr-1">Focus:</span>
          {(['all', 'tech', 'markets', 'world'] as const).map((topic) => (
            <button
              key={topic}
              type="button"
              onClick={(e) => {
                handleButtonClickGlow(e);
                setActiveTopic(topic);
              }}
              className={`clay-pill px-3 py-1 text-xs font-bold capitalize transition-all cursor-pointer ${
                activeTopic === topic
                  ? 'clay-pill-active'
                  : 'text-zinc-700'
              }`}
            >
              {topic === 'all' ? 'All Signals' : topic}
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto p-5 sm:p-8 space-y-6">
          {isLoading && !briefing ? (
            <div className="py-20 text-center space-y-3">
              <div className="w-8 h-8 rounded-full border-2 border-zinc-950 border-t-transparent animate-spin mx-auto" />
              <div className="font-serif text-base font-bold text-zinc-900">Synthesizing Wire Intelligence...</div>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto font-normal">
                Compiling breaking dispatches across global and national newsdesks
              </p>
            </div>
          ) : briefing ? (
            <>
              {/* Prominent Audio Readout Bar */}
              <div className="clay-card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-zinc-50 border border-zinc-200">
                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={handleToggleAudio}
                    className="clay-btn-dark p-3 rounded-2xl flex items-center justify-center shrink-0 shadow-md cursor-pointer"
                  >
                    {isPlayingAudio ? (
                      <Pause className="w-5 h-5 text-white" />
                    ) : (
                      <Play className="w-5 h-5 text-white ml-0.5" />
                    )}
                  </button>
                  <div>
                    <div className="text-xs font-bold text-zinc-950">
                      {isPlayingAudio ? 'Audio Playback Active' : 'Listen to Complete 3-Minute Briefing'}
                    </div>
                    <div className="text-[11px] text-zinc-500 font-mono">
                      {isPlayingAudio ? `Speed: ${playbackSpeed}x • Click Pause to stop` : 'Click to hear high-clarity voice narration'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={handleToggleAudio}
                    className={`clay-btn px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer ${
                      isPlayingAudio ? 'bg-zinc-950 text-white' : 'text-zinc-900'
                    }`}
                  >
                    {isPlayingAudio ? 'Stop Reading' : 'Play Narration'}
                  </button>
                  {isPlayingAudio && (
                    <button
                      type="button"
                      onClick={handleSpeedCycle}
                      className="clay-btn px-2.5 py-1.5 rounded-xl text-xs font-mono font-bold text-zinc-900 cursor-pointer"
                    >
                      {playbackSpeed}x
                    </button>
                  )}
                </div>
              </div>

              {/* Lead Strategic Highlight */}
              <div className="clay-card p-5 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="font-bold text-zinc-900 bg-zinc-100 px-2 py-0.5 rounded-full border border-zinc-200">
                    STRATEGIC LEAD
                  </span>
                  <span className="text-zinc-500">{briefing.date}</span>
                </div>
                <h4 className="font-serif text-xl sm:text-2xl font-bold text-zinc-950 leading-snug">
                  {briefing.leadHighlight}
                </h4>
              </div>

              {/* Two Column Macro Signals */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-1.5">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-bold flex items-center space-x-1">
                    <TrendingUp className="w-3.5 h-3.5 text-zinc-900" />
                    <span>Global Geopolitical Pulse</span>
                  </div>
                  <p className="text-xs sm:text-sm text-zinc-700 leading-relaxed font-normal">
                    {briefing.globalPulse}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-1.5">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-bold flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5 text-zinc-900" />
                    <span>Market & Liquidity Outlook</span>
                  </div>
                  <p className="text-xs sm:text-sm text-zinc-700 leading-relaxed font-normal">
                    {briefing.marketOutlook}
                  </p>
                </div>
              </div>

              {/* Key Developments Wire */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center space-x-2 text-xs font-mono font-bold uppercase tracking-wider text-zinc-900">
                  <Shield className="w-3.5 h-3.5" />
                  <span>Key Editorial Developments</span>
                </div>

                <div className="space-y-2.5">
                  {briefing.keyDevelopments.map((dev, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-2xs space-y-1"
                    >
                      <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500">
                        <span className="font-bold text-zinc-900 uppercase">{dev.category}</span>
                        <span className="px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-800 font-semibold border border-zinc-200">
                          {dev.impact} Impact
                        </span>
                      </div>
                      <h5 className="font-serif text-sm sm:text-base font-bold text-zinc-950">
                        {dev.title}
                      </h5>
                      <p className="text-xs text-zinc-600 leading-relaxed">
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
