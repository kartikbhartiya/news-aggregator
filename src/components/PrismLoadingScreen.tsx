'use client';

import React, { useEffect, useState } from 'react';

interface PrismLoadingScreenProps {
  edition?: 'india' | 'international';
  onLoaded?: () => void;
  message?: string;
}

export default function PrismLoadingScreen({
  edition = 'international',
  message,
}: PrismLoadingScreenProps) {
  const [progress, setProgress] = useState(25);
  const [statusText, setStatusText] = useState(
    message || 'Loading live news wire...'
  );

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setProgress(60);
      setStatusText(
        edition === 'india'
          ? 'Fetching dispatches from The Hindu, NDTV & Livemint...'
          : 'Fetching global dispatches from Financial Times, NYT & BBC...'
      );
    }, 250);

    const timer2 = setTimeout(() => {
      setProgress(90);
      setStatusText('Formatting editorial feeds & AI briefings...');
    }, 550);

    const timer3 = setTimeout(() => {
      setProgress(100);
      setStatusText('Ready');
    }, 850);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [edition]);

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#09090B] text-white select-none">
      <div className="max-w-sm w-full mx-auto px-6 flex flex-col items-center text-center">
        {/* Minimal Crisp Vector Emblem (No Images, No Translucency) */}
        <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-6 shadow-xl">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-emerald-400 via-teal-300 to-cyan-400 rotate-45 shadow-sm" />
        </div>

        {/* Brand Name */}
        <div className="flex items-center space-x-2 mb-2">
          <h1 className="text-2xl font-extrabold tracking-tight text-white font-sans">
            PRISM
          </h1>
          <span className="px-2 py-0.5 rounded-full bg-zinc-800 text-[10px] font-mono tracking-widest text-emerald-400 border border-zinc-700 uppercase font-bold">
            LIVE
          </span>
        </div>

        <p className="text-xs text-zinc-400 mb-8 font-sans">
          Curated real-time news & intelligence
        </p>

        {/* Clean Apple Minimal Hairline Progress Bar */}
        <div className="w-48 space-y-2 mb-3">
          <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-emerald-400 transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500">
            <span className="truncate max-w-[150px] text-left">{statusText}</span>
            <span className="font-semibold text-zinc-400">{progress}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
