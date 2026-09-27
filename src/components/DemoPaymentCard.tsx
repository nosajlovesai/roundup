import React from 'react';

interface DemoPaymentCardProps {
  className?: string;
  onClick?: () => void;
}

export const DemoPaymentCard: React.FC<DemoPaymentCardProps> = ({
  className = '',
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`relative w-full aspect-[1.586/1] rounded-2xl bg-gradient-to-br from-[#27272A] via-[#1E1E22] to-[#141416] p-5 shadow-2xl flex flex-col justify-between text-white border border-white/10 select-none overflow-hidden ${className}`}
    >
      {/* Top row: Contactless wave icon */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Neutral EMV Chip */}
          <div className="w-8 h-6 rounded-md bg-gradient-to-br from-amber-200 via-amber-300 to-amber-400 border border-amber-500/40 grid grid-cols-2 gap-0.5 p-0.5 opacity-90">
            <div className="border-r border-b border-amber-600/40 rounded-tl-sm" />
            <div className="border-b border-amber-600/40 rounded-tr-sm" />
            <div className="border-r border-amber-600/40 rounded-bl-sm" />
            <div className="rounded-br-sm" />
          </div>

          {/* Contactless waves */}
          <svg
            viewBox="0 0 24 24"
            className="w-5 h-5 text-zinc-400 rotate-90"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="M8.5 16.5a5 5 0 0 1 0-9" />
            <path d="M12 19a8.5 8.5 0 0 1 0-14" />
            <path d="M15.5 21.5a12 12 0 0 1 0-19" />
          </svg>
        </div>

        <span className="text-[11px] font-medium tracking-wide text-zinc-400 uppercase">
          Demo Card
        </span>
      </div>

      {/* Bottom row: Card Number Mask & Demo indicator */}
      <div className="flex items-end justify-between">
        <div>
          <span className="font-mono text-sm tracking-wider text-zinc-200">
            •••• •••• •••• 4128
          </span>
          <span className="block text-[10px] text-zinc-500 font-sans tracking-normal mt-0.5">
            Simulated Payment Method
          </span>
        </div>

        <div className="flex items-center gap-1 text-[11px] font-medium text-zinc-400">
          <span>Debit</span>
        </div>
      </div>
    </div>
  );
};
