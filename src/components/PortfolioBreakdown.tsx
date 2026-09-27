import React from 'react';
import { PieChart, Target, CheckCircle2, Layers } from 'lucide-react';
import { MarketHolding, PredictionCategory, SelectedPrediction } from '../types';

interface PortfolioBreakdownProps {
  holdings: MarketHolding[];
  totalAllocated: number;
  selectedPrediction: SelectedPrediction | null;
}

export const CATEGORY_CONFIG: Record<
  PredictionCategory,
  {
    label: string;
    barColor: string;
    dotColor: string;
    bgBadge: string;
    textColor: string;
    borderColor: string;
  }
> = {
  sports: {
    label: 'Sports',
    barColor: 'bg-[#16A34A]',
    dotColor: '#16A34A',
    bgBadge: 'bg-[#EBF7EF]',
    textColor: 'text-[#166534]',
    borderColor: 'border-[#BBF7D0]',
  },
  frontier_ai: {
    label: 'Frontier AI',
    barColor: 'bg-[#2563EB]',
    dotColor: '#2563EB',
    bgBadge: 'bg-[#EFF6FF]',
    textColor: 'text-[#1E40AF]',
    borderColor: 'border-[#BFDBFE]',
  },
  news: {
    label: 'Aviation',
    barColor: 'bg-[#D97706]',
    dotColor: '#D97706',
    bgBadge: 'bg-[#FFFBEB]',
    textColor: 'text-[#92400E]',
    borderColor: 'border-[#FDE68A]',
  },
  technology: {
    label: 'Robotics',
    barColor: 'bg-[#7C3AED]',
    dotColor: '#7C3AED',
    bgBadge: 'bg-[#F5F3FF]',
    textColor: 'text-[#5B21B6]',
    borderColor: 'border-[#DDD6FE]',
  },
};

export const PortfolioBreakdown: React.FC<PortfolioBreakdownProps> = ({
  holdings,
  totalAllocated,
  selectedPrediction,
}) => {
  if (holdings.length === 0 || totalAllocated <= 0) {
    return (
      <div className="rounded-xl bg-[#FAF8F3] border border-[#E3DDCF] p-3.5 space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold uppercase tracking-wider text-[#265337] flex items-center gap-1.5 text-[11px]">
            <PieChart className="w-3.5 h-3.5 text-[#1B5433]" />
            Portfolio Distribution
          </span>
          <span className="text-[10px] text-[#69796F]">0 markets backed</span>
        </div>
        <p className="text-[11px] text-[#63776B] leading-relaxed">
          As you swipe into different prediction contracts, your holdings will automatically visualize here color-coded by category (Sports, AI, Aviation, Robotics).
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-[#FAF8F3] border border-[#E2DDD0] p-3.5 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between text-xs">
        <span className="font-bold uppercase tracking-wider text-[#18482D] flex items-center gap-1.5 text-[11px]">
          <Layers className="w-3.5 h-3.5 text-[#24633E]" />
          Portfolio Distribution
        </span>
        <span className="text-[10px] font-semibold text-[#185331] bg-[#E5F5EC] px-2 py-0.5 rounded-full border border-[#BCE4CD]">
          {holdings.length} {holdings.length === 1 ? 'Market' : 'Markets'} Backed
        </span>
      </div>

      {/* Multi-Market Stacked Segmented Color Bar */}
      <div className="space-y-1.5">
        <div className="w-full h-3 rounded-full overflow-hidden bg-[#E2DBD0] flex shadow-2xs">
          {holdings.map((h) => {
            const config = CATEGORY_CONFIG[h.category] || CATEGORY_CONFIG.sports;
            return (
              <div
                key={`${h.marketId}-${h.side}`}
                className={`${config.barColor} transition-all duration-300 relative group`}
                style={{ width: `${Math.max(4, h.percentage)}%` }}
                title={`${h.marketShortTitle} (${h.side}): $${h.amount.toFixed(2)} (${h.percentage.toFixed(0)}%)`}
              />
            );
          })}
        </div>

        {/* Legend dots */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-[#55695C] pt-0.5">
          {holdings.map((h) => {
            const config = CATEGORY_CONFIG[h.category] || CATEGORY_CONFIG.sports;
            return (
              <span key={`legend-${h.marketId}-${h.side}`} className="inline-flex items-center gap-1 font-medium">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: config.dotColor }} />
                <span>{config.label}</span>
                <span className="font-mono text-[#183927] font-bold">({h.percentage.toFixed(0)}%)</span>
              </span>
            );
          })}
        </div>
      </div>

      {/* List of Invested Prediction Markets Color-coded */}
      <div className="space-y-2 pt-1 border-t border-[#E8E2D5]">
        {holdings.map((holding) => {
          const config = CATEGORY_CONFIG[holding.category] || CATEGORY_CONFIG.sports;
          const isCurrentTarget =
            selectedPrediction?.marketId === holding.marketId &&
            selectedPrediction?.side === holding.side;

          return (
            <div
              key={`holding-${holding.marketId}-${holding.side}`}
              className={`p-2.5 rounded-xl border transition-all ${
                isCurrentTarget
                  ? 'bg-white border-[#185331] shadow-2xs ring-1 ring-[#185331]/20'
                  : 'bg-white border-[#E6E0D3] hover:border-[#D5CDC0]'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                {/* Left: Category Tag & Market Name */}
                <div className="flex items-center gap-1.5 min-w-0">
                  <span
                    className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border ${config.bgBadge} ${config.textColor} ${config.borderColor} shrink-0`}
                  >
                    {config.label}
                  </span>
                  <span
                    className={`text-[10px] font-black px-1.5 py-0.5 rounded shrink-0 ${
                      holding.side === 'YES' ? 'bg-[#154E2F] text-white' : 'bg-[#963730] text-white'
                    }`}
                  >
                    {holding.side}
                  </span>
                  <span className="text-xs font-bold text-[#142C1E] truncate">
                    {holding.marketShortTitle}
                  </span>
                </div>

                {/* Right: Amount & % */}
                <div className="text-right shrink-0">
                  <span className="font-mono font-bold text-xs text-[#133D24]">
                    ${holding.amount.toFixed(2)}
                  </span>
                  <span className="block text-[10px] font-mono text-[#5C7063]">
                    {holding.percentage.toFixed(1)}% share
                  </span>
                </div>
              </div>

              {/* Status footer for this position */}
              {isCurrentTarget && (
                <div className="mt-1.5 pt-1 border-t border-[#EFEAE0] flex items-center justify-between text-[10px] text-[#185331] font-semibold">
                  <span className="flex items-center gap-1">
                    <Target className="w-3 h-3 text-[#246D42]" />
                    <span>Active Target: future round-ups will add here</span>
                  </span>
                  <span className="text-[#3E7D56]">Swiping now</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
