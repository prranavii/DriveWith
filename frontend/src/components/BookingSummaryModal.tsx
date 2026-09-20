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
  const [specialNotes, setSpecialNotes] = useState('');

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
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-6 animate-fadeIn max-h-[90vh] overflow-y-auto text-slate-900">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">Booking Confirmation</h2>
            <p className="text-xs text-slate-500 mt-0.5">Review trip details and driver pricing breakdown</p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-900 border border-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Selected Driver Section */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
          <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Your Assigned Driver</span>
          <div className="flex items-center gap-3.5">
            <img src={driver.profileImage} alt={driver.name} className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shadow-sm" />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-extrabold text-slate-900">{driver.name}</h3>
                <span className="text-xs font-bold text-amber-600">⭐ {driver.rating}</span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{driver.experienceYears} yrs experience • {driver.totalTrips} completed trips</p>
              <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 mt-1 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Verified Background & Driving License</span>
              </div>
            </div>
          </div>
        </div>

        {/* Trip Details */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3 text-xs">
          <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Trip Route</span>
          
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-bold">Pickup</p>
                <p className="font-extrabold text-slate-900">{pickup?.name || pickup}</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-bold">Destination</p>
                <p className="font-extrabold text-slate-900">{destination?.name || destination}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-slate-200 pt-2 text-slate-600">
            <span>Distance: <strong className="text-slate-900 font-extrabold">{metrics.distanceKm} km</strong></span>
            <span>Duration: <strong className="text-slate-900 font-extrabold">~{metrics.durationMins} min</strong></span>
          </div>
        </div>

        {/* Remote Booking Recipient (If Applicable) */}
        {bookingType === 'REMOTE_BOOKING' && (
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
            <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Remote Booking Recipient</span>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] text-slate-500 font-bold">Recipient Name</label>
                <input
                  type="text"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="Grandfather Sharma"
                  className="w-full bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-xs text-slate-900 mt-1"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-500 font-bold">Recipient Phone for OTP</label>
                <input
                  type="text"
                  value={recipientPhone}
                  onChange={(e) => setRecipientPhone(e.target.value)}
                  placeholder="+91 9876543210"
                  className="w-full bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-xs text-slate-900 mt-1"
                />
              </div>
            </div>
          </div>
        )}

        {/* Pricing Breakdown */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
          <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Fare Breakdown</span>
          
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between text-slate-600">
              <span>Driver Service Fee</span>
              <span className="font-bold text-slate-900">₹{fare.driverFee}</span>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span>Platform Dispatch Fee</span>
              <span className="font-bold text-slate-900">₹{fare.platformFee}</span>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span>GST & Taxes (5%)</span>
              <span className="font-bold text-slate-900">₹{fare.taxes}</span>
            </div>
            <div className="flex items-center justify-between border-t border-slate-200 pt-2 font-extrabold text-sm text-slate-900">
              <span>Total Payable</span>
              <span className="text-slate-900 font-extrabold text-base">₹{fare.totalFare}</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-2 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 transition flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go Back</span>
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            className="flex-1 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition shadow-md flex items-center justify-center gap-2"
          >
            <span>Confirm Booking & Pay ₹{fare.totalFare}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
