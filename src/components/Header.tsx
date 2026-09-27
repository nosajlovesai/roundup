import React, { useState } from 'react';
import { TrendingUp, CreditCard, RotateCcw, HelpCircle, ShieldCheck, Check } from 'lucide-react';

interface HeaderProps {
  onReset: () => void;
  hasStateToReset: boolean;
  roundUpsEnabled: boolean;
  multiplier: number;
}

export const Header: React.FC<HeaderProps> = ({
  onReset,
  hasStateToReset,
  roundUpsEnabled,
  multiplier,
}) => {
  const [showHowItWorks, setShowHowItWorks] = useState(false);

  return (
    <>
      <header className="border-b border-[#E4DFD5] bg-[#FDFCF9]/95 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          {/* Brand & Wordmark */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#143B27] text-white flex items-center justify-center shadow-xs">
              <TrendingUp className="w-4 h-4 text-[#86EFAC]" />
            </div>
            <div className="flex items-baseline gap-2.5">
              <span className="text-base font-extrabold tracking-tight text-[#11261B]">
                RoundUp
              </span>
              <span className="hidden sm:inline text-xs text-[#586C60] font-normal">
                Micro-allocations for prediction markets
              </span>
            </div>
          </div>

          {/* Right Product Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Linked Account Status */}
            <div className="hidden md:flex items-center gap-2 text-xs text-[#394F42] px-3 py-1 rounded-lg bg-[#F3F0E6] border border-[#E2DDD0]">
              <CreditCard className="w-3.5 h-3.5 text-[#245D3B]" />
              <span className="font-mono text-[11px] font-medium">Debit •••• 4128</span>
              <span className="text-[#96A69D]">·</span>
              <span className="font-semibold text-[#18482E]">
                {roundUpsEnabled ? `${multiplier}x Round-ups` : 'Paused'}
              </span>
            </div>

            {/* How It Works Button */}
            <button
              type="button"
              onClick={() => setShowHowItWorks(true)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-[#294B37] hover:bg-[#EFEAE0] transition-colors cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5 text-[#38664B]" />
              <span className="hidden sm:inline">How it works</span>
            </button>

            {/* Reset / Test State Button */}
            <button
              type="button"
              onClick={onReset}
              disabled={!hasStateToReset}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                hasStateToReset
                  ? 'bg-[#E8E2D4] text-[#1B3C2B] hover:bg-[#DDD5C5] active:scale-95 cursor-pointer shadow-2xs'
                  : 'bg-[#F1ECE2] text-[#9EA19A] cursor-not-allowed opacity-60'
              }`}
              title="Reset balance, transactions, and destination"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </header>

      {/* How It Works Modal Dialog */}
      {showHowItWorks && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-[#FAF8F3] border border-[#DDD7C9] rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5DFD1]">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-md bg-[#16422C] text-white flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-[#86EFAC]" />
                </div>
                <h3 className="text-base font-bold text-[#142C1E]">How RoundUp Works</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowHowItWorks(false)}
                className="text-xs font-semibold text-[#5B6C61] hover:text-[#142C1E] px-2 py-1 rounded-md hover:bg-[#ECE6D8] cursor-pointer"
              >
                Close
              </button>
            </div>

            <p className="text-xs text-[#415548] leading-relaxed">
              RoundUp seamlessly bridges everyday card spending with event-driven prediction markets. Every transaction rounds up to the nearest dollar, turning idle pennies into automated positions.
            </p>

            <div className="space-y-3 pt-1">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-white border border-[#E7E2D5]">
                <div className="w-6 h-6 rounded-full bg-[#18482D] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  1
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#142C1E]">Select Destination Contract</h4>
                  <p className="text-[11px] text-[#55695D] mt-0.5">
                    Choose one active prediction market and pick YES or NO. All future spare change automatically purchases contracts on that side.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-white border border-[#E7E2D5]">
                <div className="w-6 h-6 rounded-full bg-[#18482D] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  2
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#142C1E]">Spend as Usual</h4>
                  <p className="text-[11px] text-[#55695D] mt-0.5">
                    Every swipe of your debit card (e.g., $4.60 coffee) rounds up to the nearest whole dollar ($5.00). The $0.40 remainder routes into your pick.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-white border border-[#E7E2D5]">
                <div className="w-6 h-6 rounded-full bg-[#18482D] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  3
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#142C1E]">Market Settlement</h4>
                  <p className="text-[11px] text-[#55695D] mt-0.5">
                    When the market resolves, winning contracts settle at $1.00 per share. Winnings deposit directly back to your connected balance.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setShowHowItWorks(false)}
                className="px-4 py-2 rounded-xl bg-[#17462B] text-white text-xs font-bold hover:bg-[#10341F] cursor-pointer shadow-xs"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
