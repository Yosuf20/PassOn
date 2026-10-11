import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import api from '../services/api';
import { Eye, EyeOff, ArrowRight, Recycle, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('priya@example.com');
  const [password, setPassword] = useState('password123');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useApp();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      let result;
      if (isSignUp) {
        if (!name.trim()) { setError('Name is required'); setLoading(false); return; }
        result = await api.signup(name, email, password);
      } else {
        result = await api.login(email, password);
      }
      login(result.user, result.token);
      navigate('/join');
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-dvh flex flex-col justify-center items-center px-4 py-12 bg-white relative overflow-hidden">
      {/* Decorative flat geometric shapes */}
      <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-blue-50 pointer-events-none" />
      <div className="absolute top-1/3 -left-20 w-48 h-48 rounded-2xl bg-emerald-50 pointer-events-none rotate-12" />
      <div className="absolute -bottom-16 right-10 w-56 h-56 rounded-full bg-amber-50 pointer-events-none" />

      {/* Brand Header */}
      <div className="max-w-md w-full mb-8 text-center relative z-10">
        <div className="w-16 h-16 bg-blue-500 text-white rounded-2xl flex items-center justify-center mx-auto mb-4 hover:scale-105 transition-transform">
          <Recycle className="w-9 h-9" strokeWidth={2.5} />
        </div>
        <h1 className="font-extrabold text-4xl text-gray-900 tracking-tight">
          PassOn
        </h1>
        <p className="text-gray-600 text-base mt-2 font-medium">
          Give it away. Sell it cheap. Recycle it right.
        </p>
      </div>

      {/* Main Authentication Card */}
      <div className="bg-gray-100 rounded-2xl max-w-md w-full p-8 relative z-10 animate-slide-up">
        <div className="mb-6">
          <h2 className="font-bold text-2xl text-gray-900">
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            {isSignUp
              ? 'Join your residential community circle to begin reusing.'
              : 'Sign in to access verified community notices and items.'}
          </p>
        </div>

        {error && (
          <div className="bg-rose-100 text-rose-700 text-sm font-semibold p-3.5 rounded-lg mb-5">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Priya Sharma"
                className="w-full px-4 py-3 bg-white border-2 border-transparent focus:border-blue-500 rounded-lg text-gray-900 font-medium placeholder:text-gray-400 outline-none transition"
              />
            </div>
          )}

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full px-4 py-3 bg-white border-2 border-transparent focus:border-blue-500 rounded-lg text-gray-900 font-medium placeholder:text-gray-400 outline-none transition"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 bg-white border-2 border-transparent focus:border-blue-500 rounded-lg text-gray-900 font-medium placeholder:text-gray-400 outline-none transition pr-11"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 p-1"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-blue-500 hover:bg-blue-600 active:scale-95 text-white font-bold text-base rounded-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed hover:scale-105 mt-2"
          >
            {loading ? (
              <span className="flex items-center gap-2 font-semibold">
                <span className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin inline-block"></span>
                Processing...
              </span>
            ) : (
              <>
                <span>{isSignUp ? 'Create Account' : 'Sign In'}</span>
                <ArrowRight className="w-5 h-5" strokeWidth={2.5} />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-gray-200 text-center">
          <button
            onClick={() => { setIsSignUp(!isSignUp); setError(''); }}
            className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition"
          >
            {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
          </button>
        </div>

        <div className="mt-4 p-3 bg-gray-200/60 rounded-lg text-center">
          <p className="text-xs text-gray-600 font-medium">
            Demo Credentials Pre-filled: Click Sign In to proceed
          </p>
        </div>
      </div>
    </div>
  );
}
