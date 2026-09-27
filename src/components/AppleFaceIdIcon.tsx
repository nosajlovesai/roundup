import React from 'react';

interface AppleFaceIdIconProps {
  isVerifying?: boolean;
  className?: string;
}

export const AppleFaceIdIcon: React.FC<AppleFaceIdIconProps> = ({
  isVerifying = false,
  className = 'w-16 h-16',
}) => {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <svg
        viewBox="0 0 100 100"
        fill="none"
        stroke="currentColor"
        aria-hidden="true"
        className={`w-full h-full transition-opacity duration-200 ${
          isVerifying ? 'animate-faceid-restrained' : ''
        }`}
      >
        {/* Top-Left Bracket */}
        <path
          d="M 14 30 L 14 20 C 14 16.5 16.5 14 20 14 L 30 14"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Top-Right Bracket */}
        <path
          d="M 70 14 L 80 14 C 83.5 14 86 16.5 86 20 L 86 30"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Bottom-Right Bracket */}
        <path
          d="M 86 70 L 86 80 C 86 83.5 83.5 86 80 86 L 70 86"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Bottom-Left Bracket */}
        <path
          d="M 30 86 L 20 86 C 16.5 86 14 83.5 14 80 L 14 70"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Eyes */}
        <line
          x1="36"
          y1="38"
          x2="36"
          y2="45"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <line
          x1="64"
          y1="38"
          x2="64"
          y2="45"
          strokeWidth="3.5"
          strokeLinecap="round"
        />

        {/* Nose */}
        <path
          d="M 50 42 L 50 55 L 44 55"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Smile curve */}
        <path
          d="M 36 67 C 40 73 60 73 64 67"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};
