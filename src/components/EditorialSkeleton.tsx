'use client';

import React from 'react';
import { ShieldCheck, Sparkles, Radio } from 'lucide-react';

interface EditorialSkeletonProps {
  edition?: 'india' | 'international';
}

/**
 * EditorialSkeleton
 * Ultra-premium Apple loading experience.
 * Explicitly designed with:
 * - NO loading bars
 * - NO rotating spinners / bars
 * - Pristine Apple white glass pedestal with breathing geometric insignia
 * - Real-time editorial telemetry status
 */
export default function EditorialSkeleton({ edition = 'international' }: EditorialSkeletonProps) {
  return (
    <div className="w-full py-20 px-4 flex flex-col items-center justify-center animate-in fade-in duration-500">
      <div className="relative max-w-md w-full rounded-[36px] bg-white border border-zinc-200/80 p-8 sm:p-10 shadow-2xl text-center overflow-hidden">
        {/* Soft Ambient Backlight */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

        {/* Breathing Apple Insignia */}
        <div className="relative mx-auto mb-6 flex items-center justify-center">
          <div className="relative w-16 h-16 rounded-2xl bg-zinc-950 flex items-center justify-center shadow-xl border border-zinc-800">
            {/* Multifaceted Crystal Diamond */}
            <div className="w-6 h-6 rounded-md bg-gradient-to-tr from-emerald-400 via-teal-300 to-cyan-400 rotate-45 animate-pulse shadow-sm" />
          </div>
          {/* Subtle Outer Halo Ring */}
          <div className="absolute inset-0 -m-2 rounded-3xl border border-emerald-500/20 animate-ping opacity-30" />
        </div>

        {/* Brand Headline */}
        <div className="space-y-1 mb-4">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-zinc-100 text-[10px] font-mono font-bold tracking-widest text-zinc-600 border border-zinc-200/80">
            <Radio className="w-3 h-3 text-emerald-600 animate-pulse" />
            <span>CONNECTING WIRE TELEMETRY</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-zinc-950 tracking-tight">
            Curating {edition === 'india' ? 'India' : 'Global'} Intelligence
          </h3>
          <p className="text-xs text-zinc-500 max-w-xs mx-auto leading-relaxed">
            {edition === 'india'
              ? 'Synthesizing live reports across The Hindu, NDTV, Livemint, Indian Express & NewsData.io'
              : 'Synthesizing live reports across The New York Times, BBC, Ars Technica & Hacker News'}
          </p>
        </div>

        {/* Minimalist Breathing Harmonic Pulse Dots (NOT a rotating bar or spinner) */}
        <div className="flex items-center justify-center space-x-2 my-6">
          <span className="w-2 h-2 rounded-full bg-zinc-900 animate-[bounce_1.4s_infinite_0ms]" />
          <span className="w-2 h-2 rounded-full bg-zinc-900 animate-[bounce_1.4s_infinite_200ms]" />
          <span className="w-2 h-2 rounded-full bg-zinc-900 animate-[bounce_1.4s_infinite_400ms]" />
        </div>

        {/* Editorial Integrity Assurance */}
        <div className="pt-4 border-t border-zinc-100 flex items-center justify-center space-x-4 text-[11px] font-mono text-zinc-400">
          <span className="flex items-center space-x-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Verified Sources</span>
          </span>
          <span>•</span>
          <span className="flex items-center space-x-1">
            <Sparkles className="w-3.5 h-3.5 text-zinc-500" />
            <span>WebGL Liquid Glass</span>
          </span>
        </div>
      </div>
    </div>
  );
}
