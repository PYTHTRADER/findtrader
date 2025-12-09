
import { Trader, VerificationLevel, TradingCategory } from './types';

// PRODUCTION ENDPOINTS
// Project ID: findtrader-india
// Region: us-central1
export const SUBMIT_TRADER_ENDPOINT = "https://us-central1-findtrader-india.cloudfunctions.net/submitTrader";
export const HEALTH_ENDPOINT = "https://us-central1-findtrader-india.cloudfunctions.net/health";

export const MOCK_TRADERS: Trader[] = [
  {
    id: '1',
    name: 'Rahul Sharma',
    photoUrl: 'https://picsum.photos/200/200?random=1',
    category: TradingCategory.Options,
    verificationLevel: VerificationLevel.APIVerified,
    trustScore: 98,
    broker: 'Zerodha',
    monthlyGain: 12.5,
    winRate: 68,
    profitFactor: 2.4,
    avgRR: 1.8,
    bio: 'Specialist in Bank Nifty Options buying with 5 years of experience. Focus on momentum and breakout strategies.',
    strategy: 'Price Action & OI Data Analysis',
    verifiedSince: 'Jan 2023',
    totalTrades: 1240,
    monthlyData: [
      { month: 'Jan', gain: 8.2 },
      { month: 'Feb', gain: 11.5 },
      { month: 'Mar', gain: -2.1 },
      { month: 'Apr', gain: 14.3 },
      { month: 'May', gain: 12.5 },
      { month: 'Jun', gain: 9.8 },
    ],
    status: 'approved'
  },
  {
    id: '2',
    name: 'Priya Patel',
    photoUrl: 'https://picsum.photos/200/200?random=2',
    category: TradingCategory.Swing,
    verificationLevel: VerificationLevel.Gold,
    trustScore: 94,
    broker: 'Angel One',
    monthlyGain: 8.4,
    winRate: 72,
    profitFactor: 3.1,
    avgRR: 2.5,
    bio: 'Swing trader focusing on mid-cap equities. I hold positions for 3-10 days based on technical patterns.',
    strategy: 'Trend Following & Moving Averages',
    verifiedSince: 'Mar 2023',
    totalTrades: 450,
    monthlyData: [
      { month: 'Jan', gain: 5.2 },
      { month: 'Feb', gain: 7.1 },
      { month: 'Mar', gain: 8.9 },
      { month: 'Apr', gain: 6.4 },
      { month: 'May', gain: 9.2 },
      { month: 'Jun', gain: 8.4 },
    ],
    status: 'approved'
  },
  {
    id: '3',
    name: 'Vikram Singh',
    photoUrl: 'https://picsum.photos/200/200?random=3',
    category: TradingCategory.Intraday,
    verificationLevel: VerificationLevel.Silver,
    trustScore: 88,
    broker: 'Fyers',
    monthlyGain: 18.2,
    winRate: 55,
    profitFactor: 1.8,
    avgRR: 1.5,
    bio: 'High frequency scalper in Nifty 50. Quick entries and exits based on order flow.',
    strategy: 'Scalping & Order Flow',
    verifiedSince: 'Jun 2023',
    totalTrades: 3400,
    monthlyData: [
      { month: 'Jan', gain: 15.2 },
      { month: 'Feb', gain: -4.5 },
      { month: 'Mar', gain: 22.1 },
      { month: 'Apr', gain: 18.5 },
      { month: 'May', gain: 14.2 },
      { month: 'Jun', gain: 18.2 },
    ],
    status: 'approved'
  },
   {
    id: '4',
    name: 'Anjali Gupta',
    photoUrl: 'https://picsum.photos/200/200?random=4',
    category: TradingCategory.FnO,
    verificationLevel: VerificationLevel.Gold,
    trustScore: 92,
    broker: 'Upstox',
    monthlyGain: 10.1,
    winRate: 65,
    profitFactor: 2.1,
    avgRR: 2.0,
    bio: 'Systematic option seller. Iron Condors and Strangles are my bread and butter.',
    strategy: 'Non-Directional Option Selling',
    verifiedSince: 'Feb 2023',
    totalTrades: 890,
    monthlyData: [
        { month: 'Jan', gain: 9.1 },
        { month: 'Feb', gain: 10.5 },
        { month: 'Mar', gain: 10.2 },
        { month: 'Apr', gain: 11.0 },
        { month: 'May', gain: 9.8 },
        { month: 'Jun', gain: 10.1 },
    ],
    status: 'approved'
  }
];
