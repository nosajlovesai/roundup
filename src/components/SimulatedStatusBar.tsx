import React from 'react';

interface SimulatedStatusBarProps {
  theme?: 'dark' | 'light';
  time?: string;
}

export const SimulatedStatusBar: React.FC<SimulatedStatusBarProps> = ({
  theme = 'dark',
  time = '9:41',
}) => {
  const isDark = theme === 'dark';
  const textColor = isDark ? 'text-white' : 'text-[#17212B]';
  const fillColor = isDark ? '#FFFFFF' : '#17212B';

  return (
    <div
      className={`pt-3 px-6 pb-2 flex items-center justify-between text-xs font-semibold select-none z-30 ${textColor}`}
    >
      {/* Time */}
      <span className="font-semibold tracking-tight text-[13px] font-sans w-12 text-left">
        {time}
      </span>

      {/* Dynamic Island / Cutout */}
      <div className="w-24 h-5 bg-black rounded-full mx-auto hidden sm:block shadow-xs border border-white/5" />

      {/* Status Icons: Cellular, Wi-Fi, Battery */}
      <div className="flex items-center gap-1.5 w-16 justify-end">
        {/* Cellular 4 bars */}
        <svg
          viewBox="0 0 18 12"
          className="w-4 h-3 shrink-0"
          fill={fillColor}
          aria-hidden="true"
        >
          <rect x="1" y="8" width="2.5" height="4" rx="0.8" />
          <rect x="5.5" y="5.5" width="2.5" height="6.5" rx="0.8" />
          <rect x="10" y="3" width="2.5" height="9" rx="0.8" />
          <rect x="14.5" y="0.5" width="2.5" height="11.5" rx="0.8" />
        </svg>

        {/* Wi-Fi symbol */}
        <svg
          viewBox="0 0 16 12"
          className="w-3.5 h-3 shrink-0"
          fill={fillColor}
          aria-hidden="true"
        >
          <path d="M8 10.2a1.4 1.4 0 100 2.8 1.4 1.4 0 000-2.8z" />
          <path d="M4.3 7.8c2-2 5.4-2 7.4 0l1.2-1.2c-2.7-2.7-7.1-2.7-9.8 0l1.2 1.2z" />
          <path d="M1.3 4.8c3.7-3.7 9.7-3.7 13.4 0l1.2-1.2C11.6-.4 4.4-.4.1 3.6l1.2 1.2z" />
        </svg>

        {/* Battery with charge level and positive terminal */}
        <svg
          viewBox="0 0 25 12"
          className="w-5 h-3 shrink-0"
          fill="none"
          stroke={fillColor}
          aria-hidden="true"
        >
          {/* Outer capsule */}
          <rect
            x="0.75"
            y="0.75"
            width="20.5"
            height="10.5"
            rx="3"
            strokeWidth="1.2"
            fill="none"
          />
          {/* Interior charge fill (full demonstration state) */}
          <rect
            x="2.5"
            y="2.5"
            width="17"
            height="7"
            rx="1.6"
            fill={fillColor}
            stroke="none"
          />
          {/* Terminal cap */}
          <path
            d="M 22.8 4 C 23.5 4 23.8 4.6 23.8 6 C 23.8 7.4 23.5 8 22.8 8"
            stroke={fillColor}
            strokeWidth="1.2"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      </div>
    </div>
  );
};
