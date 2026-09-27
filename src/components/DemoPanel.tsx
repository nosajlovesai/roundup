import React, { useState } from 'react';
import {
  CreditCard,
  ArrowRight,
  ShieldCheck,
  ArrowUpRight,
  Target,
  AlertCircle,
  Coins,
  Settings2,
  Sliders,
} from 'lucide-react';
import { SelectedPrediction, PredictionMarket } from '../types';

interface DemoPanelProps {
  totalAllocated: number;
  lastDelta: number | null;
  selectedPrediction: SelectedPrediction | null;
  activeMarket: PredictionMarket | null;
  roundUpsEnabled: boolean;
  onToggleRoundUps: (enabled: boolean) => void;
  onSimulatePurchase: (itemName: string, originalPrice: number, roundedPrice: number) => void;
  isSimulating: boolean;
  multiplier: number;
  onMultiplierChange: (multiplier: number) => void;
}

interface ItemPreset {
  id: string;
  name: string;
  emoji: string;
  price: number;
  rounded: number;
}

const PRESET_ITEMS: ItemPreset[] = [
  { id: 'coffee', name: 'Coffee', emoji: '☕', price: 4.60, rounded: 5.00 },
  { id: 'transit', name: 'Transit', emoji: '🚊', price: 2.75, rounded: 3.00 },
  { id: 'lunch', name: 'Lunch', emoji: '🥗', price: 12.30, rounded: 13.00 },
  { id: 'grocery', name: 'Groceries', emoji: '🛒', price: 18.40, rounded: 19.00 },
];

