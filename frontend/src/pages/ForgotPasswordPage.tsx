import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, CheckCircle2, ArrowLeft } from 'lucide-react';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSent(true);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 bg-[#F8F8F8] text-black">
      <div className="w-full max-w-md bg-white border border-[#E5E7EB] rounded-3xl p-8 sm:p-10 shadow-xl space-y-6 text-center animate-fadeIn">
        
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-black text-white text-xl font-bold shadow-sm">
          🔑
        </div>

        <div>
          <h1 className="text-2xl font-black text-black">Reset Password</h1>
          <p className="text-xs text-neutral-500 font-medium mt-1">Enter your registered email to receive reset instructions.</p>
        </div>

        {sent ? (
          <div className="bg-neutral-50 border border-neutral-200 p-5 rounded-2xl space-y-3 text-center">
            <CheckCircle2 className="w-8 h-8 text-black mx-auto" />
            <p className="text-xs font-bold text-black">Password reset link sent to {email}</p>
            <p className="text-[11px] text-neutral-500">Please check your inbox or spam folder.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
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

            <button
              type="submit"
              className="w-full py-3 bg-black hover:bg-neutral-800 text-white font-bold text-xs rounded-xl shadow-sm transition"
            >
              Send Reset Link
            </button>
          </form>
        )}

        <div className="pt-2">
          <Link to="/login" className="text-xs font-bold text-black hover:underline flex items-center justify-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Login</span>
          </Link>
        </div>

      </div>
    </div>
  );
};
