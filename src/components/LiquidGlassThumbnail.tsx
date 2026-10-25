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
        const { LiquidGlass } = await import('@ybouane/liquidglass');
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
        <div className="w-full h-full min-h-[160px] flex items-center justify-center bg-zinc-100 text-zinc-400 text-xs font-semibold p-4 text-center">
          PRISM Wire Signal
        </div>
      )}

      {/* Sibling 1: Real Liquid Glass Badge — Directly refracts the underlying image via WebGL */}
      <div
        ref={badgeRef}
        data-config='{"blurAmount":0.2,"refraction":0.85,"chromAberration":0.08,"edgeHighlight":0.28,"specular":0.48,"fresnel":1.35,"cornerRadius":16,"zRadius":26,"button":true}'
        className="absolute top-2.5 left-2.5 px-3 py-1 rounded-full text-[11px] font-bold text-zinc-950 border border-white/80 shadow-md cursor-pointer select-none transition-transform active:scale-95 z-10"
        style={{
          background: 'transparent',
        }}
      >
        <span className="relative z-10 drop-shadow-xs">{badgeText}</span>
      </div>

      {priorityBadge && (
        <div className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full bg-zinc-950/85 backdrop-blur-md text-white text-[10px] font-mono font-bold tracking-wider shadow-xs z-10">
          {priorityBadge}
        </div>
      )}
    </div>
  );
}
