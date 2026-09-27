import React, { useState } from 'react';
import { ArrowDownLeft, CreditCard, CheckCircle2, AlertCircle, X, ShieldCheck } from 'lucide-react';
import { RoundUpLogo } from './RoundUpLogo';

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableBalance: number;
  onWithdraw: (amount: number) => void;
}

export const WithdrawModal: React.FC<WithdrawModalProps> = ({
  isOpen,
  onClose,
  availableBalance,
  onWithdraw,
}) => {
  const [amountInput, setAmountInput] = useState<string>(availableBalance > 0 ? availableBalance.toFixed(2) : '0.00');
  const [isSuccess, setIsSuccess] = useState(false);
  const [withdrawnAmount, setWithdrawnAmount] = useState<number>(0);

  if (!isOpen) return null;

  const parsedAmount = parseFloat(amountInput) || 0;
  const isValid = parsedAmount > 0 && parsedAmount <= availableBalance;

  const handlePreset = (fraction: number) => {
    const val = Number((availableBalance * fraction).toFixed(2));
    setAmountInput(val.toFixed(2));
  };

  const handleConfirm = () => {
    if (!isValid) return;
    const finalAmount = Number(parsedAmount.toFixed(2));
    setWithdrawnAmount(finalAmount);
    onWithdraw(finalAmount);
    setIsSuccess(true);
  };

  const handleFinish = () => {
    setIsSuccess(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-[#FAF8F3] border border-[#DDD7C9] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E5DFD1]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#143B27] text-white flex items-center justify-center shadow-xs">
              <ArrowDownLeft className="w-4 h-4 text-[#86EFAC]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#142C1E]">Withdraw to Card</h3>
              <p className="text-[11px] text-[#55695C]">Instant refund to your linked payment method</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleFinish}
            className="text-xs text-[#5B6C61] hover:text-[#142C1E] p-1.5 rounded-lg hover:bg-[#ECE6D8] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isSuccess ? (
          /* Success Screen */
          <div className="py-6 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#E5F5EC] text-[#14532D] flex items-center justify-center mx-auto border border-[#BBE3CC]">
              <CheckCircle2 className="w-7 h-7 text-[#20834B]" />
            </div>
            <div>
              <h4 className="text-base font-bold text-[#142C1E]">Transfer Complete</h4>
              <p className="text-xs text-[#4F6456] mt-1 font-mono">
                ${withdrawnAmount.toFixed(2)} refunded to Visa •••• 4128
              </p>
            </div>
            <p className="text-[11px] text-[#63776B] max-w-xs mx-auto">
              Your allocated round-up positions have been liquidated and transferred back to your debit card.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={handleFinish}
                className="w-full py-2.5 px-4 rounded-xl bg-[#17462B] text-white text-xs font-bold hover:bg-[#10341F] cursor-pointer shadow-xs"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          /* Withdrawal Form */
          <div className="space-y-4">
            {/* Balance Overview */}
            <div className="rounded-xl bg-[#F0EDE3] border border-[#DDD6C7] p-3 flex items-center justify-between text-xs">
              <span className="text-[#55695C] font-medium">Available to withdraw:</span>
              <span className="font-mono font-bold text-[#133D24] text-sm">
                ${availableBalance.toFixed(2)}
              </span>
            </div>

            {/* Input field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#183927] block">
                Withdrawal Amount ($)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-mono text-[#55695C] font-bold text-base">
                  $
                </span>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  max={availableBalance}
                  value={amountInput}
                  onChange={(e) => setAmountInput(e.target.value)}
                  className="w-full text-base font-mono font-bold py-2.5 pl-8 pr-3 rounded-xl border border-[#DCD5C5] bg-white text-[#183927] focus:outline-hidden focus:ring-2 focus:ring-[#16492C]"
                  placeholder="0.00"
                />
              </div>

              {/* Quick Preset Buttons */}
              <div className="grid grid-cols-3 gap-1.5 pt-1">
                {[
                  { label: '25%', frac: 0.25 },
                  { label: '50%', frac: 0.5 },
                  { label: 'All (100%)', frac: 1.0 },
                ].map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => handlePreset(preset.frac)}
                    className="py-1 px-2 rounded-lg text-xs font-semibold bg-white border border-[#E0D8CB] hover:bg-[#F2ECE1] text-[#244C34] transition-colors cursor-pointer"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Destination Card Confirmation */}
            <div className="rounded-xl bg-white border border-[#E4DDD0] p-3 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#55695C] font-medium">Destination:</span>
                <span className="text-[11px] font-bold text-[#185331] bg-[#E7F5ED] px-2 py-0.5 rounded border border-[#C5E5D3]">
                  Instant Transfer · $0 Fee
                </span>
              </div>
              <div className="flex items-center gap-2 pt-0.5">
                <CreditCard className="w-4 h-4 text-[#26623D]" />
                <span className="text-xs font-bold text-[#142C1E] font-mono">
                  Visa Debit ending in 4128
                </span>
              </div>
            </div>

            {/* Error notice if amount exceeds balance */}
            {!isValid && parsedAmount > availableBalance && (
              <div className="text-[11px] text-[#A4322A] bg-[#FDF1F0] p-2.5 rounded-xl border border-[#F3D5D3] flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>Amount exceeds your current available balance of ${availableBalance.toFixed(2)}.</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="button"
              disabled={!isValid}
              onClick={handleConfirm}
              className={`w-full py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                isValid
                  ? 'bg-[#14472A] text-white hover:bg-[#0E351E] cursor-pointer shadow-md'
                  : 'bg-[#EAE4D8] text-[#8E8B82] cursor-not-allowed opacity-75'
              }`}
            >
              <ArrowDownLeft className="w-4 h-4 text-[#86EFAC]" />
              <span>Confirm & Transfer ${parsedAmount > 0 ? parsedAmount.toFixed(2) : '0.00'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
