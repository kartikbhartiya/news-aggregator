'use client';

import React from 'react';

interface PrismLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showRay?: boolean;
}

export default function PrismLogo({
  className = '',
  size = 'md',
  showRay = true,
}: PrismLogoProps) {
  const sizeMap = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9 sm:w-10 sm:h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const svgSizeMap = {
    sm: 18,
    md: 22,
    lg: 28,
    xl: 38,
  };

  const dim = svgSizeMap[size];

  return (
    <div
      className={`clay-btn-dark rounded-2xl flex items-center justify-center shrink-0 border border-zinc-800 shadow-md ${sizeMap[size]} ${className}`}
      title="PRISM Intelligence Wire"
    >
      <svg
        width={dim}
        height={dim}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="transition-transform duration-300 group-hover:scale-110"
      >
        {/* Optical Triangular Glass Prism Base */}
        <polygon
          points="16,5 28,26 4,26"
          stroke="#FFFFFF"
          strokeWidth="1.8"
          strokeLinejoin="round"
          fill="rgba(255, 255, 255, 0.08)"
        />

        {/* Internal Optical Refraction Facet Line */}
        <line
          x1="16"
          y1="5"
          x2="18"
          y2="26"
          stroke="#FFFFFF"
          strokeWidth="1.2"
          strokeDasharray="1.5 2"
          strokeOpacity="0.6"
        />

        {/* Incoming Incident Light Beam */}
        <line
          x1="2"
          y1="19"
          x2="10"
          y2="15.5"
          stroke="#FFFFFF"
          strokeWidth="1.8"
          strokeLinecap="round"
        />

        {/* Dispersed Emerging Refractive Rays */}
        {showRay && (
          <>
            {/* Top Ray */}
            <line
              x1="22"
              y1="15.5"
              x2="30"
              y2="11"
              stroke="#FFFFFF"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeOpacity="0.9"
            />
            {/* Middle Ray */}
            <line
              x1="23"
              y1="17.5"
              x2="30"
              y2="16.5"
              stroke="#FFFFFF"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeOpacity="0.75"
            />
            {/* Bottom Ray */}
            <line
              x1="24"
              y1="19.5"
              x2="29.5"
              y2="22"
              stroke="#FFFFFF"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeOpacity="0.6"
            />
          </>
        )}
      </svg>
    </div>
  );
}
