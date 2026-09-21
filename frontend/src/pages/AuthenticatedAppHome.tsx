import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Car, UserCheck, Sparkles, ArrowRight, Clock, ShieldCheck, MapPin } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

export const AuthenticatedAppHome: React.FC = () => {
  const { user, activeBooking } = useAppStore();
  const navigate = useNavigate();

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 text-black">
      
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E7EB] pb-6">
        <div>
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-neutral-400">AUTHENTICATED DASHBOARD</span>
          <h1 className="text-3xl sm:text-4xl font-black text-black tracking-tight mt-1">
            Welcome back, {user?.name.split(' ')[0] || 'Traveler'} 👋
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 font-medium mt-0.5">
            How do you want to travel today?
          </p>
        </div>

        {activeBooking && (
          <div className="bg-black text-white px-4 py-2.5 rounded-2xl flex items-center gap-3 shadow-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping"></span>
            <div>
              <p className="text-[10px] text-neutral-400 font-bold uppercase">Active Journey</p>
              <p className="text-xs font-bold">{activeBooking.bookingType || 'Active Booking'} #{String(activeBooking.id).slice(-6)}</p>
            </div>
            <button
              onClick={() => navigate('/driver')}
              className="px-3 py-1 bg-white text-black text-[11px] font-bold rounded-xl hover:bg-neutral-100 transition ml-2"
            >
              Track Live
            </button>
          </div>
        )}
      </div>

      {/* Two Primary Choice Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        
        {/* Card 1: BOOK A CAB */}
        <div className="bg-white border border-[#E5E7EB] hover:border-black rounded-3xl p-8 sm:p-10 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between min-h-[340px] group">
          <div className="space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-black text-white flex items-center justify-center text-3xl font-bold shadow-sm group-hover:scale-105 transition">
              🚕
            </div>
            <div className="space-y-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-neutral-400">OPTION 01</span>
              <h2 className="text-2xl sm:text-3xl font-black text-black">BOOK A CAB</h2>
              <p className="text-xs sm:text-sm text-neutral-500 font-medium leading-relaxed">
                DriveWith vehicle + professional driver. Ideal when you need a vehicle provided for your journey.
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate('/cab')}
            className="w-full py-4 bg-black hover:bg-neutral-800 text-white font-bold text-xs rounded-2xl shadow-sm transition flex items-center justify-center gap-2 mt-6"
          >
            <span>Book Cab →</span>
          </button>
        </div>

        {/* Card 2: BOOK A DRIVER */}
        <div className="bg-white border border-[#E5E7EB] hover:border-black rounded-3xl p-8 sm:p-10 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between min-h-[340px] group">
          <div className="space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-black text-white flex items-center justify-center text-3xl font-bold shadow-sm group-hover:scale-105 transition">
              👤
            </div>
            <div className="space-y-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-neutral-400">OPTION 02</span>
              <h2 className="text-2xl sm:text-3xl font-black text-black">BOOK A DRIVER</h2>
              <p className="text-xs sm:text-sm text-neutral-500 font-medium leading-relaxed">
                Your personal vehicle + our verified driver. Ideal for your Honda City, Swift, SUV or Luxury sedan.
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate('/driver')}
            className="w-full py-4 bg-black hover:bg-neutral-800 text-white font-bold text-xs rounded-2xl shadow-sm transition flex items-center justify-center gap-2 mt-6"
          >
            <span>Book Driver →</span>
          </button>
        </div>

      </div>

      {/* Quick Action Links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
        <Link
          to="/ai"
          className="bg-white border border-[#E5E7EB] hover:border-black p-5 rounded-2xl shadow-xs transition flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center font-bold">✦</div>
            <div>
              <p className="text-xs font-black text-black">AI Concierge</p>
              <p className="text-[10px] text-neutral-400 font-medium">Plan via natural language</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-black group-hover:translate-x-1 transition" />
        </Link>

        <Link
          to="/trips"
          className="bg-white border border-[#E5E7EB] hover:border-black p-5 rounded-2xl shadow-xs transition flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-neutral-100 text-black flex items-center justify-center font-bold">📋</div>
            <div>
              <p className="text-xs font-black text-black">My Trips</p>
              <p className="text-[10px] text-neutral-400 font-medium">View history & receipts</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-black group-hover:translate-x-1 transition" />
        </Link>

        <Link
          to="/profile"
          className="bg-white border border-[#E5E7EB] hover:border-black p-5 rounded-2xl shadow-xs transition flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-neutral-100 text-black flex items-center justify-center font-bold">👤</div>
            <div>
              <p className="text-xs font-black text-black">Profile & Vehicles</p>
              <p className="text-[10px] text-neutral-400 font-medium">Manage cars & preferences</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-black group-hover:translate-x-1 transition" />
        </Link>
      </div>

    </div>
  );
};
