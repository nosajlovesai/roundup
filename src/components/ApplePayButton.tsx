import React, { useEffect, useRef, useState } from 'react';

interface ApplePayButtonProps {
  buttonType?: 'plain' | 'buy' | 'check-out' | 'order' | 'pay';
  buttonStyle?: 'black' | 'white' | 'white-outline';
  onClick: () => void;
  className?: string;
  disabled?: boolean;
}

// Unmodified artwork from Apple's downloadable marketing resources.
export const ApplePayMark: React.FC<{ className?: string }> = ({ className = '' }) => (
  <img src="/apple-pay/apple-pay-mark.svg" alt="Apple Pay" className={className} width="55" height="35" />
);

/** Official Apple web component, shown within an explicitly labeled demo. */
export const ApplePayButton: React.FC<ApplePayButtonProps> = ({
  buttonType = 'plain', buttonStyle = 'black', onClick, className = '', disabled = false,
}) => {
  const [ready, setReady] = useState(() => Boolean(window.customElements?.get('apple-pay-button')));
  const nativeButton = useRef<HTMLElement>(null);
  const [unavailable, setUnavailable] = useState(true);
  useEffect(() => {
    let mounted = true;
    window.customElements?.whenDefined('apple-pay-button').then(() => {
      if (mounted) setReady(true);
    });
    return () => { mounted = false; };
  }, []);
  useEffect(() => {
    const element = nativeButton.current;
    if (!ready || !element) return;
    // The SDK can register successfully but hide its control in an unsupported webview.
    const check = () => setUnavailable(Boolean(element.hidden) || element.hasAttribute('disabled'));
    check();
    const observer = new MutationObserver(check);
    observer.observe(element, { attributes: true, attributeFilter: ['hidden', 'disabled'] });
    return () => observer.disconnect();
  }, [ready]);

  return (
    <div className={`apple-pay-control ${className}`} inert={disabled}>
      {ready && React.createElement('apple-pay-button', {
        ref: nativeButton,
        buttonstyle: buttonStyle, type: buttonType, locale: 'en-US',
        onClick: () => { if (!disabled) onClick(); },
        'aria-label': 'Apple Pay — demo checkout',
      })}
      {(!ready || unavailable) && (
        <div className="pay-button-fallback">
          <ApplePayMark />
          <button type="button" onClick={onClick} disabled={disabled} className="demo-primary">
            Preview payment sheet
          </button>
        </div>
      )}
    </div>
  );
};
