'use client';

import React, { useEffect, useRef } from 'react';
import { handleButtonClickGlow } from '@/lib/button-glow';

interface LiquidGlassButtonProps {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  active?: boolean;
  title?: string;
  disabled?: boolean;
  variant?: 'glass' | 'dark' | 'pill';
  config?: {
    blurAmount?: number;
    refraction?: number;
    chromAberration?: number;
    edgeHighlight?: number;
    specular?: number;
    fresnel?: number;
    cornerRadius?: number;
    zRadius?: number;
    brightness?: number;
    saturation?: number;
  };
}

/**
 * LiquidGlassButton
 * Authentic Apple-grade interactive button powered by @ybouane/liquidglass WebGL shaders.
 * Sibling 0: subtle optical backdrop behind the glass.
 * Sibling 1: direct child glass element injected with real WebGL canvas shader.
 * Reacts to hover (brightening, specular sheen) and press (bevel flattening, shadow deepen).
 */
export default function LiquidGlassButton({
  children,
  onClick,
  className = '',
  active = false,
  title,
  disabled = false,
  variant = 'glass',
  config = {},
}: LiquidGlassButtonProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const cornerRadius = config.cornerRadius ?? (variant === 'pill' ? 9999 : 20);
  const zRadius = config.zRadius ?? 26;
  const refraction = config.refraction ?? 0.78;
  const chromAberration = config.chromAberration ?? 0.08;
  const edgeHighlight = config.edgeHighlight ?? 0.25;
  const specular = config.specular ?? (variant === 'dark' ? 0.45 : 0.35);

  useEffect(() => {
    if (typeof window === 'undefined' || !rootRef.current || !buttonRef.current) return;

    let instance: any = null;
    let isCancelled = false;

    async function initGlass() {
      try {
        const { LiquidGlass } = await import('@ybouane/liquidglass');
        if (isCancelled || !rootRef.current || !buttonRef.current) return;

        instance = await LiquidGlass.init({
          root: rootRef.current,
          glassElements: [buttonRef.current],
          defaults: {
            blurAmount: 0.18,
            refraction,
            chromAberration,
            edgeHighlight,
            specular,
            fresnel: 1.3,
            cornerRadius,
            zRadius,
            button: true,
            brightness: variant === 'dark' ? -0.15 : 0.04,
            saturation: 0.1,
            shadowOpacity: 0.15,
            shadowSpread: 8,
          },
        });
      } catch (err) {
        // Fallback gracefully to CSS Apple Glass
      }
    }

    const timer = setTimeout(initGlass, 60);

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
  }, [cornerRadius, zRadius, refraction, chromAberration, edgeHighlight, specular, variant]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    handleButtonClickGlow(e);
    if (onClick) onClick(e);
  };

  return (
    <div
      ref={rootRef}
      className="relative inline-flex items-center justify-center"
      style={{ position: 'relative' }}
    >
      {/* Sibling 0: Subtle Underlay Optical Texture for WebGL Refraction */}
      <div 
        aria-hidden="true"
        className={`absolute inset-0 rounded-[${cornerRadius}px] pointer-events-none transition-opacity duration-300 ${
          active 
            ? 'bg-zinc-950 shadow-md' 
            : variant === 'dark'
            ? 'bg-zinc-900/90 shadow-xs'
            : 'bg-white/60'
        }`}
      />

      {/* Sibling 1: Direct Child Button — WebGL Shaded via @ybouane/liquidglass */}
      <button
        ref={buttonRef}
        type="button"
        title={title}
        disabled={disabled}
        onClick={handleClick}
        data-config={JSON.stringify({
          button: true,
          cornerRadius,
          zRadius,
          refraction,
          chromAberration,
          specular,
        })}
        className={`apple-btn relative z-10 flex items-center justify-center transition-all duration-200 select-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
          active
            ? 'text-white'
            : variant === 'dark'
            ? 'text-zinc-100 hover:text-white'
            : 'text-zinc-700 hover:text-zinc-950'
        } ${className}`}
        style={{
          background: 'transparent',
          borderRadius: `${cornerRadius}px`,
        }}
      >
        <span className="relative z-10 flex items-center space-x-1.5">{children}</span>
      </button>
    </div>
  );
}
