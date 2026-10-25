'use client';

import React, { useEffect, useRef } from 'react';

interface LiquidGlassRootProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export default function LiquidGlassRoot({ children, className = '', id = 'liquid-glass-root' }: LiquidGlassRootProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let instance: any = null;
    let isCancelled = false;

    async function initGlass() {
      if (typeof window === 'undefined' || !rootRef.current) return;

      try {
        // Dynamic import to prevent SSR issues
        const { LiquidGlass } = await import('@/lib/liquidglass');
        if (isCancelled || !rootRef.current) return;

        const glassElements = rootRef.current.querySelectorAll('.liquid-glass-panel');
        if (glassElements.length > 0) {
          instance = await LiquidGlass.init({
            root: rootRef.current,
            glassElements: Array.from(glassElements) as HTMLElement[],
            defaults: {
              blurAmount: 0.28,
              refraction: 0.65,
              chromAberration: 0.04,
              edgeHighlight: 0.08,
              specular: 0.15,
              fresnel: 1.0,
              distortion: 0,
              cornerRadius: 28,
              zRadius: 32,
              opacity: 0.95,
              saturation: 0.2,
              tintStrength: 0.05,
              brightness: 0.02,
              shadowOpacity: 0.12,
              shadowSpread: 16,
              shadowOffsetY: 8,
              floating: false,
              button: false,
              bevelMode: 0,
            },
          });
        }
      } catch (err) {
        // Fallback to Apple CSS glassmorphism (already baked into styles)
        console.debug('LiquidGlass WebGL shader fallback to Apple native CSS glass:', err);
      }
    }

    // Small delay to ensure all DOM nodes are rendered and fonts ready
    const timer = setTimeout(initGlass, 150);

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
  }, []);

  return (
    <div
      ref={rootRef}
      id={id}
      className={`relative w-full ${className}`}
    >
      {children}
    </div>
  );
}
