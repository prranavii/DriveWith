import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { Car, ShieldCheck, UserCheck, HelpCircle, Menu, X, ChevronRight, User, Bell, LogOut, Sparkles } from 'lucide-react';

interface NavbarProps {
  onOpenRag: () => void;
  onOpenHowItWorks: () => void;
  onOpenSafety: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenRag, onOpenHowItWorks, onOpenSafety }) => {
  const { isAuthenticated, user, logout } = useAppStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E5E7EB] shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Minimal Monochrome Brand Logo */}
        <Link to={isAuthenticated ? "/app" : "/"} className="flex items-center gap-3">
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
            <p className="text-[10px] text-neutral-500 font-medium tracking-tight">Your Car. Our Driver. AI Mobility.</p>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-neutral-600">
          {!isAuthenticated ? (
            <>
              <button onClick={onOpenHowItWorks} className="hover:text-black transition">How It Works</button>
              <button onClick={onOpenSafety} className="hover:text-black transition">Safety</button>
              <button onClick={onOpenRag} className="flex items-center gap-1 text-black font-bold hover:text-neutral-700 transition">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Policy RAG</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/app" className={`hover:text-black transition ${location.pathname === '/app' ? 'text-black font-black' : ''}`}>Home</Link>
              <Link to="/cab" className={`hover:text-black transition ${location.pathname === '/cab' ? 'text-black font-black' : ''}`}>Book a Cab</Link>
              <Link to="/driver" className={`hover:text-black transition ${location.pathname === '/driver' ? 'text-black font-black' : ''}`}>Book a Driver</Link>
              <Link to="/trips" className={`hover:text-black transition ${location.pathname === '/trips' ? 'text-black font-black' : ''}`}>My Trips</Link>
              <Link to="/ai" className={`flex items-center gap-1 hover:text-black transition ${location.pathname === '/ai' ? 'text-black font-black' : ''}`}>
                <Sparkles className="w-3.5 h-3.5 text-black" />
                <span>AI</span>
              </Link>
              <Link to="/profile" className={`hover:text-black transition ${location.pathname === '/profile' ? 'text-black font-black' : ''}`}>Profile</Link>
            </>
          )}
        </nav>

        {/* Right Header Actions */}
        <div className="flex items-center gap-3">
          
          {!isAuthenticated ? (
            /* Logged Out CTAs */
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-4 py-2 text-xs font-bold text-black hover:bg-neutral-100 rounded-xl transition border border-transparent"
              >
                Log In
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 bg-black hover:bg-neutral-800 text-white text-xs font-bold rounded-xl shadow-xs transition"
              >
                Sign Up
              </Link>
            </div>
          ) : (
            /* Authenticated User Avatar Dropdown */
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2.5 p-1.5 rounded-2xl bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 transition"
              >
                <img
                  src={user?.profilePhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                  alt={user?.name}
                  className="w-7 h-7 rounded-xl object-cover border border-neutral-300"
                />
                <span className="hidden sm:inline text-xs font-bold text-black pr-1">{user?.name.split(' ')[0]} ▼</span>
              </button>

              {/* User Dropdown Menu */}
              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-[#E5E7EB] rounded-2xl shadow-xl py-2 z-50 text-xs font-bold text-black animate-fadeIn">
                  <div className="px-4 py-2 border-b border-neutral-100">
                    <p className="text-black font-black truncate">{user?.name}</p>
                    <p className="text-[10px] text-neutral-400 font-medium truncate">{user?.email}</p>
                  </div>
                  <Link
                    to="/profile"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 hover:bg-neutral-100 transition"
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>Profile & Vehicles</span>
                  </Link>
                  <Link
                    to="/trips"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 hover:bg-neutral-100 transition"
                  >
                    <Car className="w-3.5 h-3.5" />
                    <span>My Trips</span>
                  </Link>
                  {user?.role === 'ADMIN' && (
                    <Link
                      to="/admin"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 hover:bg-neutral-100 transition text-black"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Admin Command</span>
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="w-full text-left flex items-center gap-2 px-4 py-2 hover:bg-neutral-100 text-rose-600 transition border-t border-neutral-100 mt-1"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Log Out</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2.5 rounded-2xl bg-[#F8F8F8] text-black hover:bg-neutral-200 border border-[#E5E7EB] transition"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-[#E5E7EB] px-4 pt-3 pb-6 space-y-4 animate-fadeIn">
          {!isAuthenticated ? (
            <div className="space-y-2">
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="w-full text-left px-3 py-2 text-xs font-bold text-black hover:bg-[#F8F8F8] rounded-lg block">Log In</Link>
              <Link to="/signup" onClick={() => setMobileMenuOpen(false)} className="w-full text-left px-3 py-2 text-xs font-bold text-white bg-black rounded-lg block">Sign Up</Link>
              <button onClick={() => { onOpenHowItWorks(); setMobileMenuOpen(false); }} className="w-full text-left px-3 py-2 text-xs font-semibold text-black hover:bg-[#F8F8F8] rounded-lg block">How It Works</button>
              <button onClick={() => { onOpenSafety(); setMobileMenuOpen(false); }} className="w-full text-left px-3 py-2 text-xs font-semibold text-black hover:bg-[#F8F8F8] rounded-lg block">Safety & Trust</button>
            </div>
          ) : (
            <div className="space-y-2">
              <Link to="/app" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 text-xs font-bold text-black block hover:bg-neutral-100 rounded-lg">Home</Link>
              <Link to="/cab" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 text-xs font-bold text-black block hover:bg-neutral-100 rounded-lg">Book a Cab</Link>
              <Link to="/driver" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 text-xs font-bold text-black block hover:bg-neutral-100 rounded-lg">Book a Driver</Link>
              <Link to="/trips" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 text-xs font-bold text-black block hover:bg-neutral-100 rounded-lg">My Trips</Link>
              <Link to="/ai" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 text-xs font-bold text-black block hover:bg-neutral-100 rounded-lg">AI Concierge</Link>
              <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 text-xs font-bold text-black block hover:bg-neutral-100 rounded-lg">Profile & Vehicles</Link>
              <button onClick={handleLogout} className="px-3 py-2 text-xs font-bold text-rose-600 block hover:bg-neutral-100 rounded-lg w-full text-left">Log Out</button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
