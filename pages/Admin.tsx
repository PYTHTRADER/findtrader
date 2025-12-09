
import React, { useState, useEffect } from 'react';
import { Users, FileText, AlertTriangle, CheckCircle, MoreVertical, Activity, XCircle, Clock, Search } from 'lucide-react';
import { MOCK_TRADERS } from '../constants';
import { Trader, TraderStatus, VerificationLevel, TradingCategory } from '../types';

const Admin: React.FC = () => {
  // Simulate fetching data by combining Mock Data with some "Pending" examples
  const [traders, setTraders] = useState<Trader[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // In a real app, this would be an API call
    const initialData: Trader[] = [
      ...MOCK_TRADERS,
      {
        id: '99',
        name: 'Amit Verma',
        photoUrl: 'https://picsum.photos/200/200?random=99',
        category: TradingCategory.Intraday,
        verificationLevel: VerificationLevel.Bronze,
        trustScore: 50,
        broker: 'Groww',
        monthlyGain: 5.5,
        winRate: 48,
        profitFactor: 1.2,
        avgRR: 1.1,
        bio: 'Aspiring trader.',
        strategy: 'Breakout',
        verifiedSince: 'Pending',
        totalTrades: 50,
        monthlyData: [],
        status: 'pending' // Pending example
      }
    ];
    setTraders(initialData);
  }, []);

  const updateStatus = (id: string, newStatus: TraderStatus) => {
    setTraders(prev => prev.map(t => 
      t.id === id ? { ...t, status: newStatus } : t
    ));
  };

  const filteredTraders = traders.filter(trader => 
    trader.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    trader.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusStyle = (status: TraderStatus) => {
    switch (status) {
      case 'approved': return 'bg-neon-green/10 text-neon-green border-neon-green/30';
      case 'pending': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30';
      case 'rejected': return 'bg-red-500/10 text-red-500 border-red-500/30';
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500/30';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-2">Admin Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium">Welcome back, Administrator.</p>
        </div>
        <div className="flex gap-4">
           <button className="px-6 py-2 bg-[#0a0a0f] border border-white/10 rounded-xl text-white font-bold text-sm hover:bg-white/5 transition-colors">Settings</button>
           <button className="px-6 py-2 bg-neon-cyan text-black font-bold text-sm rounded-xl shadow-neon-cyan hover:bg-white transition-colors">Download Report</button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        {[
          { label: 'Total Users', value: '12,345', trend: '+12%', color: 'text-neon-cyan', bg: 'bg-cyan-900/10', border: 'border-cyan-500/20' },
          { label: 'Pending Reviews', value: traders.filter(t => t.status === 'pending').length.toString(), trend: 'Active', color: 'text-yellow-400', bg: 'bg-yellow-900/10', border: 'border-yellow-500/20' },
          { label: 'Verified Traders', value: traders.filter(t => t.status === 'approved').length.toString(), trend: '+8%', color: 'text-neon-green', bg: 'bg-emerald-900/10', border: 'border-emerald-500/20' },
          { label: 'Reported Issues', value: '12', trend: '-2', color: 'text-red-500', bg: 'bg-red-900/10', border: 'border-red-500/20' },
        ].map((stat, i) => (
          <div key={i} className={`p-6 rounded-3xl border ${stat.border} ${stat.bg} backdrop-blur-sm shadow-lg`}>
             <div className="flex justify-between items-start mb-4">
               <p className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">{stat.label}</p>
               <Activity size={16} className={stat.color} />
             </div>
             <div className="flex justify-between items-end">
               <h3 className="text-3xl font-black text-gray-900 dark:text-white">{stat.value}</h3>
               <span className={`text-sm font-bold ${
                 stat.trend.startsWith('+') ? 'text-neon-green' : 'text-gray-400'
               }`}>{stat.trend}</span>
             </div>
          </div>
        ))}
      </div>

      {/* Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Manage Traders Table */}
        <div className="lg:col-span-2 bg-white dark:bg-[#0a0a0f] rounded-3xl border border-gray-200 dark:border-white/10 shadow-xl overflow-hidden">
          <div className="p-8 border-b border-gray-200 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 bg-gray-50/50 dark:bg-white/[0.02]">
            <h2 className="text-xl font-black text-gray-900 dark:text-white">Manage Traders</h2>
            
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="relative flex-grow md:flex-grow-0 md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <input 
                  type="text" 
                  placeholder="Search trader or status..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-[#050507] text-sm text-gray-900 dark:text-white focus:ring-1 focus:ring-neon-cyan outline-none transition-all placeholder-gray-500"
                />
              </div>
              <div className="flex gap-2 shrink-0">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500 px-2 py-1 bg-gray-100 dark:bg-white/5 rounded">Total: {filteredTraders.length}</span>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 dark:bg-white/5 border-b border-gray-200 dark:border-white/10">
                  <th className="p-4 text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest pl-8">Trader</th>
                  <th className="p-4 text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">Status</th>
                  <th className="p-4 text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest text-right pr-8">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                {filteredTraders.length > 0 ? (
                  filteredTraders.map((trader) => (
                    <tr key={trader.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
                      <td className="p-4 pl-8">
                         <div className="flex items-center space-x-3">
                           <img src={trader.photoUrl} alt="" className="w-10 h-10 rounded-full object-cover" />
                           <div>
                             <p className="font-bold text-gray-900 dark:text-white text-sm">{trader.name}</p>
                             <p className="text-xs text-gray-500">{trader.category} • {trader.broker}</p>
                           </div>
                         </div>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider border ${getStatusStyle(trader.status)}`}>
                          {trader.status === 'approved' && <CheckCircle size={12} />}
                          {trader.status === 'pending' && <Clock size={12} />}
                          {trader.status === 'rejected' && <XCircle size={12} />}
                          {trader.status}
                        </span>
                      </td>
                      <td className="p-4 pr-8 text-right">
                        <div className="flex justify-end gap-2">
                          {trader.status !== 'approved' && (
                            <button 
                              onClick={() => updateStatus(trader.id, 'approved')}
                              className="p-2 bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white rounded-lg transition-all"
                              title="Approve"
                            >
                              <CheckCircle size={16} />
                            </button>
                          )}
                          {trader.status !== 'rejected' && (
                            <button 
                              onClick={() => updateStatus(trader.id, 'rejected')}
                              className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-all"
                              title="Reject"
                            >
                              <XCircle size={16} />
                            </button>
                          )}
                          {trader.status !== 'pending' && (
                            <button 
                               onClick={() => updateStatus(trader.id, 'pending')}
                               className="p-2 bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500 hover:text-white rounded-lg transition-all"
                               title="Set Pending"
                            >
                              <Clock size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="p-8 text-center text-gray-500 dark:text-gray-400">
                      No traders found matching "{searchQuery}"
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-[#0a0a0f] rounded-3xl border border-gray-200 dark:border-white/10 shadow-xl p-8 h-fit">
           <h2 className="text-xl font-black text-gray-900 dark:text-white mb-8">Platform Actions</h2>
           <div className="space-y-4">
             <button className="w-full flex items-center justify-between p-5 rounded-2xl border border-gray-200 dark:border-white/10 hover:border-neon-cyan/50 hover:bg-neon-cyan/5 transition-all group">
               <span className="text-sm font-bold text-gray-700 dark:text-gray-200 group-hover:text-neon-cyan">Manage Badges</span>
               <MoreVertical size={16} className="text-gray-400 group-hover:text-neon-cyan" />
             </button>
             <button className="w-full flex items-center justify-between p-5 rounded-2xl border border-gray-200 dark:border-white/10 hover:border-neon-purple/50 hover:bg-neon-purple/5 transition-all group">
               <span className="text-sm font-bold text-gray-700 dark:text-gray-200 group-hover:text-neon-purple">Export User Data</span>
               <MoreVertical size={16} className="text-gray-400 group-hover:text-neon-purple" />
             </button>
             <button className="w-full flex items-center justify-between p-5 rounded-2xl border border-gray-200 dark:border-white/10 hover:border-neon-pink/50 hover:bg-neon-pink/5 transition-all group">
               <span className="text-sm font-bold text-gray-700 dark:text-gray-200 group-hover:text-neon-pink">System Settings</span>
               <MoreVertical size={16} className="text-gray-400 group-hover:text-neon-pink" />
             </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
