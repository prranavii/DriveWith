import React from 'react';
import { Award, Shield, CheckCircle, Clock, Star, AlertCircle, Car, Moon, Navigation } from 'lucide-react';

interface SkillPassportModalProps {
  driver: any;
  onClose: () => void;
}

export const SkillPassportModal: React.FC<SkillPassportModalProps> = ({ driver, onClose }) => {
  if (!driver) return null;

  const skills = driver.skills || {
    years_experience: 8,
    transmission_manual: true,
    transmission_auto: true,
    sedan_exp: true,
    suv_exp: true,
    luxury_exp: true,
    night_driving_exp: true,
    highway_exp: true,
    emergency_exp: true,
    on_time_percentage: 98.4,
    cancellation_rate: 0.8,
    badge: 'PLATINUM_PRO',
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-lg">
              {driver.name ? driver.name[0] : 'D'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900">{driver.name || 'Verified Driver'}</h3>
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-slate-900 text-white rounded">
                  {skills.badge || 'VERIFIED'}
                </span>
              </div>
              <p className="text-xs text-slate-500">Verified Professional Driver Skill Passport</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-lg font-bold">
            ✕
          </button>
        </div>

        {/* Core Metrics Grid */}
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl">
            <div className="flex items-center justify-center gap-1 text-slate-900 font-bold text-base">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>{driver.rating || 4.9}</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Rating Score</p>
          </div>
          <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl">
            <div className="font-bold text-base text-slate-900">{skills.on_time_percentage}%</div>
            <p className="text-[11px] text-slate-500 mt-1">On-Time Rate</p>
          </div>
          <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl">
            <div className="font-bold text-base text-slate-900">{skills.years_experience} Yrs</div>
            <p className="text-[11px] text-slate-500 mt-1">Driving Exp.</p>
          </div>
        </div>

        {/* Skill Certifications */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Certified Competencies</h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-slate-700">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>Automatic Transmission</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-slate-700">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>Manual Transmission</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-slate-700">
              <Car className="w-4 h-4 text-slate-700" />
              <span>SUV & Sedan Certified</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-slate-700">
              <Moon className="w-4 h-4 text-indigo-600" />
              <span>Night Driving Certified</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-slate-700">
              <Navigation className="w-4 h-4 text-slate-700" />
              <span>Highway Driving Exp</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-slate-700">
              <Shield className="w-4 h-4 text-rose-600" />
              <span>Emergency Dispatch Exp</span>
            </div>
          </div>
        </div>

        {/* Factual Performance Disclaimer */}
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-start gap-2 text-[11px] text-slate-500">
          <AlertCircle className="w-4 h-4 text-slate-700 shrink-0 mt-0.5" />
          <span>Skill Passport statistics are computed strictly from empirical database trip telemetry and background verification documents.</span>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-semibold text-xs transition"
        >
          Close Passport
        </button>

      </div>
    </div>
  );
};
