import React from 'react';
import { Star, ShieldCheck, Clock, MapPin, CheckCircle, Car, Languages, FileText, ArrowRight } from 'lucide-react';
import { DriverProfile } from '../services/driverService';

interface DriverCardProps {
  driver: DriverProfile;
  isCompared: boolean;
  onToggleCompare: (driver: DriverProfile) => void;
  onViewReport: (driver: DriverProfile) => void;
  onSelectDriver: (driver: DriverProfile) => void;
}

export const DriverCard: React.FC<DriverCardProps> = ({
  driver,
  isCompared,
  onToggleCompare,
  onViewReport,
  onSelectDriver,
}) => {
  return (
    <div className="bg-white border border-slate-200/90 hover:border-slate-300 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all space-y-4 relative group text-slate-900">
      
      {/* Top Header: Photo, Name, Badge, Price */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <img
            src={driver.profileImage}
            alt={driver.name}
            className="w-14 h-14 rounded-2xl object-cover border-2 border-slate-200 group-hover:border-slate-400 transition shadow-xs"
          />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-extrabold text-slate-900">{driver.name}</h3>
              <span className="px-2 py-0.5 text-[9px] font-extrabold uppercase bg-slate-100 text-slate-800 border border-slate-200 rounded">
                {driver.badge.replace('_', ' ')}
              </span>
            </div>

            <div className="flex items-center gap-2 mt-1 text-xs">
              <span className="flex items-center gap-1 font-bold text-amber-600">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                <span>{driver.rating}</span>
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-600 font-medium">{driver.totalTrips.toLocaleString()} trips</span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-600 font-medium">{driver.experienceYears} yrs exp</span>
            </div>
          </div>
        </div>

        {/* Estimated Price */}
        <div className="text-right">
          <div className="text-lg font-extrabold text-slate-900">₹{driver.estimatedPrice}</div>
          <span className="text-[10px] text-slate-500 font-medium">Estimated Fare</span>
        </div>
      </div>

      {/* Verification Badges */}
      <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100">
        <span className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <ShieldCheck className="w-3 h-3 text-emerald-600" /> Identity Verified
        </span>
        <span className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <CheckCircle className="w-3 h-3 text-emerald-600" /> License Verified
        </span>
        <span className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-sky-50 text-sky-700 border border-sky-200">
          <ShieldCheck className="w-3 h-3 text-sky-600" /> Background Checked
        </span>
      </div>

      {/* Driver Location & Distance/ETA */}
      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 flex items-center justify-between text-xs text-slate-700">
        <div className="flex items-center gap-1.5 font-semibold text-slate-900">
          <MapPin className="w-3.5 h-3.5 text-slate-600" />
          <span>{driver.distanceKm} km away</span>
        </div>
        <div className="flex items-center gap-1.5 font-semibold text-slate-900">
          <Clock className="w-3.5 h-3.5 text-slate-600" />
          <span>Arrives in ~{driver.etaMins} min</span>
        </div>
        <div className="flex items-center gap-1 text-slate-500 text-[11px]">
          <Languages className="w-3 h-3 text-slate-400" />
          <span>{driver.languages.join(', ')}</span>
        </div>
      </div>

      {/* Vehicle Compatibility Tags */}
      <div className="flex items-center justify-between text-[11px] text-slate-500">
        <div className="flex items-center gap-1">
          <Car className="w-3.5 h-3.5 text-slate-600" />
          <span>Vehicle Support:</span>
          <span className="text-slate-900 font-bold">{driver.transmissionSupport.join('/')} • {driver.vehicleTypesSupport.slice(0, 3).join('/')}</span>
        </div>
      </div>

      {/* Action Buttons: Compare, View Report, Select Driver */}
      <div className="pt-2 flex items-center gap-2 border-t border-slate-100">
        <button
          type="button"
          onClick={() => onToggleCompare(driver)}
          className={`px-3 py-2 rounded-xl text-xs font-semibold border transition ${
            isCompared
              ? 'bg-slate-900 text-white border-slate-900 font-bold'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
          }`}
        >
          {isCompared ? '✓ Compared' : '+ Compare'}
        </button>

        <button
          type="button"
          onClick={() => onViewReport(driver)}
          className="flex-1 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl border border-slate-200 transition flex items-center justify-center gap-1"
        >
          <FileText className="w-3.5 h-3.5 text-slate-600" />
          <span>View Report</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectDriver(driver)}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl transition shadow-sm flex items-center gap-1"
        >
          <span>Select</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
};
