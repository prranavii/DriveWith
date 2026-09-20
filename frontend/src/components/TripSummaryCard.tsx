import React from 'react';
import { Navigation, Clock, UserCheck, ArrowRight, ShieldCheck, Tag } from 'lucide-react';
import { RouteCalculation } from '../services/mapService';

interface TripSummaryCardProps {
  pickupName: string;
  destName: string;
  metrics: RouteCalculation;
  availableDriversCount: number;
  onFindDrivers: () => void;
}

export const TripSummaryCard: React.FC<TripSummaryCardProps> = ({
  pickupName,
  destName,
  metrics,
  availableDriversCount,
  onFindDrivers,
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xl space-y-4 animate-fadeIn">
      
      {/* Route Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
          <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">Trip Route Summary</span>
        </div>
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
          Ready for Matching
        </span>
      </div>

      {/* Pickup -> Destination Route Indicator */}
      <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
        <div className="flex-1 truncate">
          <p className="text-[10px] text-slate-500 font-bold uppercase">Pickup</p>
          <p className="text-xs font-bold text-slate-900 truncate">{pickupName}</p>
        </div>

        <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />

        <div className="flex-1 truncate text-right">
          <p className="text-[10px] text-slate-500 font-bold uppercase">Destination</p>
          <p className="text-xs font-bold text-slate-900 truncate">{destName}</p>
        </div>
      </div>

      {/* Stats Grid: Distance, Duration, Fare, Drivers Count */}
      <div className="grid grid-cols-3 gap-2.5 text-center">
        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
          <div className="text-sm font-extrabold text-slate-900 flex items-center justify-center gap-1">
            <Navigation className="w-3.5 h-3.5 text-slate-700" />
            <span>{metrics.distanceKm} km</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-0.5">Est. Distance</p>
        </div>

        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
          <div className="text-sm font-extrabold text-slate-900 flex items-center justify-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-700" />
            <span>~{metrics.durationMins} min</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-0.5">Est. Time</p>
        </div>

        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
          <div className="text-sm font-extrabold text-slate-900 flex items-center justify-center gap-1">
            <Tag className="w-3.5 h-3.5 text-emerald-600" />
            <span>₹{metrics.estimatedFareMin}–₹{metrics.estimatedFareMax}</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-0.5">Approx. Fare</p>
        </div>
      </div>

      {/* Available Drivers Count & Primary CTA */}
      <div className="pt-1 space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-700 font-medium px-1">
          <span className="flex items-center gap-1.5">
            <UserCheck className="w-4 h-4 text-emerald-600" />
            <span>{availableDriversCount} verified drivers nearby</span>
          </span>
          <span className="text-[10px] text-slate-400 font-mono">100% Verified</span>
        </div>

        <button
          onClick={onFindDrivers}
          className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition shadow-md flex items-center justify-center gap-2"
        >
          <span>Find Available Drivers</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
