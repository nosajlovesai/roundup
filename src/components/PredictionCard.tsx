import React from 'react';
import { Trophy, Cpu, Plane, Bot, Sparkles, Info, Check } from 'lucide-react';
import { PredictionMarket, PredictionSide, SelectedPrediction } from '../types';

interface PredictionCardProps {
  market: PredictionMarket;
  selectedPrediction: SelectedPrediction | null;
  onSelect: (marketId: string, side: PredictionSide) => void;
  onOpenDetails: (market: PredictionMarket) => void;
}

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'sports':
      return {
        icon: Trophy,
        bg: 'bg-[#E8F5EE]',
        text: 'text-[#16734B]',
      };
    case 'frontier_ai':
      return {
        icon: Cpu,
        bg: 'bg-[#EEF2FF]',
        text: 'text-[#4F46E5]',
      };
    case 'news':
      return {
        icon: Plane,
        bg: 'bg-[#FEF3C7]',
        text: 'text-[#D97706]',
      };
    case 'technology':
    default:
      return {
        icon: Bot,
        bg: 'bg-[#F3E8FF]',
        text: 'text-[#7E22CE]',
      };
  }
};

export const PredictionCard: React.FC<PredictionCardProps> = ({
  market,
  selectedPrediction,
  onSelect,
  onOpenDetails,
}) => {
  const isSelected = selectedPrediction?.marketId === market.id;
  const selectedSide = isSelected ? selectedPrediction?.side : null;
  const iconConfig = getCategoryIcon(market.category);
  const IconComponent = iconConfig.icon;

  const noPrice = 100 - market.simulatedProbabilityYes;

  return (
    <article
      className={`rounded-xl bg-white border p-4 sm:p-5 flex flex-col justify-between transition-all duration-150 ${
        isSelected
          ? 'border-[#16734B] shadow-xs ring-1 ring-[#16734B]/30'
          : 'border-[#E5E7EB] hover:border-[#D1D5DB]'
      }`}
    >
      <div className="space-y-3">
        {/* Top Header: 40px icon + metadata + selection indicator */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-lg ${iconConfig.bg} ${iconConfig.text} flex items-center justify-center shrink-0`}
            >
              <IconComponent className="w-5 h-5" />
            </div>

            <div>
              <div className="flex items-center gap-1.5 text-xs text-[#64748B]">
                <span className="font-semibold text-[#17212B]">{market.categoryLabel}</span>
                <span>·</span>
                <span>Closes {market.closeDate}</span>
              </div>
              <span className="text-xs font-semibold text-[#16734B]">
                {market.simulatedProbabilityYes}% chance
              </span>
            </div>
          </div>

          {isSelected && (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#16734B] bg-[#E8F5EE] border border-[#C6E7D5] px-2 py-0.5 rounded">
              <Check className="w-3 h-3 stroke-[3]" />
              <span>Selected</span>
            </span>
          )}
        </div>

        {/* Short Display Title (16px semibold) */}
        <h3 className="text-base font-semibold text-[#17212B] leading-snug line-clamp-2 min-h-[44px]">
          {market.displayTitle}
        </h3>
      </div>

      {/* Outcome Selection Buttons & Actions */}
      <div className="space-y-3 pt-3 mt-1 border-t border-[#F3F4F6]">
        {/* Equal-width outcome buttons */}
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => onSelect(market.id, 'YES')}
            className={`py-2 px-3 rounded-lg text-sm font-semibold border transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
              selectedSide === 'YES'
                ? 'bg-[#16734B] text-white border-[#16734B] shadow-2xs'
                : 'bg-[#E8F5EE] text-[#16734B] border-[#C6E7D5] hover:bg-[#D5EFE1]'
            }`}
          >
            {selectedSide === 'YES' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
            <span>YES · {market.simulatedProbabilityYes}¢</span>
          </button>

          <button
            type="button"
            onClick={() => onSelect(market.id, 'NO')}
            className={`py-2 px-3 rounded-lg text-sm font-semibold border transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
              selectedSide === 'NO'
                ? 'bg-[#991B1B] text-white border-[#991B1B] shadow-2xs'
                : 'bg-[#FEE2E2] text-[#991B1B] border-[#FECACA] hover:bg-[#FCD2D2]'
            }`}
          >
            {selectedSide === 'NO' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
            <span>NO · {noPrice}¢</span>
          </button>
        </div>

        {/* Small Market details and Explain with Gemini actions */}
        <div className="flex items-center justify-between text-xs text-[#64748B] pt-0.5">
          <button
            type="button"
            onClick={() => onOpenDetails(market)}
            className="hover:text-[#17212B] inline-flex items-center gap-1 transition-colors cursor-pointer"
          >
            <Info className="w-3.5 h-3.5 text-[#64748B]" />
            <span>Market details</span>
          </button>

          <button
            type="button"
            onClick={() => onOpenDetails(market)}
            className="text-[#16734B] hover:text-[#125838] inline-flex items-center gap-1 font-medium transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Gemini analysis</span>
          </button>
        </div>
      </div>
    </article>
  );
};
