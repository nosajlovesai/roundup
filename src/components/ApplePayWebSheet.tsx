import React, { useEffect, useRef } from 'react';
import { X, ChevronRight } from 'lucide-react';
import { ApplePayCheckmark } from './ApplePayCheckmark';
import { AppleFaceIdIcon } from './AppleFaceIdIcon';
import { ApplePayMark } from './ApplePayButton';

interface ApplePayWebSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  flowStep: 'review' | 'authorizing' | 'success';
  amount: number;
  merchantName: string;
}

// Layout reference: Apple's Apple Pay design template, iPhone / Light.
// This DOM preview never invokes ApplePaySession or authenticates a user.
export const ApplePayWebSheet: React.FC<ApplePayWebSheetProps> = ({
  isOpen, onClose, onConfirm, flowStep, amount, merchantName,
}) => {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    if (!isOpen) { element.close(); return; }
    const align = () => {
      const frame = element.closest('.demo-phone')?.getBoundingClientRect();
      if (!frame) return;
      const top = Math.max(8, frame.top);
      Object.assign(element.style, {
        left: `${frame.left}px`, top: `${top}px`, width: `${frame.width}px`,
        height: `${Math.min(frame.height, window.innerHeight - top - 8)}px`,
      });
    };
    align();
    if (!element.open) element.showModal();
    window.addEventListener('resize', align);
    window.addEventListener('scroll', align, true);
    return () => {
      window.removeEventListener('resize', align);
      window.removeEventListener('scroll', align, true);
    };
  }, [isOpen]);

  return (
    <dialog ref={dialog} className="pay-dialog" aria-label="Apple Pay payment sheet preview"
      onCancel={(event) => { event.preventDefault(); if (flowStep === 'review') onClose(); }}>
      <div className="pay-preview">
        {flowStep === 'review' && (
          <button type="button" className="pay-side-prompt" onClick={onConfirm}
            aria-label="Simulate double-click of side button">
            <span>Double Click<br />to Pay</span><i aria-hidden="true" />
          </button>
        )}
        <section className="pay-sheet">
          <header className="pay-sheet-header">
            <ApplePayMark />
            <button type="button" onClick={onClose} disabled={flowStep !== 'review'}
              aria-label="Cancel payment" className="pay-close"><X size={20} /></button>
          </header>
          <div className="pay-card-row">
            <span className="pay-mini-card" aria-hidden="true">DEMO</span>
            <div><strong>Demo Debit</strong><span>•••• 4128</span></div>
          </div>
          <div className="pay-total">
            <span>Pay {merchantName}</span>
            <strong><small>USD</small> ${amount.toFixed(2)}</strong>
          </div>
          <div className="pay-authentication" aria-live="polite">
            {flowStep === 'review' && (
              <button type="button" className="pay-confirm" onClick={onConfirm}>
                <span className="pay-side-symbol" aria-hidden="true"><ChevronRight size={18} /><i /></span>
                <span>Confirm with Side Button</span>
              </button>
            )}
            {flowStep === 'authorizing' && <><AppleFaceIdIcon isVerifying className="w-10 h-10" /><span>Face ID</span></>}
            {flowStep === 'success' && <ApplePayCheckmark label="Done" size={44} />}
          </div>
        </section>
      </div>
    </dialog>
  );
};
