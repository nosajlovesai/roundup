import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { PredictionCard } from './components/PredictionCard';
import { DemoPanel } from './components/DemoPanel';
import { ActivityList } from './components/ActivityList';
import { PurchaseNotification } from './components/PurchaseNotification';
import { FICTIONAL_MARKETS } from './data/markets';
import { SelectedPrediction, PredictionSide, ActivityItem, PurchaseFeedback } from './types';
import { ArrowRight, Target, ShieldCheck, CreditCard, Sparkles, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [selectedPrediction, setSelectedPrediction] = useState<SelectedPrediction | null>(null);
  const [roundUpsEnabled, setRoundUpsEnabled] = useState<boolean>(true);
  const [multiplier, setMultiplier] = useState<number>(1);
  const [totalAllocated, setTotalAllocated] = useState<number>(0.0);
  const [lastDelta, setLastDelta] = useState<number | null>(null);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [feedback, setFeedback] = useState<PurchaseFeedback | null>(null);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [selectionMessage, setSelectionMessage] = useState<string | null>(null);

  // Auto-dismiss selection message
  useEffect(() => {
    if (selectionMessage) {
      const timer = setTimeout(() => {
        setSelectionMessage(null);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [selectionMessage]);

  const activeMarket = selectedPrediction
    ? FICTIONAL_MARKETS.find((m) => m.id === selectedPrediction.marketId) || null
    : null;

  // Single market & side selection rule:
  // "Changing the selected market or side should affect future simulated allocations only."
  // "After changing a selection, show a brief message: 'Future round-ups will back [short market name] — [YES/NO].'"
  const handleSelectPrediction = (marketId: string, side: PredictionSide) => {
    if (selectedPrediction?.marketId === marketId && selectedPrediction?.side === side) {
      setSelectedPrediction(null);
      setSelectionMessage(null);
    } else {
      setSelectedPrediction({ marketId, side });
      const targetMarket = FICTIONAL_MARKETS.find((m) => m.id === marketId);
      if (targetMarket) {
        setSelectionMessage(`Future round-ups will back ${targetMarket.shortName} — ${side}.`);
      }
    }
  };

  const handleMoveToSimulator = () => {
    const el = document.getElementById('demo-simulator');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Execute card round-up swipe
  const handleSimulatePurchase = (itemName: string, originalPrice: number, roundedPrice: number) => {
    if (!selectedPrediction || !activeMarket || !roundUpsEnabled) return;

    setIsSimulating(true);
    const roundUpAmount = Number((roundedPrice - originalPrice).toFixed(2));

    // Update cumulative total allocated across all predictions
    setTotalAllocated((prev) => Number((prev + roundUpAmount).toFixed(2)));
    setLastDelta(roundUpAmount);

    // Exact required activity message format:
    // "Coffee: $4.60 → $5.00. $0.40 allocated to [selected prediction and side]."
    const fullMessage = `${itemName}: $${originalPrice.toFixed(2)} → $${roundedPrice.toFixed(
      2
    )}. $${roundUpAmount.toFixed(2)} allocated to ${activeMarket.question} (${selectedPrediction.side}).`;

    const newActivityItem: ActivityItem = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: Date.now(),
      itemName,
      originalPrice,
      roundedPrice,
      roundUpAmount,
      marketQuestion: activeMarket.question,
      marketShortTitle: activeMarket.shortName,
      side: selectedPrediction.side,
      fullMessage,
      isNew: true,
    };

    setActivity((prev) => [newActivityItem, ...prev.map((it) => ({ ...it, isNew: false }))]);

    setFeedback({
      id: newActivityItem.id,
      item: itemName,
      fromAmount: originalPrice,
      toAmount: roundedPrice,
      roundUp: roundUpAmount,
      targetMarket: activeMarket.question,
      targetSide: selectedPrediction.side,
    });

    setTimeout(() => {
      setIsSimulating(false);
    }, 300);

    setTimeout(() => {
      setLastDelta(null);
    }, 2400);
  };

  // Reset Demo button: clears balance, activity, selection, and toggle
  const handleResetDemo = () => {
    setSelectedPrediction(null);
    setRoundUpsEnabled(true);
    setMultiplier(1);
    setTotalAllocated(0.0);
    setLastDelta(null);
    setActivity([]);
    setFeedback(null);
    setIsSimulating(false);
    setSelectionMessage(null);
  };

  const hasStateToReset =
    totalAllocated > 0 ||
    activity.length > 0 ||
    selectedPrediction !== null ||
    multiplier !== 1;

  return (
    <div className="min-h-screen bg-[#F8F6F0] flex flex-col justify-between selection:bg-[#CFE5D6] selection:text-[#0C2D19]">
      <div>
        {/* Clean Fintech Header */}
        <Header
          onReset={handleResetDemo}
          hasStateToReset={hasStateToReset}
          roundUpsEnabled={roundUpsEnabled}
          multiplier={multiplier}
        />

        {/* Selection change toast */}
        {selectionMessage && (
          <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 px-4 w-full max-w-md animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="bg-[#123623] text-white px-4 py-2.5 rounded-xl shadow-xl border border-[#276F47] flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-[#86EFAC] shrink-0" />
                <span className="font-medium text-[#E7F6ED]">{selectionMessage}</span>
              </div>
              <button
                onClick={() => setSelectionMessage(null)}
                className="text-[#92C7A5] hover:text-white text-xs cursor-pointer"
                aria-label="Dismiss message"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          {/* Hero Section */}
          <section className="mb-6 pb-6 border-b border-[#E3DDD1]">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-[#255D3D] mb-1">
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Automated Micro-Allocations</span>
                  <span aria-hidden="true" className="text-[#AEC2B4]">·</span>
                  <span>Direct Card Settlement</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#11261B]">
                  Automate your event predictions with spare change.
                </h1>
                <p className="text-xs sm:text-sm text-[#4E6255] mt-1 max-w-2xl leading-relaxed">
                  Choose a premier prediction market contract, link your daily spending card, and turn spare change into event-driven equity on every swipe.
                </p>
              </div>

              {/* Fast Stats Bar (Zero-Pill: Clean quiet typography) */}
              <div className="flex items-center gap-4 text-xs text-[#4E6255] pt-1">
                <div className="text-right">
                  <span className="block text-[10px] text-[#718578] uppercase font-semibold">Contract Settlement</span>
                  <span className="font-mono font-bold text-[#143B26]">$1.00 / Share</span>
                </div>
                <div className="h-6 w-px bg-[#DDD6C7]" />
                <div className="text-right">
                  <span className="block text-[10px] text-[#718578] uppercase font-semibold">Round-Up Rule</span>
                  <span className="font-mono font-bold text-[#143B26]">Nearest $1.00</span>
                </div>
              </div>
            </div>
          </section>

          {/* 2-Column Responsive Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Markets (2 per line) + Ledger */}
            <div className="lg:col-span-7 space-y-6">
              {/* Markets Grid */}
              <section aria-label="Available Prediction Markets">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-[#11261B] tracking-tight">
                      Active Prediction Markets
                    </h2>
                    <p className="text-xs text-[#526658]">
                      Contracts trade from 1¢ to 99¢ and settle at $1.00 upon verified resolution.
                    </p>
                  </div>

                  {selectedPrediction && activeMarket && (
                    <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-[#185331] bg-[#E8F3EB] px-3 py-1 rounded-lg border border-[#C5DEC9]">
                      <Target className="w-3.5 h-3.5 text-[#246D42]" />
                      Target: {activeMarket.shortName} ({selectedPrediction.side})
                    </span>
                  )}
                </div>

                {/* 2-per-line grid with items-start to prevent card stretching */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
                  {FICTIONAL_MARKETS.map((market) => (
                    <PredictionCard
                      key={market.id}
                      market={market}
                      selectedPrediction={selectedPrediction}
                      onSelect={handleSelectPrediction}
                      onTryPurchase={handleMoveToSimulator}
                    />
                  ))}
                </div>
              </section>

              {/* Activity Ledger */}
              <ActivityList activity={activity} />
            </div>

            {/* Right Column: Sticky Allocation Hub */}
            <div className="lg:col-span-5 lg:sticky lg:top-20 lg:self-start space-y-4">
              <DemoPanel
                totalAllocated={totalAllocated}
                lastDelta={lastDelta}
                selectedPrediction={selectedPrediction}
                activeMarket={activeMarket}
                roundUpsEnabled={roundUpsEnabled}
                onToggleRoundUps={setRoundUpsEnabled}
                onSimulatePurchase={handleSimulatePurchase}
                isSimulating={isSimulating}
                multiplier={multiplier}
                onMultiplierChange={setMultiplier}
              />
            </div>
          </div>
        </main>
      </div>

      {/* Mobile Floating Action Bar */}
      {selectedPrediction && activeMarket && (
        <div className="lg:hidden fixed bottom-4 inset-x-4 z-40 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="bg-[#123623] text-white p-3.5 rounded-2xl shadow-xl border border-[#276F47] flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <span
                className={`px-2 py-0.5 rounded text-[11px] font-black shrink-0 ${
                  selectedPrediction.side === 'YES' ? 'bg-[#187545] text-white' : 'bg-[#963730] text-white'
                }`}
              >
                {selectedPrediction.side}
              </span>
              <div className="min-w-0">
                <span className="text-[10px] uppercase font-bold text-[#86EFAC] block leading-none">
                  Next round-ups go to
                </span>
                <p className="text-xs font-semibold text-[#E1F3E9] truncate mt-0.5">
                  {activeMarket.shortName}
                </p>
              </div>
            </div>

            <button
              onClick={handleMoveToSimulator}
              className="shrink-0 bg-[#28844D] hover:bg-[#1C693A] text-white px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95"
            >
              <span>Swipe card</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#A6E8C0]" />
            </button>
          </div>
        </div>
      )}

      {/* Floating purchase notification feedback toast */}
      <PurchaseNotification feedback={feedback} onDismiss={() => setFeedback(null)} />

      {/* Clean Impeccable Footer */}
      <footer className="mt-12 border-t border-[#E3DDD1] bg-[#F4F1E7]/70 py-6 text-xs text-[#526458]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="space-y-0.5">
            <p className="font-bold text-[#142C1E]">
              RoundUp · Automated Event Contract Allocations
            </p>
            <p className="text-[11px] text-[#63776B]">
              Everyday spare change micro-invested into binary prediction markets. All contract settlements verified by official resolution criteria.
            </p>
          </div>
          <div className="text-[11px] text-[#63776B] font-mono">
            v2.4.0 · Production Ready
          </div>
        </div>
      </footer>
    </div>
  );
}
