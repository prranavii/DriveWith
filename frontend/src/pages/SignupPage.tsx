import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowRight, Lock, Mail, User, Phone, Sparkles } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

export const SignupPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAppStore();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const redirectTarget = searchParams.get('redirect') || '/app';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      // Create user and automatically authenticate
      login({
        name: name || 'New DriveWith User',
        email: email || 'user@drivewith.ai',
        phone: phone || '+91 98765 00000',
        role: 'CUSTOMER',
      });
      setLoading(false);
      // Redirect directly to target route, NOT landing page
      navigate(redirectTarget, { replace: true });
    }, 600);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 bg-[#F8F8F8] text-black">
      <div className="w-full max-w-md bg-white border border-[#E5E7EB] rounded-3xl p-8 sm:p-10 shadow-xl space-y-8 animate-fadeIn">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-black text-white text-xl font-bold shadow-sm mb-2">
            🚘
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-black tracking-tight">Create Account</h1>
          <p className="text-xs text-neutral-500 font-medium">Join DriveWith for cabs & professional personal drivers.</p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold text-center">
            {error}
          </div>
        )}

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-neutral-700 uppercase tracking-wider">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full bg-neutral-50 border border-[#E5E7EB] rounded-xl pl-10 pr-4 py-2.5 text-xs text-black focus:outline-none focus:border-black font-medium shadow-xs"
              />
            </div>
          </div>

          <div className="space-y-1">
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

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-neutral-700 uppercase tracking-wider">Phone Number</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5" />
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full bg-neutral-50 border border-[#E5E7EB] rounded-xl pl-10 pr-4 py-2.5 text-xs text-black focus:outline-none focus:border-black font-medium shadow-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-neutral-700 uppercase tracking-wider">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-neutral-50 border border-[#E5E7EB] rounded-xl px-3 py-2.5 text-xs text-black focus:outline-none focus:border-black font-medium shadow-xs"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-neutral-700 uppercase tracking-wider">Confirm</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-neutral-50 border border-[#E5E7EB] rounded-xl px-3 py-2.5 text-xs text-black focus:outline-none focus:border-black font-medium shadow-xs"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-black hover:bg-neutral-800 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center justify-center gap-2 pt-3"
          >
            {loading ? <Sparkles className="w-4 h-4 animate-spin" /> : null}
            <span>{loading ? 'Creating Account...' : 'Create Account →'}</span>
          </button>
        </form>

        {/* Switch to Login */}
        <div className="text-center border-t border-[#E5E7EB] pt-6">
          <p className="text-xs text-neutral-500">
            Already have an account?{' '}
            <Link
              to={`/login${searchParams.toString() ? `?${searchParams.toString()}` : ''}`}
              className="text-black font-black hover:underline"
            >
              Log In
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};
