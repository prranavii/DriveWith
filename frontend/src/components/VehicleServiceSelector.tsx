import React from 'react';
import { Check, ChevronRight } from 'lucide-react';

export interface VehicleCategory {
  id: string;
  name: string;
  capacity: string;
  transmission: 'AUTOMATIC' | 'MANUAL';
  vehicleType: 'SEDAN' | 'SUV' | 'HATCHBACK' | 'LUXURY';
  multiplier: number;
  description: string;
  carModel: string;
  image: string;
}

export const VEHICLE_CATEGORIES: VehicleCategory[] = [
  {
    id: 'cat-sedan',
    name: 'Standard Sedan',
    capacity: '4 Passengers',
    transmission: 'AUTOMATIC',
    vehicleType: 'SEDAN',
    multiplier: 1.0,
    description: 'Comfortable 4-seater sedan for city & highway',
    carModel: 'Honda City',
    image: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'cat-suv',
    name: 'Premium SUV',
    capacity: '6 Passengers',
    transmission: 'AUTOMATIC',
    vehicleType: 'SUV',
    multiplier: 1.25,
    description: 'Spacious 6-7 seater SUV for family trips',
    carModel: 'Creta',
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'cat-manual',
    name: 'Manual Driver',
    capacity: '4-5 Passengers',
    transmission: 'MANUAL',
    vehicleType: 'SEDAN',
    multiplier: 0.9,
    description: 'Expert manual transmission driver for your car',
    carModel: 'Swift',
    image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'cat-luxury',
    name: 'Executive Chauffeur',
    capacity: '4 Passengers',
    transmission: 'AUTOMATIC',
    vehicleType: 'LUXURY',
    multiplier: 1.6,
    description: 'White-glove executive chauffeur for luxury sedans',
    carModel: 'BMW 5 Series',
    image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=400&q=80',
  },
];

interface VehicleServiceSelectorProps {
  selectedCategory: VehicleCategory;
  onSelectCategory: (cat: VehicleCategory) => void;
  basePrice: number;
}

export const VehicleServiceSelector: React.FC<VehicleServiceSelectorProps> = ({
  selectedCategory,
  onSelectCategory,
  basePrice,
}) => {
  return (
    <div className="space-y-4">
      {/* Minimal Header */}
      <div className="flex items-center justify-between px-1">
        <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-gray-500">
          Choose Your Vehicle Type
        </h3>
        <button
          type="button"
          className="text-xs font-bold text-black hover:underline flex items-center gap-0.5 transition"
        >
          <span>View All</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Grid of Minimal Monochrome Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {VEHICLE_CATEGORIES.map((cat) => {
          const isSelected = selectedCategory.id === cat.id;
          const estPrice = Math.round(basePrice * cat.multiplier);

          return (
            <div
              key={cat.id}
              onClick={() => onSelectCategory(cat)}
              className={`relative bg-white rounded-3xl p-4 cursor-pointer transition-all flex flex-col justify-between h-56 text-left border ${
                isSelected
                  ? 'border-2 border-black bg-[#F8F8F8]/60 shadow-md ring-1 ring-black/10'
                  : 'border-[#E5E7EB] shadow-xs hover:border-gray-400'
              }`}
            >
              {/* Checkmark Badge on Selected State */}
              {isSelected && (
                <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-black text-white flex items-center justify-center shadow-xs z-10 animate-fadeIn">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              )}

              {/* Car Image Preview */}
              <div className="w-full h-24 rounded-2xl bg-[#F8F8F8] border border-[#E5E7EB] overflow-hidden mb-2 flex items-center justify-center">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover transition duration-300"
                />
              </div>

              {/* Specs & Pricing */}
              <div className="space-y-1">
                <h4 className="text-xs sm:text-sm font-black text-black truncate">
                  {cat.name}
                </h4>
                <p className="text-[10px] sm:text-xs text-gray-500 font-medium">
                  {cat.capacity} • {cat.transmission === 'AUTOMATIC' ? 'Automatic' : 'Manual'}
                </p>

                <div className="pt-1.5 flex items-baseline justify-between border-t border-[#E5E7EB]">
                  <span className="text-sm sm:text-base font-black text-black">
                    ₹{estPrice}
                  </span>
                  <span className="text-[10px] font-semibold text-gray-400 truncate max-w-[80px]">
                    {cat.carModel}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
