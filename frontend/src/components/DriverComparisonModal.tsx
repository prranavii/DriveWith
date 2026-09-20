import React from 'react';
import { X, Star, CheckCircle, Clock, MapPin, ArrowRight, Award } from 'lucide-react';
import { DriverProfile } from '../services/driverService';

interface DriverComparisonModalProps {
  drivers: DriverProfile[];
  onClose: () => void;
  onSelectDriver: (driver: DriverProfile) => void;
  onRemoveFromCompare: (driverId: string) => void;
}

export const DriverComparisonModal: React.FC<DriverComparisonModalProps> = ({
  drivers,
  onClose,
  onSelectDriver,
  onRemoveFromCompare,
}) => {
  if (drivers.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl space-y-6 animate-fadeIn max-h-[90vh] overflow-y-auto text-slate-900">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">Driver Side-by-Side Comparison</h2>
            <p className="text-xs text-slate-500 mt-0.5">Comparing {drivers.length} candidate drivers matched to your trip</p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-900 border border-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Responsive Comparison Table / Grid */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="p-3 text-slate-500 font-extrabold uppercase text-[10px] w-36">Metric / Feature</th>
                {drivers.map((drv) => (
                  <th key={drv.id} className="p-3 min-w-[200px] text-center border-l border-slate-200">
                    <div className="flex flex-col items-center space-y-2">
                      <img src={drv.profileImage} alt={drv.name} className="w-12 h-12 rounded-xl object-cover border border-slate-200 shadow-sm" />
                      <div>
                        <p className="font-extrabold text-slate-900 text-sm">{drv.name}</p>
                        <span className="text-[9px] text-slate-800 font-bold uppercase bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                          {drv.badge.replace('_', ' ')}
                        </span>
                      </div>
                      <button
                        onClick={() => onRemoveFromCompare(drv.id)}
                        className="text-[10px] text-rose-600 hover:underline font-semibold"
                      >
                        Remove
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              
              <tr>
                <td className="p-3 font-bold text-slate-700">Overall Rating</td>
                {drivers.map((drv) => (
                  <td key={drv.id} className="p-3 text-center border-l border-slate-200 font-extrabold text-amber-600">
                    ⭐ {drv.rating} ({drv.totalTrips} trips)
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-3 font-bold text-slate-700">Experience</td>
                {drivers.map((drv) => (
                  <td key={drv.id} className="p-3 text-center border-l border-slate-200 text-slate-900 font-bold">
                    {drv.experienceYears} Years Driving
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-3 font-bold text-slate-700">Distance & ETA</td>
                {drivers.map((drv) => (
                  <td key={drv.id} className="p-3 text-center border-l border-slate-200 text-slate-900 font-bold">
                    {drv.distanceKm} km · ~{drv.etaMins} min
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-3 font-bold text-slate-700">Estimated Fare</td>
                {drivers.map((drv) => (
                  <td key={drv.id} className="p-3 text-center border-l border-slate-200 text-slate-900 font-extrabold text-base">
                    ₹{drv.estimatedPrice}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-3 font-bold text-slate-700">On-Time Rate</td>
                {drivers.map((drv) => (
                  <td key={drv.id} className="p-3 text-center border-l border-slate-200 text-emerald-700 font-extrabold">
                    {drv.stats.onTimePercentage}%
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-3 font-bold text-slate-700">Safe Driving Score</td>
                {drivers.map((drv) => (
                  <td key={drv.id} className="p-3 text-center border-l border-slate-200 text-slate-900 font-bold">
                    {drv.safety.safeDrivingScore} / 100
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-3 font-bold text-slate-700">Languages</td>
                {drivers.map((drv) => (
                  <td key={drv.id} className="p-3 text-center border-l border-slate-200 text-slate-700">
                    {drv.languages.join(', ')}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-3 font-bold text-slate-700">Action</td>
                {drivers.map((drv) => (
                  <td key={drv.id} className="p-3 text-center border-l border-slate-200">
                    <button
                      onClick={() => {
                        onSelectDriver(drv);
                        onClose();
                      }}
                      className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl transition shadow-sm"
                    >
                      Select {drv.name.split(' ')[0]}
                    </button>
                  </td>
                ))}
              </tr>

            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};
