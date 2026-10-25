'use client';

import React from 'react';
import { Newspaper } from 'lucide-react';

export default function EditorialSkeleton({ edition = 'international' }: { edition?: 'india' | 'international' }) {
  return (
    <div className="w-full py-20 px-4 flex flex-col items-center justify-center animate-in fade-in duration-300">
      <div className="clay-card max-w-md w-full p-8 sm:p-10 text-center">
        {/* Sculpted Monogram Insignia */}
        <div className="mx-auto mb-5 flex items-center justify-center">
          <div className="clay-btn-dark w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg">
            <span className="font-serif font-black text-2xl text-white">P</span>
          </div>
        </div>

        {/* Brand Headline */}
        <div className="space-y-1.5 mb-5">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-zinc-100 text-[10px] font-mono font-bold tracking-widest text-zinc-600 border border-zinc-200">
            <Newspaper className="w-3 h-3 text-zinc-950" />
            <span>SYNCING EDITORIAL WIRE</span>
          </div>
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-zinc-950 tracking-tight">
            Curating {edition === 'india' ? 'India' : 'Global'} Wire
          </h3>
          <p className="text-xs text-zinc-500 max-w-xs mx-auto leading-relaxed">
            {edition === 'india'
              ? 'Aggregating verified reports across The Hindu, NDTV, Livemint, and Indian Express'
              : 'Aggregating verified reports across The New York Times, BBC, Ars Technica, and Reuters'}
          </p>
        </div>

        {/* Minimalist Monochrome Pulse Dots */}
        <div className="flex items-center justify-center space-x-2 my-4">
          <span className="w-2 h-2 rounded-full bg-zinc-950 animate-[bounce_1.4s_infinite_0ms]" />
          <span className="w-2 h-2 rounded-full bg-zinc-600 animate-[bounce_1.4s_infinite_200ms]" />
          <span className="w-2 h-2 rounded-full bg-zinc-300 animate-[bounce_1.4s_infinite_400ms]" />
        </div>

        <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
          High-Signal Monochrome Editorial
        </div>
      </div>
    </div>
  );
}
