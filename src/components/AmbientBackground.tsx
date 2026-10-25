'use client';

import React, { useEffect, useState } from 'react';

export default function AmbientBackground() {
  const [mousePos, setMousePos] = useState({ x: 50, y: 30 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Smooth normalized coordinates (0 to 100%)
      const x = Math.round((e.clientX / window.innerWidth) * 100);
      const y = Math.round((e.clientY / window.innerHeight) * 100);
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none -z-10 overflow-hidden bg-[#FAF9FC] transition-colors"
    >
      {/* 1. Large Top-Left Luminous Aurora (Soft Indigo / Lavender) */}
      <div
        className="absolute -top-[15%] -left-[10%] w-[65vw] h-[65vw] max-w-[900px] max-h-[900px] rounded-full opacity-60 mix-blend-multiply blur-[110px] animate-pulse"
        style={{
          background: 'radial-gradient(circle, rgba(199, 210, 254, 0.75) 0%, rgba(224, 231, 255, 0.45) 50%, transparent 75%)',
          animationDuration: '14s',
        }}
      />

      {/* 2. Top-Right Ambient Warm Champagne & Amber Bloom */}
      <div
        className="absolute -top-[10%] -right-[12%] w-[60vw] h-[60vw] max-w-[850px] max-h-[850px] rounded-full opacity-55 mix-blend-multiply blur-[120px]"
        style={{
          background: 'radial-gradient(circle, rgba(254, 215, 170, 0.7) 0%, rgba(254, 240, 138, 0.35) 45%, transparent 75%)',
        }}
      />

      {/* 3. Center-Left Floating Rose / Peony Glow */}
      <div
        className="absolute top-[35%] -left-[15%] w-[55vw] h-[55vw] max-w-[750px] max-h-[750px] rounded-full opacity-50 mix-blend-multiply blur-[115px]"
        style={{
          background: 'radial-gradient(circle, rgba(251, 207, 232, 0.65) 0%, rgba(244, 244, 245, 0.3) 50%, transparent 75%)',
        }}
      />

      {/* 4. Center-Right Cool Icy Emerald / Mint Aurora */}
      <div
        className="absolute top-[45%] -right-[15%] w-[58vw] h-[58vw] max-w-[800px] max-h-[800px] rounded-full opacity-45 mix-blend-multiply blur-[120px]"
        style={{
          background: 'radial-gradient(circle, rgba(167, 243, 208, 0.6) 0%, rgba(186, 230, 253, 0.35) 50%, transparent 75%)',
        }}
      />

      {/* 5. Dynamic Interactive Cursor Follower Specular Light */}
      <div
        className="absolute w-[500px] h-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-35 mix-blend-multiply blur-[90px] transition-all duration-700 ease-out pointer-events-none hidden md:block"
        style={{
          left: `${mousePos.x}%`,
          top: `${mousePos.y}%`,
          background: 'radial-gradient(circle, rgba(196, 181, 253, 0.7) 0%, rgba(224, 231, 255, 0.3) 50%, transparent 70%)',
        }}
      />

      {/* 6. Subtle Apple Micro-Texture Filter for Natural Glass Refraction */}
      <div
        className="absolute inset-0 opacity-[0.018] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}
