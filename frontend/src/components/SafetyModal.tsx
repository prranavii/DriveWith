import React from 'react';
import { X, ShieldCheck, CheckCircle2, Lock, Eye, AlertTriangle, PhoneCall } from 'lucide-react';

interface SafetyModalProps {
  onClose: () => void;
}

export const SafetyModal: React.FC<SafetyModalProps> = ({ onClose }) => {
  const safetyFeatures = [
    { title: '7-Point Driver Verification', desc: 'Aadhaar identity, commercial driving license, criminal history check, and permanent address verification.' },
    { title: 'Real-Time Telemetry & Safety Agent', desc: 'Continuous GPS telemetry tracking; unexpected route deviation > 500m triggers automatic safety status checks.' },
    { title: 'OTP Trip Authentication', desc: 'Trip cannot start until you or your recipient provide the 4-digit security OTP directly to the driver.' },
    { title: 'Autonomous Resolution Protection', desc: 'If a driver cancels, the Resolution Agent rebooks a verified replacement within 30 seconds at no extra charge.' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 animate-fadeIn text-slate-900">
        
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-md">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Trust & Safety Standard</span>
              <h2 className="text-xl font-extrabold text-slate-900">DriveWith Safety Commitment</h2>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-900 border border-slate-200 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3 text-xs">
          {safetyFeatures.map((f, idx) => (
            <div key={idx} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
              <div className="flex items-center gap-2 text-slate-900 font-extrabold">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>{f.title}</span>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed pl-6">{f.desc}</p>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition shadow-sm"
        >
          Close & Return to App
        </button>

      </div>
    </div>
  );
};
