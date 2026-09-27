import React from 'react';

interface ApplePayCheckmarkProps {
  label?: string;
  sublabel?: string;
  size?: number;
}

export const ApplePayCheckmark: React.FC<ApplePayCheckmarkProps> = ({
  label = 'Done',
  sublabel,
  size = 72,
}) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-3">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full transform"
        >
          {/* Subtle background track */}
          <circle
            cx="50"
            cy="50"
            r="44"
            fill="none"
            stroke="rgba(255, 255, 255, 0.15)"
            strokeWidth="3.5"
          />

          {/* Animated checkmark ring */}
          <circle
            cx="50"
            cy="50"
            r="44"
            fill="none"
            stroke="#10B981"
            strokeWidth="3.5"
            strokeLinecap="round"
            className="animate-checkmark-circle"
          />

          {/* Animated checkmark tick */}
          <path
            d="M 30 52 L 44 65 L 70 36"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="animate-checkmark-stroke"
          />
        </svg>
      </div>

      <div className="text-center space-y-0.5">
        <h4 className="text-xl font-medium tracking-tight text-white font-sans">
          {label}
        </h4>
        {sublabel && (
          <p className="text-xs text-zinc-400 font-sans">
            {sublabel}
          </p>
        )}
      </div>
    </div>
  );
};
