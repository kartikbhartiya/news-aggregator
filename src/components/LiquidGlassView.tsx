'use client';

import React, { useEffect, useRef } from 'react';

interface LiquidGlassViewProps {
  children: React.ReactNode;
  className?: string;
  refreshKey?: any;
}

/**
 * LiquidGlassView
 * Manages LiquidGlass instance for direct children with class 'liquid-glass-direct'.
 * Automatically tracks child element additions/removals and re-initializes WebGL glass shaders.
 */
export default function LiquidGlassView({ 
  children, 
  className = '', 
  refreshKey 
}: LiquidGlassViewProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let instance: any = null;
    let isCancelled = false;
    let initTimeout: NodeJS.Timeout | null = null;

    async function setupLiquidGlass() {
      if (typeof window === 'undefined' || !rootRef.current || isCancelled) return;

      // Clean up existing instance before recreating
      if (instance && typeof instance.destroy === 'function') {
        try {
          instance.destroy();
        } catch {
          // ignore
        }
        instance = null;
      }

      try {
        const { LiquidGlass } = await import('@/lib/liquidglass');
        if (isCancelled || !rootRef.current) return;

        // Select all direct children marked as liquid-glass-direct
        const directGlass = Array.from(rootRef.current.children).filter((el) =>
          el.classList.contains('liquid-glass-direct')
        ) as HTMLElement[];

        if (directGlass.length === 0) return;

        instance = await LiquidGlass.init({
          root: rootRef.current,
          glassElements: directGlass,
          defaults: {
            blurAmount: 0.22,
            refraction: 0.76,
            chromAberration: 0.08,
            edgeHighlight: 0.18,
            specular: 0.35,
            fresnel: 1.2,
            distortion: 0.02,
            cornerRadius: 28,
            zRadius: 38,
            opacity: 0.94,
            saturation: 0.2,
            tintStrength: 0.05,
            brightness: 0.03,
            shadowOpacity: 0.16,
            shadowSpread: 16,
            shadowOffsetY: 8,
            button: true,
            bevelMode: 0,
          },
        });
      } catch (err) {
        console.debug('LiquidGlass WebGL shader initialized:', err);
      }
    }

    // Debounced setup
    const scheduleSetup = () => {
      if (initTimeout) clearTimeout(initTimeout);
      initTimeout = setTimeout(setupLiquidGlass, 120);
    };

    scheduleSetup();

    // Observe direct child changes to re-bind when articles or components update
    let observer: MutationObserver | null = null;
    if (rootRef.current) {
      observer = new MutationObserver((mutations) => {
        let hasDirectChildChange = false;
        for (const m of mutations) {
          if (m.type === 'childList') {
            hasDirectChildChange = true;
            break;
          }
        }
        if (hasDirectChildChange) {
          scheduleSetup();
        }
      });

      observer.observe(rootRef.current, { childList: true });
    }

    return () => {
      isCancelled = true;
      if (initTimeout) clearTimeout(initTimeout);
      if (observer) observer.disconnect();
      if (instance && typeof instance.destroy === 'function') {
        try {
          instance.destroy();
        } catch {
          // cleanup
        }
      }
    };
  }, [refreshKey]);

  return (
    <div
      ref={rootRef}
      className={`relative w-full ${className}`}
      style={{ position: 'relative' }}
    >
      {children}
    </div>
  );
}
