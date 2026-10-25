'use client';

import React, { useEffect, useRef } from 'react';

/**
 * LiquidGlassBackground
 * Direct <canvas> child of LiquidGlass root with data-dynamic="true".
 * LiquidGlass directly blits this canvas into the WebGL scene every frame,
 * producing real optical refraction, chromatic aberration, specular glint, and Fresnel rim glow.
 *
 * Designed specifically with rich, vivid Apple chromatic auroras on an oyster-pearl light canvas
 * (never stark white) so that the glass refraction is unmistakable.
 */
export default function LiquidGlassBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', resize);

    // Continuous chromatic aura rendering
    const draw = () => {
      time += 0.006;
      const w = window.innerWidth;
      const h = window.innerHeight;

      // 1. Base Silk & Pearl Foundation (Luminous champagne-tinted oyster, NOT stark white)
      const baseGrad = ctx.createLinearGradient(0, 0, w, h);
      baseGrad.addColorStop(0, '#EDEBF5');
      baseGrad.addColorStop(0.3, '#E6E4F0');
      baseGrad.addColorStop(0.7, '#EBE8F4');
      baseGrad.addColorStop(1, '#E4E2F1');
      ctx.fillStyle = baseGrad;
      ctx.fillRect(0, 0, w, h);

      // 2. High-Chroma Electric Azure & Sky Blue Wave
      const x1 = w * 0.28 + Math.sin(time * 0.7) * 160;
      const y1 = h * 0.2 + Math.cos(time * 0.6) * 120;
      const r1 = Math.min(w, h) * 0.65;
      const grad1 = ctx.createRadialGradient(x1, y1, 0, x1, y1, r1);
      grad1.addColorStop(0, 'rgba(56, 189, 248, 0.85)');    // Sky Cyan
      grad1.addColorStop(0.35, 'rgba(99, 102, 241, 0.6)');  // Indigo
      grad1.addColorStop(0.7, 'rgba(192, 132, 252, 0.3)');  // Purple tint
      grad1.addColorStop(1, 'rgba(237, 235, 245, 0)');
      ctx.fillStyle = grad1;
      ctx.beginPath();
      ctx.arc(x1, y1, r1, 0, Math.PI * 2);
      ctx.fill();

      // 3. Vivid Radiant Orchid & Purple Bloom (Top-Right)
      const x2 = w * 0.82 + Math.cos(time * 0.65) * 180;
      const y2 = h * 0.28 + Math.sin(time * 0.8) * 140;
      const r2 = Math.min(w, h) * 0.68;
      const grad2 = ctx.createRadialGradient(x2, y2, 0, x2, y2, r2);
      grad2.addColorStop(0, 'rgba(168, 85, 247, 0.82)');   // Bright Purple
      grad2.addColorStop(0.4, 'rgba(236, 72, 153, 0.55)');  // Hot Pink
      grad2.addColorStop(0.75, 'rgba(244, 114, 182, 0.25)');
      grad2.addColorStop(1, 'rgba(237, 235, 245, 0)');
      ctx.fillStyle = grad2;
      ctx.beginPath();
      ctx.arc(x2, y2, r2, 0, Math.PI * 2);
      ctx.fill();

      // 4. Sunlit Champagne Amber & Peach Glow (Center-Left)
      const x3 = w * 0.18 + Math.cos(time * 0.9) * 140;
      const y3 = h * 0.68 + Math.sin(time * 0.5) * 150;
      const r3 = Math.min(w, h) * 0.62;
      const grad3 = ctx.createRadialGradient(x3, y3, 0, x3, y3, r3);
      grad3.addColorStop(0, 'rgba(251, 146, 60, 0.8)');    // Warm Amber Orange
      grad3.addColorStop(0.4, 'rgba(244, 63, 94, 0.5)');    // Rose Coral
      grad3.addColorStop(0.75, 'rgba(253, 224, 71, 0.25)'); // Champagne Gold
      grad3.addColorStop(1, 'rgba(237, 235, 245, 0)');
      ctx.fillStyle = grad3;
      ctx.beginPath();
      ctx.arc(x3, y3, r3, 0, Math.PI * 2);
      ctx.fill();

      // 5. Emerald & Aquamarine Spring Pool (Bottom-Right)
      const x4 = w * 0.78 + Math.sin(time * 0.8) * 150;
      const y4 = h * 0.78 + Math.cos(time * 1.1) * 130;
      const r4 = Math.min(w, h) * 0.58;
      const grad4 = ctx.createRadialGradient(x4, y4, 0, x4, y4, r4);
      grad4.addColorStop(0, 'rgba(52, 211, 153, 0.78)');   // Emerald
      grad4.addColorStop(0.4, 'rgba(45, 212, 191, 0.5)');   // Mint Teal
      grad4.addColorStop(0.75, 'rgba(96, 165, 250, 0.22)'); // Blue tint
      grad4.addColorStop(1, 'rgba(237, 235, 245, 0)');
      ctx.fillStyle = grad4;
      ctx.beginPath();
      ctx.arc(x4, y4, r4, 0, Math.PI * 2);
      ctx.fill();

      // 6. Center Violet Prismatic Flare (Provides chromatic variety under center cards)
      const x5 = w * 0.5 + Math.sin(time * 1.2) * 100;
      const y5 = h * 0.48 + Math.cos(time * 0.75) * 80;
      const r5 = Math.min(w, h) * 0.45;
      const grad5 = ctx.createRadialGradient(x5, y5, 0, x5, y5, r5);
      grad5.addColorStop(0, 'rgba(147, 51, 234, 0.5)');
      grad5.addColorStop(0.5, 'rgba(59, 130, 246, 0.25)');
      grad5.addColorStop(1, 'rgba(237, 235, 245, 0)');
      ctx.fillStyle = grad5;
      ctx.beginPath();
      ctx.arc(x5, y5, r5, 0, Math.PI * 2);
      ctx.fill();

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      data-dynamic="true"
      className="fixed inset-0 pointer-events-none -z-20 w-screen h-screen block"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: -20,
      }}
    />
  );
}
