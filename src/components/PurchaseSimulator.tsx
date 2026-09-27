import React, { useState } from 'react';
import {
  Coffee,
  ArrowRight,
  AlertCircle,
  Coins,
  CheckCircle2,
  Sparkles,
  ShoppingBag,
} from 'lucide-react';
import { SelectedPrediction, PredictionMarket } from '../types';
import { MarketVisual } from './MarketVisual';

interface PurchaseSimulatorProps {
  roundUpsEnabled: boolean;
  onToggleRoundUps: (enabled: boolean) => void;
  onSimulatePurchase: (itemName: string, originalPrice: number, roundedPrice: number) => void;
  selectedPrediction: SelectedPrediction | null;
  activeMarket: PredictionMarket | null;
  isSimulating: boolean;
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
  { id: 'croissant', name: 'Croissant', emoji: '🥐', price: 3.25, rounded: 4.00 },
  { id: 'transit', name: 'Transit', emoji: '🚊', price: 2.75, rounded: 3.00 },
  { id: 'lunch', name: 'Sandwich', emoji: '🥪', price: 7.60, rounded: 8.00 },
];

export const PurchaseSimulator: React.FC<PurchaseSimulatorProps> = ({
  roundUpsEnabled,
  onToggleRoundUps,
  onSimulatePurchase,
  selectedPrediction,
  activeMarket,
  isSimulating,
}) => {
  const [selectedItem, setSelectedItem] = useState<ItemPreset>(PRESET_ITEMS[0]);
  const isReady = roundUpsEnabled && selectedPrediction !== null;

  const roundUpAmount = Number((selectedItem.rounded - selectedItem.price).toFixed(2));

  const handleExecutePurchase = () => {
    if (!isReady || isSimulating) return;
    onSimulatePurchase(selectedItem.name, selectedItem.price, selectedItem.rounded);
  };

  return (
    <div className="rounded-2xl bg-white border border-[#E4DDD0] overflow-hidden shadow-xs">
      {/* Visual Header Banner */}
      <div className="relative">
        <MarketVisual category="coffee" className="w-full h-32 sm:h-36" />
        
        {/* Toggle overlay on top right */}
        <div className="absolute top-3 right-3 bg-black/65 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 flex items-center gap-2.5">
          <span className="text-[11px] font-bold text-white tracking-wide">
            Round-ups {roundUpsEnabled ? 'ON' : 'OFF'}
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={roundUpsEnabled}
            onClick={() => onToggleRoundUps(!roundUpsEnabled)}
            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
              roundUpsEnabled ? 'bg-[#34D399]' : 'bg-[#6B7280]'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out ${
                roundUpsEnabled ? 'translate-x-4' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      <div className="p-5 sm:p-6 space-y-4">
        {/* Interactive Preset Chips */}
        <div>
          <div className="flex items-center justify-between text-xs font-semibold text-[#486151] mb-2">
            <span>Tap purchase to simulate:</span>
            <span className="text-[11px] text-[#718678] font-normal">Next whole dollar round-up</span>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {PRESET_ITEMS.map((item) => {
              const active = selectedItem.id === item.id;
              const diff = (item.rounded - item.price).toFixed(2);
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedItem(item)}
                  className={`p-2 rounded-xl text-center transition-all cursor-pointer border ${
                    active
                      ? 'bg-[#184F31] text-white border-[#184F31] shadow-xs scale-102'
                      : 'bg-[#F9F7F1] text-[#213F2C] border-[#E8E2D5] hover:bg-[#F2ECE0]'
                  }`}
                >
                  <div className="text-xl mb-0.5">{item.emoji}</div>
                  <div className="text-xs font-bold truncate">{item.name}</div>
                  <div className={`text-[10px] font-mono mt-0.5 ${active ? 'text-[#86EFAC]' : 'text-[#586F60]'}`}>
                    ${item.price.toFixed(2)}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Visual Round-up Calculator Graphic */}
        <div className="rounded-xl bg-[#F7F4EB] border border-[#E6E0D2] p-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white text-xl flex items-center justify-center shadow-xs border border-[#E3DCce]">
              {selectedItem.emoji}
            </div>
            <div>
              <p className="text-xs font-bold text-[#142E1F]">
                {selectedItem.name} swipe
              </p>
              <div className="flex items-center gap-1.5 text-xs text-[#516458] font-mono">
                <span className="line-through text-[#849589]">${selectedItem.price.toFixed(2)}</span>
                <ArrowRight className="w-3 h-3 text-[#227144]" />
                <span className="font-bold text-[#173D26]">${selectedItem.rounded.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#356B4A] block">
              Spare Change
            </span>
            <span className="text-base sm:text-lg font-extrabold font-mono text-[#185331] inline-flex items-center gap-1">
              <Coins className="w-4 h-4 text-[#D97706]" />
              +${roundUpAmount.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Primary Simulation Button (Explicitly features coffee requirement) */}
        <div>
          <button
            type="button"
            disabled={!isReady || isSimulating}
            onClick={handleExecutePurchase}
            className={`w-full py-4 px-6 rounded-xl font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 transition-all duration-200 cursor-pointer ${
              isReady
                ? 'bg-[#15462A] text-white hover:bg-[#0E331E] active:scale-98 shadow-md hover:shadow-lg'
                : 'bg-[#ECE7DA] text-[#9A968B] cursor-not-allowed opacity-80'
            }`}
          >
            <Coffee className="w-5 h-5 text-[#86EFAC]" />
            <span>
              Simulate {selectedItem.id === 'coffee' ? 'coffee purchase — $4.60' : `${selectedItem.name.toLowerCase()} purchase — $${selectedItem.price.toFixed(2)}`}
            </span>
            {isReady && (
              <span className="ml-1 text-xs font-semibold bg-[#266D43] text-white px-2 py-0.5 rounded-md">
                +${roundUpAmount.toFixed(2)}
              </span>
            )}
          </button>
        </div>

        {/* Helpful state pill when button is disabled */}
        {!isReady && (
          <div className="flex items-center gap-2 text-xs text-[#8A6124] bg-[#FFFBEB] p-2.5 rounded-lg border border-[#FDE68A]">
            <AlertCircle className="w-4 h-4 text-[#D97706] shrink-0" />
            <span>
              {!selectedPrediction
                ? 'Select a prediction card above first.'
                : 'Switch “Round-ups” ON above to simulate.'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
