import React from 'react';
import { PredictionCategory } from '../types';

interface MarketVisualProps {
  category: PredictionCategory | 'coffee';
  className?: string;
}

export const MarketVisual: React.FC<MarketVisualProps> = ({ category, className = 'w-full h-20' }) => {
  // 1. SPORTS
  if (category === 'sports') {
    return (
      <div className={`relative overflow-hidden rounded-t-2xl bg-gradient-to-r from-[#0C2417] via-[#123823] to-[#184D30] ${className}`}>
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 360 80" preserveAspectRatio="xMidYMid slice" fill="none">
          <defs>
            <radialGradient id="sportsGlow" cx="50%" cy="20%" r="60%">
              <stop offset="0%" stopColor="#4AE28D" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#0C2417" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width="360" height="80" fill="url(#sportsGlow)" />
          {/* Floodlight beams */}
          <polygon points="30,0 90,80 0,80" fill="#6EE7B7" opacity="0.1" />
          <polygon points="330,0 360,80 270,80" fill="#6EE7B7" opacity="0.1" />
          {/* Pitch grass arc */}
          <ellipse cx="180" cy="85" rx="140" ry="35" stroke="#68D391" strokeWidth="1.5" strokeOpacity="0.5" fill="#133D24" fillOpacity="0.6" />
          <line x1="180" y1="50" x2="180" y2="80" stroke="#68D391" strokeWidth="1.5" strokeOpacity="0.5" />
          {/* Soccer ball */}
          <g transform="translate(170, 24)">
            <circle cx="10" cy="10" r="11" fill="#F8FAFC" stroke="#0F2D1F" strokeWidth="1.2" />
            <polygon points="10,4 6,7 7,12 13,12 14,7" fill="#163E29" />
          </g>
          <text x="14" y="68" fill="#A7F3D0" fontSize="9" fontFamily="monospace" opacity="0.85">
            CHAMPIONSHIP · FINAL RESOLUTION
          </text>
        </svg>
      </div>
    );
  }

  // 2. FRONTIER AI
  if (category === 'frontier_ai') {
    return (
      <div className={`relative overflow-hidden rounded-t-2xl bg-gradient-to-r from-[#0A1A27] via-[#0E2633] to-[#123630] ${className}`}>
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 360 80" preserveAspectRatio="xMidYMid slice" fill="none">
          <defs>
            <radialGradient id="geminiGlow" cx="60%" cy="50%" r="60%">
              <stop offset="0%" stopColor="#4AE28D" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#38BDF8" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#0A1A27" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width="360" height="80" fill="url(#geminiGlow)" />
          {/* Constellation grid */}
          <line x1="20" y1="40" x2="100" y2="25" stroke="#38BDF8" strokeWidth="1" opacity="0.3" />
          <line x1="100" y1="25" x2="160" y2="55" stroke="#4AE28D" strokeWidth="1" opacity="0.4" />
          <line x1="160" y1="55" x2="240" y2="30" stroke="#38BDF8" strokeWidth="1.5" opacity="0.5" />
          <line x1="240" y1="30" x2="310" y2="45" stroke="#4AE28D" strokeWidth="1" opacity="0.4" />

          {/* Spark Core */}
          <g transform="translate(190, 38)">
            <circle cx="0" cy="0" r="14" fill="#38BDF8" fillOpacity="0.15" />
            <circle cx="0" cy="0" r="6" fill="#4AE28D" />
            <path d="M 0 -12 L 2 -4 L 10 0 L 2 4 L 0 12 L -2 4 L -10 0 L -2 -4 Z" fill="#E0F2FE" />
          </g>

          <circle cx="100" cy="25" r="3.5" fill="#38BDF8" />
          <circle cx="160" cy="55" r="4" fill="#4AE28D" />
          <circle cx="240" cy="30" r="4.5" fill="#38BDF8" />
          <circle cx="310" cy="45" r="3" fill="#6EE7B7" />

          <text x="14" y="68" fill="#7DD3FC" fontSize="9" fontFamily="monospace" opacity="0.85">
            FRONTIER REASONING BENCHMARK
          </text>
        </svg>
      </div>
    );
  }

  // 3. NEWS / COMMERCIAL AVIATION
  if (category === 'news') {
    return (
      <div className={`relative overflow-hidden rounded-t-2xl bg-gradient-to-r from-[#24152A] via-[#351D40] to-[#4F2A5C] ${className}`}>
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 360 80" preserveAspectRatio="xMidYMid slice" fill="none">
          <defs>
            <linearGradient id="skyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#180D1D" />
              <stop offset="60%" stopColor="#3F1D4F" />
              <stop offset="100%" stopColor="#B45309" />
            </linearGradient>
          </defs>
          <rect width="360" height="80" fill="url(#skyGrad)" />
          {/* Sunset Horizon & Soundwave Cones */}
          <circle cx="280" cy="65" r="30" fill="#FDBA74" opacity="0.5" />
          <line x1="0" y1="65" x2="360" y2="65" stroke="#FDA4AF" strokeWidth="1" opacity="0.25" />
          <line x1="20" y1="36" x2="170" y2="36" stroke="#FDE047" strokeWidth="2" opacity="0.7" strokeLinecap="round" />
          {/* Supersonic Jet */}
          <g transform="translate(170, 24)">
            <path d="M 45,12 L 22,7 L 0,2 L 14,12 L 0,22 L 22,17 Z" fill="#FFFFFF" />
            <circle cx="-2" cy="12" r="3" fill="#F59E0B" />
          </g>
          <text x="14" y="68" fill="#FBCFE8" fontSize="9" fontFamily="monospace" opacity="0.85">
            TRANSATLANTIC · HIGH-ALTITUDE CORRIDOR
          </text>
        </svg>
      </div>
    );
  }

  // 4. TECHNOLOGY / ROBOTICS
  if (category === 'technology') {
    return (
      <div className={`relative overflow-hidden rounded-t-2xl bg-gradient-to-r from-[#0D1824] via-[#142436] to-[#1C334D] ${className}`}>
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 360 80" preserveAspectRatio="xMidYMid slice" fill="none">
          <defs>
            <radialGradient id="robotGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#0D1824" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width="360" height="80" fill="url(#robotGlow)" />
          {/* Circuit tracks */}
          <line x1="30" y1="40" x2="130" y2="40" stroke="#38BDF8" strokeWidth="1.5" opacity="0.4" />
          <line x1="130" y1="40" x2="160" y2="20" stroke="#38BDF8" strokeWidth="1.5" opacity="0.5" />
          <line x1="200" y1="20" x2="230" y2="40" stroke="#38BDF8" strokeWidth="1.5" opacity="0.5" />
          <line x1="230" y1="40" x2="330" y2="40" stroke="#38BDF8" strokeWidth="1.5" opacity="0.4" />
          {/* Robotic Hand / Bionic Joint Emblem */}
          <g transform="translate(162, 16)">
            <rect x="0" y="0" width="36" height="36" rx="6" fill="#0C2538" stroke="#38BDF8" strokeWidth="1.5" />
            <circle cx="18" cy="18" r="8" fill="#0284C7" fillOpacity="0.3" stroke="#7DD3FC" strokeWidth="1" />
            <circle cx="18" cy="18" r="3.5" fill="#38BDF8" />
          </g>
          <circle cx="80" cy="40" r="3" fill="#7DD3FC" />
          <circle cx="280" cy="40" r="3" fill="#7DD3FC" />
          <text x="14" y="68" fill="#93C5FD" fontSize="9" fontFamily="monospace" opacity="0.85">
            INDUSTRIAL ROBOTICS · ENTERPRISE AUDIT
          </text>
        </svg>
      </div>
    );
  }

  // FALLBACK OR COFFEE
  return (
    <div className={`relative overflow-hidden rounded-t-2xl bg-gradient-to-r from-[#24170F] via-[#352317] to-[#4A3120] ${className}`}>
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 360 80" preserveAspectRatio="xMidYMid slice" fill="none">
        <g transform="translate(100, 10)">
          <ellipse cx="30" cy="50" rx="30" ry="5" fill="#EAE5D9" />
          <path d="M 10,12 L 16,48 C 16,50 44,50 44,48 L 50,12 Z" fill="#FAF6EE" stroke="#DDD6C5" strokeWidth="1.5" />
          <ellipse cx="30" cy="14" rx="20" ry="5" fill="#4B2C1B" />
          <path d="M 48,18 C 58,18 58,38 46,40" stroke="#FAF6EE" strokeWidth="3" fill="none" strokeLinecap="round" />
        </g>
        <g transform="translate(195, 22)">
          <ellipse cx="14" cy="30" rx="14" ry="5" fill="#EAB308" />
          <ellipse cx="14" cy="27" rx="14" ry="5" fill="#FACC15" />
          <text x="11" y="30" fill="#854D0E" fontSize="8" fontWeight="bold">¢</text>
          <ellipse cx="26" cy="22" rx="12" ry="4.5" fill="#EAB308" />
          <ellipse cx="26" cy="19" rx="12" ry="4.5" fill="#FACC15" />
          <path d="M 42,12 L 48,6 M 48,6 L 43,6 M 48,6 L 48,11" stroke="#4ADE80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <text x="14" y="68" fill="#FDE68A" fontSize="9" fontFamily="monospace" opacity="0.85">
          AUTOMATED MICRO-ALLOCATION SWIPE
        </text>
      </svg>
    </div>
  );
};
