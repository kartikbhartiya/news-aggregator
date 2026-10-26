'use client';

import React, { useEffect, useRef, useState } from 'react';

interface LiquidGlassThumbnailProps {
  src: string;
  alt: string;
  badgeText: string;
  className?: string;
  priorityBadge?: string;
}

/**
 * LiquidGlassThumbnail
 * Container that runs authentic @ybouane/liquidglass WebGL shader refraction.
 * The <img> is sibling 0, and the source badge is sibling 1 (direct child).
 * LiquidGlass directly captures the image pixels behind the badge and refracts them
 * with realistic WebGL refraction, blur, chromatic aberration, and specular highlights.
 */
export default function LiquidGlassThumbnail({
  src,
  alt,
  badgeText,
  className = '',
  priorityBadge,
}: LiquidGlassThumbnailProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);

  // Use proxied URL if external to guarantee CORS headers for WebGL texture upload
  const safeSrc = src && !src.startsWith('/api') && !src.startsWith('data:')
    ? `/api/proxy-image?url=${encodeURIComponent(src)}`
    : src;

  useEffect(() => {
    if (!imgLoaded || !rootRef.current || !badgeRef.current || typeof window === 'undefined') return;

    let instance: any = null;
    let isCancelled = false;

    async function initGlass() {
      try {
        const { LiquidGlass } = await import('@/lib/liquidglass');
        if (isCancelled || !rootRef.current || !badgeRef.current) return;

        instance = await LiquidGlass.init({
          root: rootRef.current,
          glassElements: [badgeRef.current],
          defaults: {
            blurAmount: 0.18,
            refraction: 0.85,
            chromAberration: 0.08,
            edgeHighlight: 0.25,
            specular: 0.45,
            fresnel: 1.35,
            distortion: 0.02,
            cornerRadius: 16,
            zRadius: 26,
            opacity: 0.92,
            saturation: 0.15,
            tintStrength: 0.04,
            brightness: 0.05,
            shadowOpacity: 0.22,
            shadowSpread: 12,
            shadowOffsetY: 4,
            button: true,
            bevelMode: 0,
          },
        });
      } catch (err) {
        console.debug('LiquidGlassThumbnail shader init note:', err);
      }
    }

    // Delay slightly to ensure layout and image decode
    const timer = setTimeout(initGlass, 80);

    return () => {
      isCancelled = true;
      clearTimeout(timer);
      if (instance && typeof instance.destroy === 'function') {
        try {
          instance.destroy();
        } catch {
          // cleanup
        }
      }
    };
  }, [imgLoaded]);

  return (
    <div
      ref={rootRef}
      className={`relative rounded-2xl overflow-hidden bg-zinc-100 border border-zinc-200/60 shadow-xs group ${className}`}
      style={{ position: 'relative' }}
    >
      {/* Sibling 0: Image element captured by WebGL shader pipeline */}
      {!imgError && safeSrc ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={safeSrc}
          alt={alt}
          crossOrigin="anonymous"
          onLoad={() => setImgLoaded(true)}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 block"
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-zinc-100 via-zinc-50 to-zinc-100/70 p-4 text-center select-none">
          <div className="w-10 h-10 rounded-2xl bg-white border border-zinc-200/70 flex items-center justify-center text-zinc-400 mb-2 shadow-2xs">
            <svg className="w-5 h-5 text-zinc-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="2" y1="2" x2="22" y2="22"/>
              <path d="M10.41 10.41a2 2 0 1 0-2.83-2.83"/>
              <line x1="13.5" y1="13.5" x2="6" y2="21"/>
              <line x1="18" y1="12" x2="21" y2="15"/>
              <path d="M3.59 3.59A2 2 0 0 0 3 5v14a2 2 0 0 0 2 2h14c.55 0 1.05-.22 1.41-.59"/>
              <path d="M21 15V5a2 2 0 0 0-2-2H9"/>
            </svg>
          </div>
          <span className="text-xs font-semibold text-zinc-700 tracking-tight">No Image Available</span>
          <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 mt-0.5">Wire Dispatch • Text Only</span>
        </div>
      )}

      {/* Sibling 1: Solid Tactile Clay Pill Badge */}
      <div
        ref={badgeRef}
        className="absolute top-2.5 left-2.5 px-3 py-1 rounded-full text-[11px] font-extrabold text-zinc-950 bg-white border border-zinc-200 shadow-xs cursor-pointer select-none transition-transform active:scale-95 z-10 tracking-tight"
      >
        <span className="relative z-10">{badgeText}</span>
      </div>

      {priorityBadge && (
        <div className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full bg-zinc-950 text-white text-[10px] font-mono font-bold tracking-wider shadow-xs z-10">
          {priorityBadge}
        </div>
      )}
    </div>
  );
}
