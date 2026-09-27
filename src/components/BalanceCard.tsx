import React from 'react';
import { ShieldCheck, ArrowUpRight, Target, Coins, Sparkles } from 'lucide-react';
import { SelectedPrediction, PredictionMarket } from '../types';

interface BalanceCardProps {
  totalAllocated: number;
  lastDelta: number | null;
  selectedPrediction: SelectedPrediction | null;
  activeMarket: PredictionMarket | null;
  roundUpsEnabled: boolean;
}

export const BalanceCard: React.FC<BalanceCardProps> = ({
  totalAllocated,
  lastDelta,
  selectedPrediction,
  activeMarket,
  roundUpsEnabled,
}) => {
  const formattedBalance = totalAllocated.toFixed(2);
  const goal = 5.00;
  const progressPercent = Math.min(100, Math.round((totalAllocated / goal) * 100));

  return (
    <div className="relative overflow-hidden rounded-2xl bg-[#143B28] text-[#F3F9F5] p-5 sm:p-7 shadow-lg border border-[#0D2D1E]">
      {/* Decorative ambient backdrop */}
      <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-[#20583A] opacity-35 blur-3xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Left column: Big balance counter */}
        <div className="md:col-span-7">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[11px] uppercase tracking-wider font-bold text-[#86EFAC] bg-[#1E5238] px-2.5 py-0.5 rounded-full border border-[#2B704C]">
              Simulated Balance
            </span>
            <span className="text-xs text-[#9EC4AE] flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#5DD38D]" />
              No real bank link
            </span>
          </div>

          <p className="text-xs font-semibold text-[#8EBFA4] uppercase tracking-wider">
            Total round-ups allocated
          </p>

          <div className="py-2 flex items-baseline gap-3">
            <div className="flex items-baseline">
              <span className="text-3xl sm:text-5xl font-extrabold text-[#74C597] mr-1.5 font-mono">
                $
              </span>
              <span className="text-4xl sm:text-6xl font-black tracking-tight font-mono-nums text-white">
                {formattedBalance}
              </span>
            </div>

            {lastDelta !== null && lastDelta > 0 && (
              <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#205C3E] text-[#69D898] border border-[#2D7852] text-sm font-bold animate-bounce">
                <ArrowUpRight className="w-4 h-4" />
                <span>+${lastDelta.toFixed(2)}</span>
              </div>
            )}
          </div>

          {/* Active prediction backing pill */}
          <div className="mt-3 flex items-center gap-2 text-xs">
            <Target className="w-4 h-4 text-[#86EFAC] shrink-0" />
            <span className="text-[#A7D1BA]">Next round-ups go to:</span>
            {activeMarket && selectedPrediction ? (
              <span className="font-semibold text-white bg-[#1E543A] px-2.5 py-1 rounded-lg border border-[#2C7450] flex items-center gap-2">
                <span className="truncate max-w-[180px] sm:max-w-xs">{activeMarket.question}</span>
                <span
                  className={`px-1.5 py-0.5 rounded text-[10px] font-black ${
                    selectedPrediction.side === 'YES'
                      ? 'bg-[#1D7948] text-white'
                      : 'bg-[#963730] text-white'
                  }`}
                >
                  {selectedPrediction.side}
                </span>
              </span>
            ) : (
              <span className="text-[#84A994] italic">
                Choose a prediction card below
              </span>
            )}
          </div>
        </div>

        {/* Right column: Interactive Visual Piggy Jar & Goal progress */}
        <div className="md:col-span-5 bg-[#0F2D1F]/70 border border-[#23583E] rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#A5E7BF] flex items-center gap-1.5">
              <Coins className="w-4 h-4 text-[#FBBF24]" />
              Prediction Stake Goal ($5.00)
            </span>
            <span className="text-xs font-mono font-bold text-white">
              {progressPercent}%
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full h-3 bg-[#0B2117] rounded-full overflow-hidden p-0.5 border border-[#1A4530]">
            <div
              className="h-full bg-gradient-to-r from-[#10B981] to-[#34D399] rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#1C4732] text-[11px] text-[#86AB96]">
            <span>Automated Round-ups</span>
            <span className={`font-bold px-2 py-0.5 rounded-full ${
              roundUpsEnabled ? 'bg-[#18643C] text-[#86EFAC]' : 'bg-[#21382C] text-[#849B8E]'
            }`}>
              {roundUpsEnabled ? '● Active' : '○ Paused'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
