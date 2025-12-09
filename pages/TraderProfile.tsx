import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MOCK_TRADERS } from '../constants';
import { ShieldCheck, Award, TrendingUp, DollarSign, Activity, Bot, Share2, Copy } from 'lucide-react';
import { BarChart as ReBarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from 'recharts';
import { analyzeTrader } from '../services/geminiService';

const TraderProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const trader = MOCK_TRADERS.find(t => t.id === id);
  const [activeTab, setActiveTab] = useState<'overview' | 'performance' | 'reviews'>('overview');
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAiAnalysis = async () => {
    if (!trader) return;
    setIsAnalyzing(true);
    const result = await analyzeTrader(trader);
    setAiAnalysis(result);
    setIsAnalyzing(false);
  };

  if (!trader) {
    return <div className="p-20 text-center text-white text-2xl">Trader not found</div>;
  }

  return (
    <div className="pb-20">
      {/* Profile Header Background */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-indigo-950 to-black">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
          <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-[#050507] to-transparent"></div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10">
        <div className="glass-card rounded-3xl p-6 md:p-10 shadow-2xl">
          <div className="flex flex-col md:flex-row items-start md:items-end gap-8 mb-10">
            <div className="relative">
               <div className="absolute -inset-1 bg-gradient-to-br from-neon-cyan to-neon-purple rounded-3xl blur opacity-75"></div>
               <img 
                 src={trader.photoUrl} 
                 alt={trader.name} 
                 className="relative w-36 h-36 md:w-48 md:h-48 rounded-3xl border-4 border-[#050507] shadow-xl object-cover"
               />
               <div className="absolute -bottom-3 -right-3 bg-black border border-white/10 p-2 rounded-xl shadow-lg flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${trader.verificationLevel === 'API Verified' ? 'bg-neon-green shadow-neon-green' : 'bg-yellow-500'}`}></div>
                  <span className="text-xs font-bold text-white uppercase tracking-wider">Live</span>
               </div>
            </div>
            
            <div className="flex-grow w-full">
              <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                <div>
                  <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-2">{trader.name}</h1>
                  <p className="text-xl text-gray-600 dark:text-gray-400 font-medium">{trader.category} Specialist <span className="mx-2 text-gray-700 dark:text-gray-600">|</span> <span className="text-neon-cyan">{trader.broker}</span></p>
                </div>
                <div className="flex gap-3">
                   <button className="p-3 bg-gray-100 dark:bg-white/5 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-white/10 hover:text-white transition-colors">
                     <Share2 size={20} />
                   </button>
                   <button className="px-6 py-3 bg-gradient-to-r from-neon-purple to-neon-pink text-white font-bold rounded-xl shadow-neon-purple hover:shadow-[0_0_20px_rgba(217,70,239,0.5)] transition-all uppercase tracking-wide text-sm">
                     Follow Trader
                   </button>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-4 mt-6">
                <span className={`px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider text-white shadow-lg border border-white/10 flex items-center gap-2 ${
                    trader.verificationLevel === 'API Verified' ? 'bg-gradient-to-r from-green-900/50 to-emerald-900/50 text-neon-green border-neon-green/30' : 'bg-yellow-900/20 text-yellow-500 border-yellow-500/30'
                  }`}>
                    {trader.verificationLevel === 'API Verified' && <ShieldCheck size={14} />}
                    {trader.verificationLevel}
                  </span>
                <div className="px-4 py-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-400 text-xs font-bold uppercase tracking-wider">
                  Verified Since: <span className="text-white ml-1">{trader.verifiedSince}</span>
                </div>
                 <div className="px-4 py-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-400 text-xs font-bold uppercase tracking-wider">
                  Trades: <span className="text-white ml-1">{trader.totalTrades}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12">
            {[
              { label: 'Win Rate', value: `${trader.winRate}%`, icon: Award, color: 'text-neon-cyan', bg: 'bg-cyan-900/10', border: 'border-cyan-500/20' },
              { label: 'Profit Factor', value: trader.profitFactor, icon: TrendingUp, color: 'text-neon-green', bg: 'bg-emerald-900/10', border: 'border-emerald-500/20' },
              { label: 'Monthly Gain', value: `+${trader.monthlyGain}%`, icon: DollarSign, color: 'text-neon-purple', bg: 'bg-purple-900/10', border: 'border-purple-500/20' },
              { label: 'Avg R:R', value: `1:${trader.avgRR}`, icon: Activity, color: 'text-neon-pink', bg: 'bg-pink-900/10', border: 'border-pink-500/20' },
            ].map((stat, i) => (
              <div key={i} className={`p-6 rounded-2xl border ${stat.border} ${stat.bg} backdrop-blur-sm relative overflow-hidden group hover:scale-105 transition-transform duration-300`}>
                <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-20 ${stat.bg.replace('/10', '/30')} blur-xl group-hover:scale-150 transition-transform duration-500`}></div>
                <div className="flex items-center gap-2 mb-3 text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider relative z-10">
                  <stat.icon size={14} className={stat.color} /> {stat.label}
                </div>
                <div className={`text-3xl font-black ${stat.color} relative z-10 drop-shadow-sm`}>{stat.value}</div>
              </div>
            ))}
          </div>

          {/* Content Tabs */}
          <div className="mb-8">
            <div className="flex space-x-8 border-b border-gray-200 dark:border-white/10">
              {['overview', 'performance', 'reviews'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`pb-4 px-2 font-bold text-sm transition-all uppercase tracking-widest ${
                    activeTab === tab
                      ? 'border-b-2 border-neon-cyan text-neon-cyan'
                      : 'border-b-2 border-transparent text-gray-500 hover:text-white'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="min-h-[300px] animate-fade-in">
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                  <div className="bg-gray-50 dark:bg-white/5 p-8 rounded-2xl border border-gray-200 dark:border-white/10">
                    <h3 className="text-xl font-black text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                       <span className="w-1 h-6 bg-neon-cyan rounded-full"></span>
                       About Trader
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed font-medium">{trader.bio}</p>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-white/5 p-8 rounded-2xl border border-gray-200 dark:border-white/10">
                    <h3 className="text-xl font-black text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                       <span className="w-1 h-6 bg-neon-purple rounded-full"></span>
                       Trading Edge
                    </h3>
                    <div className="relative">
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-neon-purple to-transparent rounded-full"></div>
                      <p className="pl-6 text-gray-600 dark:text-gray-300 italic text-lg">"{trader.strategy}"</p>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-1">
                   <div className="bg-gradient-to-br from-[#1c1c2e] to-[#0a0a0f] p-1 rounded-2xl shadow-2xl border border-white/10">
                      <div className="bg-[#0a0a0f] rounded-xl p-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-neon-cyan/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                        <div className="relative z-10">
                          <h3 className="text-lg font-black text-white mb-4 flex items-center gap-2">
                             <Bot className="text-neon-cyan" size={20} /> Gemini AI Analysis
                          </h3>
                          
                          {aiAnalysis ? (
                            <div className="space-y-4">
                              <p className="text-gray-300 text-sm leading-relaxed border-l-2 border-neon-cyan/30 pl-3">
                                {aiAnalysis}
                              </p>
                              <div className="pt-2">
                                <span className="text-[10px] text-gray-500 uppercase tracking-wider">Generated by Gemini 2.5 Flash</span>
                              </div>
                            </div>
                          ) : (
                            <div className="text-center py-6">
                              <p className="text-gray-500 text-sm mb-4">Unlock deep insights into {trader.name}'s trading patterns.</p>
                              <button 
                                onClick={handleAiAnalysis}
                                disabled={isAnalyzing}
                                className="w-full py-3 bg-neon-cyan/10 hover:bg-neon-cyan/20 border border-neon-cyan/50 text-neon-cyan font-bold rounded-lg transition-all text-sm uppercase tracking-wide flex justify-center items-center gap-2"
                              >
                                {isAnalyzing ? (
                                  <span className="animate-pulse">Analyzing...</span>
                                ) : (
                                  <>Generate Report <Bot size={16} /></>
                                )}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                   </div>
                </div>
              </div>
            )}

            {activeTab === 'performance' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center mb-6">
                   <h3 className="text-xl font-black text-gray-900 dark:text-white">Monthly Returns (2024)</h3>
                   <div className="flex items-center gap-2 text-sm text-gray-500">
                     <span className="w-3 h-3 bg-neon-green rounded-sm"></span> Profit
                     <span className="w-3 h-3 bg-red-500 rounded-sm ml-2"></span> Loss
                   </div>
                </div>
                
                <div className="h-[400px] w-full bg-gray-50 dark:bg-[#0c0c14] p-6 rounded-3xl border border-gray-200 dark:border-white/5 relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <ReBarChart data={trader.monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" opacity={0.3} />
                      <XAxis dataKey="month" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} tick={{fill: '#9ca3af', fontWeight: 600}} dy={10} />
                      <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}%`} tick={{fill: '#9ca3af', fontWeight: 600}} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#050507', border: '1px solid #333', borderRadius: '12px', color: '#fff', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.5)' }}
                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                      />
                      <Bar dataKey="gain" radius={[6, 6, 0, 0]} animationDuration={1500}>
                        {trader.monthlyData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={entry.gain >= 0 ? '#0aff60' : '#ef4444'} 
                            strokeWidth={0}
                            style={{ filter: entry.gain >= 0 ? 'drop-shadow(0 0 8px rgba(10, 255, 96, 0.3))' : '' }}
                          />
                        ))}
                      </Bar>
                    </ReBarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="py-20 text-center">
                <div className="inline-block p-6 rounded-full bg-gray-100 dark:bg-white/5 mb-4">
                  <Copy size={32} className="text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Community Reviews</h3>
                <p className="text-gray-500 mt-2">Verified reviews are coming in the next update.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TraderProfile;