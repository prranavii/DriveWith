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
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E5E7EB] shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Minimal Monochrome Brand Logo */}
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-black text-white flex items-center justify-center shadow-xs">
            <Car className="w-5 h-5 font-bold" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-black tracking-tight text-black">
                DriveWith
              </span>
              <span className="px-1.5 py-0.5 text-[9px] font-extrabold bg-[#F8F8F8] text-black border border-[#E5E7EB] rounded uppercase">
                AI 2.0
              </span>
            </div>
            <p className="text-[10px] text-gray-500 font-medium tracking-tight">Your Car. Our Driver. AI Mobility.</p>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-gray-600">
          <button onClick={onOpenHowItWorks} className="hover:text-black transition">How It Works</button>
          <button onClick={onOpenSafety} className="hover:text-black transition">Safety</button>
          <button className="hover:text-black transition">Pricing</button>
          <button className="hover:text-black transition">For Business</button>
          <button onClick={onOpenRag} className="flex items-center gap-1 text-black hover:text-gray-700 font-bold transition">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Policy RAG</span>
          </button>
        </nav>

        {/* Role View Switcher & Actions */}
        <div className="flex items-center gap-3">
          {/* Desktop Role Switcher */}
          <div className="hidden sm:flex items-center gap-1 bg-[#F8F8F8] p-1 rounded-xl border border-[#E5E7EB]">
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
                      ? 'bg-black text-white shadow-xs font-bold'
                      : 'text-gray-600 hover:text-black hover:bg-gray-200/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {r.label}
                </Link>
              );
            })}
          </div>

          {/* Bell Notification Icon */}
          <button className="relative p-2.5 rounded-2xl bg-[#F8F8F8] text-black hover:bg-gray-200 transition border border-[#E5E7EB]">
            <Bell className="w-4 h-4" />
            <span className="w-2 h-2 rounded-full bg-black absolute top-2 right-2 ring-2 ring-white"></span>
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 rounded-2xl bg-[#F8F8F8] text-black hover:bg-gray-200 border border-[#E5E7EB] focus:outline-none transition"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer (Minimal White Theme) */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-[#E5E7EB] px-4 pt-3 pb-6 space-y-4 animate-fadeIn">
          <div className="space-y-2">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-2">Navigation</p>
            <button
              onClick={() => { onOpenHowItWorks(); setMobileMenuOpen(false); }}
              className="w-full text-left px-3 py-2 text-xs font-semibold text-black hover:bg-[#F8F8F8] rounded-lg flex items-center justify-between"
            >
              <span>How It Works</span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>
            <button
              onClick={() => { onOpenSafety(); setMobileMenuOpen(false); }}
              className="w-full text-left px-3 py-2 text-xs font-semibold text-black hover:bg-[#F8F8F8] rounded-lg flex items-center justify-between"
            >
              <span>Safety & Trust</span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>
            <button
              onClick={() => { onOpenRag(); setMobileMenuOpen(false); }}
              className="w-full text-left px-3 py-2 text-xs font-semibold text-black hover:bg-[#F8F8F8] rounded-lg flex items-center justify-between"
            >
              <span>Policy RAG Assistant</span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>
          </div>

          <div className="space-y-2 border-t border-[#E5E7EB] pt-3">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-2">Switch Application View</p>
            <div className="grid grid-cols-3 gap-2">
              {roles.map((r) => (
                <Link
                  key={r.key}
                  to={r.key === 'CUSTOMER' ? '/customer' : r.key === 'DRIVER' ? '/driver' : '/admin'}
                  onClick={() => { setRole(r.key); setMobileMenuOpen(false); }}
                  className={`px-2.5 py-2 rounded-lg text-[11px] font-bold text-center border transition ${
                    currentRole === r.key
                      ? 'bg-black text-white border-black shadow-xs'
                      : 'bg-[#F8F8F8] border-[#E5E7EB] text-gray-700 hover:bg-gray-200'
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
