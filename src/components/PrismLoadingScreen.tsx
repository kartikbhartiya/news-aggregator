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
  const [phaseIndex, setPhaseIndex] = useState(0);

  const PHASES = [
    edition === 'india' 
      ? 'Aligning India National Wire • The Hindu, NDTV & Livemint'
      : 'Calibrating Global Wire Streams • FT, NYT & BBC',
    'Refracting 400+ Real-Time Editorial Signals',
    'Engaging Groq AI Intelligence Engine',
    'Spectral Synthesis Complete • Entering PRISM',
  ];

  useEffect(() => {
    const t1 = setTimeout(() => setPhaseIndex(1), 350);
    const t2 = setTimeout(() => setPhaseIndex(2), 750);
    const t3 = setTimeout(() => setPhaseIndex(3), 1150);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#070709] text-white select-none overflow-hidden">
      {/* Dynamic Keyframes for High-Performance Hardware-Accelerated Animations */}
      <style>{`
        @keyframes prismSpinSlow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes prismSpinReverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        @keyframes prismPulseRay {
          0%, 100% { opacity: 0.35; stroke-dashoffset: 0; }
          50% { opacity: 1; stroke-dashoffset: -30; }
        }
        @keyframes prismGlowBreathe {
          0%, 100% { transform: scale(0.96); opacity: 0.5; }
          50% { transform: scale(1.06); opacity: 0.9; }
        }
        @keyframes prismFloat {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-6px) rotate(1deg); }
        }
        @keyframes spectrumSweep {
          0% { filter: hue-rotate(0deg); }
          100% { filter: hue-rotate(360deg); }
        }
        @keyframes textShimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>

      {/* Central Hero Composition */}
      <div className="relative flex flex-col items-center text-center max-w-md px-6">
        
        {/* 1. ANIMATED OPTICAL PRISM DISPERSION EMBLEM */}
        <div className="relative w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center mb-8">
          
          {/* Ambient Optical Core Glow */}
          <div 
            className="absolute w-36 h-36 rounded-full bg-gradient-to-tr from-cyan-500/25 via-emerald-500/25 to-purple-600/25 blur-2xl pointer-events-none"
            style={{ animation: 'prismGlowBreathe 3s ease-in-out infinite' }}
          />

          {/* SVG Multi-Layer Refraction Engine */}
          <svg
            viewBox="0 0 240 240"
            className="w-full h-full relative z-10 overflow-visible"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Outer Glow Filters */}
              <filter id="prismGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              {/* Spectral Ray Gradients */}
              <linearGradient id="rayWhite" x1="0" y1="120" x2="90" y2="120" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.1" />
                <stop offset="60%" stopColor="#FFFFFF" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#FFFFFF" stopOpacity="1" />
              </linearGradient>

              <linearGradient id="rayRed" x1="120" y1="120" x2="230" y2="70" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#F43F5E" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#FB7185" stopOpacity="0.2" />
              </linearGradient>

              <linearGradient id="rayAmber" x1="120" y1="120" x2="235" y2="95" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#FCD34D" stopOpacity="0.2" />
              </linearGradient>

              <linearGradient id="rayEmerald" x1="120" y1="120" x2="240" y2="120" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#10B981" stopOpacity="1" />
                <stop offset="100%" stopColor="#6EE7B7" stopOpacity="0.3" />
              </linearGradient>

              <linearGradient id="rayCyan" x1="120" y1="120" x2="235" y2="145" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#67E8F9" stopOpacity="0.2" />
              </linearGradient>

              <linearGradient id="rayViolet" x1="120" y1="120" x2="230" y2="170" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#C4B5FD" stopOpacity="0.2" />
              </linearGradient>

              {/* Crystal Facet Fill Gradients */}
              <linearGradient id="glassFaceLeft" x1="120" y1="65" x2="80" y2="165" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.28" />
                <stop offset="60%" stopColor="#38BDF8" stopOpacity="0.14" />
                <stop offset="100%" stopColor="#0369A1" stopOpacity="0.04" />
              </linearGradient>

              <linearGradient id="glassFaceRight" x1="120" y1="65" x2="160" y2="165" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.38" />
                <stop offset="50%" stopColor="#34D399" stopOpacity="0.18" />
                <stop offset="100%" stopColor="#065F46" stopOpacity="0.05" />
              </linearGradient>

              <linearGradient id="glassFaceBottom" x1="80" y1="165" x2="160" y2="165" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.1" />
                <stop offset="50%" stopColor="#34D399" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#A855F7" stopOpacity="0.1" />
              </linearGradient>
            </defs>

            {/* A. Outer Concentric Orbital Ring 1 (Clockwise) */}
            <g style={{ transformOrigin: '120px 120px', animation: 'prismSpinSlow 18s linear infinite' }}>
              <circle
                cx="120"
                cy="120"
                r="92"
                stroke="rgba(255,255,255,0.08)"
                strokeWidth="1"
                strokeDasharray="4 8"
              />
              <circle
                cx="120"
                cy="28"
                r="2.5"
                fill="#34D399"
                filter="url(#prismGlow)"
              />
              <circle
                cx="212"
                cy="120"
                r="2"
                fill="#38BDF8"
                filter="url(#prismGlow)"
              />
            </g>

            {/* B. Middle Orbital Ring 2 (Counter-Clockwise) */}
            <g style={{ transformOrigin: '120px 120px', animation: 'prismSpinReverse 12s linear infinite' }}>
              <circle
                cx="120"
                cy="120"
                r="68"
                stroke="rgba(255,255,255,0.12)"
                strokeWidth="1"
                strokeDasharray="6 10"
              />
              <circle
                cx="65"
                cy="78"
                r="2"
                fill="#FBBF24"
                filter="url(#prismGlow)"
              />
              <circle
                cx="175"
                cy="162"
                r="2"
                fill="#A78BFA"
                filter="url(#prismGlow)"
              />
            </g>

            {/* C. Incoming Pure White Beam (Left -> Prism) */}
            <line
              x1="10"
              y1="120"
              x2="96"
              y2="120"
              stroke="url(#rayWhite)"
              strokeWidth="2.5"
              strokeLinecap="round"
              filter="url(#prismGlow)"
            />

            {/* D. Dispersed Kinetic Spectral Beams (Prism -> Right Fan) */}
            <g filter="url(#prismGlow)">
              {/* Red Ray */}
              <path
                d="M136 112 L225 68"
                stroke="url(#rayRed)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeDasharray="16 4"
                style={{ animation: 'prismPulseRay 1.8s ease-in-out infinite' }}
              />
              {/* Amber Ray */}
              <path
                d="M138 116 L232 94"
                stroke="url(#rayAmber)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeDasharray="16 4"
                style={{ animation: 'prismPulseRay 2.1s ease-in-out infinite 0.15s' }}
              />
              {/* Emerald Centerline Ray */}
              <path
                d="M140 120 L238 120"
                stroke="url(#rayEmerald)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray="20 4"
                style={{ animation: 'prismPulseRay 1.6s ease-in-out infinite 0.3s' }}
              />
              {/* Cyan Ray */}
              <path
                d="M138 124 L232 146"
                stroke="url(#rayCyan)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeDasharray="16 4"
                style={{ animation: 'prismPulseRay 2.3s ease-in-out infinite 0.45s' }}
              />
              {/* Violet Ray */}
              <path
                d="M136 128 L225 172"
                stroke="url(#rayViolet)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeDasharray="16 4"
                style={{ animation: 'prismPulseRay 1.9s ease-in-out infinite 0.6s' }}
              />
            </g>

            {/* E. Floating Isometric Glass Prism Crystal */}
            <g style={{ transformOrigin: '120px 120px', animation: 'prismFloat 4s ease-in-out infinite' }}>
              {/* Face 1: Left Facet */}
              <polygon
                points="120,68 84,162 120,152"
                fill="url(#glassFaceLeft)"
                stroke="rgba(255,255,255,0.7)"
                strokeWidth="1.2"
                strokeLinejoin="round"
              />

              {/* Face 2: Right Facet (Dispersing Edge) */}
              <polygon
                points="120,68 156,162 120,152"
                fill="url(#glassFaceRight)"
                stroke="rgba(255,255,255,0.85)"
                strokeWidth="1.2"
                strokeLinejoin="round"
              />

              {/* Face 3: Base Foundation */}
              <polygon
                points="84,162 156,162 120,152"
                fill="url(#glassFaceBottom)"
                stroke="rgba(255,255,255,0.4)"
                strokeWidth="1"
                strokeLinejoin="round"
              />

              {/* Internal Refraction Apex Sparkle */}
              <circle
                cx="120"
                cy="68"
                r="3"
                fill="#FFFFFF"
                filter="url(#prismGlow)"
              />
              <circle
                cx="120"
                cy="120"
                r="2.5"
                fill="#6EE7B7"
                filter="url(#prismGlow)"
              />
            </g>
          </svg>
        </div>

        {/* 2. PREMIUM TYPOGRAPHY & APERTURE STATUS */}
        <div className="space-y-3">
          {/* Brand Wordmark with Specular Light Sweep */}
          <div className="flex items-center justify-center space-x-3">
            <h1 
              className="text-3xl sm:text-4xl font-black tracking-[0.25em] text-white font-sans"
              style={{
                background: 'linear-gradient(90deg, #FFFFFF 0%, #A1A1AA 30%, #FFFFFF 50%, #A1A1AA 70%, #FFFFFF 100%)',
                backgroundSize: '200% auto',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                animation: 'textShimmer 3.5s linear infinite',
              }}
            >
              PRISM
            </h1>

            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[10px] font-mono font-bold tracking-widest text-emerald-400 uppercase">
              WIRE LIVE
            </span>
          </div>

          {/* Subtitle */}
          <div className="flex items-center justify-center space-x-2 text-xs font-mono text-zinc-400 uppercase tracking-widest">
            <span>{edition === 'india' ? 'India Edition' : 'Global Edition'}</span>
            <span>•</span>
            <span className="text-zinc-500">Real-Time Intelligence Stream</span>
          </div>

          {/* 3. KINETIC TELEMETRY STATUS (NO PROGRESS BAR) */}
          <div className="pt-4 flex items-center justify-center space-x-2.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>

            <p className="text-xs sm:text-sm font-sans font-medium text-zinc-300 tracking-wide transition-all duration-300 ease-out">
              {message || PHASES[phaseIndex]}
            </p>
          </div>

          {/* 4. Mini Pulsing Quantum Frequency Dots */}
          <div className="flex items-center justify-center space-x-1.5 pt-2 opacity-60">
            <div className={`w-1 h-1 rounded-full transition-all duration-300 ${phaseIndex >= 0 ? 'bg-cyan-400 scale-125' : 'bg-zinc-700'}`} />
            <div className={`w-1 h-1 rounded-full transition-all duration-300 ${phaseIndex >= 1 ? 'bg-emerald-400 scale-125' : 'bg-zinc-700'}`} />
            <div className={`w-1 h-1 rounded-full transition-all duration-300 ${phaseIndex >= 2 ? 'bg-amber-400 scale-125' : 'bg-zinc-700'}`} />
            <div className={`w-1 h-1 rounded-full transition-all duration-300 ${phaseIndex >= 3 ? 'bg-rose-400 scale-125' : 'bg-zinc-700'}`} />
          </div>
        </div>

      </div>
    </div>
  );
}
