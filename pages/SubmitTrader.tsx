import React, { useState } from 'react';
import { ShieldCheck, Upload, AlertCircle, Check, Loader2, FileText, Link as LinkIcon, Lock, Key } from 'lucide-react';
import { useAuth } from '../components/AuthContext';
import { useNavigate } from 'react-router-dom';
import { TradingCategory } from '../types';
import { submitTraderSecurely } from '../services/submissionService';

const SubmitTrader: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    city: '',
    mobile: '',
    category: TradingCategory.Intraday,
    broker: 'Zerodha',
    strategy: '',
    apiKey: '' // Added apiKey for secure submission
  });
  
  const [verificationMethod, setVerificationMethod] = useState<'upload' | 'api'>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [apiConnected, setApiConnected] = useState(false);
  const [connectingApi, setConnectingApi] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const simulateApiConnect = (brokerName: string) => {
    setConnectingApi(brokerName);
    setTimeout(() => {
      setConnectingApi(null);
      setApiConnected(true);
    }, 1500);
  };

  const handleSubmit = async () => {
    if (!currentUser) {
      setMessage({ type: 'error', text: 'You must be logged in to submit.' });
      return;
    }

    // Validation
    if (!formData.name || !formData.email || !formData.strategy) {
      setMessage({ type: 'error', text: 'Please fill in all personal and trading information.' });
      return;
    }

    if (verificationMethod === 'upload' && !file) {
      setMessage({ type: 'error', text: 'Please upload a P&L document.' });
      return;
    }

    if (verificationMethod === 'api' && !apiConnected) {
      setMessage({ type: 'error', text: 'Please connect your broker API.' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      // Prepare file: if API method, create a dummy placeholder file to satisfy backend multipart requirement
      let submissionFile = file;
      if (verificationMethod === 'api' && !submissionFile) {
        const blob = new Blob(["Verification via Broker API Connection"], { type: 'text/plain' });
        submissionFile = new File([blob], "api_verification_placeholder.txt", { type: 'text/plain' });
      }

      if (!submissionFile) {
         throw new Error("File is missing.");
      }

      await submitTraderSecurely({
        fullName: formData.name,
        email: formData.email,
        city: formData.city,
        mobile: formData.mobile,
        category: formData.category,
        broker: formData.broker,
        strategy: formData.strategy,
        apiKey: verificationMethod === 'api' ? formData.apiKey : undefined,
        file: submissionFile
      });

      setMessage({ type: 'success', text: 'Submission received — pending verification.' });
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        city: '',
        mobile: '',
        category: TradingCategory.Intraday,
        broker: 'Zerodha',
        strategy: '',
        apiKey: ''
      });
      setFile(null);
      setApiConnected(false);

      // Redirect after delay
      setTimeout(() => navigate('/leaderboard'), 3000);

    } catch (error: any) {
      console.error("Error submitting:", error);
      setMessage({ type: 'error', text: `Submission failed: ${error.message}` });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-6">Get <span className="text-neon-cyan text-glow">Verified</span></h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Join the elite list of verified traders. Connect your broker API or upload P&L statements to earn the badge.
        </p>
      </div>

      {message && (
        <div className={`max-w-4xl mx-auto mb-8 p-4 rounded-xl font-bold text-center ${message.type === 'success' ? 'bg-green-500/20 text-green-500 border border-green-500/50' : 'bg-red-500/20 text-red-500 border border-red-500/50'}`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          
          {/* Section 1 */}
          <div className="glass-card p-8 rounded-3xl">
            <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-8 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-neon-cyan/20 text-neon-cyan text-sm border border-neon-cyan/50">1</span>
              Personal Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { label: 'Full Name', name: 'name', ph: 'John Doe' },
                { label: 'Email', name: 'email', ph: 'john@example.com', type: 'email' },
                { label: 'City', name: 'city', ph: 'Mumbai' },
                { label: 'Mobile', name: 'mobile', ph: '+91 98765 43210' }
              ].map((field, i) => (
                <div key={i}>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2 ml-1">{field.label}</label>
                  <input 
                    type={field.type || 'text'} 
                    name={field.name}
                    value={(formData as any)[field.name]}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#0a0a0f] text-gray-900 dark:text-white p-4 focus:ring-2 focus:ring-neon-purple focus:border-transparent outline-none transition-all placeholder-gray-500 dark:placeholder-gray-700 font-medium" 
                    placeholder={field.ph} 
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Section 2 */}
          <div className="glass-card p-8 rounded-3xl">
            <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-8 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-neon-purple/20 text-neon-purple text-sm border border-neon-purple/50">2</span>
              Trading Profile
            </h2>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2 ml-1">Primary Category</label>
                  <div className="relative">
                    <select 
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#0a0a0f] text-gray-900 dark:text-white p-4 appearance-none focus:ring-2 focus:ring-neon-purple outline-none font-medium"
                    >
                      {Object.values(TradingCategory).map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">▼</div>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2 ml-1">Broker</label>
                  <div className="relative">
                     <select 
                      name="broker"
                      value={formData.broker}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#0a0a0f] text-gray-900 dark:text-white p-4 appearance-none focus:ring-2 focus:ring-neon-purple outline-none font-medium"
                    >
                      <option>Zerodha</option>
                      <option>Angel One</option>
                      <option>Upstox</option>
                      <option>Fyers</option>
                      <option>Groww</option>
                      <option>Dhan</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">▼</div>
                  </div>
                </div>
              </div>
              <div>
                 <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2 ml-1">Trading Strategy Description</label>
                 <textarea 
                  name="strategy"
                  value={formData.strategy}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#0a0a0f] text-gray-900 dark:text-white p-4 focus:ring-2 focus:ring-neon-purple outline-none transition-all placeholder-gray-500 dark:placeholder-gray-700 font-medium" 
                  rows={4} 
                  placeholder="Describe your edge, risk management, and setup..."
                ></textarea>
              </div>
            </div>
          </div>

          {/* Section 3: Verification */}
          <div className="glass-card p-8 rounded-3xl border border-neon-cyan/20 shadow-[0_0_30px_rgba(0,243,255,0.05)]">
            <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-neon-green/20 text-neon-green text-sm border border-neon-green/50">3</span>
              Verification Proof
            </h2>
            
            {/* Method Toggle */}
            <div className="flex bg-gray-800/50 p-1 rounded-xl mb-8 border border-white/5">
              <button 
                onClick={() => setVerificationMethod('upload')}
                className={`flex-1 py-3 px-4 rounded-lg text-sm font-bold uppercase tracking-wide transition-all ${
                  verificationMethod === 'upload' 
                  ? 'bg-gray-700 text-white shadow-lg' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                Document Upload
              </button>
              <button 
                 onClick={() => setVerificationMethod('api')}
                 className={`flex-1 py-3 px-4 rounded-lg text-sm font-bold uppercase tracking-wide transition-all flex items-center justify-center gap-2 ${
                  verificationMethod === 'api'
                  ? 'bg-gradient-to-r from-neon-green/20 to-emerald-900/40 text-neon-green border border-neon-green/20 shadow-lg'
                  : 'text-gray-400 hover:text-neon-green hover:bg-neon-green/5'
                }`}
              >
                <LinkIcon size={14} /> Connect Broker API
              </button>
            </div>

            {verificationMethod === 'upload' ? (
              // Document Upload UI
              <div className="animate-fade-in">
                <div className="relative group">
                    <input 
                        type="file" 
                        id="file-upload" 
                        className="hidden" 
                        accept=".pdf,.png,.jpg,.jpeg" 
                        onChange={handleFileChange} 
                    />
                    <label 
                        htmlFor="file-upload"
                        className={`block border-2 border-dashed rounded-3xl p-10 text-center transition-all cursor-pointer relative overflow-hidden ${
                            file 
                            ? 'border-neon-cyan/50 bg-neon-cyan/5' 
                            : 'border-gray-700 hover:border-neon-cyan/50 hover:bg-white/5'
                        }`}
                    >
                        <div className="absolute inset-0 bg-gradient-to-tr from-neon-cyan/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                        <div className={`w-20 h-20 mx-auto rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 shadow-lg ${
                            file 
                            ? 'bg-gradient-to-br from-neon-cyan to-blue-600 text-white scale-100 shadow-neon-cyan/50' 
                            : 'bg-[#12121a] text-gray-400 group-hover:text-neon-cyan group-hover:scale-110 border border-white/10'
                        }`}>
                            {file ? <Check strokeWidth={4} className="h-8 w-8" /> : <Upload className="h-8 w-8" />}
                        </div>

                        {file ? (
                            <div className="animate-fade-in relative z-10">
                                <p className="text-white font-bold text-lg mb-2">Upload Complete</p>
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-black/40 border border-white/10 backdrop-blur-md">
                                    <FileText size={14} className="text-neon-cyan" />
                                    <span className="text-sm font-mono text-gray-300 truncate max-w-[200px]">{file.name}</span>
                                </div>
                                <p className="mt-4 text-xs text-neon-cyan font-bold uppercase tracking-widest opacity-80 group-hover:opacity-100 transition-opacity">
                                    Click to change
                                </p>
                            </div>
                        ) : (
                            <div className="relative z-10">
                                <p className="text-xl font-black text-white mb-2 tracking-tight group-hover:text-neon-cyan transition-colors">
                                    Upload Verified P&L
                                </p>
                                <p className="text-gray-500 font-medium mb-4">Support for PDF, JPG, PNG</p>
                            </div>
                        )}
                        
                        <p className="text-xs text-gray-600 mt-6 font-bold uppercase tracking-wide">Maximum file size 10MB</p>
                    </label>
                </div>
                
                <div className="mt-6 flex items-start gap-3 text-sm text-yellow-500 bg-yellow-500/10 p-4 rounded-xl border border-yellow-500/20">
                   <AlertCircle size={20} className="mt-0.5 flex-shrink-0" />
                   <p className="font-medium">We strictly check for manipulated documents. Uploading fake P&L will result in a <span className="underline font-bold">permanent ban</span>.</p>
                </div>
              </div>
            ) : (
              // API Connection UI
              <div className="animate-fade-in space-y-6">
                <div className="bg-gradient-to-br from-[#0c0c14] to-black rounded-2xl p-6 border border-white/10">
                  <div className="flex items-center justify-between mb-4">
                     <h3 className="text-white font-bold text-lg flex items-center gap-2">
                       <Lock size={16} className="text-neon-green" /> Secure Connection
                     </h3>
                     <span className="text-xs text-gray-500 uppercase tracking-wider bg-white/5 px-2 py-1 rounded">Read-only Access</span>
                  </div>
                  <p className="text-gray-400 text-sm mb-6">Select your broker to securely connect your trading account. We only fetch trade history for verification purposes.</p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {['Zerodha', 'Angel One', 'Upstox', 'Dhan'].map((broker) => (
                      <button 
                        key={broker}
                        onClick={() => simulateApiConnect(broker)}
                        disabled={apiConnected || connectingApi !== null}
                        className={`p-4 rounded-xl border transition-all text-left relative overflow-hidden group ${
                           apiConnected && connectingApi !== broker ? 'opacity-50' : ''
                        } ${
                          apiConnected && connectingApi === broker
                            ? 'bg-neon-green/10 border-neon-green text-neon-green'
                            : 'bg-white/5 border-white/10 hover:border-neon-cyan/50 hover:bg-white/10 text-white'
                        }`}
                      >
                         <div className="flex justify-between items-center relative z-10">
                            <span className="font-bold">{broker}</span>
                            {connectingApi === broker && <Loader2 className="animate-spin h-5 w-5 text-neon-cyan" />}
                            {apiConnected && connectingApi === broker && <Check className="h-5 w-5" />}
                         </div>
                      </button>
                    ))}
                  </div>

                  {apiConnected && (
                    <div className="mt-6 animate-fade-in space-y-4">
                        <div className="p-4 bg-neon-green/10 border border-neon-green/20 rounded-xl flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-neon-green/20 flex items-center justify-center text-neon-green">
                                <ShieldCheck size={20} />
                            </div>
                            <div>
                                <p className="text-white font-bold text-sm">Broker Connected</p>
                                <p className="text-xs text-neon-green/80">Please provide your API Key below for server-side verification.</p>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2 ml-1">
                                API Key (Optional / For Encryption Test)
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Key className="h-4 w-4 text-neon-green" />
                                </div>
                                <input 
                                    type="text" 
                                    name="apiKey"
                                    value={formData.apiKey}
                                    onChange={handleInputChange}
                                    className="w-full rounded-xl border border-neon-green/30 bg-[#0a0a0f] text-white pl-10 p-4 focus:ring-1 focus:ring-neon-green focus:border-neon-green outline-none font-mono text-sm placeholder-gray-600"
                                    placeholder="Enter API Key to encrypt..."
                                />
                            </div>
                            <p className="text-[10px] text-gray-500 mt-2">
                                Note: This key will be encrypted server-side using Google Cloud KMS and never stored in plain text.
                            </p>
                        </div>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            <button 
              onClick={handleSubmit}
              disabled={loading || (verificationMethod === 'api' && !apiConnected)}
              className="w-full mt-8 bg-gradient-to-r from-neon-cyan to-blue-600 hover:from-neon-cyan hover:to-blue-500 text-white font-black py-4 px-6 rounded-xl transition-all shadow-neon-cyan hover:shadow-[0_0_30px_rgba(0,243,255,0.4)] text-lg uppercase tracking-widest transform hover:-translate-y-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading && <Loader2 className="animate-spin h-5 w-5" />}
              {loading ? 'Processing Securely...' : 'Submit Application'}
            </button>
            
            <div className="mt-4 flex items-center gap-2 justify-center">
                 <Lock size={12} className="text-gray-500" />
                 <span className="text-xs text-gray-500 font-medium">End-to-End Encrypted Submission</span>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
           <div className="bg-gradient-to-br from-blue-900 to-[#0a0a0f] rounded-3xl p-8 text-white shadow-2xl border border-white/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-neon-purple/20 rounded-full blur-3xl -mr-10 -mt-10"></div>
              <h3 className="font-black text-2xl mb-6 relative z-10">Why Verify?</h3>
              <ul className="space-y-4 relative z-10">
                {[
                  'Get the "Verified" Badge',
                  'Rank on the Leaderboard',
                  'Access Capital (Beta)',
                  'Build Public Trust'
                ].map((item, i) => (
                  <li key={i} className="flex gap-3 items-center text-gray-200 font-medium">
                    <div className="w-6 h-6 rounded-full bg-neon-green/20 flex items-center justify-center text-neon-green border border-neon-green/30">
                      <Check size={14} strokeWidth={3} />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
           </div>
           
           <div className="bg-white dark:bg-[#0a0a0f] rounded-3xl p-8 border border-gray-200 dark:border-white/10">
             <h3 className="font-black text-gray-900 dark:text-white text-xl mb-6">Verification Levels</h3>
             <div className="space-y-6 relative">
               {/* Connector Line */}
               <div className="absolute left-[15px] top-2 bottom-4 w-0.5 bg-gray-200 dark:bg-white/10"></div>
               
               {[
                 { level: 'Bronze', desc: 'Email & Phone Verified', color: 'bg-orange-400' },
                 { level: 'Silver', desc: 'KYC + 3 Months P&L PDF', color: 'bg-gray-400' },
                 { level: 'Gold', desc: '6 Months Verified P&L', color: 'bg-yellow-400' },
                 { level: 'API Verified', desc: 'Real-time Broker Link', color: 'bg-neon-green shadow-neon-green' },
               ].map((l, i) => (
                 <div key={i} className="flex items-center gap-4 relative z-10">
                   <div className={`w-8 h-8 rounded-full ${l.color} border-4 border-white dark:border-[#0a0a0f] flex-shrink-0`}></div>
                   <div>
                     <p className="font-bold text-gray-900 dark:text-white">{l.level}</p>
                     <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">{l.desc}</p>
                   </div>
                 </div>
               ))}
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default SubmitTrader;