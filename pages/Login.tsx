import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Chrome, ArrowRight, X } from 'lucide-react';
import { auth } from '../services/firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  GoogleAuthProvider, 
  signInWithPopup,
  updateProfile
} from 'firebase/auth';
import { useAuth } from '../components/AuthContext';

const Login: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgotPass, setShowForgotPass] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetMessage, setResetMessage] = useState('');
  
  const navigate = useNavigate();
  const { resetPassword } = useAuth();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        // Save the user's name to their profile
        if (name) {
          await updateProfile(userCredential.user, {
            displayName: name
          });
        }
      }
      navigate('/');
    } catch (err: any) {
      let errorMessage = err.message.replace('Firebase: ', '');
      
      if (err.code) {
        switch (err.code) {
          case 'auth/invalid-credential':
          case 'auth/user-not-found':
          case 'auth/wrong-password':
          case 'auth/invalid-email':
            errorMessage = "Email or Password incorrect";
            break;
          case 'auth/email-already-in-use':
            errorMessage = "User already exists. Sign in?";
            setIsLogin(true); // Forward to sign in with same email
            break;
          default:
            // Keep default message for other errors
            break;
        }
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate('/');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) {
      setResetMessage('Please enter your email address.');
      return;
    }
    try {
      await resetPassword(resetEmail);
      setResetMessage('Password reset email sent! Check your inbox.');
      setTimeout(() => {
        setShowForgotPass(false);
        setResetMessage('');
        setResetEmail('');
      }, 3000);
    } catch (err: any) {
      setResetMessage(err.message);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-purple/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-cyan/10 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Forgot Password Modal */}
      {showForgotPass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#0a0a0f] border border-white/10 p-8 rounded-3xl max-w-md w-full relative shadow-2xl">
            <button 
              onClick={() => setShowForgotPass(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X size={24} />
            </button>
            <h3 className="text-2xl font-black text-white mb-4">Reset Password</h3>
            <p className="text-gray-400 mb-6">Enter your email address and we'll send you a link to reset your password.</p>
            
            {resetMessage && (
              <div className={`p-3 rounded-xl mb-4 text-sm font-bold ${resetMessage.includes('sent') ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                {resetMessage}
              </div>
            )}

            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2 ml-1">Email address</label>
                <div className="mt-1 relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input 
                    type="email" 
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="block w-full pl-11 p-4 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#12121a] text-gray-900 dark:text-white focus:ring-2 focus:ring-neon-purple focus:border-transparent outline-none transition-all font-medium" 
                    placeholder="you@example.com" 
                  />
                </div>
              </div>
              <button type="submit" className="w-full py-4 bg-neon-purple text-white font-black rounded-xl hover:bg-neon-purple/80 transition-colors uppercase tracking-widest shadow-neon-purple">
                Send Reset Link
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="max-w-md w-full space-y-8 relative z-10">
        <div className="text-center">
          <h2 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">
            {isLogin ? 'Welcome Back' : 'Join the Elite'}
          </h2>
          <p className="mt-3 text-gray-600 dark:text-gray-400 font-medium">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="font-bold text-neon-cyan hover:text-white transition-colors"
            >
              {isLogin ? 'Sign up' : 'Log in'}
            </button>
          </p>
        </div>
        
        <div className="glass-card py-10 px-6 sm:px-10 rounded-3xl shadow-2xl">
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm font-bold text-center">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleAuth}>
            {!isLogin && (
               <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2 ml-1">Full Name</label>
                <div className="mt-1 relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="block w-full pl-11 p-4 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#0a0a0f] text-gray-900 dark:text-white focus:ring-2 focus:ring-neon-cyan focus:border-transparent outline-none transition-all font-medium" 
                    placeholder="John Doe" 
                  />
                </div>
              </div>
            )}
            
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2 ml-1">Email address</label>
              <div className="mt-1 relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-11 p-4 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#0a0a0f] text-gray-900 dark:text-white focus:ring-2 focus:ring-neon-cyan focus:border-transparent outline-none transition-all font-medium" 
                  placeholder="you@example.com" 
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2 ml-1">Password</label>
              <div className="mt-1 relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-11 p-4 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#0a0a0f] text-gray-900 dark:text-white focus:ring-2 focus:ring-neon-cyan focus:border-transparent outline-none transition-all font-medium" 
                  placeholder="••••••••" 
                />
              </div>
            </div>

            {isLogin && (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-neon-cyan focus:ring-neon-cyan border-gray-300 rounded bg-[#0a0a0f]" />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300 font-medium">Remember me</label>
                </div>
                <div className="text-sm">
                  <button type="button" onClick={() => setShowForgotPass(true)} className="font-bold text-neon-purple hover:text-white transition-colors">Forgot password?</button>
                </div>
              </div>
            )}

            <div>
              <button 
                type="submit" 
                disabled={loading}
                className="group w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-neon-cyan text-sm font-black text-white bg-gradient-to-r from-neon-cyan to-blue-600 hover:from-white hover:to-white hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neon-cyan transition-all uppercase tracking-widest transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Processing...' : (isLogin ? 'Sign in' : 'Create Account')}
                {!loading && <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />}
              </button>
            </div>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white dark:bg-[#12121a] text-gray-500 rounded-full font-medium">Or continue with</span>
              </div>
            </div>

            <div className="mt-6">
              <button 
                onClick={handleGoogleLogin}
                className="w-full flex justify-center items-center py-3 px-4 border border-gray-200 dark:border-white/10 rounded-xl shadow-sm bg-gray-50 dark:bg-[#0a0a0f] text-sm font-bold text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
              >
                <Chrome className="h-5 w-5 mr-3 text-white" />
                Google
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;