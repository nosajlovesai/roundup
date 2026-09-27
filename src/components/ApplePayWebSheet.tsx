import React from 'react';
import { ChevronDown } from 'lucide-react';
import { ApplePayCheckmark } from './ApplePayCheckmark';
import { AppleFaceIdIcon } from './AppleFaceIdIcon';
import { ApplePayMarkVector } from './ApplePayButton';

interface ApplePayWebSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  flowStep: 'review' | 'authorizing' | 'success';
  amount: number;
  merchantName: string;
  itemName: string;
}

export const ApplePayWebSheet: React.FC<ApplePayWebSheetProps> = ({
  isOpen,
  onClose,
  onConfirm,
  flowStep,
  amount,
  merchantName,
  itemName,
}) => {
  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-50 bg-black/50 backdrop-blur-xs flex flex-col justify-end animate-in fade-in duration-150">
      <div className="bg-[#F2F2F7] rounded-t-[32px] p-5 space-y-3.5 shadow-2xl animate-in slide-in-from-bottom duration-250 border-t border-white/20 max-h-[92%] overflow-y-auto text-[#17212B]">
        {/* Apple Pay Sheet Header */}
        <div className="flex items-center justify-between pb-2 border-b border-[#E5E5EA]">
          <div className="flex items-center gap-1.5">
            <ApplePayMarkVector className="h-5 w-auto" fill="#17212B" />
          </div>

          {flowStep === 'review' && (
            <button
              type="button"
              onClick={onClose}
              className="text-xs font-medium text-[#8E8E93] hover:text-[#17212B] p-1 cursor-pointer"
            >
              Cancel
            </button>
          )}
        </div>

        {/* REVIEW STAGE */}
        {flowStep === 'review' && (
          <div className="space-y-3">
            {/* Neutral Demo Payment Card */}
            <div className="bg-white rounded-2xl p-3 border border-[#E5E5EA] shadow-2xs space-y-2">
              <span className="text-[10px] uppercase font-semibold tracking-wider text-[#8E8E93] block">
                Cards
              </span>

              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  {/* Neutral Demo Card graphic */}
                  <div className="w-10 h-6 rounded bg-zinc-800 text-zinc-200 flex items-center justify-center font-mono text-[8px] tracking-wider shadow-2xs border border-zinc-700">
                    <span>••••</span>
                  </div>
                  <div>
                    <span className="font-semibold text-[#17212B] block">
                      Demo Card (•••• 4128)
                    </span>
                    <span className="text-[11px] text-[#8E8E93]">
                      Standard Account
                    </span>
                  </div>
                </div>

                <ChevronDown className="w-4 h-4 text-[#C7C7CC]" />
              </div>
            </div>

            {/* Item Summary Breakdown */}
            <div className="bg-white rounded-2xl p-3 border border-[#E5E5EA] shadow-2xs text-xs space-y-1.5">
              <div className="flex justify-between text-[#8E8E93]">
                <span>{itemName}</span>
                <span className="font-mono text-[#17212B] font-medium">
                  ${amount.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-[#8E8E93]">
                <span>Sales Tax</span>
                <span className="font-mono text-[#17212B] font-medium">$0.00</span>
              </div>
              <div className="pt-2 border-t border-[#E5E5EA] flex justify-between font-bold text-sm text-[#17212B]">
                <span>Pay {merchantName}</span>
                <span className="font-mono">${amount.toFixed(2)}</span>
              </div>
            </div>

            {/* Authorization Action */}
            <div className="pt-1">
              <button
                type="button"
                onClick={onConfirm}
                className="w-full min-h-[48px] py-3 px-4 rounded-2xl bg-black text-white font-semibold text-sm hover:bg-zinc-800 active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 cursor-pointer shadow-md"
              >
                <AppleFaceIdIcon isVerifying={false} className="w-5 h-5 text-white" />
                <span>Pay with Face ID · ${amount.toFixed(2)}</span>
              </button>
            </div>
          </div>
        )}

        {/* AUTHORIZING / PROCESSING STAGE */}
        {flowStep === 'authorizing' && (
          <div className="py-8 flex flex-col items-center justify-center space-y-4 animate-in zoom-in-95 duration-150">
            <div className="w-20 h-20 rounded-3xl bg-white border border-[#E5E5EA] flex items-center justify-center shadow-md">
              <AppleFaceIdIcon isVerifying={true} className="w-12 h-12 text-[#17212B]" />
            </div>
            <div className="text-center space-y-1">
              <span className="text-sm font-semibold text-[#17212B] block">
                Face ID
              </span>
              <span className="text-xs text-[#8E8E93] font-mono">
                Authorizing ${amount.toFixed(2)}
              </span>
            </div>
          </div>
        )}

        {/* SUCCESS CHECKMARK STAGE */}
        {flowStep === 'success' && (
          <div className="py-6 flex flex-col items-center justify-center animate-in zoom-in-95 duration-150">
            <ApplePayCheckmark
              label="Done"
              sublabel={`Paid $${amount.toFixed(2)} to ${merchantName}`}
              size={72}
            />
          </div>
        )}
      </div>
    </div>
  );
};
