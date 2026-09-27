import React, { useEffect, useState } from 'react';
import { Check, X } from 'lucide-react';
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
        setTimeout(onDismiss, 200);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [feedback, onDismiss]);

  if (!feedback || !visible) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 animate-in fade-in slide-in-from-bottom-3 duration-200">
      <div className="bg-white border border-[#E5E7EB] rounded-lg py-2.5 px-4 shadow-lg flex items-center gap-3 text-xs text-[#17212B]">
        <div className="w-5 h-5 rounded-full bg-[#E8F5EE] text-[#16734B] flex items-center justify-center shrink-0">
          <Check className="w-3.5 h-3.5 stroke-[2.5]" />
        </div>

        <span className="font-medium">
          ${feedback.roundUp.toFixed(2)} allocated to{' '}
          <strong className="font-semibold">{feedback.targetMarket}</strong> ·{' '}
          <span className="font-semibold">{feedback.targetSide}</span>.
        </span>

        <button
          type="button"
          onClick={() => {
            setVisible(false);
            setTimeout(onDismiss, 200);
          }}
          className="text-[#64748B] hover:text-[#17212B] p-0.5 rounded hover:bg-[#F3F4F6] cursor-pointer ml-1"
          aria-label="Dismiss"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
