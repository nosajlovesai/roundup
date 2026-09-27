import React, { useState } from 'react';
import { ChevronDown, ChevronUp, CreditCard, PieChart } from 'lucide-react';
import { SelectedPrediction, PredictionMarket, MarketHolding } from '../types';

interface DemoPanelProps {
  totalAllocated: number;
  purchaseCount: number;
  selectedPrediction: SelectedPrediction | null;
  activeMarket: PredictionMarket | null;
  roundUpsEnabled: boolean;
  onToggleRoundUps: (enabled: boolean) => void;
  onSimulatePurchase: (itemName: string, originalPrice: number, roundedPrice: number) => void;
  isSimulating: boolean;
  multiplier: number;
  onMultiplierChange: (multiplier: number) => void;
  holdings: MarketHolding[];
}

interface ItemPreset {
  id: string;
  name: string;
  price: number;
  rounded: number;
}

const PRESET_ITEMS: ItemPreset[] = [
  { id: 'coffee', name: 'Coffee', price: 4.60, rounded: 5.00 },
  { id: 'transit', name: 'Transit', price: 2.75, rounded: 3.00 },
  { id: 'lunch', name: 'Lunch', price: 12.30, rounded: 13.00 },
  { id: 'grocery', name: 'Groceries', price: 18.40, rounded: 19.00 },
];

