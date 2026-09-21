import React from 'react';
import { CheckCircle2, Phone, MessageSquare, KeyRound, MapPin, Clock, ShieldCheck, Car, RefreshCw } from 'lucide-react';
import { BookingRecord } from '../services/bookingService';
import { LiveTripTracker } from './LiveTripTracker';

interface BookingConfirmedCardProps {
  booking: BookingRecord;
  onNewBooking: () => void;
}

export const BookingConfirmedCard: React.FC<BookingConfirmedCardProps> = ({
  booking,
  onNewBooking,
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 animate-fadeIn">
      
      {/* Top Banner: Success Badge & Booking ID */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center font-bold">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-black">Booking Confirmed</h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-neutral-100 text-black border border-neutral-200">
                {booking.bookingType}
              </span>
            </div>
            <p className="text-xs text-neutral-500 font-mono mt-0.5">Booking ID: {booking.id}</p>
          </div>
        </div>

        <button
          onClick={onNewBooking}
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 transition flex items-center gap-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Book Another Driver</span>
        </button>
      </div>

      {/* Driver Contact & Security OTP Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Driver Card */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src={booking.driver.profileImage} alt={booking.driver.name} className="w-12 h-12 rounded-xl object-cover border border-slate-300" />
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm">{booking.driver.name}</h3>
              <p className="text-[11px] text-slate-500">⭐ {booking.driver.rating} • {booking.driver.experienceYears} yrs exp</p>
              <p className="text-[10px] text-slate-700 font-semibold">{booking.driver.distanceKm} km away (Arrives ~{booking.driver.etaMins} min)</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="p-2.5 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition" title="Call Driver">
              <Phone className="w-4 h-4" />
            </button>
            <button className="p-2.5 rounded-xl bg-slate-200 text-slate-700 hover:bg-slate-300 transition" title="Message Driver">
              <MessageSquare className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Security OTP Card */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold">
              <KeyRound className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-slate-500">Trip Security Verification OTP</p>
              <p className="text-2xl font-mono font-extrabold text-slate-900 tracking-wider">{booking.otp}</p>
              <p className="text-[10px] text-slate-400">Share this code with your driver upon arrival</p>
            </div>
          </div>
        </div>

      </div>

      {/* Embedded Live Map Tracking */}
      <div className="pt-2">
        <LiveTripTracker
          booking={{
            id: booking.id,
            status: 'DRIVER_EN_ROUTE',
            booking_type: booking.bookingType,
            pickup_address: typeof booking.pickup === 'string' ? booking.pickup : booking.pickup.name,
            destination_address: typeof booking.destination === 'string' ? booking.destination : booking.destination.name,
            pickup_lat: typeof booking.pickup === 'object' ? booking.pickup.lat : 28.6270,
            pickup_lng: typeof booking.pickup === 'object' ? booking.pickup.lng : 77.3726,
            dest_lat: typeof booking.destination === 'object' ? booking.destination.lat : 28.4950,
            dest_lng: typeof booking.destination === 'object' ? booking.destination.lng : 77.0895,
            otp: booking.otp,
            estimated_fare: booking.fareBreakdown.totalFare,
            driver_id: booking.driver.id,
          }}
          onRefresh={() => {}}
        />
      </div>

    </div>
  );
};
