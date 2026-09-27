import React, { useEffect, useState } from 'react';
import { CheckCircle2, ArrowRight, Sparkles, TrendingUp } from 'lucide-react';
import { PurchaseFeedback } from '../types';

interface PurchaseNotificationProps {
  feedback: PurchaseFeedback | null;
  onDismiss: () => void;
}

export const PurchaseNotification: React.FC<PurchaseNotificationProps> = ({
  feedback,
  onDismiss,
}) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (feedback) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(onDismiss, 300);
      }, 4200);
      return () => clearTimeout(timer);
    }
  }, [feedback, onDismiss]);

  if (!feedback || !visible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm sm:max-w-md w-full px-4 animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className="rounded-2xl bg-[#143B28] text-white p-4 shadow-xl border border-[#2B6D4A] flex items-start gap-3.5">
        <div className="w-9 h-9 rounded-xl bg-[#235F3E] text-[#69D898] flex items-center justify-center shrink-0 mt-0.5">
          <TrendingUp className="w-5 h-5" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#73CE9A]">
              Round-up Allocated
            </span>
            <span className="text-xs font-mono font-bold text-[#A5E7BF]">
              +${feedback.roundUp.toFixed(2)}
            </span>
          </div>

          {/* Primary requirement: Briefly show "$4.60 → $5.00" and "$0.40 toward your prediction" */}
          <div className="mt-1 flex items-center gap-2 text-sm font-bold text-white">
            <span>${feedback.fromAmount.toFixed(2)}</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#65CD92]" />
            <span>${feedback.toAmount.toFixed(2)}</span>
            <span className="text-xs font-semibold text-[#8FD4AE] ml-1">
              (${feedback.roundUp.toFixed(2)} toward your prediction)
            </span>
          </div>

          <p className="mt-1 text-xs text-[#AFD6C1] truncate">
            Backed: <strong>{feedback.targetMarket}</strong> ({feedback.targetSide})
          </p>
        </div>

        <button
          onClick={() => {
            setVisible(false);
            setTimeout(onDismiss, 200);
          }}
          className="text-[#7CBF99] hover:text-white text-xs font-semibold p-1 cursor-pointer"
        >
          ✕
        </button>
      </div>
    </div>
  );
};