export const DemoPanel: React.FC<DemoPanelProps> = ({
  totalAllocated,
  purchaseCount,
  selectedPrediction,
  activeMarket,
  roundUpsEnabled,
  onToggleRoundUps,
  onSimulatePurchase,
  isSimulating,
  multiplier,
  onMultiplierChange,
  holdings,
}) => {
  const [selectedItem, setSelectedItem] = useState<ItemPreset>(PRESET_ITEMS[0]);
  const [isCustom, setIsCustom] = useState(false);
  const [customName, setCustomName] = useState('Online Order');
  const [customPriceInput, setCustomPriceInput] = useState('8.45');
  const [showSettings, setShowSettings] = useState(false);
  const [showBreakdown, setShowBreakdown] = useState(false);

  // Price calculations
  const parsedCustomPrice = parseFloat(customPriceInput) || 0;
  const customRounded =
    Math.ceil(parsedCustomPrice) === parsedCustomPrice && parsedCustomPrice > 0
      ? parsedCustomPrice
      : Math.ceil(parsedCustomPrice);

  const activePrice = isCustom ? parsedCustomPrice : selectedItem.price;
  const activeRounded = isCustom ? customRounded : selectedItem.rounded;

  const baseRoundUp = Math.max(0, Number((activeRounded - activePrice).toFixed(2)));
  const allocatedAmount = Number((baseRoundUp * multiplier).toFixed(2));

  const hasSelection = selectedPrediction !== null && activeMarket !== null;
  const canSimulate = hasSelection && roundUpsEnabled && baseRoundUp > 0 && !isSimulating;

  const handleExecutePurchase = () => {
    if (!canSimulate) return;
    const name = isCustom ? customName.trim() || 'Custom purchase' : selectedItem.name;
    const finalRounded = Number((activePrice + allocatedAmount).toFixed(2));
    onSimulatePurchase(name, activePrice, finalRounded);
  };

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-xs space-y-5 text-[#17212B]">
      {/* Header: Title + Card Subtitle */}
      <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB]">
        <div>
          <h2 className="text-lg font-bold text-[#17212B]">Your round-ups</h2>
          <span className="text-xs text-[#64748B] flex items-center gap-1.5 mt-0.5 font-mono">
            <CreditCard className="w-3 h-3 text-[#64748B]" />
            Demo card •••• 4128
          </span>
        </div>
      </div>

      {/* A. Total Allocated */}
      <div className="space-y-1">
        <span className="text-xs font-medium text-[#64748B] block">Total allocated</span>
        <div className="flex items-baseline justify-between">
          <span className="text-3xl font-bold font-tabular text-[#17212B]">
            ${totalAllocated.toFixed(2)}
          </span>
          <span className="text-xs text-[#64748B]">
            {purchaseCount} {purchaseCount === 1 ? 'purchase' : 'purchases'}
          </span>
        </div>
      </div>

      {/* B. Next Round-ups Destination */}
      <div className="pt-3 border-t border-[#E5E7EB] space-y-1.5">
        <span className="text-xs font-medium text-[#64748B] block">Next round-ups go to</span>
        {hasSelection ? (
          <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#F7F8FA] border border-[#E5E7EB]">
            <div className="min-w-0 pr-2">
              <span className="text-xs font-semibold text-[#17212B] block truncate">
                {activeMarket.displayTitle}
              </span>
              <span className="text-[11px] text-[#64748B]">{activeMarket.categoryLabel}</span>
            </div>
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded border shrink-0 ${
                selectedPrediction.side === 'YES'
                  ? 'bg-[#E8F5EE] text-[#16734B] border-[#C6E7D5]'
                  : 'bg-[#FEE2E2] text-[#991B1B] border-[#FECACA]'
              }`}
            >
              {selectedPrediction.side}
            </span>
          </div>
        ) : (
          <p className="text-xs text-[#64748B] p-2.5 rounded-lg bg-[#F7F8FA] border border-[#E5E7EB]">
            Choose a prediction to get started.
          </p>
        )}
      </div>

      {/* C. Automatic Round-ups Toggle */}
      <div className="pt-3 border-t border-[#E5E7EB] flex items-center justify-between">
        <div>
          <span className="text-sm font-semibold text-[#17212B] block">Automatic round-ups</span>
          <span className="text-xs text-[#64748B]">
            {roundUpsEnabled ? 'Active · Allocating on purchase' : 'Paused · No round-ups routed'}
          </span>
        </div>

        <button
          type="button"
          role="switch"
          aria-checked={roundUpsEnabled}
          onClick={() => onToggleRoundUps(!roundUpsEnabled)}
          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
            roundUpsEnabled ? 'bg-[#16734B]' : 'bg-[#D1D5DB]'
          }`}
        >
          <span
            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
              roundUpsEnabled ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {/* D. Demo Purchase Simulator */}
      <div className="pt-3 border-t border-[#E5E7EB] space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[#17212B]">Demo purchase</span>
          <button
            type="button"
            onClick={() => setIsCustom(!isCustom)}
            className="text-xs text-[#16734B] hover:underline font-medium cursor-pointer"
          >
            {isCustom ? 'Use presets' : 'Custom'}
          </button>
        </div>

        {/* Compact preset selector */}
        {!isCustom ? (
          <div className="grid grid-cols-4 gap-1.5">
            {PRESET_ITEMS.map((item) => {
              const isSelectedPreset = selectedItem.id === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedItem(item)}
                  className={`py-1.5 px-1 rounded-lg text-center border text-xs transition-colors cursor-pointer ${
                    isSelectedPreset
                      ? 'bg-[#E8F5EE] text-[#16734B] border-[#16734B] font-semibold'
                      : 'bg-[#F7F8FA] text-[#64748B] border-[#E5E7EB] hover:bg-[#F3F4F6]'
                  }`}
                >
                  <span className="block truncate">{item.name}</span>
                  <span className="block font-mono text-[10px] mt-0.5">${item.price.toFixed(2)}</span>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <label className="text-[#64748B] block mb-1">Item name</label>
              <input
                type="text"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                className="w-full py-1.5 px-2.5 rounded-lg border border-[#E5E7EB] bg-white text-[#17212B] focus:outline-hidden focus:border-[#16734B]"
              />
            </div>
            <div>
              <label className="text-[#64748B] block mb-1">Amount ($)</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={customPriceInput}
                onChange={(e) => setCustomPriceInput(e.target.value)}
                className="w-full py-1.5 px-2.5 font-mono rounded-lg border border-[#E5E7EB] bg-white text-[#17212B] focus:outline-hidden focus:border-[#16734B]"
              />
            </div>
          </div>
        )}

        {/* Clear Calculation Display */}
        <div className="p-3 rounded-lg bg-[#F7F8FA] border border-[#E5E7EB] text-xs space-y-1.5">
          <div className="flex items-center justify-between text-[#64748B]">
            <span>{isCustom ? customName || 'Custom purchase' : selectedItem.name}</span>
            <span className="font-mono text-[#17212B] font-medium">${activePrice.toFixed(2)}</span>
          </div>

          <div className="flex items-center justify-between text-[#64748B]">
            <span>Rounded purchase</span>
            <span className="font-mono text-[#17212B] font-medium">
              ${(activePrice + baseRoundUp).toFixed(2)}
            </span>
          </div>

          <div className="flex items-center justify-between pt-1.5 border-t border-[#E5E7EB] font-semibold text-[#17212B]">
            <span>Round-up</span>
            <span className="font-mono text-[#16734B]">+${baseRoundUp.toFixed(2)}</span>
          </div>

          {multiplier > 1 && baseRoundUp > 0 && (
            <div className="pt-1 text-[11px] text-[#64748B]">
              Base round-up ${baseRoundUp.toFixed(2)} × {multiplier} = ${allocatedAmount.toFixed(2)}{' '}
              allocated.
            </div>
          )}
        </div>

        {/* Primary Action Button */}
        <button
          type="button"
          disabled={!canSimulate}
          onClick={handleExecutePurchase}
          className={`w-full py-2.5 px-4 rounded-lg font-semibold text-sm transition-all duration-150 flex items-center justify-center gap-1.5 ${
            canSimulate
              ? 'bg-[#16734B] text-white hover:bg-[#125838] shadow-xs active:scale-98 cursor-pointer'
              : 'bg-[#E5E7EB] text-[#9CA3AF] cursor-not-allowed'
          }`}
        >
          <span>Simulate purchase · +${allocatedAmount.toFixed(2)}</span>
        </button>

        {/* Guidance message when disabled */}
        {!canSimulate && (
          <p className="text-xs text-[#64748B] text-center">
            {!hasSelection
              ? 'Choose a prediction on the left to get started.'
              : !roundUpsEnabled
              ? 'Turn on automatic round-ups above.'
              : baseRoundUp === 0
              ? 'Whole dollar purchase produces $0.00 round-up.'
              : ''}
          </p>
        )}
      </div>

      {/* E. Round-up Settings (Multiplier 1x, 2x, 3x) in compact expandable row */}
      <div className="pt-3 border-t border-[#E5E7EB]">
        <button
          type="button"
          onClick={() => setShowSettings(!showSettings)}
          className="w-full flex items-center justify-between text-xs text-[#64748B] hover:text-[#17212B] transition-colors cursor-pointer"
        >
          <span>Round-up multiplier ({multiplier}x)</span>
          {showSettings ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {showSettings && (
          <div className="grid grid-cols-3 gap-1.5 mt-2.5 animate-in fade-in duration-100">
            {[1, 2, 3].map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => onMultiplierChange(m)}
                className={`py-1.5 px-2 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                  multiplier === m
                    ? 'bg-[#16734B] text-white border-[#16734B]'
                    : 'bg-[#F7F8FA] text-[#64748B] border-[#E5E7EB] hover:bg-[#F3F4F6]'
                }`}
              >
                {m}x
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Collapsed Allocation Breakdown (Hidden when no allocations) */}
      {holdings.length > 0 && (
        <div className="pt-3 border-t border-[#E5E7EB]">
          <button
            type="button"
            onClick={() => setShowBreakdown(!showBreakdown)}
            className="w-full flex items-center justify-between text-xs text-[#64748B] hover:text-[#17212B] transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              <PieChart className="w-3.5 h-3.5 text-[#64748B]" />
              <span>Allocation breakdown ({holdings.length})</span>
            </span>
            {showBreakdown ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </button>

          {showBreakdown && (
            <div className="mt-3 space-y-2 text-xs animate-in fade-in duration-100">
              {holdings.map((h) => (
                <div
                  key={`${h.marketId}-${h.side}`}
                  className="flex items-center justify-between p-2 rounded-lg bg-[#F7F8FA] border border-[#E5E7EB]"
                >
                  <div className="min-w-0 pr-2">
                    <span className="font-semibold text-[#17212B] block truncate">
                      {h.marketShortTitle}
                    </span>
                    <span className="text-[11px] text-[#64748B] font-mono">
                      {h.side} · {h.percentage.toFixed(0)}%
                    </span>
                  </div>
                  <span className="font-mono font-bold text-xs text-[#17212B]">
                    ${h.amount.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
