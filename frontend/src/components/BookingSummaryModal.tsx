import React, { useState } from 'react';
import { X, ArrowRight, ArrowLeft, ShieldCheck, MapPin, Clock, Tag, User, Phone, CheckCircle, Car } from 'lucide-react';
import { DriverProfile } from '../services/driverService';
import { calculateFareBreakdown, BookingRecord, createBookingRecord } from '../services/bookingService';

interface BookingSummaryModalProps {
  driver: DriverProfile | null;
  pickup: any;
  destination: any;
  metrics: any;
  bookingType: string;
  onClose: () => void;
  onConfirmBooking: (record: BookingRecord) => void;
}

export const BookingSummaryModal: React.FC<BookingSummaryModalProps> = ({
  driver,
  pickup,
  destination,
  metrics,
  bookingType,
  onClose,
  onConfirmBooking,
}) => {
  const [recipientName, setRecipientName] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');

  if (!driver) return null;

  const fare = calculateFareBreakdown(driver.estimatedPrice);

  const handleConfirm = () => {
    const record = createBookingRecord(
      driver,
      pickup,
      destination,
      null,
      metrics.distanceKm,
      metrics.durationMins,
      bookingType,
      bookingType === 'REMOTE_BOOKING' ? recipientName : undefined,
      bookingType === 'REMOTE_BOOKING' ? recipientPhone : undefined
    );
    onConfirmBooking(record);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-[#E5E7EB] rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-6 animate-fadeIn max-h-[90vh] overflow-y-auto text-black">
        
        {/* Header (Matching Reference Image 7) */}
        <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-4">
          <div>
            <h2 className="text-xl font-black uppercase tracking-wider text-black">CONFIRM YOUR BOOKING</h2>
            <p className="text-xs text-gray-500 font-medium mt-0.5">Review trip details and driver fare breakdown.</p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-2xl bg-[#F8F8F8] text-gray-500 hover:text-black border border-[#E5E7EB] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Driver Box */}
        <div className="bg-[#F8F8F8] p-4 rounded-2xl border border-[#E5E7EB] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <img src={driver.profileImage} alt={driver.name} className="w-14 h-14 rounded-full object-cover border-2 border-gray-200 shadow-xs" />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-black">{driver.name}</h3>
                <span className="text-xs font-bold text-amber-600 flex items-center gap-0.5">
                  ★ {driver.rating}
                </span>
              </div>
              <p className="text-xs text-gray-500 font-medium mt-0.5">{driver.experienceYears} yrs experience • {driver.totalTrips} trips</p>
            </div>
          </div>
        </div>

        {/* Trip Box */}
        <div className="bg-[#F8F8F8] p-4 rounded-2xl border border-[#E5E7EB] space-y-3 text-xs">
          <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Trip Route</span>

          <div className="space-y-2.5">
            <div className="flex items-start gap-2.5">
              <div className="w-3 h-3 rounded-full bg-emerald-600 mt-1 shrink-0"></div>
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase">Pickup</p>
                <p className="font-black text-black text-xs sm:text-sm">{pickup?.name || pickup}</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <div className="w-3 h-3 rounded-full bg-rose-600 mt-1 shrink-0"></div>
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase">Destination</p>
                <p className="font-black text-black text-xs sm:text-sm">{destination?.name || destination}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-[#E5E7EB] pt-2 text-gray-600 font-medium">
            <span>Distance: <strong className="text-black font-black">{metrics.distanceKm} km</strong></span>
            <span>Duration: <strong className="text-black font-black">~{metrics.durationMins} min</strong></span>
          </div>
        </div>

        {/* Vehicle Box */}
        <div className="bg-[#F8F8F8] p-4 rounded-2xl border border-[#E5E7EB] flex items-center justify-between text-xs">
          <div>
            <p className="font-black text-black">Standard Sedan (Honda City)</p>
            <p className="text-gray-500 font-medium">4 Passengers • Automatic</p>
          </div>
          <span className="px-3 py-1 rounded-xl bg-white text-black font-extrabold text-[11px] border border-[#E5E7EB]">
            Instant Ride
          </span>
        </div>

        {/* Pricing Breakdown (Matching Reference Image 7) */}
        <div className="bg-[#F8F8F8] p-4 rounded-2xl border border-[#E5E7EB] space-y-2 text-xs font-medium">
          <div className="flex items-center justify-between text-gray-600">
            <span>Driver Fee</span>
            <span className="font-extrabold text-black">₹{fare.driverFee}</span>
          </div>
          <div className="flex items-center justify-between text-gray-600">
            <span>Platform Fee</span>
            <span className="font-extrabold text-black">₹{fare.platformFee}</span>
          </div>
          <div className="flex items-center justify-between border-t border-[#E5E7EB] pt-2 font-black text-sm text-black">
            <span>Total</span>
            <span className="text-base font-black text-black">₹{fare.totalFare}</span>
          </div>
        </div>

        {/* Primary Black CTA Button */}
        <div className="space-y-2 pt-2">
          <button
            type="button"
            onClick={handleConfirm}
            className="w-full py-4 bg-black hover:bg-gray-800 text-white font-black text-sm rounded-2xl transition shadow-md flex items-center justify-center gap-2"
          >
            <span>CONFIRM BOOKING →</span>
          </button>
        </div>

      </div>
    </div>
  );
};
