import React from 'react';
import { X, MapPin, Search, UserCheck, ShieldCheck, CheckCircle2, Car, PhoneCall } from 'lucide-react';

interface HowItWorksModalProps {
  onClose: () => void;
}

export const HowItWorksModal: React.FC<HowItWorksModalProps> = ({ onClose }) => {
  const steps = [
    { number: '01', title: 'Enter Locations & Vehicle', desc: 'Specify your pickup, destination, and select your registered vehicle transmission & type.', icon: MapPin },
    { number: '02', title: 'Compare Verified Drivers', desc: 'Browse available drivers matched to your route using 7-factor deterministic telemetry scoring.', icon: Search },
    { number: '03', title: 'Inspect Driver Report', desc: 'Review comprehensive Trust & Safety profiles, identity checks, license status, and customer ratings.', icon: UserCheck },
    { number: '04', title: 'Verify OTP & Track Live', desc: 'Share your 4-digit security OTP upon driver arrival and track real-time GPS telemetry.', icon: ShieldCheck },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 animate-fadeIn text-slate-900">
        
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Simple 4-Step Process</span>
            <h2 className="text-xl font-extrabold text-slate-900">How DriveWith Works</h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-900 border border-slate-200 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div key={idx} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-xl bg-slate-900 text-white font-extrabold text-xs flex items-center justify-center shadow-xs">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-mono font-extrabold text-slate-400">{s.number}</span>
                </div>
                <h3 className="font-extrabold text-slate-900 text-xs">{s.title}</h3>
                <p className="text-[11px] text-slate-600 leading-relaxed">{s.desc}</p>
              </div>
            );
          })}
        </div>

        <button
          onClick={onClose}
          className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition shadow-sm"
        >
          Got It, Start Booking
        </button>

      </div>
    </div>
  );
};