export const DemoPanel: React.FC<DemoPanelProps> = ({
  totalAllocated,
  lastDelta,
  selectedPrediction,
  activeMarket,
  roundUpsEnabled,
  onToggleRoundUps,
  onSimulatePurchase,
  isSimulating,
  multiplier,
  onMultiplierChange,
}) => {
  const [selectedItem, setSelectedItem] = useState<ItemPreset>(PRESET_ITEMS[0]);
  const [isCustom, setIsCustom] = useState(false);
  const [customItemName, setCustomItemName] = useState('Online Order');
  const [customPriceInput, setCustomPriceInput] = useState('8.45');

  const parsedCustomPrice = parseFloat(customPriceInput) || 0;
  const customRoundedPrice = Math.ceil(parsedCustomPrice) === parsedCustomPrice && parsedCustomPrice > 0
    ? parsedCustomPrice + 1.0
    : Math.ceil(parsedCustomPrice);

  const activePrice = isCustom ? parsedCustomPrice : selectedItem.price;
  const activeRounded = isCustom ? customRoundedPrice : selectedItem.rounded;
  const rawRoundUp = Math.max(0, Number((activeRounded - activePrice).toFixed(2)));
  const effectiveRoundUp = Number((rawRoundUp * multiplier).toFixed(2));

  const isReady = roundUpsEnabled && selectedPrediction !== null && activePrice > 0;

  const handleExecutePurchase = () => {
    if (!isReady || isSimulating) return;
    const name = isCustom ? (customItemName.trim() || 'Custom Purchase') : selectedItem.name;
    const rounded = Number((activePrice + effectiveRoundUp).toFixed(2));
    onSimulatePurchase(name, activePrice, rounded);
  };

  return (
    <div
      id="demo-simulator"
      className="rounded-2xl bg-white border border-[#E2DDD1] shadow-sm overflow-hidden transition-all"
    >
      {/* Account Balance Header */}
      <div className="bg-[#123624] text-white p-5">
        <div className="flex items-center justify-between pb-3 border-b border-[#225037] text-xs">
          <div className="flex items-center gap-2">
            <CreditCard className="w-3.5 h-3.5 text-[#86EFAC]" />
            <span className="font-mono text-[11px] text-[#A2D3B8]">Visa •••• 4128</span>
          </div>

          <button
            type="button"
            onClick={() => onToggleRoundUps(!roundUpsEnabled)}
            className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full cursor-pointer transition-colors ${
              roundUpsEnabled
                ? 'bg-[#18643C] text-[#86EFAC] border border-[#2F7E53]'
                : 'bg-[#253D30] text-[#869E90]'
            }`}
          >
            {roundUpsEnabled ? '● Auto Round-ups On' : '○ Paused'}
          </button>
        </div>

        {/* Total Allocated */}
        <div className="pt-4">
          <p className="text-[11px] font-semibold text-[#8EBFA4] uppercase tracking-wider">
            Total round-ups allocated
          </p>

          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-bold text-[#72C194] font-mono">$</span>
            <span className="text-5xl font-black tracking-tight font-mono text-white">
              {totalAllocated.toFixed(2)}
            </span>

            {lastDelta !== null && lastDelta > 0 && (
              <div className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md bg-[#1B5738] text-[#6DE69E] border border-[#2D7852] text-xs font-bold animate-bounce ml-1.5 font-mono">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>+${lastDelta.toFixed(2)}</span>
              </div>
            )}
          </div>

          <p className="text-[11px] text-[#A0CEB5] mt-1.5 font-normal">
            Cumulative spare change routed into prediction contracts.
          </p>
        </div>
      </div>

      <div className="p-4 sm:p-5 space-y-4">
        {/* Next round-ups destination */}
        <div className="rounded-xl bg-[#F8F6F0] border border-[#E3DDCF] p-3.5 space-y-1.5">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-bold uppercase tracking-wider text-[#265337] flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-[#1B5433]" />
              Next round-ups go to
            </span>
            {selectedPrediction && (
              <span className="text-[10px] text-[#69796F]">
                Affects future swipes only
              </span>
            )}
          </div>

          {activeMarket && selectedPrediction ? (
            <div className="space-y-1 pt-1">
              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-0.5 rounded text-[11px] font-black shrink-0 ${
                    selectedPrediction.side === 'YES'
                      ? 'bg-[#154E2F] text-white'
                      : 'bg-[#963730] text-white'
                  }`}
                >
                  {selectedPrediction.side}
                </span>
                <p className="text-xs font-bold text-[#142C1E] leading-snug line-clamp-2">
                  {activeMarket.question}
                </p>
              </div>
              <p className="text-[11px] text-[#55695C]">
                Target: {activeMarket.shortName} · Past activity remains locked to its original pick.
              </p>
            </div>
          ) : (
            <div className="flex items-center gap-2 py-1 text-xs text-[#876024]">
              <AlertCircle className="w-4 h-4 text-[#D97706] shrink-0" />
              <span>Select BUY YES or BUY NO on any market card on the left to set your destination.</span>
            </div>
          )}
        </div>

        {/* Round-up Rule & Multiplier Config */}
        <div className="rounded-xl bg-[#FAF8F3] border border-[#E4DFD3] p-3.5 space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-[#183B27] flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-[#2B6D45]" />
              Round-up multiplier
            </span>
            <span className="font-mono text-[11px] text-[#4F6456]">
              {multiplier}x spare change
            </span>
          </div>

          <div className="grid grid-cols-3 gap-1.5">
            {[1, 2, 3].map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => onMultiplierChange(m)}
                className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
                  multiplier === m
                    ? 'bg-[#15492C] text-white border-[#15492C] shadow-2xs'
                    : 'bg-white text-[#294B37] border-[#E0D9CB] hover:bg-[#F2ECE1]'
                }`}
              >
                {m}x Round-up
              </button>
            ))}
          </div>
        </div>

        {/* Spend Simulator */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-[#163825]">Simulate Card Swipe</span>
            <button
              type="button"
              onClick={() => setIsCustom(!isCustom)}
              className="text-[11px] text-[#245D3B] hover:text-[#113C23] underline font-medium cursor-pointer"
            >
              {isCustom ? 'Use presets' : 'Custom amount'}
            </button>
          </div>

          {/* Quick presets */}
          {!isCustom ? (
            <div className="grid grid-cols-4 gap-1.5">
              {PRESET_ITEMS.map((item) => {
                const active = selectedItem.id === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedItem(item)}
                    className={`py-2 px-1 rounded-xl text-center transition-all cursor-pointer border ${
                      active
                        ? 'bg-[#15492C] text-white border-[#15492C] shadow-2xs font-bold'
                        : 'bg-[#FAF8F3] text-[#1E3B2A] border-[#E4DED3] hover:bg-[#F1ECE0]'
                    }`}
                  >
                    <div className="text-base leading-none">{item.emoji}</div>
                    <div className="text-[11px] truncate mt-1">{item.name}</div>
                    <div className={`text-[10px] font-mono ${active ? 'text-[#86EFAC]' : 'text-[#617467]'}`}>
                      ${item.price.toFixed(2)}
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-[#55695C] block mb-1 font-medium">Merchant / Item</label>
                <input
                  type="text"
                  value={customItemName}
                  onChange={(e) => setCustomItemName(e.target.value)}
                  className="w-full text-xs py-1.5 px-2.5 rounded-lg border border-[#DCD5C5] bg-white text-[#183927] focus:outline-hidden focus:ring-1 focus:ring-[#16492C]"
                  placeholder="e.g. Bookstore"
                />
              </div>
              <div>
                <label className="text-[10px] text-[#55695C] block mb-1 font-medium">Swipe Amount ($)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={customPriceInput}
                  onChange={(e) => setCustomPriceInput(e.target.value)}
                  className="w-full text-xs font-mono py-1.5 px-2.5 rounded-lg border border-[#DCD5C5] bg-white text-[#183927] focus:outline-hidden focus:ring-1 focus:ring-[#16492C]"
                  placeholder="0.00"
                />
              </div>
            </div>
          )}

          {/* Allocation Calculation Preview */}
          <div className="rounded-xl bg-[#FAF8F3] border border-[#E3DDCF] p-2.5 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-[#4D6354]">
              <span>Purchase: ${activePrice.toFixed(2)}</span>
              <ArrowRight className="w-3 h-3 text-[#22633C]" />
              <span className="font-semibold text-[#183C26]">${(activePrice + effectiveRoundUp).toFixed(2)}</span>
            </div>
            <div className="font-mono font-bold text-[#185331] flex items-center gap-1">
              <Coins className="w-3.5 h-3.5 text-[#D97706]" />
              <span>+${effectiveRoundUp.toFixed(2)}</span>
            </div>
          </div>

          {/* Primary Action Button */}
          <button
            type="button"
            disabled={!isReady || isSimulating}
            onClick={handleExecutePurchase}
            className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-150 ${
              isReady
                ? 'bg-[#14472A] text-white hover:bg-[#0D331D] active:scale-98 shadow-md hover:shadow-lg cursor-pointer'
                : 'bg-[#EAE4D8] text-[#8E8B82] cursor-not-allowed opacity-75'
            }`}
          >
            <CreditCard className="w-4 h-4 text-[#86EFAC]" />
            <span>
              Swipe Visa card ({isCustom ? `$${activePrice.toFixed(2)}` : `${selectedItem.name} — $${activePrice.toFixed(2)}`})
            </span>
            {isReady && (
              <span className="ml-1 text-[11px] font-semibold bg-[#225F3B] text-[#86EFAC] px-2 py-0.5 rounded-md font-mono">
                +${effectiveRoundUp.toFixed(2)}
              </span>
            )}
          </button>

          {/* In-simulator guidance banner */}
          {!isReady && (
            <div className="text-[11px] text-[#7C5921] bg-[#FFFBEB] p-2.5 rounded-xl border border-[#FDE68A] flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-[#D97706] shrink-0" />
              <span>
                {!selectedPrediction
                  ? 'Pick BUY YES or BUY NO on any market card on the left.'
                  : 'Switch on “Auto Round-ups” at top.'}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
