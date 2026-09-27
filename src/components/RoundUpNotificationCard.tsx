import React, { useState } from 'react';
import { Check, X } from 'lucide-react';
import { RoundUpLogo } from './RoundUpLogo';
import { PredictionSide } from '../types';

interface RoundUpNotificationCardProps {
  status: 'active' | 'approved' | 'skipped' | 'dismissed';
  amountDue: number;
  roundUpAmount: number;
  marketShortTitle: string;
  side: PredictionSide;
  totalAllocated: number;
  onApprove: () => void;
  onSkip: () => void;
  onDismiss: () => void;
  className?: string;
}

export const RoundUpNotificationCard: React.FC<RoundUpNotificationCardProps> = ({
  status, amountDue, roundUpAmount, marketShortTitle, side, totalAllocated,
  onApprove, onSkip, onDismiss, className = '',
}) => {
  const [expanded, setExpanded] = useState(false);
  if (status === 'dismissed') return <p className="roundup-dismissed" role="status">Dismissed. No round-up added.</p>;

  return (
    <div className={`roundup-notification animate-notification-slide ${className}`}>
      <div className="roundup-notification-header">
        <RoundUpLogo className="w-7 h-7" /><strong>Round Up</strong><span>now</span>
        {status === 'active' && <button type="button" onClick={onDismiss} aria-label="Dismiss round-up"><X size={16} /></button>}
      </div>
      {status === 'active' ? (
        <>
          <button type="button" className="roundup-notification-message" onClick={() => setExpanded(!expanded)}
            aria-expanded={expanded} aria-label="Review round-up">
            <strong>Round up your ${amountDue.toFixed(2)} coffee?</strong>
            <span>Add ${roundUpAmount.toFixed(2)} to {marketShortTitle} · {side}.</span>
          </button>
          {expanded && <div className="roundup-expanded">
            <div className="roundup-equation" aria-label={`${amountDue.toFixed(2)} plus ${roundUpAmount.toFixed(2)} equals ${(amountDue + roundUpAmount).toFixed(2)}`}>
              <span>${amountDue.toFixed(2)}<small>Coffee</small></span><b>+</b>
              <span className="roundup-change">${roundUpAmount.toFixed(2)}<small>Round-up</small></span><b>=</b>
              <span>${(amountDue + roundUpAmount).toFixed(2)}<small>Total</small></span>
            </div>
            <button type="button" className="roundup-approve" onClick={onApprove}><Check size={18} />Round up ${roundUpAmount.toFixed(2)}</button>
            <button type="button" className="roundup-skip" onClick={onSkip}>Not now</button>
          </div>}
        </>
      ) : (
        <div className="roundup-result" role="status">
          <strong>{status === 'approved' ? `+$${roundUpAmount.toFixed(2)} added` : 'Skipped. Nothing added.'}</strong>
          <p>{status === 'approved' ? `${marketShortTitle} · ${side}` : `Your coffee payment stays at $${amountDue.toFixed(2)}.`}</p>
          {status === 'approved' && <div><span>Total allocated</span><b>${totalAllocated.toFixed(2)}</b></div>}
        </div>
      )}
    </div>
  );
};
