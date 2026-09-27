import React from 'react';
import { Check, CheckCircle2, X } from 'lucide-react';
import { RoundUpLogo } from './RoundUpLogo';
import { PredictionSide } from '../types';

interface RoundUpNotificationCardProps {
  status: 'active' | 'approved' | 'skipped' | 'dismissed';
  amountDue: number; // 4.60
  roundUpAmount: number; // 0.40
  marketShortTitle: string;
  side: PredictionSide;
  totalAllocated: number;
  onApprove: () => void;
  onSkip: () => void;
  onDismiss: () => void;
  className?: string;
}

export const RoundUpNotificationCard: React.FC<RoundUpNotificationCardProps> = ({
  status,
  amountDue,
  roundUpAmount,
  marketShortTitle,
  side,
  totalAllocated,
  onApprove,
  onSkip,
  onDismiss,
  className = '',
}) => {
  if (status === 'dismissed') {
    return (
      <div className={`animate-notification-slide text-left ${className}`}>
        <div className="bg-[#1C1C1E]/90 backdrop-blur-2xl border border-white/10 rounded-2xl p-3.5 shadow-2xl text-zinc-400 text-xs">
          <span>Notification dismissed · No round-up allocated.</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`animate-notification-slide text-left ${className}`}>
      <div className="bg-[#1C1C1E]/95 backdrop-blur-2xl border border-white/15 rounded-2xl p-4 shadow-2xl text-white space-y-3 ring-1 ring-white/10">
        {/* Banner Header: App icon, Title, separator, timestamp, dismiss button */}
        <div className="flex items-center justify-between pb-2 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-[5px] overflow-hidden flex items-center justify-center shrink-0">
              <RoundUpLogo className="w-full h-full" />
            </div>
            <div className="flex items-center gap-1.5 text-xs">
              <span className="font-semibold text-zinc-100 font-sans">Round Up</span>
              <span className="text-zinc-500">·</span>
              <span className="text-[11px] text-zinc-400 font-mono">now</span>
            </div>
          </div>

          {status === 'active' && (
            <button
              type="button"
              onClick={onDismiss}
              title="Dismiss notification"
              className="text-zinc-400 hover:text-white p-1 rounded-md transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* ACTIVE STATE: Question and Expanded Actions */}
        {status === 'active' && (
          <div className="space-y-3">
            <div className="space-y-1 text-xs">
              <p className="font-semibold text-white text-sm tracking-tight font-sans">
                Round up your ${amountDue.toFixed(2)} coffee?
              </p>
              <p className="text-zinc-300 text-xs leading-relaxed font-sans">
                Add ${roundUpAmount.toFixed(2)} toward{' '}
                <strong className="text-white font-medium">{marketShortTitle}</strong>{' '}
                ·{' '}
                <span
                  className={`font-semibold px-1.5 py-0.5 rounded text-[11px] ${
                    side === 'YES'
                      ? 'bg-[#10B981]/20 text-[#34D399] border border-[#10B981]/30'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  }`}
                >
                  {side}
                </span>
                .
              </p>
            </div>

            {/* Expanded Action Buttons */}
            <div className="grid grid-cols-2 gap-2 pt-0.5">
              <button
                type="button"
                onClick={onApprove}
                className="min-h-[44px] py-2.5 px-3 rounded-xl bg-[#10B981] text-zinc-950 font-semibold text-xs hover:bg-[#059669] active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
              >
                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Yes, round up ${roundUpAmount.toFixed(2)}</span>
              </button>

              <button
                type="button"
                onClick={onSkip}
                className="min-h-[44px] py-2.5 px-3 rounded-xl bg-white/12 text-zinc-200 hover:text-white hover:bg-white/20 font-semibold text-xs active:scale-[0.98] transition-all flex items-center justify-center cursor-pointer border border-white/10"
              >
                <span>No, skip</span>
              </button>
            </div>
          </div>
        )}

        {/* APPROVED MORPHED STATE */}
        {status === 'approved' && (
          <div className="space-y-2 py-0.5 animate-in fade-in duration-200">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#34D399]">
              <CheckCircle2 className="w-4 h-4 text-[#34D399] shrink-0" />
              <span className="text-sm font-semibold">${roundUpAmount.toFixed(2)} allocated</span>
            </div>
            <p className="text-xs text-zinc-300 font-sans">
              {marketShortTitle} ·{' '}
              <span
                className={`font-semibold px-1 py-0.2 rounded text-[10px] ${
                  side === 'YES' ? 'text-[#34D399]' : 'text-rose-300'
                }`}
              >
                {side}
              </span>
            </p>
            <div className="pt-1 flex items-center justify-between text-[11px] font-mono text-[#34D399] bg-[#10B981]/10 px-2.5 py-1.5 rounded-lg border border-[#10B981]/20">
              <span className="font-sans text-zinc-400">Total Allocated</span>
              <span className="font-bold">${totalAllocated.toFixed(2)}</span>
            </div>
          </div>
        )}

        {/* SKIPPED MORPHED STATE */}
        {status === 'skipped' && (
          <div className="space-y-1 py-0.5 animate-in fade-in duration-200 text-xs">
            <p className="font-semibold text-zinc-200">Skipped. Nothing allocated.</p>
            <p className="text-[11px] text-zinc-400 font-sans">
              Base purchase of ${amountDue.toFixed(2)} settled as standard.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
