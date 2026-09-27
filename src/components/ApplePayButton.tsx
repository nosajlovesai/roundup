import React, { useEffect, useState } from 'react';

interface ApplePayButtonProps {
  buttonType?: 'plain' | 'buy' | 'check-out' | 'order' | 'pay';
  buttonStyle?: 'black' | 'white' | 'white-outline';
  onClick: () => void;
  className?: string;
  disabled?: boolean;
}

// Unified vector representation of the Apple Pay mark (Apple silhouette + Pay wordmark)
// Avoids Unicode characters and separated raw text elements
export const ApplePayMarkVector: React.FC<{ className?: string; fill?: string }> = ({
  className = 'h-5 w-auto',
  fill = 'currentColor',
}) => {
  return (
    <svg
      viewBox="0 0 165 64"
      fill={fill}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Apple Pay"
      role="img"
    >
      {/* Apple leaf */}
      <path d="M50.9 15.3c2.4-3 4-7.2 3.6-11.4-3.6.2-7.8 2.4-10.4 5.4-2.2 2.6-4.2 6.8-3.7 10.9 4 .3 8.1-1.9 10.5-4.9z" />
      {/* Apple body */}
      <path d="M54.5 22.4c-5.8-.3-10.7 3.3-13.5 3.3-2.8 0-7-3.2-11.6-3.1-6 .1-11.5 3.5-14.6 8.9-6.2 10.8-1.6 26.8 4.4 35.5 2.9 4.3 6.4 9 11 8.8 4.5-.2 6.2-2.9 11.6-2.9 5.4 0 6.9 2.9 11.6 2.8 4.8-.1 7.8-4.3 10.7-8.6 3.4-4.9 4.8-9.7 4.9-10-.1-.1-9.4-3.6-9.5-14.3-.1-8.9 7.3-13.2 7.6-13.4-4.2-6.1-10.6-6.8-12.7-7z" />
      {/* P */}
      <path d="M79.2 14.8h17.8c5.4 0 9.7 1.4 12.8 4.2 3.1 2.8 4.7 6.6 4.7 11.4 0 4.9-1.6 8.7-4.7 11.5-3.1 2.8-7.4 4.2-12.8 4.2h-7.6v17.4H79.2V14.8zm10.2 22.8h7.2c2.7 0 4.8-.7 6.3-2.1s2.2-3.4 2.2-6c0-2.6-.7-4.6-2.2-6s-3.6-2.1-6.3-2.1h-7.2v16.2z" />
      {/* a */}
      <path d="M125.7 37.6c-4.9 0-8.6 1.1-11 3.2-2.4 2.1-3.6 5-3.6 8.7 0 3.5 1.1 6.3 3.4 8.3 2.3 2 5.4 3 9.4 3 3.6 0 6.6-.9 9.1-2.6v2.1h9.4V42.6c0-4.6-1.5-8.1-4.4-10.4-3-2.4-7.2-3.6-12.8-3.6-5 0-9.2.9-12.7 2.7l3 7.3c2.7-1.4 5.8-2.1 9.4-2.1 2.8 0 5 .6 6.4 1.7 1.5 1.1 2.2 2.8 2.2 5.1v1.6l-8.4-.3zm8.3 12.9c-1.3 1.4-3.3 2.1-5.9 2.1-2 0-3.6-.5-4.8-1.5-1.2-1-1.8-2.4-1.8-4.2 0-2 .7-3.5 2.1-4.6 1.4-1.1 3.5-1.6 6.3-1.6l4.1.2v9.6z" />
      {/* y */}
      <path d="M149.3 29h10.4l9.5 26.6 9.3-26.6h10.2l-15.6 38.6c-2.8 6.9-7.2 10.4-13.3 10.4-2.6 0-4.8-.4-6.6-1.2l2.6-7.8c1.2.5 2.5.7 3.9.7 2.8 0 4.8-1.4 6-4.1l1.4-3.7-17.8-32.9z" />
    </svg>
  );
};

export const ApplePayButton: React.FC<ApplePayButtonProps> = ({
  buttonType = 'plain',
  buttonStyle = 'black',
  onClick,
  className = '',
  disabled = false,
}) => {
  const [canUseNative, setCanUseNative] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isSafari =
        /^((?!chrome|android).)*safari/i.test(navigator.userAgent) ||
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        Boolean((window as any).ApplePaySession);
      setCanUseNative(isSafari);
    }
  }, []);

  const getStyleClasses = () => {
    switch (buttonStyle) {
      case 'white':
        return 'bg-white text-black border border-transparent hover:bg-zinc-100';
      case 'white-outline':
        return 'bg-white text-black border border-black hover:bg-zinc-50';
      case 'black':
      default:
        return 'bg-black text-white hover:bg-zinc-900 border border-transparent';
    }
  };

  const getPrefixLabel = () => {
    switch (buttonType) {
      case 'buy':
        return 'Buy with';
      case 'check-out':
        return 'Check out with';
      case 'order':
        return 'Order with';
      case 'pay':
        return 'Pay with';
      case 'plain':
      default:
        return '';
    }
  };

  const prefix = getPrefixLabel();

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label="Apple Pay"
      className={`relative inline-flex items-center justify-center min-h-[44px] h-[48px] px-6 rounded-xl font-medium text-sm transition-all active:scale-[0.98] cursor-pointer shadow-sm select-none overflow-hidden ${getStyleClasses()} ${className}`}
      style={{
        WebkitAppearance: canUseNative ? '-apple-pay-button' : undefined,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ['--apple-pay-button-style' as any]: buttonStyle,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ['--apple-pay-button-type' as any]: buttonType,
      }}
    >
      <span className="flex items-center justify-center gap-2">
        {prefix && <span className="font-normal text-sm leading-none">{prefix}</span>}
        <ApplePayMarkVector
          className="h-5 w-auto"
          fill={buttonStyle === 'black' ? '#FFFFFF' : '#000000'}
        />
      </span>
    </button>
  );
};
