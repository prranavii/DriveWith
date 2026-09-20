import React, { useState } from 'react';
import { Star, ShieldCheck, CheckCircle, Clock, Award, AlertCircle, Car, Moon, Navigation, Shield, UserCheck, MessageSquare, ArrowRight, X } from 'lucide-react';
import { DriverProfile } from '../services/driverService';

interface DriverReportModalProps {
  driver: DriverProfile | null;
  onClose: () => void;
  onSelectDriver: (driver: DriverProfile) => void;
}

export const DriverReportModal: React.FC<DriverReportModalProps> = ({
  driver,
  onClose,
  onSelectDriver,
}) => {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'SAFETY' | 'REVIEWS' | 'SKILLS'>('OVERVIEW');

  if (!driver) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 animate-fadeIn max-h-[90vh] overflow-y-auto text-slate-900">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-4">
            <img
              src={driver.profileImage}
              alt={driver.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-200 shadow-sm"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold text-slate-900">{driver.name}</h2>
                <span className="px-2.5 py-0.5 text-[10px] font-extrabold uppercase bg-slate-900 text-white rounded">
                  {driver.badge.replace('_', ' ')}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">Trust & Safety Verified Driver Profile</p>
              <div className="flex items-center gap-3 mt-1 text-xs">
                <span className="flex items-center gap-1 font-bold text-amber-600">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  <span>{driver.rating}</span>
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-600 font-medium">{driver.totalTrips} Trips</span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-900 font-bold">{driver.experienceYears} Yrs Exp</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-900 border border-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
          {(['OVERVIEW', 'SAFETY', 'REVIEWS', 'SKILLS'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 rounded-lg transition ${
                activeTab === tab
                  ? 'bg-slate-900 text-white shadow-sm font-extrabold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab === 'OVERVIEW' ? 'Verifications & Stats' : tab === 'SAFETY' ? 'Safety Record' : tab === 'REVIEWS' ? `Reviews (${driver.reviews.length})` : 'Certified Skills'}
            </button>
          ))}
        </div>

        {/* Tab 1: OVERVIEW & VERIFICATIONS */}
        {activeTab === 'OVERVIEW' && (
          <div className="space-y-6">
            
            {/* Verification Checklist */}
            <div className="space-y-3">
              <h3 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Background & Credential Checks</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-slate-700 font-medium">Government Identity (Aadhaar)</span>
                  <span className="flex items-center gap-1 text-emerald-700 font-extrabold text-[11px]">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Verified
                  </span>
                </div>

                <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-slate-700 font-medium">Commercial Driving License</span>
                  <span className="flex items-center gap-1 text-emerald-700 font-extrabold text-[11px]">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Verified
                  </span>
                </div>

                <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-slate-700 font-medium">Police Criminal Verification</span>
                  <span className="flex items-center gap-1 text-sky-700 font-extrabold text-[11px]">
                    <ShieldCheck className="w-3.5 h-3.5 text-sky-600" /> Checked
                  </span>
                </div>

                <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-slate-700 font-medium">Permanent Address Verification</span>
                  <span className="flex items-center gap-1 text-emerald-700 font-extrabold text-[11px]">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Verified
                  </span>
                </div>
              </div>
            </div>

            {/* Performance Statistics Grid */}
            <div className="space-y-3">
              <h3 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Performance Telemetry</h3>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <div className="text-lg font-extrabold text-slate-900">{driver.stats.onTimePercentage}%</div>
                  <p className="text-[10px] text-slate-500 mt-0.5 font-medium">On-Time Arrival</p>
                </div>
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <div className="text-lg font-extrabold text-slate-900">{driver.stats.cancellationRatePct}%</div>
                  <p className="text-[10px] text-slate-500 mt-0.5 font-medium">Cancellation Rate</p>
                </div>
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <div className="text-lg font-extrabold text-slate-900">{driver.stats.repeatCustomersPct}%</div>
                  <p className="text-[10px] text-slate-500 mt-0.5 font-medium">Repeat Customers</p>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* Tab 2: SAFETY RECORD */}
        {activeTab === 'SAFETY' && (
          <div className="space-y-6">
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Telematics Rating</span>
                <h4 className="text-2xl font-extrabold text-slate-900">{driver.safety.safeDrivingScore} / 100</h4>
                <p className="text-xs text-slate-500 mt-1">Based on smooth braking, acceleration, and speed telemetry</p>
              </div>
              <div className="w-16 h-16 rounded-full bg-slate-900 text-white flex items-center justify-center font-extrabold text-lg shadow-sm">
                {driver.safety.safeDrivingScore}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <span className="text-slate-500">Accident History:</span>
                <p className="text-sm font-extrabold text-emerald-700 mt-1">0 Incidents Reported</p>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <span className="text-slate-500">Customer Complaints:</span>
                <p className="text-sm font-extrabold text-emerald-700 mt-1">0 Active Complaints</p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: REVIEWS LIST */}
        {activeTab === 'REVIEWS' && (
          <div className="space-y-3">
            {driver.reviews.map((rev) => (
              <div key={rev.id} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-slate-900 text-xs">{rev.customerName}</span>
                    <span className="text-[10px] bg-slate-200 px-2 py-0.5 rounded text-slate-800 font-semibold">{rev.tripType}</span>
                  </div>
                  <span className="text-[11px] text-amber-600 font-bold">⭐ {rev.rating}</span>
                </div>
                <p className="text-xs text-slate-700 italic">"{rev.comment}"</p>
                <p className="text-[10px] text-slate-400 text-right">{rev.date}</p>
              </div>
            ))}
          </div>
        )}

        {/* Tab 4: CERTIFIED SKILLS */}
        {activeTab === 'SKILLS' && (
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center gap-2 text-slate-800 font-semibold">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>Automatic Transmission</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center gap-2 text-slate-800 font-semibold">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>Manual Transmission</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center gap-2 text-slate-800 font-semibold">
              <Navigation className="w-4 h-4 text-slate-700" />
              <span>Highway Driving Certified</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center gap-2 text-slate-800 font-semibold">
              <Moon className="w-4 h-4 text-indigo-600" />
              <span>Night Driving Certified</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center gap-2 text-slate-800 font-semibold">
              <Car className="w-4 h-4 text-slate-700" />
              <span>Luxury Vehicle Exp</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center gap-2 text-slate-800 font-semibold">
              <Shield className="w-4 h-4 text-rose-600" />
              <span>Elderly Passenger Care</span>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
          <div className="text-xs text-slate-500">
            <span>Estimated Fare: </span>
            <span className="text-base font-extrabold text-slate-900">₹{driver.estimatedPrice}</span>
          </div>

          <button
            onClick={() => {
              onSelectDriver(driver);
              onClose();
            }}
            className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition shadow-md flex items-center gap-2"
          >
            <span>Select Driver</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
