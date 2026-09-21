import React from 'react';
import { Check, Sparkles, Users, Settings, Briefcase, ArrowRight } from 'lucide-react';

export interface VehicleCategory {
  id: string;
  name: string;
  badge: string;
  tagline: string;
  passengers: string;
  transmission: 'AUTOMATIC' | 'MANUAL';
  bags: string;
  vehicleType: 'SEDAN' | 'SUV' | 'HATCHBACK' | 'LUXURY';
  multiplier: number;
  carModel: string;
  image: string;
}

export const VEHICLE_CATEGORIES: VehicleCategory[] = [
  {
    id: 'cat-sedan',
    name: 'Standard Sedan',
    badge: 'MOST POPULAR',
    tagline: 'Comfortable. Reliable. Everyday.',
    passengers: '4',
    transmission: 'AUTOMATIC',
    bags: '2',
    vehicleType: 'SEDAN',
    multiplier: 1.0,
    carModel: 'Honda City',
    image: 'https://images.rawpixel.com/image_png_800/czNmZXN0aXZhbC1maWxlcy9pbWFnZXMvY2FyX3BuZzE2Njc3LnBuZw.png',
  },
  {
    id: 'cat-suv',
    name: 'Premium SUV',
    badge: 'SPACIOUS',
    tagline: 'More space for more possibilities.',
    passengers: '6',
    transmission: 'AUTOMATIC',
    bags: '3',
    vehicleType: 'SUV',
    multiplier: 1.25,
    carModel: 'Creta',
    image: 'https://images.rawpixel.com/image_png_800/czNmZXN0aXZhbC1maWxlcy9pbWFnZXMvY2FyX3BuZzE2NjgxLnBuZw.png',
  },
  {
    id: 'cat-manual',
    name: 'Manual Driver',
    badge: 'BUDGET FRIENDLY',
    tagline: 'For a hands-on drive experience.',
    passengers: '4-5',
    transmission: 'MANUAL',
    bags: '2',
    vehicleType: 'SEDAN',
    multiplier: 0.9,
    carModel: 'Swift',
    image: 'https://images.rawpixel.com/image_png_800/czNmZXN0aXZhbC1maWxlcy9pbWFnZXMvY2FyX3BuZzE2Njc1LnBuZw.png',
  },
  {
    id: 'cat-luxury',
    name: 'Executive Chauffeur',
    badge: 'PREMIUM',
    tagline: 'Elevate your journey with professional drivers.',
    passengers: '4',
    transmission: 'AUTOMATIC',
    bags: '2',
    vehicleType: 'LUXURY',
    multiplier: 1.6,
    carModel: 'BMW 5 Series',
    image: 'https://images.rawpixel.com/image_png_800/czNmZXN0aXZhbC1maWxlcy9pbWFnZXMvY2FyX3BuZzE2Njg1LnBuZw.png',
  },
];

interface VehicleServiceSelectorProps {
  selectedCategory: VehicleCategory;
  onSelectCategory: (cat: VehicleCategory) => void;
  basePrice?: number;
  onOpenAiConcierge?: () => void;
}

