import React from 'react';

export const ApplePayCheckmark: React.FC<{ label?: string; sublabel?: string; size?: number }> = ({
  label = 'Done', sublabel, size = 64,
}) => (
  <div className="pay-complete" role="status">
    <svg viewBox="0 0 100 100" width={size} height={size} aria-hidden="true">
      <circle cx="50" cy="50" r="44" fill="none" stroke="currentColor" strokeWidth="4" className="animate-checkmark-circle" />
      <path d="M30 51 44 65 71 36" fill="none" stroke="currentColor" strokeWidth="5"
        strokeLinecap="round" strokeLinejoin="round" className="animate-checkmark-stroke" />
    </svg>
    <span>{label}</span>
    {sublabel && <small>{sublabel}</small>}
  </div>
);
