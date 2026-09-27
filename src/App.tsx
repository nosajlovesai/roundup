import React, { useState, useMemo } from 'react';
import { Search, X } from 'lucide-react';
import { Header } from './components/Header';
import { PredictionCard } from './components/PredictionCard';
import { DemoPanel } from './components/DemoPanel';
import { ActivityList } from './components/ActivityList';
import { MarketDetailModal } from './components/MarketDetailModal';
import { PurchaseNotification } from './components/PurchaseNotification';
import { MobileDemoView } from './components/MobileDemoView';
import { FICTIONAL_MARKETS } from './data/markets';
import {
  SelectedPrediction,
  PredictionSide,
  ActivityItem,
  PurchaseFeedback,
  MarketHolding,
  PredictionMarket,
  GeminiMarketIntelligence,
} from './types';

const CATEGORY_FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'sports', label: 'Sports' },
  { id: 'ai', label: 'AI' },
  { id: 'aviation', label: 'Aviation' },
  { id: 'robotics', label: 'Robotics' },
];

export default function App() {
  const [selectedPrediction, setSelectedPrediction] = useState<SelectedPrediction | null>(null);
  // On a fresh demo, start OFF as requested
  const [roundUpsEnabled, setRoundUpsEnabled] = useState<boolean>(false);
  const [multiplier, setMultiplier] = useState<number>(1);
  const [totalAllocated, setTotalAllocated] = useState<number>(0.0);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [feedback, setFeedback] = useState<PurchaseFeedback | null>(null);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Reusable detail modal & Gemini explanation cache
  const [modalMarket, setModalMarket] = useState<PredictionMarket | null>(null);
  const [cachedExplanations, setCachedExplanations] = useState<
    Record<string, GeminiMarketIntelligence>
  >({});

  // Mobile Bottom Sheet state
  const [isMobilePanelOpen, setIsMobilePanelOpen] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<'markets' | 'activity'>('markets');

  // Separately addressable view for Mobile Demo (#/mobile-demo)
  const [currentView, setCurrentView] = useState<'dashboard' | 'mobile-demo'>(() => {
    return typeof window !== 'undefined' && window.location.hash === '#/mobile-demo'
      ? 'mobile-demo'
      : 'dashboard';
  });

  React.useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#/mobile-demo') {
        setCurrentView('mobile-demo');
      } else {
        setCurrentView('dashboard');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleOpenMobileDemo = () => {
    window.location.hash = '#/mobile-demo';
  };

  const handleBackToDashboard = () => {
    window.location.hash = '#/';
  };

  const handleAddMobileDemoAllocation = (data: {
    roundUpAmount: number;
    marketQuestion: string;
    marketShortTitle: string;
    side: PredictionSide;
    itemName: string;
    originalPrice: number;
    roundedPrice: number;
  }) => {
    setTotalAllocated((prev) => Number((prev + data.roundUpAmount).toFixed(2)));
    const newActivityItem: ActivityItem = {
      id: `mobile-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: Date.now(),
      itemName: data.itemName,
      originalPrice: data.originalPrice,
      roundedPrice: data.roundedPrice,
      roundUpAmount: data.roundUpAmount,
      marketQuestion: data.marketQuestion,
      marketShortTitle: data.marketShortTitle,
      side: data.side,
      fullMessage: `${data.itemName}: $${data.originalPrice.toFixed(2)} → $${data.roundedPrice.toFixed(
        2
      )}. $${data.roundUpAmount.toFixed(2)} allocated to ${data.marketShortTitle} (${data.side}).`,
      isNew: true,
      isMobileDemo: true,
    };
    setActivity((prev) => [newActivityItem, ...prev.map((it) => ({ ...it, isNew: false }))]);
  };

  const handleResetMobileDemoAllocations = () => {
    const mobileItems = activity.filter((item) => item.isMobileDemo);
    const mobileSum = mobileItems.reduce((acc, curr) => acc + curr.roundUpAmount, 0);
    setTotalAllocated((prev) => Math.max(0, Number((prev - mobileSum).toFixed(2))));
    setActivity((prev) => prev.filter((item) => !item.isMobileDemo));
  };

  const activeMarket = useMemo(() => {
    if (!selectedPrediction) return null;
    return FICTIONAL_MARKETS.find((m) => m.id === selectedPrediction.marketId) || null;
  }, [selectedPrediction]);

  // Single market & side selection
  const handleSelectPrediction = (marketId: string, side: PredictionSide) => {
    if (selectedPrediction?.marketId === marketId && selectedPrediction?.side === side) {
      setSelectedPrediction(null);
    } else {
      setSelectedPrediction({ marketId, side });
    }
  };

  // Simulate Purchase execution
  const handleSimulatePurchase = (itemName: string, originalPrice: number, roundedPrice: number) => {
    if (!selectedPrediction || !activeMarket || !roundUpsEnabled) return;

    setIsSimulating(true);
    const roundUpAmount = Number((roundedPrice - originalPrice).toFixed(2));

    setTotalAllocated((prev) => Number((prev + roundUpAmount).toFixed(2)));

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
      fullMessage: `${itemName}: $${originalPrice.toFixed(2)} → $${roundedPrice.toFixed(2)}. $${roundUpAmount.toFixed(
        2
      )} allocated to ${activeMarket.shortName} (${selectedPrediction.side}).`,
      isNew: true,
    };

    setActivity((prev) => [newActivityItem, ...prev.map((it) => ({ ...it, isNew: false }))]);

    setFeedback({
      id: newActivityItem.id,
      item: itemName,
      fromAmount: originalPrice,
      toAmount: roundedPrice,
      roundUp: roundUpAmount,
      targetMarket: activeMarket.shortName,
      targetSide: selectedPrediction.side,
    });

    setTimeout(() => {
      setIsSimulating(false);
    }, 250);
  };

  // Calculate holdings across all backed prediction markets
  const holdings: MarketHolding[] = useMemo(() => {
    if (totalAllocated <= 0) return [];
    const map = new Map<string, { market: (typeof FICTIONAL_MARKETS)[0]; side: PredictionSide; amount: number }>();

    activity.forEach((item) => {
      if (item.isWithdrawal || item.side === 'WITHDRAWAL') return;
      const m = FICTIONAL_MARKETS.find((market) => market.question === item.marketQuestion);
      if (!m) return;
      const key = `${m.id}-${item.side}`;
      const existing = map.get(key);
      if (existing) {
        existing.amount = Number((existing.amount + item.roundUpAmount).toFixed(2));
      } else {
        map.set(key, { market: m, side: item.side as PredictionSide, amount: item.roundUpAmount });
      }
    });

    const activeHoldings = Array.from(map.values()).filter((h) => h.amount > 0);
    const sumTotal = activeHoldings.reduce((sum, h) => sum + h.amount, 0);
    if (sumTotal <= 0) return [];

    return activeHoldings.map(({ market, side, amount }) => ({
      marketId: market.id,
      marketQuestion: market.question,
      marketShortTitle: market.shortName,
      category: market.category,
      side,
      amount,
      percentage: Number(((amount / sumTotal) * 100).toFixed(1)),
    }));
  }, [activity, totalAllocated]);

  // Reset Demo button: restores consistent initial state
  const handleResetDemo = () => {
    setSelectedPrediction(null);
    setRoundUpsEnabled(false); // start OFF
    setMultiplier(1);
    setTotalAllocated(0.0);
    setActivity([]);
    setFeedback(null);
    setIsSimulating(false);
    setSearchQuery('');
    setSelectedCategory('all');
    setModalMarket(null);
    setIsMobilePanelOpen(false);
  };

  const hasStateToReset =
    totalAllocated > 0 ||
    activity.length > 0 ||
    selectedPrediction !== null ||
    multiplier !== 1 ||
    roundUpsEnabled ||
    searchQuery !== '' ||
    selectedCategory !== 'all';

  // Navigation scroll handler
  const handleNavigate = (section: 'markets' | 'activity') => {
    setActiveSection(section);
    const elementId = section === 'markets' ? 'markets-section' : 'activity-section';
    const el = document.getElementById(elementId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Filtered markets
  const filteredMarkets = useMemo(() => {
    return FICTIONAL_MARKETS.filter((m) => {
      const matchesCategory =
        selectedCategory === 'all' ||
        (selectedCategory === 'sports' && m.category === 'sports') ||
        (selectedCategory === 'ai' && m.category === 'frontier_ai') ||
        (selectedCategory === 'aviation' && m.category === 'news') ||
        (selectedCategory === 'robotics' && m.category === 'technology');

      const matchesSearch =
        searchQuery.trim() === '' ||
        m.displayTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.shortName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  const handleSaveExplanation = (marketId: string, data: GeminiMarketIntelligence) => {
    setCachedExplanations((prev) => ({ ...prev, [marketId]: data }));
  };

  if (currentView === 'mobile-demo') {
    return (
      <MobileDemoView
        initialSelectedPrediction={selectedPrediction}
        totalAllocated={totalAllocated}
        onAddAllocation={handleAddMobileDemoAllocation}
        onResetMobileDemoAllocations={handleResetMobileDemoAllocations}
        onBackToDashboard={handleBackToDashboard}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F8FA] flex flex-col justify-between selection:bg-[#E8F5EE] selection:text-[#16734B]">
      <div>
        {/* Compact 64px Header */}
        <Header
          onReset={handleResetDemo}
          hasStateToReset={hasStateToReset}
          activeSection={activeSection}
          onNavigate={handleNavigate}
          onOpenMobileDemo={handleOpenMobileDemo}
        />

        {/* Main Content Area (Max width 1280px with 24px gutters) */}
        <main className="max-w-[1280px] mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8">
          {/* Compact Page Intro */}
          <section className="space-y-1">
            <h1 className="text-2xl sm:text-[28px] font-bold tracking-tight text-[#17212B]">
              Put your spare change behind your predictions.
            </h1>
            <p className="text-sm sm:text-base text-[#64748B]">
              Pick a side. Enable round-ups. Let everyday purchases add up.
            </p>
          </section>

          {/* Desktop Two-Column Layout (Gap 24px, right ~360px) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Area: Markets Grid and Activity */}
            <div className="lg:col-span-8 space-y-6">
              {/* Market Browsing Toolbar */}
              <section id="markets-section" className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  {/* Category filters */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                    {CATEGORY_FILTERS.map((cat) => {
                      const isActive = selectedCategory === cat.id;
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setSelectedCategory(cat.id)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer border ${
                            isActive
                              ? 'bg-[#16734B] text-white border-[#16734B] font-semibold'
                              : 'bg-white text-[#64748B] border-[#E5E7EB] hover:text-[#17212B] hover:bg-[#F3F4F6]'
                          }`}
                        >
                          {cat.label}
                        </button>
                      );
                    })}
                  </div>

                  {/* Compact Search Input */}
                  <div className="relative w-full sm:w-64">
                    <Search className="w-3.5 h-3.5 text-[#9CA3AF] absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search markets…"
                      className="w-full pl-8 pr-7 py-1.5 text-xs rounded-lg border border-[#E5E7EB] bg-white text-[#17212B] placeholder-[#9CA3AF] focus:outline-hidden focus:border-[#16734B]"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#17212B] cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Markets Two-Column Grid */}
                {filteredMarkets.length === 0 ? (
                  <div className="py-12 px-4 text-center bg-white border border-[#E5E7EB] rounded-xl space-y-2">
                    <p className="font-semibold text-sm text-[#17212B]">No matching markets</p>
                    <p className="text-xs text-[#64748B]">Try adjusting your search query or category filter.</p>
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedCategory('all');
                      }}
                      className="inline-flex py-1.5 px-3 rounded-lg bg-[#F3F4F6] text-xs font-semibold text-[#17212B] hover:bg-[#E5E7EB] transition-colors cursor-pointer"
                    >
                      Clear filters
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {filteredMarkets.map((market) => (
                      <PredictionCard
                        key={market.id}
                        market={market}
                        selectedPrediction={selectedPrediction}
                        onSelect={handleSelectPrediction}
                        onOpenDetails={(m) => setModalMarket(m)}
                      />
                    ))}
                  </div>
                )}
              </section>

              {/* Activity Ledger Below Markets */}
              <ActivityList activity={activity} />
            </div>

            {/* Right Column: Unified Round-Up Panel (~360px sticky desktop) */}
            <div className="hidden lg:block lg:col-span-4 sticky top-20">
              <DemoPanel
                totalAllocated={totalAllocated}
                purchaseCount={activity.length}
                selectedPrediction={selectedPrediction}
                activeMarket={activeMarket}
                roundUpsEnabled={roundUpsEnabled}
                onToggleRoundUps={setRoundUpsEnabled}
                onSimulatePurchase={handleSimulatePurchase}
                isSimulating={isSimulating}
                multiplier={multiplier}
                onMultiplierChange={setMultiplier}
                holdings={holdings}
              />
            </div>
          </div>
        </main>
      </div>

      {/* Reusable Market Details & Gemini Modal */}
      <MarketDetailModal
        isOpen={modalMarket !== null}
        onClose={() => setModalMarket(null)}
        market={modalMarket}
        onSelectSide={(side) => {
          if (modalMarket) {
            handleSelectPrediction(modalMarket.id, side);
          }
        }}
        selectedSide={modalMarket?.id === selectedPrediction?.marketId ? (selectedPrediction?.side ?? null) : null}
        cachedExplanation={modalMarket ? cachedExplanations[modalMarket.id] : null}
        onSaveExplanation={handleSaveExplanation}
      />

      {/* Mobile Floating Action Bar */}
      {selectedPrediction && activeMarket && (
        <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-[#E5E7EB] p-3 shadow-lg flex items-center justify-between gap-3 animate-in slide-in-from-bottom duration-150">
          <div className="min-w-0 pr-2">
            <span className="text-[11px] text-[#64748B] block truncate">
              {activeMarket.displayTitle}
            </span>
            <span
              className={`text-xs font-bold px-1.5 py-0.2 rounded border inline-block mt-0.5 ${
                selectedPrediction.side === 'YES'
                  ? 'bg-[#E8F5EE] text-[#16734B] border-[#C6E7D5]'
                  : 'bg-[#FEE2E2] text-[#991B1B] border-[#FECACA]'
              }`}
            >
              {selectedPrediction.side}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsMobilePanelOpen(true)}
            className="py-2.5 px-4 rounded-lg bg-[#16734B] text-white text-xs font-semibold hover:bg-[#125838] transition-colors cursor-pointer shrink-0 shadow-xs"
          >
            Try a round-up
          </button>
        </div>
      )}

      {/* Mobile Bottom Sheet for Round-up Panel */}
      {isMobilePanelOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="lg:hidden fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setIsMobilePanelOpen(false)}
        >
          <div
            className="bg-white border-t border-[#E5E7EB] rounded-t-2xl w-full max-h-[85vh] overflow-y-auto p-4 pb-8 space-y-4 shadow-2xl animate-in slide-in-from-bottom duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-[#E5E7EB]">
              <span className="text-sm font-bold text-[#17212B]">Round-up Simulator</span>
              <button
                type="button"
                onClick={() => setIsMobilePanelOpen(false)}
                className="text-[#64748B] hover:text-[#17212B] p-1 rounded-md hover:bg-[#F3F4F6] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <DemoPanel
              totalAllocated={totalAllocated}
              purchaseCount={activity.length}
              selectedPrediction={selectedPrediction}
              activeMarket={activeMarket}
              roundUpsEnabled={roundUpsEnabled}
              onToggleRoundUps={setRoundUpsEnabled}
              onSimulatePurchase={(name, orig, rounded) => {
                handleSimulatePurchase(name, orig, rounded);
                setIsMobilePanelOpen(false);
              }}
              isSimulating={isSimulating}
              multiplier={multiplier}
              onMultiplierChange={setMultiplier}
              holdings={holdings}
            />
          </div>
        </div>
      )}

      {/* Post-Purchase Confirmation Toast */}
      <PurchaseNotification feedback={feedback} onDismiss={() => setFeedback(null)} />

      {/* Honest Concise Footer */}
      <footer className="mt-12 py-6 border-t border-[#E5E7EB] text-center text-xs text-[#64748B] bg-white">
        <p>Simulated purchases and allocations. No real money is moved.</p>
      </footer>
    </div>
  );
}
