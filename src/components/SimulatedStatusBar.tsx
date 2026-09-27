import React from 'react';

/** Desktop-only illustration; on phones leave status chrome to the OS.
 * Original SVG approximations, not exported SF Symbols. See docs/apple-pay-demo.md.
 */
export const SimulatedStatusBar: React.FC<{ theme?: 'dark' | 'light'; time?: string }> = ({
  theme = 'dark', time = '9:41',
}) => (
  <div className={`demo-status ${theme === 'dark' ? 'demo-status-light' : ''}`} aria-hidden="true">
    <span>{time}</span><div className="demo-island" />
    <div className="demo-status-icons">
      <svg viewBox="0 0 19 12" width="19" height="12" fill="currentColor">
        <rect y="8" width="3.1" height="4" rx=".8" /><rect x="5" y="5.5" width="3.1" height="6.5" rx=".8" />
        <rect x="10" y="3" width="3.1" height="9" rx=".8" /><rect x="15" width="3.1" height="12" rx=".8" />
      </svg>
      <svg viewBox="0 0 17 12" width="17" height="12" fill="currentColor">
        <path d="M.3 3.4a12.2 12.2 0 0 1 16.4 0l-1.9 1.9a9.5 9.5 0 0 0-12.6 0zM3.3 6.4a7.7 7.7 0 0 1 10.4 0l-1.9 1.9a4.9 4.9 0 0 0-6.6 0zM6.3 9.4a3.2 3.2 0 0 1 4.4 0L8.5 12z" />
      </svg>
      <svg viewBox="0 0 28 13" width="28" height="13" fill="currentColor">
        <rect x=".5" y=".5" width="24" height="12" rx="3.5" fill="none" stroke="currentColor" opacity=".4" />
        <rect x="2.5" y="2.5" width="20" height="8" rx="1.6" />
        <path d="M26 4.5c2 0 2 4 0 4z" opacity=".4" />
      </svg>
    </div>
  </div>
);
