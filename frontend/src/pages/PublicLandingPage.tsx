import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Car,
  UserCheck,
  Sparkles,
  ShieldCheck,
  Signal,
  ArrowRight,
  MapPin,
  Clock,
  KeyRound,
  CheckCircle2,
  ChevronRight,
  Phone,
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

export const PublicLandingPage: React.FC = () => {
  const { isAuthenticated } = useAppStore();
  const navigate = useNavigate();

  const handleAction = (targetPath: string) => {
    if (isAuthenticated) {
      navigate(targetPath);
    } else {
      navigate(`/login?redirect=${encodeURIComponent(targetPath)}`);
    }
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="w-full bg-[#F8F8F8] text-black font-sans space-y-16 sm:space-y-24 pb-20">
      
      {/* 1. HERO SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Hero Content (6 cols) */}
          <div className="lg:col-span-6 space-y-6 sm:space-y-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black text-white text-xs font-bold shadow-xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI-Native Mobility Ecosystem</span>
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.08] text-black">
                YOUR JOURNEY. <br />
                <span className="text-neutral-500">YOUR CHOICE.</span>
              </h1>
              <p className="text-sm sm:text-base text-neutral-600 font-medium leading-relaxed max-w-xl">
                One platform for every journey. Book a cab when you need a ride, or get a verified professional driver for your own vehicle.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => handleAction('/app')}
                className="px-8 py-4 bg-black hover:bg-neutral-800 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-md transition flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>GET STARTED</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => scrollToSection('how-it-works')}
                className="px-6 py-4 bg-white hover:bg-neutral-100 text-black border border-[#E5E7EB] font-bold text-xs sm:text-sm rounded-2xl shadow-xs transition"
              >
                SEE HOW IT WORKS
              </button>
            </div>

            {/* Feature Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 border-t border-[#E5E7EB]">
              <div className="flex items-center gap-2 text-xs font-bold text-neutral-700">
                <ShieldCheck className="w-4 h-4 text-black shrink-0" />
                <span>100% Verified</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-neutral-700">
                <Signal className="w-4 h-4 text-black shrink-0" />
                <span>Real-Time Telemetry</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-neutral-700">
                <Sparkles className="w-4 h-4 text-black shrink-0" />
                <span>AI Concierge</span>
              </div>
            </div>
          </div>

          {/* Hero Visual (6 cols) */}
          <div className="lg:col-span-6 relative">
            <div className="relative bg-white border border-[#E5E7EB] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 overflow-hidden">
              
              {/* Card Header Overlay */}
              <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-black text-white flex items-center justify-center font-bold text-lg">
                    🚘
                  </div>
                  <div>
                    <p className="text-xs font-black text-black">DriveWith Mobility Suite</p>
                    <p className="text-[10px] text-neutral-500 font-medium">Noida Sector 62 → DLF Cyber City</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-neutral-100 text-black border border-neutral-200">
                  LIVE TELEMETRY
                </span>
              </div>

              {/* Minimal Map Preview Graphic */}
              <div className="relative w-full h-56 sm:h-64 rounded-2xl bg-neutral-100 border border-[#E5E7EB] overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]"></div>
                
                {/* Route Line Graphic */}
                <div className="relative z-10 w-4/5 h-3/5 border-2 border-dashed border-black rounded-3xl flex items-center justify-between px-6">
                  <div className="w-10 h-10 rounded-2xl bg-black text-white flex items-center justify-center font-bold text-xs shadow-md">
                    ●
                  </div>
                  <div className="px-3 py-1 rounded-full bg-white border border-black text-[10px] font-bold text-black shadow-xs">
                    12.4 km • 32 min
                  </div>
                  <div className="w-10 h-10 rounded-2xl bg-neutral-900 text-white flex items-center justify-center font-bold text-xs shadow-md">
                    📍
                  </div>
                </div>
              </div>

              {/* Quick Choice Pill Overlay */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-neutral-50 p-3 rounded-2xl border border-neutral-200 text-left">
                  <p className="text-[10px] font-bold text-neutral-400 uppercase">Option 01</p>
                  <p className="text-xs font-black text-black">🚕 Book a Cab</p>
                </div>
                <div className="bg-neutral-50 p-3 rounded-2xl border border-neutral-200 text-left">
                  <p className="text-[10px] font-bold text-neutral-400 uppercase">Option 02</p>
                  <p className="text-xs font-black text-black">👤 Book a Driver</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 2. TWO CORE SERVICES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">CORE OFFERINGS</span>
          <h2 className="text-3xl sm:text-4xl font-black text-black tracking-tight">Two ways to travel.</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          
          {/* Service 1: Book a Cab */}
          <div className="bg-white border border-[#E5E7EB] hover:border-black rounded-3xl p-8 sm:p-10 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-8 group">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-black text-white flex items-center justify-center text-2xl font-bold shadow-sm group-hover:scale-105 transition">
                🚕
              </div>
              <div className="space-y-2">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-neutral-400">CAB SERVICE</span>
                <h3 className="text-2xl sm:text-3xl font-black text-black">BOOK A CAB</h3>
                <p className="text-xs sm:text-sm font-bold text-black">Need a ride?</p>
                <p className="text-xs sm:text-sm text-neutral-500 font-medium leading-relaxed">
                  Book a DriveWith vehicle with a professional, vetted driver for point-to-point city transfers or airport pickups.
                </p>
              </div>
            </div>

            <button
              onClick={() => handleAction('/cab')}
              className="w-full py-3.5 bg-black hover:bg-neutral-800 text-white font-bold text-xs rounded-2xl shadow-sm transition flex items-center justify-center gap-2"
            >
              <span>Explore Cab Booking</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Service 2: Book a Driver */}
          <div className="bg-white border border-[#E5E7EB] hover:border-black rounded-3xl p-8 sm:p-10 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-8 group">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-black text-white flex items-center justify-center text-2xl font-bold shadow-sm group-hover:scale-105 transition">
                👤
              </div>
              <div className="space-y-2">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-neutral-400">PERSONAL DRIVER</span>
                <h3 className="text-2xl sm:text-3xl font-black text-black">BOOK A DRIVER</h3>
                <p className="text-xs sm:text-sm font-bold text-black">Have your own car?</p>
                <p className="text-xs sm:text-sm text-neutral-500 font-medium leading-relaxed">
                  Book a verified professional driver to drive your personal car safely—for daily commutes, night outs, or outstation.
                </p>
              </div>
            </div>

            <button
              onClick={() => handleAction('/driver')}
              className="w-full py-3.5 bg-black hover:bg-neutral-800 text-white font-bold text-xs rounded-2xl shadow-sm transition flex items-center justify-center gap-2"
            >
              <span>Book a Driver</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </section>

      {/* 3. HOW IT WORKS SECTION */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">TRANSPARENT STEPS</span>
          <h2 className="text-3xl sm:text-4xl font-black text-black tracking-tight">How DriveWith works</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* For Cab */}
          <div className="bg-white border border-[#E5E7EB] rounded-3xl p-7 sm:p-9 space-y-6">
            <div className="flex items-center gap-3 border-b border-[#E5E7EB] pb-4">
              <span className="text-xl">🚕</span>
              <h3 className="text-lg font-black text-black">For Cab Booking</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5 p-4 rounded-2xl bg-neutral-50 border border-neutral-200/60">
                <span className="text-lg font-black text-neutral-400">01</span>
                <h4 className="text-xs font-bold text-black">Choose Destination</h4>
                <p className="text-[11px] text-neutral-500 font-medium">Set pickup and drop points.</p>
              </div>
              <div className="space-y-1.5 p-4 rounded-2xl bg-neutral-50 border border-neutral-200/60">
                <span className="text-lg font-black text-neutral-400">02</span>
                <h4 className="text-xs font-bold text-black">Choose Your Cab</h4>
                <p className="text-[11px] text-neutral-500 font-medium">Select Sedan, SUV or Luxury.</p>
              </div>
              <div className="space-y-1.5 p-4 rounded-2xl bg-neutral-50 border border-neutral-200/60">
                <span className="text-lg font-black text-neutral-400">03</span>
                <h4 className="text-xs font-bold text-black">Meet Your Driver</h4>
                <p className="text-[11px] text-neutral-500 font-medium">Verify security OTP.</p>
              </div>
              <div className="space-y-1.5 p-4 rounded-2xl bg-neutral-50 border border-neutral-200/60">
                <span className="text-lg font-black text-neutral-400">04</span>
                <h4 className="text-xs font-bold text-black">Enjoy Your Ride</h4>
                <p className="text-[11px] text-neutral-500 font-medium">Track trip telemetry live.</p>
              </div>
            </div>
          </div>

          {/* For Driver */}
          <div className="bg-white border border-[#E5E7EB] rounded-3xl p-7 sm:p-9 space-y-6">
            <div className="flex items-center gap-3 border-b border-[#E5E7EB] pb-4">
              <span className="text-xl">👤</span>
              <h3 className="text-lg font-black text-black">For Personal Driver</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5 p-4 rounded-2xl bg-neutral-50 border border-neutral-200/60">
                <span className="text-lg font-black text-neutral-400">01</span>
                <h4 className="text-xs font-bold text-black">Tell Us Your Route</h4>
                <p className="text-[11px] text-neutral-500 font-medium">Specify pickup & destination.</p>
              </div>
              <div className="space-y-1.5 p-4 rounded-2xl bg-neutral-50 border border-neutral-200/60">
                <span className="text-lg font-black text-neutral-400">02</span>
                <h4 className="text-xs font-bold text-black">Vehicle Details</h4>
                <p className="text-[11px] text-neutral-500 font-medium">Specify Manual / Automatic.</p>
              </div>
              <div className="space-y-1.5 p-4 rounded-2xl bg-neutral-50 border border-neutral-200/60">
                <span className="text-lg font-black text-neutral-400">03</span>
                <h4 className="text-xs font-bold text-black">Choose Your Driver</h4>
                <p className="text-[11px] text-neutral-500 font-medium">View skill passport & ratings.</p>
              </div>
              <div className="space-y-1.5 p-4 rounded-2xl bg-neutral-50 border border-neutral-200/60">
                <span className="text-lg font-black text-neutral-400">04</span>
                <h4 className="text-xs font-bold text-black">Enjoy the Journey</h4>
                <p className="text-[11px] text-neutral-500 font-medium">Relax in your own vehicle.</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 4. WHY DRIVEWITH SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">PRODUCT ADVANTAGE</span>
          <h2 className="text-3xl sm:text-4xl font-black text-black tracking-tight">Built around your journey.</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-[#E5E7EB] rounded-3xl p-7 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center font-bold">
              🚘
            </div>
            <h3 className="text-base font-black text-black">YOUR CAR, YOUR DRIVER</h3>
            <p className="text-xs text-neutral-500 font-medium leading-relaxed">
              Need someone to drive your own vehicle? We've got you covered with specialized transmission-matched drivers.
            </p>
          </div>

          <div className="bg-white border border-[#E5E7EB] rounded-3xl p-7 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center font-bold">
              🛡️
            </div>
            <h3 className="text-base font-black text-black">VERIFIED PROFESSIONALS</h3>
            <p className="text-xs text-neutral-500 font-medium leading-relaxed">
              Discover drivers with transparent skill passports, background verifications, safety scores, and real user ratings.
            </p>
          </div>

          <div className="bg-white border border-[#E5E7EB] rounded-3xl p-7 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center font-bold">
              ✦
            </div>
            <h3 className="text-base font-black text-black">AI-POWERED</h3>
            <p className="text-xs text-neutral-500 font-medium leading-relaxed">
              Tell DriveWith what you need in natural language. Our AI concierge handles intent parsing & matching.
            </p>
          </div>
        </div>
      </section>

      {/* 5. AI SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-[#E5E7EB] rounded-3xl p-8 sm:p-12 shadow-md space-y-8">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">LANGGRAPH CONCIERGE</span>
            <h2 className="text-3xl sm:text-4xl font-black text-black tracking-tight">
              Just tell DriveWith what you need.
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 font-medium">
              Describe your journey naturally. Our AI determines whether you need a cab or a personal driver.
            </p>
          </div>

          {/* Interactive Mock Conversation Preview */}
          <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-6 space-y-4 max-w-2xl font-sans text-xs">
            <div className="flex justify-end">
              <div className="bg-black text-white px-4 py-3 rounded-2xl rounded-tr-xs max-w-sm">
                <p className="font-medium">"I need to take my parents from Noida to the airport tomorrow at 6 AM."</p>
              </div>
            </div>

            <div className="flex justify-start">
              <div className="bg-white border border-neutral-200 text-black px-5 py-4 rounded-2xl rounded-tl-xs space-y-3 max-w-md shadow-xs">
                <div className="flex items-center gap-2 font-black text-black">
                  <Sparkles className="w-4 h-4 text-black" />
                  <span>DriveWith AI Concierge</span>
                </div>
                <p className="font-medium text-neutral-600">Got it! Extracted trip details:</p>
                <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-200 space-y-1 font-mono text-[11px]">
                  <p><span className="text-neutral-400">Pickup:</span> Sector 62, Noida</p>
                  <p><span className="text-neutral-400">Destination:</span> IGI Airport T3</p>
                  <p><span className="text-neutral-400">Time:</span> Tomorrow, 6:00 AM</p>
                </div>
                <div className="flex gap-2 pt-1">
                  <span className="px-3 py-1 bg-black text-white rounded-lg font-bold text-[10px]">BOOK A CAB</span>
                  <span className="px-3 py-1 bg-neutral-100 border border-neutral-300 text-black rounded-lg font-bold text-[10px]">BOOK A DRIVER</span>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => handleAction('/ai')}
            className="px-6 py-3.5 bg-black hover:bg-neutral-800 text-white font-bold text-xs rounded-2xl shadow-sm transition flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>TRY DRIVEWITH AI →</span>
          </button>
        </div>
      </section>

      {/* 6. SAFETY / TRUST SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">SAFETY & ASSURANCE</span>
          <h2 className="text-3xl sm:text-4xl font-black text-black tracking-tight">Travel with confidence.</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 text-center">
          <div className="bg-white border border-[#E5E7EB] p-5 rounded-2xl space-y-2">
            <CheckCircle2 className="w-6 h-6 text-black mx-auto" />
            <p className="text-xs font-bold text-black">Verified Drivers</p>
          </div>
          <div className="bg-white border border-[#E5E7EB] p-5 rounded-2xl space-y-2">
            <UserCheck className="w-6 h-6 text-black mx-auto" />
            <p className="text-xs font-bold text-black">Driver Passports</p>
          </div>
          <div className="bg-white border border-[#E5E7EB] p-5 rounded-2xl space-y-2">
            <Signal className="w-6 h-6 text-black mx-auto" />
            <p className="text-xs font-bold text-black">Trip Telemetry</p>
          </div>
          <div className="bg-white border border-[#E5E7EB] p-5 rounded-2xl space-y-2">
            <KeyRound className="w-6 h-6 text-black mx-auto" />
            <p className="text-xs font-bold text-black">Security OTP</p>
          </div>
          <div className="bg-white border border-[#E5E7EB] p-5 rounded-2xl space-y-2">
            <Phone className="w-6 h-6 text-black mx-auto" />
            <p className="text-xs font-bold text-black">24/7 Support</p>
          </div>
          <div className="bg-white border border-[#E5E7EB] p-5 rounded-2xl space-y-2">
            <ShieldCheck className="w-6 h-6 text-black mx-auto" />
            <p className="text-xs font-bold text-black">Transparent Fare</p>
          </div>
        </div>
      </section>

      {/* 7. DRIVER PORTAL CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-black text-white rounded-3xl p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black">Want to drive with DriveWith?</h2>
            <p className="text-xs sm:text-sm text-neutral-400 font-medium">Turn your professional driving experience into opportunity.</p>
          </div>

          <button
            onClick={() => handleAction('/driver-portal')}
            className="px-6 py-3.5 bg-white text-black hover:bg-neutral-100 font-bold text-xs rounded-2xl shadow-sm transition flex items-center gap-2 shrink-0"
          >
            <span>BECOME A DRIVER</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* 8. FINAL LANDING CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <div className="space-y-2">
          <h2 className="text-3xl sm:text-4xl font-black text-black">Ready for your next journey?</h2>
          <p className="text-xs sm:text-sm text-neutral-500 font-medium">Choose how you want to travel.</p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => handleAction('/cab')}
            className="px-8 py-4 bg-black hover:bg-neutral-800 text-white font-bold text-xs rounded-2xl shadow-md transition"
          >
            BOOK A CAB
          </button>
          <button
            onClick={() => handleAction('/driver')}
            className="px-8 py-4 bg-white hover:bg-neutral-100 text-black border border-black font-bold text-xs rounded-2xl shadow-sm transition"
          >
            BOOK A DRIVER
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[#E5E7EB] pt-12 text-xs text-neutral-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-black text-white flex items-center justify-center text-xs font-bold">🚘</div>
            <span className="font-black text-black">DriveWith</span>
            <span>© 2026 DriveWith Mobility Inc.</span>
          </div>

          <div className="flex items-center gap-6 font-bold text-black">
            <button onClick={() => scrollToSection('how-it-works')} className="hover:underline">How It Works</button>
            <button onClick={() => handleAction('/safety')} className="hover:underline">Safety</button>
            <button onClick={() => handleAction('/driver-portal')} className="hover:underline">Drivers</button>
          </div>
        </div>
      </footer>

    </div>
  );
};
