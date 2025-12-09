import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, TrendingUp, Shield, Users, Award, ShieldCheck, Zap, Loader2 } from 'lucide-react';
import { MOCK_TRADERS } from '../constants';
import { motion } from 'framer-motion';
import Spline from '@splinetool/react-spline';

const Home: React.FC = () => {
  const topTraders = MOCK_TRADERS.slice(0, 3);
  const [splineLoaded, setSplineLoaded] = useState(false);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative pt-24 pb-32 md:pt-40 md:pb-48 overflow-hidden">
        {/* Background with Spline 3D Scene */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 bg-[#020617]">
          {/* Loading State */}
          {!splineLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="w-10 h-10 text-neon-cyan animate-spin" />
            </div>
          )}
          
          <Spline 
            scene="https://prod.spline.design/bUYIkx1gwClkodXI/scene.splinecode"
            onLoad={() => setSplineLoaded(true)}
            style={{ 
              width: '100%', 
              height: '100%', 
              opacity: splineLoaded ? 1 : 0, 
              transition: 'opacity 1s ease-in-out' 
            }}
          />
          
          {/* Ambient Overlays to ensure text readability over 3D scene */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/40 via-transparent to-[#050507] pointer-events-none"></div>
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay pointer-events-none"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 pointer-events-none">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="pointer-events-auto"
          >
            <div className="inline-flex items-center space-x-2 py-1.5 px-4 rounded-full bg-blue-900/30 border border-cyan-500/30 backdrop-blur-md mb-8 shadow-[0_0_15px_rgba(0,243,255,0.3)]">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
              <span className="text-cyan-400 text-sm font-bold tracking-wide uppercase">#1 Verified Trading Platform</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white mb-8 leading-tight drop-shadow-2xl">
              VERIFY YOUR <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 text-glow filter drop-shadow-[0_0_10px_rgba(0,243,255,0.5)]">EDGE</span>. <br />
              JOIN THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 text-glow">ELITE</span>.
            </h1>
            
            <p className="text-xl md:text-2xl text-blue-100/80 max-w-3xl mx-auto mb-12 font-medium leading-relaxed drop-shadow-lg">
              FindTrader India connects <span className="text-white font-bold border-b-2 border-cyan-500">proven traders</span> with capital and community. 
              Get verified, climb the ranks, and trade with absolute authority.
            </p>
            
            <div className="flex flex-col items-center">
              <div className="flex flex-col sm:flex-row justify-center gap-6">
                <Link to="/leaderboard">
                  <button className="relative w-full sm:w-auto px-10 py-5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black text-lg rounded-xl shadow-[0_0_20px_rgba(0,243,255,0.4)] hover:shadow-[0_0_40px_rgba(0,243,255,0.6)] transition-all transform hover:-translate-y-1 uppercase tracking-wider group overflow-hidden border border-cyan-400/50">
                    <span className="relative z-10 flex items-center justify-center">
                      View Leaderboard <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                  </button>
                </Link>
                <Link to="/submit">
                  <button className="w-full sm:w-auto px-10 py-5 bg-blue-950/50 text-white border-2 border-blue-500/30 hover:border-cyan-400 hover:text-cyan-400 font-black text-lg rounded-xl shadow-lg hover:shadow-[0_0_20px_rgba(0,243,255,0.2)] transition-all uppercase tracking-wider backdrop-blur-sm">
                    Get Verified
                  </button>
                </Link>
              </div>
              
              <div className="mt-8">
                <p className="text-neon-cyan/80 text-xs font-medium tracking-widest drop-shadow-md">Developed by momin.analyst</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section - Premium Glass */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 p-8 rounded-3xl glass-card shadow-2xl bg-[#0a0a0f]/80 backdrop-blur-xl border border-white/10">
          {[
            { label: 'Verified Traders', value: '2,500+', icon: Users, color: 'text-neon-cyan' },
            { label: 'Total Votes', value: '150k+', icon: CheckCircle, color: 'text-neon-purple' },
            { label: 'API Verified', value: '99.9%', icon: Shield, color: 'text-neon-green' },
            { label: 'Community Trust', value: '4.9/5', icon: Award, color: 'text-neon-pink' },
          ].map((stat, idx) => (
            <div key={idx} className="text-center group p-4 rounded-2xl hover:bg-white/5 transition-colors">
              <div className={`mx-auto mb-4 w-16 h-16 rounded-2xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 flex items-center justify-center ${stat.color} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon size={32} />
              </div>
              <div className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-2">{stat.value}</div>
              <div className="text-xs md:text-sm font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 group-hover:text-white transition-colors">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Top Traders Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-3">Top <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-green to-emerald-500">Performers</span></h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 font-medium">Traders dominating the markets this month.</p>
          </div>
          <Link to="/leaderboard" className="hidden md:flex items-center text-neon-cyan font-bold uppercase tracking-wider hover:text-white transition-colors group">
            View All <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {topTraders.map((trader, index) => (
            <motion.div variants={item} key={trader.id}>
              <Link to={`/trader/${trader.id}`} className="block group">
                <div className="relative bg-white dark:bg-[#0a0a0f] rounded-3xl overflow-hidden border border-gray-200 dark:border-white/10 transition-all duration-300 hover:border-neon-cyan/50 hover:shadow-neon-cyan group-hover:-translate-y-2">
                  
                  {/* Neon Glow Effect on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/0 via-neon-cyan/0 to-neon-purple/0 group-hover:from-neon-cyan/5 group-hover:to-neon-purple/5 transition-all duration-500"></div>

                  <div className="absolute top-4 right-4 z-10">
                     <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider text-white shadow-lg backdrop-blur-md border border-white/20 ${
                        trader.verificationLevel === 'API Verified' ? 'bg-gradient-to-r from-neon-green to-emerald-600' :
                        trader.verificationLevel === 'Gold' ? 'bg-gradient-to-r from-yellow-400 to-orange-500' :
                        'bg-gray-500'
                      }`}>
                        {trader.verificationLevel}
                      </span>
                  </div>

                  <div className="p-8 relative z-10">
                    <div className="flex items-center space-x-5 mb-8">
                      <div className="relative">
                        <div className="absolute -inset-1 bg-gradient-to-r from-neon-cyan to-neon-purple rounded-full blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
                        <img 
                          src={trader.photoUrl} 
                          alt={trader.name} 
                          className="relative w-20 h-20 rounded-full object-cover border-4 border-gray-100 dark:border-[#1c1c2e]"
                        />
                        <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-black border-2 border-neon-cyan text-neon-cyan rounded-full flex items-center justify-center text-sm font-bold shadow-lg">
                          #{index + 1}
                        </div>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-neon-cyan transition-colors">{trader.name}</h3>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">{trader.category} Trader</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-gray-50 dark:bg-white/5 p-4 rounded-2xl border border-transparent group-hover:border-neon-green/30 transition-colors">
                        <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">Monthly Gain</p>
                        <p className="text-2xl font-black text-neon-green">+{trader.monthlyGain}%</p>
                      </div>
                      <div className="bg-gray-50 dark:bg-white/5 p-4 rounded-2xl border border-transparent group-hover:border-neon-purple/30 transition-colors">
                        <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">Trust Score</p>
                        <p className="text-2xl font-black text-neon-purple">{trader.trustScore}</p>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400 pt-6 border-t border-gray-100 dark:border-white/10">
                      <span className="font-semibold">{trader.broker}</span>
                      <span className="flex items-center text-neon-cyan font-bold uppercase text-xs tracking-wider group-hover:translate-x-2 transition-transform">
                        View Profile <ArrowRight className="ml-1 w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
        
        <div className="mt-12 text-center md:hidden">
           <Link to="/leaderboard" className="inline-flex items-center justify-center w-full px-6 py-4 bg-gray-900 dark:bg-white/10 text-white font-bold rounded-xl">
            View All Traders <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-white dark:bg-[#0a0a0f] py-24 border-y border-gray-200 dark:border-white/5 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neon-purple via-neon-cyan to-neon-green"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <span className="text-neon-purple font-bold tracking-widest uppercase text-sm mb-4 block">Platform Features</span>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-16">Why Traders Choose <span className="text-neon-cyan">FindTrader</span></h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { title: 'Transparent Verification', desc: 'Direct broker API integration ensures every trade is real. No photoshop, just facts.', icon: ShieldCheck, color: 'text-neon-cyan', glow: 'shadow-neon-cyan' },
              { title: 'Advanced Analytics', desc: 'Deep dive into performance metrics like Profit Factor, Sharpe Ratio, and Drawdown.', icon: TrendingUp, color: 'text-neon-purple', glow: 'shadow-neon-purple' },
              { title: 'Community Trust', desc: 'Built by traders, for traders. Our reputation system filters out the noise.', icon: Users, color: 'text-neon-pink', glow: 'shadow-neon-pink' }
            ].map((feature, i) => (
              <div key={i} className="flex flex-col items-center group">
                <div className={`w-20 h-20 bg-gray-100 dark:bg-[#12121a] rounded-3xl flex items-center justify-center ${feature.color} mb-8 transform rotate-6 group-hover:rotate-12 transition-all duration-300 border border-gray-200 dark:border-white/10 group-hover:border-${feature.color.replace('text-', '')}/50 group-hover:${feature.glow}`}>
                  <feature.icon size={40} />
                </div>
                <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-4">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 max-w-xs mx-auto leading-relaxed font-medium">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;