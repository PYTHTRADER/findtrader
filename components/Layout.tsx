import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, BarChart2, Zap, LogOut, User } from 'lucide-react';
import { useTheme } from './ThemeContext';
import { useAuth } from './AuthContext';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { theme } = useTheme();
  const { currentUser, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Leaderboard', path: '/leaderboard' },
    { name: 'Submit Profile', path: '/submit' },
    { name: 'About', path: '/about' },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    try {
      await logout();
      setIsMenuOpen(false);
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-100 bg-[#050507] transition-colors duration-300 relative overflow-hidden">
      
      {/* Background Glows for Premium Feel */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-neon-purple/20 rounded-full blur-[120px] -z-10 pointer-events-none mix-blend-screen"></div>
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-neon-cyan/20 rounded-full blur-[120px] -z-10 pointer-events-none mix-blend-screen"></div>

      {/* Navbar */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-[#050507]/80 border-b border-white/10 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-neon-cyan to-neon-purple rounded-lg blur opacity-50 group-hover:opacity-100 transition duration-300"></div>
                <div className="relative bg-black p-2.5 rounded-lg border border-white/10">
                  <BarChart2 className="h-6 w-6 text-neon-cyan" />
                </div>
              </div>
              <span className="text-2xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 group-hover:from-neon-cyan group-hover:to-neon-purple transition-all duration-300">
                FIND<span className="text-neon-cyan">TRADER</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm font-bold uppercase tracking-wider transition-all duration-300 hover:text-neon-cyan relative group ${
                    isActive(link.path)
                      ? 'text-neon-cyan'
                      : 'text-gray-400'
                  }`}
                >
                  {link.name}
                  <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-neon-cyan transition-all duration-300 group-hover:w-full ${isActive(link.path) ? 'w-full' : ''}`}></span>
                </Link>
              ))}
              
              <div className="flex items-center space-x-4 ml-6 pl-6 border-l border-white/10">
                {currentUser ? (
                   <div className="flex items-center gap-4">
                        <div className="hidden md:flex flex-col items-end">
                            <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Welcome</span>
                            <span className="text-sm font-bold text-neon-cyan truncate max-w-[120px]">{currentUser.displayName || 'Trader'}</span>
                        </div>
                        <button onClick={handleLogout} className="p-2.5 rounded-lg bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white transition-all">
                            <LogOut size={18} />
                        </button>
                   </div>
                ) : (
                    <Link to="/login">
                    <button className="relative px-6 py-2.5 group overflow-hidden rounded-lg">
                        <div className="absolute inset-0 w-full h-full transition-all duration-300 ease-out opacity-100 bg-gradient-to-br from-neon-purple to-neon-pink group-hover:opacity-0"></div>
                        <div className="absolute inset-0 w-full h-full transition-all duration-300 ease-out opacity-0 bg-gradient-to-br from-neon-cyan to-neon-blue group-hover:opacity-100"></div>
                        <span className="relative text-sm font-bold text-white uppercase tracking-wider flex items-center">
                        Login <Zap className="ml-2 h-3 w-3" />
                        </span>
                    </button>
                    </Link>
                )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-md text-white hover:bg-white/5 focus:outline-none"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-[#0a0a0f] border-b border-white/10">
            <div className="px-4 pt-2 pb-4 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-4 py-3 rounded-xl text-base font-bold uppercase tracking-wide ${
                    isActive(link.path)
                      ? 'bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20'
                      : 'text-gray-300 hover:bg-white/5'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              
              <div className="mt-4 pt-4 border-t border-white/10">
                  {currentUser ? (
                      <div className="space-y-3">
                           <div className="flex items-center px-4 gap-3">
                                <div className="w-10 h-10 rounded-full bg-neon-purple/20 flex items-center justify-center text-neon-purple">
                                    <User size={20} />
                                </div>
                                <div>
                                    <p className="text-white font-bold">{currentUser.displayName || 'Trader'}</p>
                                    <p className="text-xs text-gray-500">{currentUser.email}</p>
                                </div>
                           </div>
                           <button 
                             onClick={handleLogout}
                             className="w-full text-center px-4 py-3 text-base font-bold text-red-500 bg-red-500/10 rounded-xl hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2"
                           >
                            <LogOut size={16} /> Logout
                           </button>
                      </div>
                  ) : (
                    <Link
                        to="/login"
                        onClick={() => setIsMenuOpen(false)}
                        className="block w-full text-center px-4 py-3 text-base font-bold text-white bg-gradient-to-r from-neon-purple to-neon-pink rounded-xl shadow-neon-purple hover:shadow-lg transition-all"
                    >
                        Login / Register
                    </Link>
                  )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-grow relative z-0">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-[#020203] border-t border-white/5 mt-auto relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-neon-cyan to-transparent opacity-50"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="space-y-6">
              <div className="flex items-center space-x-2">
                <div className="bg-gradient-to-br from-neon-cyan to-blue-600 p-2 rounded-lg">
                  <BarChart2 className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-black text-white tracking-tighter">FindTrader<span className="text-neon-cyan">.IN</span></span>
              </div>
              <p className="text-sm font-medium text-gray-400 leading-relaxed">
                Empowering Indian traders with <span className="text-neon-purple font-bold">AI-verified</span> performance data. Join the revolution of transparency.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6 border-l-2 border-neon-cyan pl-3">Platform</h3>
              <ul className="space-y-3">
                <li><Link to="/leaderboard" className="text-gray-400 hover:text-neon-cyan text-sm font-bold transition-colors">Leaderboard</Link></li>
                <li><Link to="/submit" className="text-gray-400 hover:text-neon-cyan text-sm font-bold transition-colors">Submit Profile</Link></li>
                <li><Link to="/about" className="text-gray-400 hover:text-neon-cyan text-sm font-bold transition-colors">How it Works</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6 border-l-2 border-neon-purple pl-3">Legal</h3>
              <ul className="space-y-3">
                <li><Link to="/about" className="text-gray-400 hover:text-neon-purple text-sm font-bold transition-colors">Privacy Policy</Link></li>
                <li><Link to="/about" className="text-gray-400 hover:text-neon-purple text-sm font-bold transition-colors">Terms of Service</Link></li>
                <li><Link to="/about" className="text-gray-400 hover:text-neon-purple text-sm font-bold transition-colors">Disclaimer</Link></li>
              </ul>
            </div>

            <div>
               <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6 border-l-2 border-neon-pink pl-3">Contact</h3>
               <p className="text-sm text-gray-400 font-medium mb-1">support@findtrader.in</p>
               <p className="text-sm text-gray-400 font-medium">Mumbai, India</p>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-white/5 text-center">
            <p className="text-xs text-gray-600 font-medium">
              © {new Date().getFullYear()} FindTrader India. All rights reserved. 
              <br className="md:hidden"/>
              <span className="md:ml-2 text-yellow-500/80">
                Disclaimer: Trading involves high risk. We do not provide investment advice.
              </span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;