import React, { useState, useRef, useEffect } from 'react';
import { MapPin, Navigation, X, ArrowUpDown, Search, Car, Sliders, Zap, ChevronDown, Sparkles, Clock, Calendar, ArrowRight } from 'lucide-react';
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
  onOpenAiConcierge?: () => void;
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
  onOpenAiConcierge,
}) => {
  const [bookingMode, setBookingMode] = useState<'MANUAL' | 'AI'>('MANUAL');
  const [aiPrompt, setAiPrompt] = useState('');
  const [activeInput, setActiveInput] = useState<'PICKUP' | 'DEST' | null>(null);
  const [loadingGeo, setLoadingGeo] = useState(false);
  const [suggestions, setSuggestions] = useState<LocationItem[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const sampleAiPrompts = [
    "Driver for office from Noida to Gurgaon at 9 AM",
    "Airport drop tomorrow morning",
    "Take my parents to the hospital",
  ];

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

  const handleApplyAiSamplePrompt = (prompt: string) => {
    setAiPrompt(prompt);
    if (prompt.includes("Noida to Gurgaon")) {
      onPickupChange("Sector 62, Noida, UP");
      onDestChange("DLF Cyber City, Gurgaon, HR");
    } else if (prompt.includes("Airport")) {
      onPickupChange("Sector 62, Noida, UP");
      onDestChange("IGI Airport T3, New Delhi");
    } else {
      onPickupChange("Sector 62, Noida, UP");
      onDestChange("Max Super Speciality Hospital, Saket");
    }
  };

  return (
    <div ref={containerRef} className="relative bg-white border border-[#E5E7EB] rounded-3xl p-5 shadow-sm space-y-4 text-[#111111]">
      
      {/* Dual Mode Switcher: Book a Driver / Ask AI (Matching Reference Image 3) */}
      <div className="flex items-center bg-[#F8F8F8] p-1.5 rounded-2xl border border-[#E5E7EB]">
        <button
          type="button"
          onClick={() => setBookingMode('MANUAL')}
          className={`flex-1 py-2 rounded-xl text-xs font-extrabold transition-all ${
            bookingMode === 'MANUAL'
              ? 'bg-black text-white shadow-xs'
              : 'text-gray-600 hover:text-black'
          }`}
        >
          <span>Book a Driver</span>
        </button>

        <button
          type="button"
          onClick={() => setBookingMode('AI')}
          className={`flex-1 py-2 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all ${
            bookingMode === 'AI'
              ? 'bg-black text-white shadow-xs'
              : 'text-gray-600 hover:text-black'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-gray-300" />
          <span>Ask AI</span>
        </button>
      </div>

      {/* Book with AI Prompt Box */}
      {bookingMode === 'AI' && (
        <div className="bg-[#F8F8F8] border border-[#E5E7EB] rounded-2xl p-3.5 space-y-3 animate-fadeIn">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-black flex items-center gap-1">✦ Tell us where you need a driver...</span>
          </div>
          <input
            type="text"
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            placeholder="e.g. 'Take my parents from Noida to airport tomorrow at 6 AM'"
            className="w-full bg-white border border-[#E5E7EB] rounded-xl px-3.5 py-2.5 text-xs text-black font-medium placeholder:text-gray-400 focus:outline-none focus:border-black"
          />
          <div className="space-y-1.5">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">Try asking:</p>
            <div className="flex flex-wrap gap-1.5">
              {sampleAiPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleApplyAiSamplePrompt(prompt)}
                  className="text-[10px] font-semibold text-gray-700 bg-white border border-[#E5E7EB] hover:border-black px-2.5 py-1 rounded-lg transition"
                >
                  "{prompt}"
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Location Inputs Group with Node Connectors (Matching Reference Image 3) */}
      <div className="relative flex items-center gap-3">
        
        {/* Left Node Vertical Line */}
        <div className="flex flex-col items-center justify-between py-3 h-24 shrink-0">
          <div className="w-3.5 h-3.5 rounded-full bg-emerald-600 border-2 border-emerald-200 shadow-xs flex items-center justify-center">
            <span className="w-1 h-1 rounded-full bg-white"></span>
          </div>

          <div className="w-0.5 flex-1 border-l-2 border-dashed border-gray-300 my-1"></div>

          <div className="w-3.5 h-3.5 rounded-full bg-rose-500 border-2 border-rose-200 shadow-xs flex items-center justify-center">
            <span className="w-1 h-1 rounded-full bg-white"></span>
          </div>
        </div>

        {/* Inputs */}
        <div className="flex-1 space-y-2.5">
          
          {/* Pickup Input */}
          <div className="relative bg-[#F8F8F8] border border-[#E5E7EB] rounded-2xl px-3.5 py-2 hover:border-gray-400 transition">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
              Your current location
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
                placeholder="Sector 62, Noida, UP"
                className="w-full bg-transparent text-xs sm:text-sm font-black text-black placeholder:text-gray-400 focus:outline-none pr-6"
              />
              {pickupValue ? (
                <button
                  type="button"
                  onClick={() => onPickupChange('')}
                  className="text-gray-400 hover:text-black"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleUseGPS}
                  disabled={loadingGeo}
                  title="Detect GPS"
                  className="text-black hover:text-gray-700"
                >
                  <Navigation className={`w-3.5 h-3.5 ${loadingGeo ? 'animate-spin' : ''}`} />
                </button>
              )}
            </div>
          </div>

          {/* Destination Input */}
          <div className="relative bg-[#F8F8F8] border border-[#E5E7EB] rounded-2xl px-3.5 py-2 hover:border-gray-400 transition">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
              Where do you want to go?
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
                placeholder="DLF Cyber City, Gurgaon, HR"
                className="w-full bg-transparent text-xs sm:text-sm font-black text-black placeholder:text-gray-400 focus:outline-none pr-6"
              />
              {destValue && (
                <button
                  type="button"
                  onClick={() => onDestChange('')}
                  className="text-gray-400 hover:text-black"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

        </div>

        {/* Swap Button */}
        {onSwapLocations && (
          <button
            type="button"
            onClick={onSwapLocations}
            className="w-10 h-10 rounded-full bg-[#F8F8F8] hover:bg-gray-200 border border-[#E5E7EB] text-black flex items-center justify-center shadow-xs transition shrink-0"
            title="Swap Locations"
          >
            <ArrowUpDown className="w-4 h-4" />
          </button>
        )}

      </div>

      {/* Selectors Row: Vehicle, Transmission, Service */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-[#F8F8F8] border border-[#E5E7EB] rounded-2xl p-2.5 flex items-center justify-between gap-1 cursor-pointer hover:border-gray-400 transition">
          <div className="min-w-0">
            <p className="text-[9px] font-bold text-gray-400 uppercase">Vehicle</p>
            <select
              value={vehicleType}
              onChange={(e) => onVehicleTypeChange && onVehicleTypeChange(e.target.value)}
              className="bg-transparent font-black text-xs text-black focus:outline-none cursor-pointer w-full"
            >
              <option value="Sedan">Sedan</option>
              <option value="SUV">SUV</option>
              <option value="Hatchback">Hatchback</option>
              <option value="Luxury">Luxury</option>
            </select>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-gray-400 shrink-0 pointer-events-none" />
        </div>

        <div className="bg-[#F8F8F8] border border-[#E5E7EB] rounded-2xl p-2.5 flex items-center justify-between gap-1 cursor-pointer hover:border-gray-400 transition">
          <div className="min-w-0">
            <p className="text-[9px] font-bold text-gray-400 uppercase">Transmission</p>
            <select
              value={transmission}
              onChange={(e) => onTransmissionChange && onTransmissionChange(e.target.value)}
              className="bg-transparent font-black text-xs text-black focus:outline-none cursor-pointer w-full"
            >
              <option value="Automatic">Automatic</option>
              <option value="Manual">Manual</option>
            </select>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-gray-400 shrink-0 pointer-events-none" />
        </div>

        <div className="bg-[#F8F8F8] border border-[#E5E7EB] rounded-2xl p-2.5 flex items-center justify-between gap-1 cursor-pointer hover:border-gray-400 transition">
          <div className="min-w-0">
            <p className="text-[9px] font-bold text-gray-400 uppercase">When</p>
            <select
              value={serviceType === 'Schedule' ? 'Schedule' : 'Now'}
              onChange={(e) => onServiceTypeChange && onServiceTypeChange(e.target.value)}
              className="bg-transparent font-black text-xs text-black focus:outline-none cursor-pointer w-full"
            >
              <option value="Now">Now</option>
              <option value="Schedule">Schedule</option>
            </select>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-gray-400 shrink-0 pointer-events-none" />
        </div>
      </div>

      {/* Primary Black CTA Button (Matching Reference Image 4) */}
      <button
        type="button"
        onClick={onFindDrivers}
        disabled={!pickupValue || !destValue}
        className="w-full py-4 bg-black hover:bg-gray-800 disabled:opacity-40 text-white font-black text-sm rounded-2xl transition shadow-md flex items-center justify-center gap-2"
      >
        <span>Find Available Drivers</span>
        <ArrowRight className="w-4 h-4" />
      </button>

      {/* Autocomplete Dropdown */}
      {activeInput && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-[#E5E7EB] rounded-2xl shadow-2xl z-30 max-h-56 overflow-y-auto divide-y divide-gray-100 animate-fadeIn">
          {activeInput === 'PICKUP' && (
            <button
              type="button"
              onClick={handleUseGPS}
              className="w-full text-left p-3 hover:bg-[#F8F8F8] flex items-center gap-2.5 text-xs text-black font-bold border-b border-gray-100 transition"
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
              className="w-full text-left p-3 hover:bg-[#F8F8F8] flex items-start gap-2.5 text-xs transition"
            >
              <MapPin className={`w-4 h-4 shrink-0 mt-0.5 ${activeInput === 'PICKUP' ? 'text-emerald-600' : 'text-rose-600'}`} />
              <div>
                <p className="font-bold text-black">{item.name}</p>
                <p className="text-[10px] text-gray-500 mt-0.5">{item.address}</p>
              </div>
            </button>
          ))}
        </div>
      )}

    </div>
  );
};
