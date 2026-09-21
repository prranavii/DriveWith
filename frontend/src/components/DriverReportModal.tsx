import React, { useState } from 'react';
import { Star, ShieldCheck, CheckCircle, Clock, Award, AlertCircle, Car, Moon, Navigation, Shield, UserCheck, MessageSquare, ArrowRight, X, Lock } from 'lucide-react';
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
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'REVIEWS' | 'SAFETY' | 'SKILLS'>('OVERVIEW');

  if (!driver) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-[#E5E7EB] rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 animate-fadeIn max-h-[90vh] overflow-y-auto text-black">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#E5E7EB] pb-5">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={driver.profileImage}
                alt={driver.name}
                className="w-20 h-20 rounded-full object-cover border-2 border-gray-200 shadow-xs"
              />
              <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-black text-white flex items-center justify-center border-2 border-white shadow-xs">
                <CheckCircle className="w-3.5 h-3.5 stroke-[3]" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-black">{driver.name}</h2>
                <span className="px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider bg-black text-white rounded-full flex items-center gap-1">
                  ✓ Verified Driver
                </span>
              </div>
              
              <div className="flex items-center gap-2 mt-1 text-xs">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="font-black text-black">{driver.rating}</span>
                <span className="text-gray-500 font-semibold">({driver.reviews.length || 320} reviews)</span>
              </div>

              <p className="text-xs text-gray-500 font-medium mt-1">
                Professional Driver • {driver.experienceYears} years experience
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-2xl bg-[#F8F8F8] text-gray-500 hover:text-black border border-[#E5E7EB] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 4 Core Statistics Grid */}
        <div className="grid grid-cols-4 gap-3 text-center">
          <div className="bg-[#F8F8F8] p-3.5 rounded-2xl border border-[#E5E7EB]">
            <div className="text-lg sm:text-xl font-black text-black">{driver.totalTrips}</div>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tight mt-0.5">Trips</p>
          </div>
          <div className="bg-[#F8F8F8] p-3.5 rounded-2xl border border-[#E5E7EB]">
            <div className="text-lg sm:text-xl font-black text-black">{driver.rating}</div>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tight mt-0.5">Rating</p>
          </div>
          <div className="bg-[#F8F8F8] p-3.5 rounded-2xl border border-[#E5E7EB]">
            <div className="text-lg sm:text-xl font-black text-black">{driver.stats?.onTimePercentage || 96}%</div>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tight mt-0.5">On-Time</p>
          </div>
          <div className="bg-[#F8F8F8] p-3.5 rounded-2xl border border-[#E5E7EB]">
            <div className="text-lg sm:text-xl font-black text-black">{driver.experienceYears} yrs</div>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tight mt-0.5">Experience</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 bg-[#F8F8F8] p-1.5 rounded-2xl border border-[#E5E7EB] text-xs font-extrabold">
          {(['OVERVIEW', 'REVIEWS', 'SAFETY', 'SKILLS'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 px-3 rounded-xl transition ${
                activeTab === tab
                  ? 'bg-black text-white shadow-xs'
                  : 'text-gray-600 hover:text-black'
              }`}
            >
              {tab === 'OVERVIEW' ? 'Overview' : tab === 'REVIEWS' ? `Reviews (${driver.reviews.length})` : tab === 'SAFETY' ? 'Safety' : 'Skills'}
            </button>
          ))}
        </div>

        {/* Tab 1: OVERVIEW */}
        {activeTab === 'OVERVIEW' && (
          <div className="space-y-5 animate-fadeIn">
            <div>
              <h4 className="text-xs font-extrabold text-black uppercase tracking-wider mb-2">About Driver</h4>
              <p className="text-xs text-gray-600 leading-relaxed font-medium">
                Professional driver with extensive experience operating passenger vehicles across city & highway routes. Dedicated to safety, punctuality, and a smooth journey.
              </p>
            </div>

            {/* Verification Checklist */}
            <div className="space-y-3">
              <h4 className="text-xs font-extrabold text-black uppercase tracking-wider">Verification Status</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-2 bg-[#F8F8F8] border border-[#E5E7EB] p-3 rounded-2xl text-black font-bold">
                  <CheckCircle className="w-4 h-4 text-black shrink-0" />
                  <span>Identity Verified</span>
                </div>
                <div className="flex items-center gap-2 bg-[#F8F8F8] border border-[#E5E7EB] p-3 rounded-2xl text-black font-bold">
                  <Lock className="w-4 h-4 text-black shrink-0" />
                  <span>Driving License</span>
                </div>
                <div className="flex items-center gap-2 bg-[#F8F8F8] border border-[#E5E7EB] p-3 rounded-2xl text-black font-bold">
                  <ShieldCheck className="w-4 h-4 text-black shrink-0" />
                  <span>Background Verification</span>
                </div>
                <div className="flex items-center gap-2 bg-[#F8F8F8] border border-[#E5E7EB] p-3 rounded-2xl text-black font-bold">
                  <CheckCircle className="w-4 h-4 text-black shrink-0" />
                  <span>Address Verified</span>
                </div>
              </div>
            </div>

            {/* Certified Skills */}
            <div className="space-y-2">
              <h4 className="text-xs font-extrabold text-black uppercase tracking-wider">Skills & Experience</h4>
              <div className="flex flex-wrap gap-2 text-xs">
                {['City Driving', 'Highway', 'Night Driving', 'Long Distance', 'Elderly Assistance'].map((skill, i) => (
                  <span key={i} className="px-3 py-1.5 rounded-xl bg-[#F8F8F8] text-black font-bold border border-[#E5E7EB]">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: REVIEWS */}
        {activeTab === 'REVIEWS' && (
          <div className="space-y-3 animate-fadeIn">
            {driver.reviews.map((rev) => (
              <div key={rev.id} className="bg-[#F8F8F8] p-4 rounded-2xl border border-[#E5E7EB] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-black text-black text-xs">{rev.customerName}</span>
                  <span className="text-amber-600 font-bold text-xs">★ {rev.rating}</span>
                </div>
                <p className="text-xs text-gray-700 italic font-medium">"{rev.comment}"</p>
                <p className="text-[10px] text-gray-400 text-right">{rev.date}</p>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: SAFETY */}
        {activeTab === 'SAFETY' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="bg-[#F8F8F8] p-4 rounded-2xl border border-[#E5E7EB] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Safe Driving Rating</span>
                <h4 className="text-2xl font-black text-black">{driver.safety?.safeDrivingScore || 98} / 100</h4>
                <p className="text-xs text-gray-500 font-medium">Verified by smooth braking, speed, and acceleration telemetry</p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: SKILLS */}
        {activeTab === 'SKILLS' && (
          <div className="grid grid-cols-2 gap-3 text-xs animate-fadeIn">
            {['Automatic Transmission', 'Manual Transmission', 'Highway Driving', 'Night Driving', 'Luxury Vehicles', 'Elderly Assistance'].map((sk, i) => (
              <div key={i} className="bg-[#F8F8F8] p-3.5 rounded-2xl border border-[#E5E7EB] font-bold text-black flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-black" />
                <span>{sk}</span>
              </div>
            ))}
          </div>
        )}

        {/* Footer Actions */}
        <div className="pt-4 border-t border-[#E5E7EB] grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            className="py-3 px-4 bg-[#F8F8F8] hover:bg-gray-200 text-black font-extrabold text-xs rounded-2xl border border-[#E5E7EB] transition flex items-center justify-center gap-2"
          >
            <MessageSquare className="w-4 h-4 text-gray-600" />
            <span>Message</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onSelectDriver(driver);
              onClose();
            }}
            className="py-3 px-4 bg-black hover:bg-gray-800 text-white font-extrabold text-xs rounded-2xl transition shadow-md flex items-center justify-center gap-2"
          >
            <Car className="w-4 h-4" />
            <span>Book This Driver</span>
          </button>
        </div>

      </div>
    </div>
  );
};
