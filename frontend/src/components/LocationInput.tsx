import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Navigation, X, Check, Search, AlertCircle } from 'lucide-react';
import { LocationItem, getCurrentUserLocation, searchLocations } from '../services/locationService';

interface LocationInputProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (val: string, item?: LocationItem) => void;
  onSelectLocation?: (item: LocationItem) => void;
  isPickup?: boolean;
  iconColor?: string;
}

export const LocationInput: React.FC<LocationInputProps> = ({
  label,
  placeholder,
  value,
  onChange,
  onSelectLocation,
  isPickup = false,
  iconColor = 'text-teal-400',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loadingGeo, setLoadingGeo] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<LocationItem[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSuggestions(searchLocations(value));
  }, [value]);

  // Click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleUseCurrentLocation = async () => {
    setLoadingGeo(true);
    setGeoError(null);
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
      onChange(loc.address, currentItem);
      if (onSelectLocation) onSelectLocation(currentItem);
      setIsOpen(false);
    } catch (err: any) {
      setGeoError(err.message || 'Location permission denied');
    } finally {
      setLoadingGeo(false);
    }
  };

  const handleSelectItem = (item: LocationItem) => {
    onChange(item.name, item);
    if (onSelectLocation) onSelectLocation(item);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative space-y-1.5 w-full">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
          <MapPin className={`w-3.5 h-3.5 ${iconColor}`} />
          <span>{label}</span>
        </label>
        {isPickup && (
          <button
            type="button"
            onClick={handleUseCurrentLocation}
            disabled={loadingGeo}
            className="text-[11px] font-bold text-slate-900 hover:text-slate-700 flex items-center gap-1 transition"
          >
            <Navigation className={`w-3 h-3 ${loadingGeo ? 'animate-spin' : ''}`} />
            <span>{loadingGeo ? 'Locating...' : 'Use Current Location'}</span>
          </button>
        )}
      </div>

      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="w-full bg-white border border-slate-200 focus:border-slate-400 rounded-xl px-3.5 py-3 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 pr-8 shadow-xs transition"
        />

        {value && (
          <button
            type="button"
            onClick={() => {
              onChange('');
              setIsOpen(true);
            }}
            className="absolute right-2.5 top-3 text-slate-400 hover:text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {geoError && (
        <div className="flex items-center gap-1.5 text-[11px] text-amber-600 pt-0.5">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{geoError}</span>
        </div>
      )}

      {/* Autocomplete Suggestions Dropdown */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-slate-200 rounded-xl shadow-xl z-30 max-h-56 overflow-y-auto divide-y divide-slate-100 animate-fadeIn">
          {isPickup && (
            <button
              type="button"
              onClick={handleUseCurrentLocation}
              className="w-full text-left p-3 hover:bg-slate-50 flex items-center gap-2.5 text-xs text-slate-900 font-bold border-b border-slate-100 transition"
            >
              <Navigation className="w-4 h-4 shrink-0 text-slate-900" />
              <span>Detect My Current Location (GPS)</span>
            </button>
          )}

          {suggestions.length > 0 ? (
            suggestions.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelectItem(item)}
                className="w-full text-left p-3 hover:bg-slate-50 flex items-start gap-2.5 text-xs text-slate-700 transition"
              >
                <MapPin className={`w-4 h-4 shrink-0 mt-0.5 ${iconColor}`} />
                <div>
                  <p className="font-bold text-slate-900">{item.name}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">{item.address}</p>
                </div>
              </button>
            ))
          ) : (
            <div className="p-3 text-xs text-slate-400 text-center">No locations found. Press enter for custom location.</div>
          )}
        </div>
      )}
    </div>
  );
};