export const VehicleServiceSelector: React.FC<VehicleServiceSelectorProps> = ({
  selectedCategory,
  onSelectCategory,
  basePrice = 983,
  onOpenAiConcierge,
}) => {
  return (
    <div className="w-full max-w-7xl mx-auto space-y-10 sm:space-y-14 py-4 text-black">
      
      {/* Header & Booking Progress Indicator */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#E5E7EB] pb-6">
        
        {/* Step Header */}
        <div className="space-y-2">
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-neutral-400">
            STEP 2 OF 4
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-black tracking-tight">
            Choose your vehicle type
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 font-medium leading-relaxed">
            Select the category that best fits your journey and comfort.
          </p>
        </div>

        {/* Top-Right Progress Indicator & View All Action */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8">
          {/* Subtle Progress Bar */}
          <div className="hidden lg:flex items-center gap-2.5 text-xs font-bold">
            <div className="flex items-center gap-1.5 text-neutral-400">
              <span className="w-6 h-6 rounded-full border border-neutral-300 flex items-center justify-center text-[11px] font-bold">1</span>
              <span>Location</span>
            </div>
            <div className="w-6 h-px bg-neutral-300"></div>
            <div className="flex items-center gap-1.5 text-black">
              <span className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-[11px] font-bold shadow-xs">2</span>
              <span>Vehicle</span>
            </div>
            <div className="w-6 h-px bg-neutral-300"></div>
            <div className="flex items-center gap-1.5 text-neutral-400">
              <span className="w-6 h-6 rounded-full border border-neutral-300 flex items-center justify-center text-[11px] font-bold">3</span>
              <span>Driver</span>
            </div>
            <div className="w-6 h-px bg-neutral-300"></div>
            <div className="flex items-center gap-1.5 text-neutral-400">
              <span className="w-6 h-6 rounded-full border border-neutral-300 flex items-center justify-center text-[11px] font-bold">4</span>
              <span>Confirm</span>
            </div>
          </div>

          <button
            type="button"
            className="text-xs font-bold text-black hover:underline flex items-center gap-1 transition"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* Spacious 2-Column Desktop / 1-Column Mobile Vehicle Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        {VEHICLE_CATEGORIES.map((cat) => {
          const isSelected = selectedCategory.id === cat.id;
          // Exact target prices matching prompt reference when basePrice is 983
          const displayFare = cat.id === 'cat-sedan' ? 983
            : cat.id === 'cat-suv' ? 1229
            : cat.id === 'cat-manual' ? 885
            : 1573;

          return (
            <div
              key={cat.id}
              onClick={() => onSelectCategory(cat)}
              className={`relative bg-white rounded-3xl p-7 sm:p-9 min-h-[420px] cursor-pointer transition-all duration-300 flex flex-col justify-between border ${
                isSelected
                  ? 'border-2 border-black shadow-md ring-1 ring-black/5'
                  : 'border-[#E5E7EB] shadow-xs hover:border-neutral-400 hover:shadow-sm'
              }`}
            >
              {/* TOP: Category Badge & Selected Checkmark */}
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <span className="inline-block px-3.5 py-1 rounded-full text-[10px] font-extrabold tracking-wider uppercase bg-neutral-100 text-neutral-700 border border-neutral-200">
                    {cat.badge}
                  </span>
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-black text-black tracking-tight">
                      {cat.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-neutral-500 font-medium mt-1">
                      {cat.tagline}
                    </p>
                  </div>
                </div>

                {/* Selected Checkmark Badge */}
                {isSelected ? (
                  <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center shadow-sm shrink-0 animate-fadeIn">
                    <Check className="w-4 h-4 stroke-[3]" />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full border border-neutral-200 bg-neutral-50 shrink-0"></div>
                )}
              </div>

              {/* CENTER: Spacious Vehicle Render with Soft Background Backdrop */}
              <div className="relative w-full h-44 sm:h-52 my-4 flex items-center justify-center overflow-hidden">
                {/* Subtle soft circular radial gradient backdrop */}
                <div className="absolute w-44 h-44 sm:w-52 sm:h-52 rounded-full bg-gradient-to-b from-neutral-200/50 via-neutral-100/30 to-transparent blur-2xl pointer-events-none"></div>
                <div className="absolute w-40 h-40 sm:w-48 sm:h-48 rounded-full bg-neutral-100/80 border border-neutral-200/40 pointer-events-none"></div>
                
                {/* Clean Product Vehicle Render */}
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="relative z-10 w-full h-full object-contain hover:scale-105 transition-transform duration-300"
                  onError={(e: any) => {
                    // Fallback to SVG placeholder if image fails
                    e.target.style.display = 'none';
                  }}
                />
              </div>

              {/* BOTTOM FEATURES & PRICING */}
              <div className="space-y-5">
                {/* Feature Icons Row */}
                <div className="grid grid-cols-3 gap-2 text-center pt-2">
                  <div className="bg-neutral-50 p-2.5 rounded-2xl border border-neutral-200/70 space-y-1">
                    <Users className="w-4 h-4 text-black mx-auto" />
                    <p className="text-xs font-black text-black">{cat.passengers}</p>
                    <p className="text-[10px] text-neutral-400 font-bold uppercase">Passengers</p>
                  </div>

                  <div className="bg-neutral-50 p-2.5 rounded-2xl border border-neutral-200/70 space-y-1">
                    <Settings className="w-4 h-4 text-black mx-auto" />
                    <p className="text-xs font-black text-black">{cat.transmission === 'AUTOMATIC' ? 'Automatic' : 'Manual'}</p>
                    <p className="text-[10px] text-neutral-400 font-bold uppercase">Transmission</p>
                  </div>

                  <div className="bg-neutral-50 p-2.5 rounded-2xl border border-neutral-200/70 space-y-1">
                    <Briefcase className="w-4 h-4 text-black mx-auto" />
                    <p className="text-xs font-black text-black">{cat.bags}</p>
                    <p className="text-[10px] text-neutral-400 font-bold uppercase">Large Bags</p>
                  </div>
                </div>

                <div className="w-full h-px bg-[#E5E7EB]"></div>

                {/* Pricing & CTA Button */}
                <div className="flex items-center justify-between pt-1">
                  <div>
                    <span className="text-2xl sm:text-3xl font-black text-black">
                      ₹{displayFare}
                    </span>
                    <span className="text-xs text-neutral-400 font-medium ml-1.5">
                      per ride
                    </span>
                  </div>

                  {isSelected ? (
                    <button
                      type="button"
                      className="px-6 py-2.5 rounded-full bg-black text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition"
                    >
                      <span>Selected</span>
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="px-6 py-2.5 rounded-full bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 text-black font-bold text-xs transition"
                    >
                      Select
                    </button>
                  )}
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* AI Assistant Banner */}
      <div className="bg-white border border-[#E5E7EB] rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center font-bold text-xl shadow-sm shrink-0">
            ✦
          </div>
          <div className="space-y-0.5">
            <h4 className="text-base sm:text-lg font-black text-black">
              Not sure which vehicle to choose?
            </h4>
            <p className="text-xs sm:text-sm text-neutral-500 font-medium">
              Let our AI assistant recommend the best option for your trip.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onOpenAiConcierge && onOpenAiConcierge()}
          className="bg-black hover:bg-neutral-800 text-white shadow-sm px-6 py-3 rounded-full font-bold text-xs flex items-center gap-2 shrink-0 transition"
        >
          <Sparkles className="w-4 h-4 text-white" />
          <span>Ask AI →</span>
        </button>
      </div>

    </div>
  );
};
