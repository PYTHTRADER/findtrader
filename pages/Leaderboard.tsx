
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MOCK_TRADERS } from '../constants';
import { TradingCategory, VerificationLevel, TraderStatus } from '../types';
import { Search, Filter, ArrowUpRight, Trophy, CheckCircle2, Clock, XCircle } from 'lucide-react';

const Leaderboard: React.FC = () => {
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTraders = MOCK_TRADERS.filter(trader => {
    const matchesCategory = categoryFilter === 'All' || trader.category === categoryFilter;
    const matchesSearch = trader.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  }).sort((a, b) => b.trustScore - a.trustScore);

  const getStatusIcon = (status: TraderStatus) => {
    switch (status) {
      case 'approved': return <CheckCircle2 size={16} className="text-neon-green" />;
      case 'pending': return <Clock size={16} className="text-yellow-500" />;
      case 'rejected': return <XCircle size={16} className="text-red-500" />;
      default: return null;
    }
  };

  const getStatusStyle = (status: TraderStatus) => {
    switch (status) {
      case 'approved': return 'bg-neon-green/10 text-neon-green border-neon-green/30';
      case 'pending': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30';
      case 'rejected': return 'bg-red-500/10 text-red-500 border-red-500/30';
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500/30';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-12 text-center relative">
        <div className="inline-block p-3 rounded-full bg-neon-purple/10 mb-4 animate-pulse-neon">
          <Trophy className="h-8 w-8 text-neon-purple" />
        </div>
        <h1 className="text-5xl font-black text-gray-900 dark:text-white mb-6">Trader <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-neon-pink">Leaderboard</span></h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-medium">
          Ranked by Trust Score, Consistency, and Profitability. <br/>All stats are verified via <span className="text-neon-green font-bold">Broker API</span>.
        </p>
      </div>

      {/* Filters and Search - Enhanced UI */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-10 bg-[#0a0a0f]/50 backdrop-blur-md p-6 rounded-3xl border border-white/5 shadow-2xl relative overflow-visible">
        {/* Decorative subtle border top */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

        <div className="flex items-center space-x-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
          <button
            onClick={() => setCategoryFilter('All')}
            className={`px-6 py-3 rounded-2xl text-sm font-bold whitespace-nowrap transition-all uppercase tracking-wide border ${
              categoryFilter === 'All' 
                ? 'bg-neon-cyan text-black border-neon-cyan shadow-[0_0_15px_rgba(0,243,255,0.4)]' 
                : 'bg-white/5 text-gray-400 border-white/5 hover:bg-white/10 hover:text-white hover:border-white/10'
            }`}
          >
            All Traders
          </button>
          {Object.values(TradingCategory).map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-6 py-3 rounded-2xl text-sm font-bold whitespace-nowrap transition-all uppercase tracking-wide border ${
                categoryFilter === cat 
                  ? 'bg-neon-cyan text-black border-neon-cyan shadow-[0_0_15px_rgba(0,243,255,0.4)]' 
                  : 'bg-white/5 text-gray-400 border-white/5 hover:bg-white/10 hover:text-white hover:border-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-96 group z-10">
          {/* Professional Neon Background Glow Effect on Focus */}
          <div className="absolute -inset-[2px] bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-pink rounded-2xl blur-md opacity-0 group-focus-within:opacity-70 transition-opacity duration-500 will-change-transform"></div>
          
          <div className="relative bg-[#0c0c14] rounded-2xl flex items-center border border-white/10 group-focus-within:border-transparent transition-colors">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-500 group-focus-within:text-neon-cyan transition-colors duration-300" />
            </div>
            <input
              type="text"
              placeholder="Search trader..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-14 pr-6 py-4 rounded-2xl bg-transparent text-gray-300 focus:text-neon-cyan placeholder-gray-600 focus:ring-0 caret-neon-cyan outline-none transition-all duration-300 font-bold tracking-wide relative z-10"
            />
          </div>
        </div>
      </div>

      {/* Table/List */}
      <div className="bg-white dark:bg-[#0a0a0f] rounded-3xl shadow-xl border border-gray-200 dark:border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-white/5 border-b border-gray-200 dark:border-white/10">
                <th className="p-6 text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest w-20 text-center">Rank</th>
                <th className="p-6 text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">Trader Profile</th>
                <th className="p-6 text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest hidden md:table-cell">Status</th>
                <th className="p-6 text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest hidden md:table-cell">Category</th>
                <th className="p-6 text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest text-center">Trust Score</th>
                <th className="p-6 text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest text-center">Win Rate</th>
                <th className="p-6 text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest text-right">Gain (30d)</th>
                <th className="p-6 w-20"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {filteredTraders.map((trader, index) => (
                <tr key={trader.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors group">
                  <td className="p-6 text-center">
                    <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${
                      index < 3 ? 'bg-gradient-to-br from-neon-purple to-neon-pink text-white shadow-neon-purple' : 'text-gray-500 dark:text-gray-500 bg-gray-100 dark:bg-white/5'
                    }`}>
                      {index + 1}
                    </span>
                  </td>
                  <td className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                         <img src={trader.photoUrl} alt={trader.name} className="w-12 h-12 rounded-full object-cover border-2 border-gray-200 dark:border-white/10 group-hover:border-neon-cyan transition-colors" />
                         {trader.verificationLevel === 'API Verified' && (
                           <div className="absolute -bottom-1 -right-1 bg-neon-green rounded-full p-0.5 border-2 border-white dark:border-[#0a0a0f]">
                             <div className="w-2 h-2 bg-white rounded-full"></div>
                           </div>
                         )}
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 dark:text-white text-lg group-hover:text-neon-cyan transition-colors">{trader.name}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                            trader.verificationLevel === 'API Verified' ? 'border-neon-green/30 text-neon-green bg-neon-green/10' :
                            'border-yellow-500/30 text-yellow-500 bg-yellow-500/10'
                          }`}>
                            {trader.verificationLevel}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400 md:hidden">• {trader.monthlyGain}% Gain</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-6 hidden md:table-cell">
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg border ${getStatusStyle(trader.status)}`}>
                      {getStatusIcon(trader.status)}
                      <span className="text-xs font-bold uppercase tracking-wider">{trader.status}</span>
                    </div>
                  </td>
                  <td className="p-6 hidden md:table-cell">
                    <span className="text-sm font-semibold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-white/5 px-3 py-1 rounded-lg">
                      {trader.category}
                    </span>
                  </td>
                  <td className="p-6 text-center">
                    <div className="inline-block px-4 py-1.5 bg-neon-purple/10 text-neon-purple rounded-lg font-black text-lg shadow-[0_0_10px_rgba(188,19,254,0.1)]">
                      {trader.trustScore}
                    </div>
                  </td>
                  <td className="p-6 text-center font-bold text-gray-700 dark:text-gray-300">
                    {trader.winRate}%
                  </td>
                  <td className="p-6 text-right font-black text-neon-green text-lg text-glow">
                    +{trader.monthlyGain}%
                  </td>
                  <td className="p-6 text-right">
                    <Link to={`/trader/${trader.id}`} className="inline-flex items-center justify-center p-2.5 bg-gray-100 dark:bg-white/5 rounded-xl text-gray-400 hover:bg-neon-cyan hover:text-black transition-all shadow-sm hover:shadow-neon-cyan">
                      <ArrowUpRight className="h-5 w-5" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredTraders.length === 0 && (
            <div className="p-16 text-center">
              <p className="text-gray-500 dark:text-gray-400 text-lg">No traders found matching your criteria.</p>
              <button 
                onClick={() => {setCategoryFilter('All'); setSearchQuery('')}}
                className="mt-4 text-neon-cyan font-bold hover:underline"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
