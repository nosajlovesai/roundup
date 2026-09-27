export type PredictionCategory =
  | 'frontier_ai'
  | 'technology'
  | 'sports'
  | 'news';

export interface PredictionMarket {
  id: string;
  category: PredictionCategory;
  categoryLabel: string;
  shortName: string;
  question: string;
  description: string;
  resolutionRule: string;
  simulatedProbabilityYes: number; // e.g. 84
  volumeUsd: number;               // e.g. 342800
  closeDate: string;               // e.g. 'Dec 31, 2026'
  change24h: number;               // e.g. +3.5
}

export type PredictionSide = 'YES' | 'NO';

export interface SelectedPrediction {
  marketId: string;
  side: PredictionSide;
}

export interface ActivityItem {
  id: string;
  timestamp: number;
  itemName: string;
  originalPrice: number; // 4.60
  roundedPrice: number;  // 5.00
  roundUpAmount: number; // 0.40
  marketQuestion: string;
  marketShortTitle: string;
  side: PredictionSide;
  fullMessage: string;
  isNew?: boolean;
}

export interface PurchaseFeedback {
  id: string;
  item: string;
  fromAmount: number;
  toAmount: number;
  roundUp: number;
  targetMarket: string;
  targetSide: PredictionSide;
}
