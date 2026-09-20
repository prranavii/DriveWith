import React, { useState, useRef, useEffect } from 'react';
import { MapPin, Navigation, X, ArrowUpDown, Search, Car, Sliders, Zap, ChevronDown } from 'lucide-react';
import { LocationItem, getCurrentUserLocation, searchLocations } from '../services/locationService';

interface ConnectedRouteInputCardProps {
  pickupValue: string;
  destValue: string;
  onPickupChange: (val: string, item?: LocationItem) => void;
  onDestChange: (val: string, item?: LocationItem) => void;
  onSwapLocations?: () => void;
  vehicleType?: string;
  onVehicleTypeChange?: (val: string) => void;
  transmission?: string;
  onTransmissionChange?: (val: string) => void;
  serviceType?: string;
  onServiceTypeChange?: (val: string) => void;
  onFindDrivers?: () => void;
}

export const ConnectedRouteInputCard: React.FC<ConnectedRouteInputCardProps> = ({
  pickupValue,
  destValue,
  onPickupChange,
  onDestChange,
  onSwapLocations,
  vehicleType = 'Sedan',
  onVehicleTypeChange,
  transmission = 'Automatic',
  onTransmissionChange,
  serviceType = 'Instant Ride',
  onServiceTypeChange,
  onFindDrivers,
}) => {
  const [activeInput, setActiveInput] = useState<'PICKUP' | 'DEST' | null>(null);
  const [loadingGeo, setLoadingGeo] = useState(false);
  const [suggestions, setSuggestions] = useState<LocationItem[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentQuery = activeInput === 'PICKUP' ? pickupValue : activeInput === 'DEST' ? destValue : '';

  useEffect(() => {
    setSuggestions(searchLocations(currentQuery));
  }, [currentQuery]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setActiveInput(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleUseGPS = async () => {
    setLoadingGeo(true);
    try {
      const loc = await getCurrentUserLocation();
      const currentItem: LocationItem = {
        id: 'geo-user',
        name: loc.address,
        address: loc.address,
        lat: loc.lat,
        lng: loc.lng,
        city: 'Local Area',
      };
      onPickupChange(loc.address, currentItem);
      setActiveInput(null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingGeo(false);
    }
  };

  const handleSelectSuggestion = (item: LocationItem) => {
    if (activeInput === 'PICKUP') {
      onPickupChange(item.name, item);
    } else if (activeInput === 'DEST') {
      onDestChange(item.name, item);
    }
    setActiveInput(null);
  };

  return (
    <div ref={containerRef} className="relative bg-white border border-slate-200/90 rounded-3xl p-4 sm:p-6 shadow-xl space-y-4">
      
      {/* Location Inputs Group with Dotted Connection Line & Swap Button */}
      <div className="relative flex items-center gap-3">
        
        {/* Left Vertical Node Connection Line */}
        <div className="flex flex-col items-center justify-between py-3 h-24 shrink-0">
          {/* Green Pickup Pin Dot */}
          <div className="w-3.5 h-3.5 rounded-full bg-emerald-600 border-2 border-emerald-200 shadow-xs flex items-center justify-center">
            <span className="w-1 h-1 rounded-full bg-white"></span>
          </div>

          {/* Vertical Dashed Line */}
          <div className="w-0.5 flex-1 border-l-2 border-dashed border-slate-300 my-1"></div>

          {/* Red Destination Pin Icon */}
          <div className="w-3.5 h-3.5 rounded-full bg-rose-500 border-2 border-rose-200 shadow-xs flex items-center justify-center">
            <span className="w-1 h-1 rounded-full bg-white"></span>
          </div>
        </div>

        {/* Inputs Stack */}
        <div className="flex-1 space-y-2.5">
          
          {/* Pickup Input Container */}
          <div className="relative bg-slate-50 border border-slate-200/80 rounded-2xl px-3.5 py-2 hover:border-slate-300 transition">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Pickup Location
            </label>
            <div className="flex items-center justify-between">
              <input
                type="text"
                value={pickupValue}
                onChange={(e) => {
                  onPickupChange(e.target.value);
                  setActiveInput('PICKUP');
                }}
                onFocus={() => setActiveInput('PICKUP')}
                placeholder="Enter Pickup Location"
                className="w-full bg-transparent text-xs sm:text-sm font-extrabold text-slate-900 placeholder:text-slate-400 focus:outline-none pr-6"
              />
              {pickupValue ? (
                <button
                  type="button"
                  onClick={() => onPickupChange('')}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleUseGPS}
                  disabled={loadingGeo}
                  title="Detect GPS"
                  className="text-emerald-600 hover:text-emerald-700"
                >
                  <Navigation className={`w-3.5 h-3.5 ${loadingGeo ? 'animate-spin' : ''}`} />
                </button>
              )}
            </div>
          </div>

          {/* Destination Input Container */}
          <div className="relative bg-slate-50 border border-slate-200/80 rounded-2xl px-3.5 py-2 hover:border-slate-300 transition">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Destination
            </label>
            <div className="flex items-center justify-between">
              <input
                type="text"
                value={destValue}
                onChange={(e) => {
                  onDestChange(e.target.value);
                  setActiveInput('DEST');
                }}
                onFocus={() => setActiveInput('DEST')}
                placeholder="Enter Destination"
                className="w-full bg-transparent text-xs sm:text-sm font-extrabold text-slate-900 placeholder:text-slate-400 focus:outline-none pr-6"
              />
              {destValue && (
                <button
                  type="button"
                  onClick={() => onDestChange('')}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

        </div>

        {/* Swap Button (Matching Reference Image) */}
        {onSwapLocations && (
          <button
            type="button"
            onClick={onSwapLocations}
            className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200/80 text-slate-700 flex items-center justify-center shadow-xs transition shrink-0"
            title="Swap Locations"
          >
            <ArrowUpDown className="w-4 h-4" />
          </button>
        )}

      </div>

      {/* 3 Selectable Compact Filter Option Cards (Matching Reference Image) */}
      <div className="grid grid-cols-3 gap-2">
        {/* Vehicle Type Filter Card */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-2.5 flex items-center justify-between gap-1.5 cursor-pointer hover:border-slate-300 transition">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-6 h-6 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-700 shrink-0">
              <Car className="w-3.5 h-3.5" />
            </div>
            <div className="truncate">
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">Vehicle Type</p>
              <select
                value={vehicleType}
                onChange={(e) => onVehicleTypeChange && onVehicleTypeChange(e.target.value)}
                className="bg-transparent font-extrabold text-xs text-slate-900 focus:outline-none cursor-pointer w-full"
              >
                <option value="Sedan">Sedan</option>
                <option value="SUV">SUV</option>
                <option value="Hatchback">Hatchback</option>
                <option value="Luxury">Luxury</option>
              </select>
            </div>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0 pointer-events-none" />
        </div>

        {/* Transmission Filter Card */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-2.5 flex items-center justify-between gap-1.5 cursor-pointer hover:border-slate-300 transition">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-6 h-6 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-700 shrink-0">
              <Sliders className="w-3.5 h-3.5" />
            </div>
            <div className="truncate">
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">Transmission</p>
              <select
                value={transmission}
                onChange={(e) => onTransmissionChange && onTransmissionChange(e.target.value)}
                className="bg-transparent font-extrabold text-xs text-slate-900 focus:outline-none cursor-pointer w-full"
              >
                <option value="Automatic">Automatic</option>
                <option value="Manual">Manual</option>
                <option value="ALL">All</option>
              </select>
            </div>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0 pointer-events-none" />
        </div>

        {/* Service Type Filter Card */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-2.5 flex items-center justify-between gap-1.5 cursor-pointer hover:border-slate-300 transition">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-6 h-6 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-700 shrink-0">
              <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            </div>
            <div className="truncate">
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">Service Type</p>
              <select
                value={serviceType}
                onChange={(e) => onServiceTypeChange && onServiceTypeChange(e.target.value)}
                className="bg-transparent font-extrabold text-xs text-slate-900 focus:outline-none cursor-pointer w-full"
              >
                <option value="Instant Ride">Instant Ride</option>
                <option value="Schedule">Schedule</option>
                <option value="Outstation">Outstation</option>
              </select>
            </div>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0 pointer-events-none" />
        </div>
      </div>

      {/* Find Drivers Primary CTA Button (Matching Reference Image) */}
      <button
        type="button"
        onClick={onFindDrivers}
        disabled={!pickupValue || !destValue}
        className="w-full py-4 bg-[#004d40] hover:bg-[#043b32] disabled:opacity-40 text-white font-extrabold text-sm rounded-2xl transition shadow-lg shadow-[#004d40]/25 flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99]"
      >
        <Search className="w-4.5 h-4.5" />
        <span>Find Drivers</span>
        <span className="text-emerald-300 font-bold ml-1">›</span>
      </button>

      {/* Autocomplete Suggestions Dropdown */}
      {activeInput && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-slate-200 rounded-2xl shadow-2xl z-30 max-h-56 overflow-y-auto divide-y divide-slate-100 animate-fadeIn">
          {activeInput === 'PICKUP' && (
            <button
              type="button"
              onClick={handleUseGPS}
              className="w-full text-left p-3 hover:bg-slate-50 flex items-center gap-2.5 text-xs text-emerald-600 font-bold border-b border-slate-100 transition"
            >
              <Navigation className="w-4 h-4 shrink-0" />
              <span>Detect My Current Location (GPS)</span>
            </button>
          )}

          {suggestions.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleSelectSuggestion(item)}
              className="w-full text-left p-3 hover:bg-slate-50 flex items-start gap-2.5 text-xs transition"
            >
              <MapPin className={`w-4 h-4 shrink-0 mt-0.5 ${activeInput === 'PICKUP' ? 'text-emerald-500' : 'text-rose-500'}`} />
              <div>
                <p className="font-bold text-slate-900">{item.name}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">{item.address}</p>
              </div>
            </button>
          ))}
        </div>
      )}

    </div>
  );
};
