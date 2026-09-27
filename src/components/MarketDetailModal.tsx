import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  Scale,
  Newspaper,
  ExternalLink,
  RefreshCw,
  AlertCircle,
  RotateCw,
  TrendingUp,
  TrendingDown,
  Target,
  AlertTriangle,
  Lightbulb,
} from 'lucide-react';
import { PredictionMarket, PredictionSide, GeminiMarketIntelligence } from '../types';

interface MarketDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  market: PredictionMarket | null;
  onSelectSide: (side: PredictionSide) => void;
  selectedSide: PredictionSide | null;
  cachedExplanation?: GeminiMarketIntelligence | null;
  onSaveExplanation?: (marketId: string, data: GeminiMarketIntelligence) => void;
}

export const MarketDetailModal: React.FC<MarketDetailModalProps> = ({
  isOpen,
  onClose,
  market,
  onSelectSide,
  selectedSide,
  cachedExplanation,
  onSaveExplanation,
}) => {
  const [intelligence, setIntelligence] = useState<GeminiMarketIntelligence | null>(
    cachedExplanation || null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sync cache when modal opens
  useEffect(() => {
    if (cachedExplanation) {
      setIntelligence(cachedExplanation);
    } else {
      setIntelligence(null);
    }
    setError(null);
  }, [market?.id, cachedExplanation]);

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !market) return null;

  const handleFetchIntelligence = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/explain-prediction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: market.question,
          shortName: market.shortName,
          category: market.categoryLabel,
          description: market.description,
          resolutionRule: market.resolutionRule,
          odds: `${market.simulatedProbabilityYes}% YES / ${100 - market.simulatedProbabilityYes}% NO`,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data: GeminiMarketIntelligence = await response.json();
      if (data.summary && data.bullCase && data.bearCase) {
        setIntelligence(data);
        if (onSaveExplanation) {
          onSaveExplanation(market.id, data);
        }
      } else {
        throw new Error('Incomplete intelligence data received.');
      }
    } catch (err: any) {
      console.error('Gemini intelligence request failed:', err);
      setError('Unable to generate intelligence report right now. Please tap retry.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="bg-white border border-[#E5E7EB] rounded-t-2xl sm:rounded-xl max-w-xl w-full max-h-[92vh] overflow-y-auto shadow-2xl space-y-4 p-5 sm:p-6 text-[#17212B] animate-in slide-in-from-bottom-4 sm:zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#E5E7EB]">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#64748B]">
              <span className="font-semibold text-[#17212B]">{market.categoryLabel}</span>
              <span>·</span>
              <span>Closes {market.closeDate}</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-[#17212B] mt-1 leading-snug">
              {market.question}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#64748B] hover:text-[#17212B] p-1.5 rounded-lg hover:bg-[#F3F4F6] cursor-pointer shrink-0"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Pricing & Selection row */}
        <div className="flex items-center justify-between gap-3 p-3 rounded-lg bg-[#F7F8FA] border border-[#E5E7EB]">
          <div>
            <span className="text-xs text-[#64748B] block">Current market pricing</span>
            <span className="text-sm font-semibold text-[#17212B]">
              {market.simulatedProbabilityYes}% chance
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onSelectSide('YES')}
              className={`py-1.5 px-3 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                selectedSide === 'YES'
                  ? 'bg-[#16734B] text-white border-[#16734B]'
                  : 'bg-[#E8F5EE] text-[#16734B] border-[#C6E7D5] hover:bg-[#D5EFE1]'
              }`}
            >
              YES · {market.simulatedProbabilityYes}¢
            </button>
            <button
              type="button"
              onClick={() => onSelectSide('NO')}
              className={`py-1.5 px-3 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                selectedSide === 'NO'
                  ? 'bg-[#991B1B] text-white border-[#991B1B]'
                  : 'bg-[#FEE2E2] text-[#991B1B] border-[#FECACA] hover:bg-[#FCD2D2]'
              }`}
            >
              NO · {100 - market.simulatedProbabilityYes}¢
            </button>
          </div>
        </div>

        {/* Gemini Market Intelligence Section */}
        <div className="space-y-3 pt-1 border-t border-[#E5E7EB]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#16734B]" />
              <span className="text-sm font-bold text-[#17212B]">Gemini Market Intelligence</span>
            </div>

            {intelligence && !isLoading && (
              <button
                type="button"
                onClick={handleFetchIntelligence}
                className="text-xs text-[#16734B] hover:underline font-medium inline-flex items-center gap-1 cursor-pointer"
              >
                <RotateCw className="w-3 h-3" />
                <span>Refresh analysis</span>
              </button>
            )}
          </div>

          {/* Trigger State before generation */}
          {!intelligence && !isLoading && !error && (
            <div className="p-4 rounded-xl bg-[#F7F8FA] border border-[#E5E7EB] space-y-3">
              <div className="flex items-start gap-2.5">
                <Lightbulb className="w-4 h-4 text-[#16734B] shrink-0 mt-0.5" />
                <div className="space-y-1 text-xs">
                  <p className="font-semibold text-[#17212B]">
                    Generate deep AI intelligence beyond the rules
                  </p>
                  <p className="text-[#64748B] leading-relaxed">
                    Gemini analyzes fundamental market dynamics, bull vs. bear catalysts, critical milestones to watch, and technical settlement traps.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleFetchIntelligence}
                className="w-full py-2 px-3 rounded-lg bg-[#16734B] text-white text-xs font-semibold hover:bg-[#125838] transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Generate Market Intelligence</span>
              </button>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="p-5 rounded-xl bg-[#F7F8FA] border border-[#E5E7EB] text-xs space-y-2">
              <div className="flex items-center gap-2.5 text-[#16734B] font-semibold">
                <RefreshCw className="w-4 h-4 animate-spin text-[#16734B]" />
                <span>Gemini is generating market intelligence…</span>
              </div>
              <p className="text-[#64748B] pl-6 text-[11px]">
                Evaluating competitive catalysts, historical precedents, and contract settlement technicalities.
              </p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="p-3 rounded-lg bg-[#FEE2E2] border border-[#FECACA] text-xs space-y-1.5">
              <p className="text-[#991B1B] flex items-center gap-1.5 font-medium">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{error}</span>
              </p>
              <button
                type="button"
                onClick={handleFetchIntelligence}
                className="text-xs font-semibold text-[#991B1B] underline hover:no-underline cursor-pointer"
              >
                Retry
              </button>
            </div>
          )}

          {/* Render Full Rich Intelligence */}
          {intelligence && !isLoading && (
            <div className="space-y-3 text-xs animate-in fade-in duration-150">
              {/* Executive Briefing */}
              <div className="p-3 rounded-lg bg-[#F7F8FA] border border-[#E5E7EB] space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#64748B] block">
                  Executive Briefing & Sentiment
                </span>
                <p className="text-xs text-[#17212B] leading-relaxed font-medium">
                  {intelligence.summary}
                </p>
              </div>

              {/* Bull vs Bear Thesis Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* Bull Case (YES) */}
                <div className="p-3 rounded-lg bg-[#E8F5EE] border border-[#C6E7D5] space-y-2">
                  <div className="flex items-center gap-1.5 text-[#16734B] font-bold text-xs">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>Case for YES (Tailwinds)</span>
                  </div>
                  <ul className="space-y-1.5 text-[11px] text-[#17212B] leading-snug">
                    {intelligence.bullCase.map((point, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-[#16734B] shrink-0 mt-1.5" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Bear Case (NO) */}
                <div className="p-3 rounded-lg bg-[#FEE2E2] border border-[#FECACA] space-y-2">
                  <div className="flex items-center gap-1.5 text-[#991B1B] font-bold text-xs">
                    <TrendingDown className="w-3.5 h-3.5" />
                    <span>Case for NO (Headwinds)</span>
                  </div>
                  <ul className="space-y-1.5 text-[11px] text-[#17212B] leading-snug">
                    {intelligence.bearCase.map((point, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-[#991B1B] shrink-0 mt-1.5" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Watchpoints & Milestones */}
              {intelligence.watchpoints && intelligence.watchpoints.length > 0 && (
                <div className="p-3 rounded-lg bg-white border border-[#E5E7EB] space-y-1.5">
                  <div className="flex items-center gap-1.5 text-[#17212B] font-semibold text-xs">
                    <Target className="w-3.5 h-3.5 text-[#4F46E5]" />
                    <span>Key Milestones to Watch</span>
                  </div>
                  <ul className="space-y-1 text-[11px] text-[#64748B]">
                    {intelligence.watchpoints.map((wp, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="font-mono text-[#4F46E5] font-bold text-[10px]">0{idx + 1}</span>
                        <span className="text-[#17212B]">{wp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Contract Trap / Settlement Nuance */}
              {intelligence.contractNuance && (
                <div className="p-2.5 rounded-lg bg-[#FEF3C7] border border-[#FDE68A] text-xs flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-[#D97706] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-[#92400E] block text-[11px]">
                      Contract Settlement Nuance
                    </span>
                    <p className="text-[11px] text-[#78350F] mt-0.5 leading-relaxed">
                      {intelligence.contractNuance}
                    </p>
                  </div>
                </div>
              )}

              {/* Settlement Conditions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                <div className="p-2.5 rounded-lg bg-[#F7F8FA] border border-[#E5E7EB] space-y-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#16734B]">
                    YES Wins If
                  </span>
                  <p className="text-[11px] text-[#17212B] leading-relaxed">
                    {intelligence.yesWinsIf}
                  </p>
                </div>

                <div className="p-2.5 rounded-lg bg-[#F7F8FA] border border-[#E5E7EB] space-y-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#991B1B]">
                    NO Wins If
                  </span>
                  <p className="text-[11px] text-[#17212B] leading-relaxed">
                    {intelligence.noWinsIf}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Market Rules */}
        <div className="space-y-1.5 pt-1 border-t border-[#E5E7EB]">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#17212B]">
            <Scale className="w-3.5 h-3.5 text-[#64748B]" />
            <span>Market rules</span>
          </div>
          <div className="p-3 rounded-lg bg-[#F7F8FA] border border-[#E5E7EB] text-xs text-[#64748B] leading-relaxed">
            {market.resolutionRule}
          </div>
        </div>

        {/* Related News & Sources */}
        {market.newsItems && market.newsItems.length > 0 && (
          <div className="space-y-2 pt-1 border-t border-[#E5E7EB]">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#17212B]">
              <Newspaper className="w-3.5 h-3.5 text-[#64748B]" />
              <span>Related news & reporting</span>
            </div>
            <div className="space-y-1.5">
              {market.newsItems.map((news) => (
                <a
                  key={news.id}
                  href={news.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-2 rounded-lg bg-[#F7F8FA] border border-[#E5E7EB] hover:border-[#16734B] hover:bg-white transition-all text-xs group"
                >
                  <div className="flex items-center justify-between text-[11px] text-[#64748B]">
                    <span className="font-semibold text-[#17212B]">{news.source}</span>
                    <span>{news.timeAgo}</span>
                  </div>
                  <p className="text-xs text-[#17212B] group-hover:text-[#16734B] font-medium mt-0.5 leading-snug flex items-center justify-between gap-2">
                    <span>{news.title}</span>
                    <ExternalLink className="w-3 h-3 text-[#64748B] group-hover:text-[#16734B] shrink-0" />
                  </p>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Footer actions */}
        <div className="pt-2 border-t border-[#E5E7EB] flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="py-1.5 px-4 rounded-lg bg-[#F3F4F6] text-xs font-semibold text-[#17212B] hover:bg-[#E5E7EB] transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
