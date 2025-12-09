
export enum VerificationLevel {
  Bronze = 'Bronze',
  Silver = 'Silver',
  Gold = 'Gold',
  APIVerified = 'API Verified'
}

export enum TradingCategory {
  Intraday = 'Intraday',
  Swing = 'Swing',
  Options = 'Options',
  FnO = 'F&O',
  Equity = 'Equity',
  Scalping = 'Scalping',
  Investment = 'Investment'
}

export type TraderStatus = 'pending' | 'approved' | 'rejected';

export interface Trader {
  id: string;
  name: string;
  photoUrl: string;
  category: TradingCategory;
  verificationLevel: VerificationLevel;
  trustScore: number;
  broker: string;
  monthlyGain: number;
  winRate: number;
  profitFactor: number;
  avgRR: number;
  bio: string;
  strategy: string;
  verifiedSince: string;
  totalTrades: number;
  monthlyData: { month: string; gain: number }[];
  status: TraderStatus;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
}

export interface AdminStat {
  label: string;
  value: string;
  trend: 'up' | 'down' | 'neutral';
  trendValue: string;
}