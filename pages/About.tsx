import React from 'react';

const About: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 text-gray-800 dark:text-gray-200">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-900 dark:text-white">About FindTrader India</h1>
      
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4 text-indigo-600 dark:text-indigo-400">Our Mission</h2>
        <p className="leading-relaxed mb-4">
          FindTrader India was founded to solve a critical problem in the Indian trading community: <strong>Trust</strong>. 
          With the rise of "fake gurus" and manipulated screenshots, genuine talent often goes unnoticed. 
          We provide a transparent, data-backed platform where traders can prove their skills through verified P&L and broker API integrations.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4 text-indigo-600 dark:text-indigo-400">How Verification Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700">
            <h3 className="font-bold mb-2">1. API Integration</h3>
            <p className="text-sm">We connect directly to brokers like Zerodha, Angel One, and Fyers to fetch real-time trade data. This is tamper-proof.</p>
          </div>
          <div className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700">
             <h3 className="font-bold mb-2">2. P&L Analysis</h3>
            <p className="text-sm">For manual verification, our team analyzes PDF statements for digital signatures and inconsistencies.</p>
          </div>
        </div>
      </section>

      <div className="border-t border-gray-200 dark:border-slate-700 my-12"></div>

      <section className="bg-yellow-50 dark:bg-yellow-900/10 p-8 rounded-2xl border border-yellow-200 dark:border-yellow-900/30">
        <h2 className="text-2xl font-bold mb-4 text-yellow-800 dark:text-yellow-500 flex items-center gap-2">
          IMPORTANT DISCLAIMER
        </h2>
        <div className="space-y-4 text-sm text-yellow-900 dark:text-yellow-100/80">
          <p>
            <strong>Not Investment Advice:</strong> FindTrader India is a technology platform for analytics and community ranking. We are not a SEBI registered investment advisor (RIA) or research analyst (RA). The information displayed on this website is for educational and informational purposes only.
          </p>
          <p>
            <strong>Risk Warning:</strong> Trading in financial markets (Stocks, Options, Futures, Forex) involves a high degree of risk and may result in the loss of your entire capital. Past performance of any trader listed on this leaderboard is not indicative of future results.
          </p>
          <p>
            <strong>No Solicitations:</strong> We do not solicit investments or handle user funds. We do not offer tips, calls, or paid advisory services. Any interaction between users is at their own discretion and risk.
          </p>
          <p>
            <strong>SEBI Compliance:</strong> We adhere to all applicable laws and regulations in India. We encourage all users to consult with a SEBI registered financial advisor before making any investment decisions.
          </p>
        </div>
      </section>
    </div>
  );
};

export default About;