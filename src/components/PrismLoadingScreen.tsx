'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';

interface PrismLoadingScreenProps {
  edition?: 'india' | 'international';
  onLoaded?: () => void;
  message?: string;
}

export default function PrismLoadingScreen({
  edition = 'international',
  message,
}: PrismLoadingScreenProps) {
  const [progress, setProgress] = useState(15);
  const [statusText, setStatusText] = useState(
    message || 'Synchronizing multi-source global wire feeds...'
  );

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setProgress(48);
      setStatusText(
        edition === 'india'
          ? 'Synthesizing national dispatches from The Hindu, NDTV & Livemint...'
          : 'Synthesizing global dispatches from FT, NYT, BBC & Hacker News...'
      );
    }, 400);

    const timer2 = setTimeout(() => {
      setProgress(82);
      setStatusText('Calibrating Groq Qwen-3 AI intelligence models...');
    }, 900);

    const timer3 = setTimeout(() => {
      setProgress(100);
      setStatusText('Refracting verified signals • Launching PRISM...');
    }, 1400);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [edition]);

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black/95 text-white overflow-hidden select-none animate-fadeIn">
      {/* Background Hero Prism Refraction Visual */}
      <div className="absolute inset-0 z-0 opacity-40 mix-blend-screen scale-105 pointer-events-none">
        <Image
          src="/prism-hero.png"
          alt="PRISM Optical Refraction"
          fill
          priority
          className="object-cover object-center filter blur-xs"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/80" />
      </div>

      {/* Central Apple Vision Glass Capsule */}
      <div className="relative z-10 max-w-lg w-full mx-auto px-6 flex flex-col items-center text-center">
        {/* Optical Glass Icon Badge */}
        <div className="relative mb-6 group">
          <div className="w-20 h-20 rounded-3xl bg-zinc-900/90 border border-white/20 shadow-[0_0_40px_rgba(56,189,248,0.35)] flex items-center justify-center backdrop-blur-2xl transition-transform duration-500 hover:scale-105">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-400 via-teal-300 to-cyan-400 rotate-45 shadow-lg animate-pulse" />
          </div>
          <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-emerald-500/20 via-sky-500/30 to-purple-500/20 blur-xl -z-10 animate-pulse" />
        </div>

        {/* Brand Title */}
        <div className="flex items-center space-x-2.5 mb-2">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white drop-shadow-md">
            PRISM
          </h1>
          <span className="px-2 py-0.5 rounded-full bg-white/10 text-[10px] font-mono tracking-widest text-emerald-400 border border-white/15 uppercase font-bold">
            LIVE WIRE
          </span>
        </div>

        <p className="text-xs sm:text-sm text-zinc-400 font-sans tracking-wide max-w-sm mb-8 leading-relaxed">
          Refracting global signal from unverified noise with sub-millisecond precision.
        </p>

        {/* Spectrum Refraction Progress Bar */}
        <div className="w-full max-w-xs space-y-2.5 mb-4">
          <div className="h-1.5 w-full bg-zinc-800/80 rounded-full overflow-hidden p-0.5 border border-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-emerald-400 via-amber-400 to-rose-500 transition-all duration-500 ease-out shadow-[0_0_12px_rgba(52,211,153,0.8)]"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
            <span className="truncate max-w-[220px] text-left">{statusText}</span>
            <span className="font-bold text-emerald-400">{progress}%</span>
          </div>
        </div>

        {/* Edition Subtext */}
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] text-zinc-300 font-medium">
          <span>{edition === 'india' ? '🇮🇳 India Editorial Stream' : '🌐 Global Wire Edition'}</span>
        </div>
      </div>
    </div>
  );
}
