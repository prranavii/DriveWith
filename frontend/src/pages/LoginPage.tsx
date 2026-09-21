import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowRight, Lock, Mail, ShieldCheck, Sparkles } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('pranav@drivewith.ai');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAppStore();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Read target redirect param (e.g., /cab or /driver)
  const redirectTarget = searchParams.get('redirect') || '/app';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || loading) return;

    setLoading(true);
    setTimeout(() => {
      login({
        email,
        name: email.split('@')[0].replace('.', ' ').toUpperCase(),
      });
      setLoading(false);
      navigate(redirectTarget, { replace: true });
    }, 600);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 bg-[#F8F8F8] text-black">
      <div className="w-full max-w-md bg-white border border-[#E5E7EB] rounded-3xl p-8 sm:p-10 shadow-xl space-y-8 animate-fadeIn">
        
        {/* Branding & Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-black text-white text-xl font-bold shadow-sm mb-2">
            🚘
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-black tracking-tight">Welcome Back</h1>
          <p className="text-xs text-neutral-500 font-medium">Log in to manage your bookings and personal drivers.</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-neutral-700 uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-neutral-50 border border-[#E5E7EB] rounded-xl pl-10 pr-4 py-2.5 text-xs text-black focus:outline-none focus:border-black font-medium shadow-xs"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold text-neutral-700 uppercase tracking-wider">Password</label>
              <Link to="/forgot-password" className="text-[11px] text-neutral-500 hover:text-black font-semibold">
                Forgot?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-neutral-50 border border-[#E5E7EB] rounded-xl pl-10 pr-4 py-2.5 text-xs text-black focus:outline-none focus:border-black font-medium shadow-xs"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-black hover:bg-neutral-800 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center justify-center gap-2 pt-3"
          >
            {loading ? <Sparkles className="w-4 h-4 animate-spin" /> : null}
            <span>{loading ? 'Authenticating...' : 'Log In →'}</span>
          </button>
        </form>

        {/* Demo Fast Logins */}
        <div className="border-t border-[#E5E7EB] pt-6 space-y-2">
          <p className="text-[11px] text-center font-bold text-neutral-400 uppercase tracking-wider">Quick Demo Login</p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                login({ name: 'Pranav Sharma', role: 'CUSTOMER' });
                navigate(redirectTarget, { replace: true });
              }}
              className="px-3 py-2 bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 text-black text-[11px] font-bold rounded-xl transition"
            >
              Customer Demo
            </button>
            <button
              type="button"
              onClick={() => {
                login({ name: 'Vikram Yadav', role: 'DRIVER' });
                navigate('/driver-portal', { replace: true });
              }}
              className="px-3 py-2 bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 text-black text-[11px] font-bold rounded-xl transition"
            >
              Driver Demo
            </button>
          </div>
        </div>

        {/* Switch to Signup */}
        <div className="text-center pt-2">
          <p className="text-xs text-neutral-500">
            Don't have an account?{' '}
            <Link
              to={`/signup${searchParams.toString() ? `?${searchParams.toString()}` : ''}`}
              className="text-black font-black hover:underline"
            >
              Sign Up
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};
