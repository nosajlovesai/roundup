import React, { useState } from 'react';
import {
  Sparkles,
  Check,
  AlertCircle,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Scale,
  ArrowRight,
  RotateCw,
  TrendingUp,
} from 'lucide-react';
import { PredictionMarket, PredictionSide, SelectedPrediction } from '../types';
import { MarketVisual } from './MarketVisual';

interface ExplanationData {
  yesWinsIf: string;
  noWinsIf: string;
}

interface PredictionCardProps {
  market: PredictionMarket;
  selectedPrediction: SelectedPrediction | null;
  onSelect: (marketId: string, side: PredictionSide) => void;
  onTryPurchase?: () => void;
}

export const PredictionCard: React.FC<PredictionCardProps> = ({
  market,
  selectedPrediction,
  onSelect,
  onTryPurchase,
}) => {
  const isSelected = selectedPrediction?.marketId === market.id;
  const selectedSide = isSelected ? selectedPrediction?.side : null;

  // Gemini Explanation State
  const [explanationData, setExplanationData] = useState<ExplanationData | null>(null);
  const [loadingExplanation, setLoadingExplanation] = useState<boolean>(false);
  const [explanationError, setExplanationError] = useState<string | null>(null);
  const [showExplanationBox, setShowExplanationBox] = useState<boolean>(false);
  const [showRule, setShowRule] = useState<boolean>(false);

  // Fetch explanation (or reuse existing session result)
  const fetchExplanation = async (forceRefresh: boolean = false) => {
    if (explanationData && !forceRefresh) {
      setShowExplanationBox(!showExplanationBox);
      return;
    }

    setShowExplanationBox(true);
    setLoadingExplanation(true);
    setExplanationError(null);

    try {
      const response = await fetch('/api/explain-prediction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: market.question,
          description: market.description,
          resolutionRule: market.resolutionRule,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server error (${response.status})`);
      }

      const data = await response.json();
      if (data.yesWinsIf && data.noWinsIf) {
        setExplanationData({
          yesWinsIf: data.yesWinsIf,
          noWinsIf: data.noWinsIf,
        });
      } else {
        throw new Error('Incomplete explanation received.');
      }
    } catch (err: any) {
      console.error('Explanation request failed:', err);
      setExplanationError('Unable to load explanation. Tap retry.');
    } finally {
      setLoadingExplanation(false);
    }
  };

  const formattedVol = market.volumeUsd >= 1000
    ? `$${(market.volumeUsd / 1000).toFixed(1)}k Vol`
    : `$${market.volumeUsd} Vol`;

  return (
    <article
      className={`group relative rounded-2xl bg-white overflow-hidden transition-all duration-200 border flex flex-col justify-between self-start shadow-xs hover:shadow-md ${
        isSelected
          ? 'border-[#185331] ring-2 ring-[#185331]/25 bg-[#FDFEFC]'
          : 'border-[#E4DFD3] hover:border-[#CDC5B2]'
      }`}
    >
      <div>
        {/* Visual Scene Header */}
        <div className="relative">
          <MarketVisual category={market.category} className="w-full h-20" />

          {/* Active selection indicator */}
          {isSelected && (
            <div className="absolute top-2.5 right-2.5 flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-[#133D25] text-white text-[10px] font-bold shadow-xs border border-[#308A56]">
              <Check className="w-3 h-3 stroke-[3]" />
              <span>Active Target: {selectedSide}</span>
            </div>
          )}
        </div>

        {/* Card Body */}
        <div className="p-4 pb-2.5 space-y-2.5">
          {/* Metadata Header (Zero-Pill: Clean unboxed typographic layout) */}
          <div className="flex items-center gap-1.5 text-[11px] text-[#55695C] font-medium flex-wrap">
            <span className="text-[#1E4830] font-semibold">{market.categoryLabel}</span>
            <span aria-hidden="true" className="text-[#B3C4B8]">·</span>
            <span className="font-mono text-[10px] text-[#42584B]">{formattedVol}</span>
            <span aria-hidden="true" className="text-[#B3C4B8]">·</span>
            <span className="text-[10px] text-[#5D7063]">Closes {market.closeDate}</span>
          </div>

          {/* Primary Question */}
          <h3 className="text-sm font-bold text-[#112419] leading-snug tracking-tight min-h-[40px]">
            {market.question}
          </h3>

          {/* Probability & Pricing Gauge */}
          <div className="bg-[#F8F6F0] p-2.5 rounded-xl border border-[#E9E3D5] space-y-1.5">
            <div className="flex items-center justify-between text-xs font-mono font-bold">
              <span className="text-[#155A32] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#207B46]" />
                YES {market.simulatedProbabilityYes}¢ ({market.simulatedProbabilityYes}%)
              </span>
              <span className="text-[#883630]">
                NO {100 - market.simulatedProbabilityYes}¢ ({100 - market.simulatedProbabilityYes}%)
              </span>
            </div>

            {/* Split Bar */}
            <div className="w-full h-2 bg-[#E3DDD0] rounded-full overflow-hidden flex">
              <div
                className="bg-gradient-to-r from-[#175E35] to-[#2E8B52] transition-all duration-300"
                style={{ width: `${market.simulatedProbabilityYes}%` }}
              />
              <div
                className="bg-[#BA4E47] transition-all duration-300"
                style={{ width: `${100 - market.simulatedProbabilityYes}%` }}
              />
            </div>
          </div>

          {/* Resolution Criteria Accordion */}
          <div>
            <button
              type="button"
              onClick={() => setShowRule(!showRule)}
              className="text-[11px] text-[#4F6857] hover:text-[#18482D] font-medium inline-flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Scale className="w-3 h-3 text-[#2F6D47]" />
              <span>{showRule ? 'Hide resolution rules' : 'Official resolution rules'}</span>
              {showRule ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>

            {showRule && (
              <div className="mt-1.5 rounded-xl bg-[#F7F5EE] border border-[#E4DDD0] p-2.5 text-[11px] text-[#4B5E51] leading-relaxed animate-in fade-in duration-150">
                <p className="font-semibold text-[#183927] mb-1">Contract Settlement Rule:</p>
                <p>{market.resolutionRule}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Footer: Order Buttons & Gemini Explanation */}
      <div className="p-4 pt-1 space-y-2">
        {/* Order Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => onSelect(market.id, 'YES')}
            className={`min-h-[42px] py-2 px-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              isSelected && selectedSide === 'YES'
                ? 'bg-[#154E2F] text-white shadow-xs ring-2 ring-[#154E2F] ring-offset-1'
                : 'bg-[#ECE7DA] text-[#163D27] hover:bg-[#E1DBD0] active:scale-98'
            }`}
          >
            {isSelected && selectedSide === 'YES' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
            <span>Buy YES</span>
            <span className="font-mono text-[11px] opacity-80">· {market.simulatedProbabilityYes}¢</span>
          </button>

          <button
            type="button"
            onClick={() => onSelect(market.id, 'NO')}
            className={`min-h-[42px] py-2 px-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              isSelected && selectedSide === 'NO'
                ? 'bg-[#963730] text-white shadow-xs ring-2 ring-[#963730] ring-offset-1'
                : 'bg-[#ECE7DA] text-[#4B2825] hover:bg-[#E2D6D3] active:scale-98'
            }`}
          >
            {isSelected && selectedSide === 'NO' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
            <span>Buy NO</span>
            <span className="font-mono text-[11px] opacity-80">· {100 - market.simulatedProbabilityYes}¢</span>
          </button>
        </div>

        {/* Quick Simulator Jump on Mobile/Card */}
        {isSelected && onTryPurchase && (
          <button
            type="button"
            onClick={onTryPurchase}
            className="w-full py-2 px-3 rounded-xl bg-[#14472A] hover:bg-[#0E351E] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs active:scale-98 transition-all cursor-pointer border border-[#2B7A4C]"
          >
            <span>Simulate card swipe into this pick</span>
            <ArrowRight className="w-3 h-3 text-[#86EFAC]" />
          </button>
        )}

        {/* Primary Explain Button */}
        <div>
          <button
            type="button"
            onClick={() => fetchExplanation(false)}
            disabled={loadingExplanation}
            className="w-full min-h-[32px] py-1.5 px-2.5 rounded-xl bg-[#F6F4EB] hover:bg-[#EFE9D7] text-[#224A32] border border-[#DFD8CC] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-60"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#246B41]" />
            <span>
              {loadingExplanation
                ? 'Gemini is explaining the rules…'
                : showExplanationBox && explanationData
                ? 'Hide explanation'
                : 'Explain with Gemini'}
            </span>
          </button>
        </div>

        {/* Compact Expandable Explanation Box */}
        {showExplanationBox && (
          <div className="rounded-xl bg-[#F3F8F4] border border-[#C5E3CE] p-3 text-xs animate-in fade-in duration-200 shadow-2xs">
            <div className="flex items-center justify-between pb-2 border-b border-[#D8ECE0]">
              <span className="font-bold text-[#144728] flex items-center gap-1.5 text-xs">
                <Sparkles className="w-3 h-3 text-[#29864E]" />
                Understand this prediction
              </span>
              <div className="flex items-center gap-2">
                {explanationData && !loadingExplanation && (
                  <button
                    type="button"
                    onClick={() => fetchExplanation(true)}
                    className="text-[10px] text-[#245D3B] hover:text-[#113C23] font-medium flex items-center gap-0.5 cursor-pointer underline decoration-[#A9D8BB]"
                  >
                    <RotateCw className="w-2.5 h-2.5" />
                    <span>Generate again</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setShowExplanationBox(false)}
                  className="text-[10px] text-[#55695C] hover:text-[#18482D] font-medium cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>

            {/* Loading State */}
            {loadingExplanation && (
              <div className="py-3 flex items-center gap-2 text-xs text-[#2E5E3D]">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#2E7D4C]" />
                <span className="font-medium">Gemini is explaining the rules…</span>
              </div>
            )}

            {/* Error State */}
            {explanationError && (
              <div className="py-2 text-xs">
                <p className="text-[#A4322A] flex items-center gap-1 mb-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{explanationError}</span>
                </p>
                <button
                  type="button"
                  onClick={() => fetchExplanation(true)}
                  className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#1A4B30] bg-white px-2 py-0.5 rounded-md border border-[#CCE2D3] hover:bg-[#E8F3EC] cursor-pointer"
                >
                  <RefreshCw className="w-2.5 h-2.5" />
                  <span>Retry</span>
                </button>
              </div>
            )}

            {/* Structured Explanation */}
            {!loadingExplanation && explanationData && (
              <div className="space-y-2 mt-2.5">
                <div className="rounded-lg bg-[#EAF5EE] p-2.5 border border-[#CDE7D5]">
                  <p className="text-[11px] font-bold text-[#144829] flex items-center gap-1.5 mb-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#277846]" />
                    <span>YES wins if…</span>
                  </p>
                  <p className="text-[11px] text-[#1E3B29] leading-relaxed pl-3">
                    {explanationData.yesWinsIf}
                  </p>
                </div>

                <div className="rounded-lg bg-[#FDF1F0] p-2.5 border border-[#F3D5D3]">
                  <p className="text-[11px] font-bold text-[#862A24] flex items-center gap-1.5 mb-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#B84E46]" />
                    <span>NO wins if…</span>
                  </p>
                  <p className="text-[11px] text-[#3E211F] leading-relaxed pl-3">
                    {explanationData.noWinsIf}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </article>
  );
};
