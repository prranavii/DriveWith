import React, { useState } from 'react';
import { ArrowLeft, Car, ShieldCheck, Sparkles, Check, Clock, MapPin, Signal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ConnectedRouteInputCard } from '../components/ConnectedRouteInputCard';
import { MapView } from '../components/MapView';
import { calculateTripMetrics } from '../services/mapService';
import { LocationItem, POPULAR_LOCATIONS } from '../services/locationService';
import { DEMO_DRIVERS, DriverProfile } from '../services/driverService';
import { createBookingRecord, BookingRecord } from '../services/bookingService';
import { BookingConfirmedCard } from '../components/BookingConfirmedCard';
import { useAppStore } from '../store/useAppStore';

const CAB_CATEGORIES = [
  { id: 'cab-sedan', name: 'DriveWith Sedan', desc: 'Comfortable 4-seater sedan with AC', fare: 720, capacity: '4 Passengers', model: 'Honda City / Dzire' },
  { id: 'cab-suv', name: 'DriveWith SUV', desc: 'Spacious 6-7 seater SUV for group trips', fare: 980, capacity: '6 Passengers', model: 'Ertiga / Innova' },
  { id: 'cab-luxury', name: 'DriveWith Executive', desc: 'Premium luxury sedan with white-glove service', fare: 1450, capacity: '4 Passengers', model: 'Mercedes C-Class / BMW 3' },
];

export const CabBookingPage: React.FC = () => {
  const [pickupText, setPickupText] = useState('Sector 62, Noida, UP');
  const [pickupLoc, setPickupLoc] = useState<LocationItem>(POPULAR_LOCATIONS[0]);
  const [destText, setDestText] = useState('IGI Airport T3, New Delhi');
  const [destLoc, setDestLoc] = useState<LocationItem | null>(POPULAR_LOCATIONS[2]);
  
  const [selectedCab, setSelectedCab] = useState(CAB_CATEGORIES[0]);
  const [step, setStep] = useState<'SELECT' | 'CONFIRMED'>('SELECT');
  const [confirmedBooking, setConfirmedBooking] = useState<BookingRecord | null>(null);

  const { setActiveBooking } = useAppStore();
  const navigate = useNavigate();

  const tripMetrics = calculateTripMetrics(
    pickupLoc.lat,
    pickupLoc.lng,
    destLoc ? destLoc.lat : pickupLoc.lat + 0.05,
    destLoc ? destLoc.lng : pickupLoc.lng + 0.05
  );

  const handleConfirmCabBooking = () => {
    const driver: DriverProfile = DEMO_DRIVERS[0];
    const vehicle = {
      make: 'DriveWith Fleet',
      model: selectedCab.model,
      transmission: 'AUTOMATIC',
      vehicleType: selectedCab.id.includes('suv') ? 'SUV' : 'SEDAN',
      licensePlate: 'DL 01 CAB 5588',
    };

    const record = createBookingRecord(
      driver,
      pickupLoc,
      destLoc || POPULAR_LOCATIONS[1],
      vehicle,
      tripMetrics.distanceKm,
      tripMetrics.durationMins,
      'CAB_BOOKING'
    );
    record.fareBreakdown.totalFare = selectedCab.fare;

    setConfirmedBooking(record);
    setActiveBooking(record);
    setStep('CONFIRMED');
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 text-black">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/app')}
            className="p-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">🚕</span>
              <h1 className="text-2xl font-black text-black">Book a DriveWith Cab</h1>
            </div>
            <p className="text-xs text-neutral-500 font-medium">Vehicle + Verified Driver provided by DriveWith</p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-neutral-100 rounded-full border border-neutral-200 text-xs font-bold">
          <ShieldCheck className="w-4 h-4 text-black" />
          <span>All Cabs Sanitized & GPS Tracked</span>
        </div>
      </div>

      {step === 'CONFIRMED' && confirmedBooking ? (
        <BookingConfirmedCard
          booking={confirmedBooking}
          onNewBooking={() => setStep('SELECT')}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Controls & Cab Categories (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Route Input */}
            <ConnectedRouteInputCard
              pickupValue={pickupText}
              destValue={destText}
              onPickupChange={(val, item) => {
                setPickupText(val);
                if (item) setPickupLoc(item);
              }}
              onDestChange={(val, item) => {
                setDestText(val);
                if (item) setDestLoc(item);
              }}
              onSwapLocations={() => {
                if (!destLoc) return;
                const tmpT = pickupText; const tmpL = pickupLoc;
                setPickupText(destText); setPickupLoc(destLoc);
                setDestText(tmpT); setDestLoc(tmpL);
              }}
              vehicleType="Sedan"
              onVehicleTypeChange={() => {}}
              transmission="Automatic"
              onTransmissionChange={() => {}}
              serviceType="Instant Ride"
              onServiceTypeChange={() => {}}
              onFindDrivers={() => {}}
              onOpenAiConcierge={() => navigate('/ai')}
            />

            {/* Cab Category Selector */}
            <div className="space-y-3">
              <h3 className="text-sm font-black uppercase tracking-wider text-neutral-500">Select Cab Category</h3>
              
              <div className="space-y-2.5">
                {CAB_CATEGORIES.map((cab) => {
                  const isSelected = selectedCab.id === cab.id;
                  return (
                    <div
                      key={cab.id}
                      onClick={() => setSelectedCab(cab)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'border-2 border-black bg-white shadow-md'
                          : 'border-[#E5E7EB] bg-white hover:border-neutral-400'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-black text-black">{cab.name}</h4>
                          <span className="text-[10px] bg-neutral-100 px-2 py-0.5 rounded font-bold text-neutral-600">
                            {cab.capacity}
                          </span>
                        </div>
                        <p className="text-[11px] text-neutral-500 font-medium">{cab.desc}</p>
                        <p className="text-[10px] text-neutral-400 font-bold">{cab.model}</p>
                      </div>

                      <div className="text-right space-y-1">
                        <span className="text-base font-black text-black">₹{cab.fare}</span>
                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-black text-white flex items-center justify-center ml-auto">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Confirm CTA */}
            <button
              onClick={handleConfirmCabBooking}
              className="w-full py-4 bg-black hover:bg-neutral-800 text-white font-bold text-xs rounded-2xl shadow-md transition flex items-center justify-center gap-2"
            >
              <span>CONFIRM CAB BOOKING (₹{selectedCab.fare}) →</span>
            </button>

          </div>

          {/* Right Map Canvas (7 cols) */}
          <div className="lg:col-span-7">
            <div className="w-full h-[520px] rounded-3xl overflow-hidden border border-[#E5E7EB] shadow-sm bg-neutral-100">
              <MapView
                pickupLoc={pickupLoc}
                destLoc={destLoc}
                drivers={DEMO_DRIVERS}
                routePolyline={tripMetrics.routePolyline}
                heightClass="h-full w-full"
                distanceKm={tripMetrics.distanceKm}
                durationMins={tripMetrics.durationMins}
              />
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
