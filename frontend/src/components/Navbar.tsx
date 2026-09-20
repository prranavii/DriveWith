import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAppStore, UserRole } from '../store/useAppStore';
import { Car, ShieldCheck, UserCheck, Activity, HelpCircle, Menu, X, ChevronRight, User, Bell } from 'lucide-react';

interface NavbarProps {
  onOpenRag: () => void;
  onOpenHowItWorks: () => void;
  onOpenSafety: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenRag, onOpenHowItWorks, onOpenSafety }) => {
  const { currentRole, setRole } = useAppStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const roles: { key: UserRole; label: string; icon: any }[] = [
    { key: 'CUSTOMER', label: 'Customer', icon: Car },
    { key: 'DRIVER', label: 'Driver Portal', icon: UserCheck },
    { key: 'ADMIN', label: 'Admin Command', icon: Activity },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo & Tagline (Matching Reference Image) */}
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#004d40] text-white flex items-center justify-center shadow-md">
            <Car className="w-5.5 h-5.5 font-bold" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-extrabold tracking-tight text-[#004d40]">
                Drive<span className="text-emerald-600">With</span>
              </span>
            </div>
            <p className="text-[10px] text-slate-500 font-medium tracking-tight">Your Car. Our Driver. AI Mobility.</p>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-slate-600">
          <button onClick={onOpenHowItWorks} className="hover:text-[#004d40] transition">How It Works</button>
          <button onClick={onOpenSafety} className="hover:text-[#004d40] transition">Safety & Trust</button>
          <button onClick={onOpenRag} className="flex items-center gap-1 hover:text-[#004d40] transition">
            <HelpCircle className="w-3.5 h-3.5 text-[#004d40]" />
            <span>Policy RAG</span>
          </button>
        </nav>

        {/* Role View Switcher & Action Buttons */}
        <div className="flex items-center gap-3">
          {/* Desktop Role Switcher */}
          <div className="hidden sm:flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
            {roles.map((r) => {
              const Icon = r.icon;
              const isActive = currentRole === r.key;
              const targetPath = r.key === 'CUSTOMER' ? '/customer' : r.key === 'DRIVER' ? '/driver' : '/admin';
              return (
                <Link
                  key={r.key}
                  to={targetPath}
                  onClick={() => setRole(r.key)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-[#004d40] text-white shadow-sm font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {r.label}
                </Link>
              );
            })}
          </div>

          {/* Bell Notification Icon (Matching Reference Image) */}
          <button className="relative p-2.5 rounded-2xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition border border-slate-200/80">
            <Bell className="w-4.5 h-4.5" />
            <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-2 right-2 ring-2 ring-white"></span>
          </button>

          {/* Mobile Menu Button (Matching Reference Image) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 rounded-2xl bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200/80 focus:outline-none transition"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Hamburger Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-900 border-b border-slate-800 px-4 pt-3 pb-6 space-y-4 animate-fadeIn">
          <div className="space-y-2">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2">Navigation</p>
            <button
              onClick={() => { onOpenHowItWorks(); setMobileMenuOpen(false); }}
              className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-800 rounded-lg flex items-center justify-between"
            >
              <span>How It Works</span>
              <ChevronRight className="w-4 h-4 text-slate-500" />
            </button>
            <button
              onClick={() => { onOpenSafety(); setMobileMenuOpen(false); }}
              className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-800 rounded-lg flex items-center justify-between"
            >
              <span>Safety & Trust</span>
              <ChevronRight className="w-4 h-4 text-slate-500" />
            </button>
            <button
              onClick={() => { onOpenRag(); setMobileMenuOpen(false); }}
              className="w-full text-left px-3 py-2 text-xs font-semibold text-teal-400 hover:bg-slate-800 rounded-lg flex items-center justify-between"
            >
              <span>Policy RAG Assistant</span>
              <ChevronRight className="w-4 h-4 text-slate-500" />
            </button>
          </div>

          <div className="space-y-2 border-t border-slate-800 pt-3">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2">Switch Application View</p>
            <div className="grid grid-cols-3 gap-2">
              {roles.map((r) => (
                <Link
                  key={r.key}
                  to={r.key === 'CUSTOMER' ? '/customer' : r.key === 'DRIVER' ? '/driver' : '/admin'}
                  onClick={() => { setRole(r.key); setMobileMenuOpen(false); }}
                  className={`px-2.5 py-2 rounded-lg text-[11px] font-bold text-center border transition ${
                    currentRole === r.key
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                      : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {r.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
