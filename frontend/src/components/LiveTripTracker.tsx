import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { Car, Navigation, Shield, Clock, Phone, KeyRound, CheckCircle, AlertTriangle } from 'lucide-react';
import { api } from '../api/client';

// Fix Leaflet marker icon URLs
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface LiveTripTrackerProps {
  booking: any;
  onRefresh: () => void;
}

export const LiveTripTracker: React.FC<LiveTripTrackerProps> = ({ booking, onRefresh }) => {
  const [otpInput, setOtpInput] = useState('');
  const [otpError, setOtpError] = useState('');
  const [driverPos, setDriverPos] = useState<[number, number]>([
    booking.pickup_lat || 28.5355,
    booking.pickup_lng || 77.3910,
  ]);

  // Connect to WebSocket for live GPS telemetry tick
  useEffect(() => {
    const ws = new WebSocket(`ws://${window.location.hostname}:5000`);
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'DRIVER_LOCATION_TICK' || data.type === 'DRIVER_LOCATION_UPDATE') {
          if (!booking.driver_id || data.driverId === booking.driver_id) {
            setDriverPos([data.lat, data.lng]);
          }
        }
      } catch (err) {}
    };
    return () => ws.close();
  }, [booking]);

  const handleVerifyOtp = async () => {
    try {
      setOtpError('');
      const res = await api.post(`/bookings/${booking.id}/otp`, { otp: otpInput });
      if (res.data) {
        onRefresh();
      }
    } catch (err: any) {
      setOtpError(err.response?.data?.error || 'Invalid OTP');
    }
  };

  const handleCompleteTrip = async () => {
    try {
      await api.post(`/bookings/trips/${booking.id}/complete`);
      onRefresh();
    } catch (err: any) {
      console.error(err);
    }
  };

  const pickupCoords: [number, number] = [booking.pickup_lat || 28.5355, booking.pickup_lng || 77.3910];
  const destCoords: [number, number] = [booking.dest_lat || 28.4595, booking.dest_lng || 77.0266];

  const routePolyline = [driverPos, pickupCoords, destCoords];

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xl space-y-6">
      
      {/* Top Banner & Status Pill */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
            <h3 className="text-lg font-bold text-slate-900">Live Driver Telemetry</h3>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
              {booking.booking_type} BOOKING
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">Booking #{booking.id?.slice(-6)} • {booking.pickup_address} → {booking.destination_address}</p>
        </div>

        <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
          <span className="text-xs text-slate-500">Status:</span>
          <span className="text-xs font-bold text-slate-900">{booking.status}</span>
        </div>
      </div>

      {/* Interactive Map */}
      <div className="h-72 rounded-xl overflow-hidden border border-slate-200 relative z-0">
        <MapContainer center={pickupCoords} zoom={12} className="h-full w-full">
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
          />

          {/* Markers */}
          <Marker position={pickupCoords}>
            <Popup>Pickup: {booking.pickup_address}</Popup>
          </Marker>

          <Marker position={destCoords}>
            <Popup>Destination: {booking.destination_address}</Popup>
          </Marker>

          <Marker position={driverPos}>
            <Popup>Driver Live Position</Popup>
          </Marker>

          <Polyline positions={routePolyline} color="#2563eb" weight={4} dashArray="6, 6" />
        </MapContainer>
      </div>

      {/* OTP Verification Section if Driver Arrived */}
      {booking.status === 'DRIVER_EN_ROUTE' || booking.status === 'DRIVER_ARRIVED' || booking.status === 'DRIVER_ASSIGNED' ? (
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-lg">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Trip Security Verification OTP</p>
              <p className="text-xl font-mono font-extrabold text-slate-900 tracking-wider">{booking.otp}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Enter OTP (e.g. 1234)"
              value={otpInput}
              onChange={(e) => setOtpInput(e.target.value)}
              className="bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-400 w-36 font-mono shadow-xs"
            />
            <button
              onClick={handleVerifyOtp}
              className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold text-xs transition"
            >
              Verify OTP
            </button>
          </div>
          {otpError && <p className="text-xs text-rose-600 w-full">{otpError}</p>}
        </div>
      ) : null}

      {/* Complete Trip Controls */}
      {booking.status === 'OTP_VERIFIED' || booking.status === 'TRIP_STARTED' ? (
        <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 p-4 rounded-xl">
          <div className="flex items-center gap-2 text-emerald-800 text-xs font-semibold">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>OTP Verified — Driver is executing trip</span>
          </div>
          <button
            onClick={handleCompleteTrip}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs transition"
          >
            Complete Trip & Pay ₹{booking.estimated_fare}
          </button>
        </div>
      ) : null}

    </div>
  );
};
