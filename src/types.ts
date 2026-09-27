export type PredictionCategory =
  | 'frontier_ai'
  | 'technology'
  | 'sports'
  | 'news';

export interface MarketNewsItem {
  id: string;
  source: string;
  timeAgo: string;
  title: string;
  url: string;
}

export interface PredictionMarket {
  id: string;
  category: PredictionCategory;
  categoryLabel: string;
  shortName: string;
  displayTitle: string;
  question: string;
  description: string;
  resolutionRule: string;
  simulatedProbabilityYes: number; // e.g. 84
  volumeUsd: number;               // e.g. 342800
  closeDate: string;               // e.g. 'Dec 31, 2026'
  change24h: number;               // e.g. +3.5
  newsItems?: MarketNewsItem[];
}

export type PredictionSide = 'YES' | 'NO';

export interface SelectedPrediction {
  marketId: string;
  side: PredictionSide;
}

export interface MarketHolding {
  marketId: string;
  marketQuestion: string;
  marketShortTitle: string;
  category: PredictionCategory;
  side: PredictionSide;
  amount: number;
  percentage: number;
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
  side: PredictionSide | 'WITHDRAWAL';
  fullMessage: string;
  isNew?: boolean;
  isWithdrawal?: boolean;
  isMobileDemo?: boolean;
}

export interface PurchaseFeedback {
  id: string;
  item: string;
  fromAmount: number;
  toAmount: number;
  roundUp: number;
  targetMarket: string;
  targetSide: PredictionSide | 'WITHDRAWAL';
}

export interface GeminiMarketIntelligence {
  summary: string;
  bullCase: string[];
  bearCase: string[];
  watchpoints: string[];
  contractNuance: string;
  yesWinsIf: string;
  noWinsIf: string;
  model?: string;
  source?: string;
}
