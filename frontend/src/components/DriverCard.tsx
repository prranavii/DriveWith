import React from 'react';
import { Star, ShieldCheck, Clock, MapPin, CheckCircle, Lock, Heart } from 'lucide-react';
import { DriverProfile } from '../services/driverService';

interface DriverCardProps {
  driver: DriverProfile;
  isCompared: boolean;
  onToggleCompare: (driver: DriverProfile) => void;
  onViewReport: (driver: DriverProfile) => void;
  onSelectDriver: (driver: DriverProfile) => void;
  isTopMatch?: boolean;
}

export const DriverCard: React.FC<DriverCardProps> = ({
  driver,
  isCompared,
  onToggleCompare,
  onViewReport,
  onSelectDriver,
  isTopMatch = false,
}) => {
  return (
    <div className={`bg-white rounded-3xl p-5 border transition-all relative flex flex-col justify-between space-y-4 text-black ${
      isTopMatch
        ? 'border-2 border-black shadow-md ring-1 ring-black/10'
        : 'border-[#E5E7EB] shadow-xs hover:border-gray-400'
    }`}>
      
      {/* Top Header: Badge & Favorite Icon */}
      <div className="flex items-center justify-between">
        {isTopMatch ? (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-black text-white shadow-xs flex items-center gap-1">
            <Star className="w-3 h-3 fill-white text-white" />
            <span>Top Match</span>
          </span>
        ) : (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-[#F8F8F8] text-gray-700 border border-[#E5E7EB]">
            {driver.badge.replace('_', ' ')}
          </span>
        )}

        <button
          type="button"
          onClick={() => onToggleCompare(driver)}
          className={`p-2 rounded-full border transition ${
            isCompared
              ? 'bg-black text-white border-black'
              : 'bg-[#F8F8F8] border-[#E5E7EB] text-gray-400 hover:text-black'
          }`}
          title={isCompared ? 'Remove from Compare' : 'Add to Compare'}
        >
          <Heart className={`w-4 h-4 ${isCompared ? 'fill-white' : ''}`} />
        </button>
      </div>

      {/* Driver Profile Info */}
      <div className="flex flex-col items-center text-center space-y-2 pt-1">
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
          <h3 className="text-base font-black text-black flex items-center justify-center gap-1">
            <span>{driver.name}</span>
          </h3>
          <div className="flex items-center justify-center gap-1 text-xs mt-0.5">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="font-extrabold text-black">{driver.rating}</span>
            <span className="text-gray-500 font-medium">({driver.totalTrips} reviews)</span>
          </div>
          <p className="text-xs text-gray-500 font-semibold mt-0.5">
            {driver.experienceYears} years experience
          </p>
        </div>
      </div>

      {/* Verification Badges (Matching Concept Image 5) */}
      <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
        <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-[#F8F8F8] text-gray-800 border border-[#E5E7EB] flex items-center gap-1">
          <CheckCircle className="w-3 h-3 text-black" /> Verified
        </span>
        <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-[#F8F8F8] text-gray-800 border border-[#E5E7EB] flex items-center gap-1">
          <Lock className="w-3 h-3 text-black" /> License
        </span>
        <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-[#F8F8F8] text-gray-800 border border-[#E5E7EB] flex items-center gap-1">
          <ShieldCheck className="w-3 h-3 text-black" /> Background
        </span>
      </div>

      {/* Distance & ETA Telemetry */}
      <div className="bg-[#F8F8F8] p-2.5 rounded-2xl border border-[#E5E7EB] flex items-center justify-between text-xs text-gray-700 font-bold">
        <span className="flex items-center gap-1">
          <Clock className="w-3.5 h-3.5 text-gray-500" />
          <span>{driver.etaMins} min away</span>
        </span>
        <span className="flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5 text-gray-500" />
          <span>{driver.distanceKm} km</span>
        </span>
      </div>

      {/* Fare Price Tag */}
      <div className="text-center pt-1">
        <span className="text-xl font-black text-black">₹{driver.estimatedPrice}</span>
      </div>

      {/* Action Buttons: View Profile & Select Driver */}
      <div className="grid grid-cols-2 gap-2 pt-1">
        <button
          type="button"
          onClick={() => onViewReport(driver)}
          className="py-2.5 px-3 rounded-2xl bg-[#F8F8F8] hover:bg-gray-200 text-black font-extrabold text-xs transition border border-[#E5E7EB]"
        >
          View Profile
        </button>

        <button
          type="button"
          onClick={() => onSelectDriver(driver)}
          className="py-2.5 px-3 rounded-2xl bg-black hover:bg-gray-800 text-white font-extrabold text-xs transition shadow-sm flex items-center justify-center gap-1"
        >
          <span>Select Driver</span>
        </button>
      </div>

    </div>
  );
};
