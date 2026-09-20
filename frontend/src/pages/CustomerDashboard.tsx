import React, { useState } from 'react';
import { Search, ArrowLeft, ChevronRight, SlidersHorizontal, AlertCircle, RefreshCw, Car, ShieldCheck, Sparkles, X } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

import { LocationItem, POPULAR_LOCATIONS } from '../services/locationService';
import { calculateTripMetrics, RouteCalculation } from '../services/mapService';
import { DriverProfile, DEMO_DRIVERS } from '../services/driverService';
import { BookingRecord } from '../services/bookingService';

import { ConnectedRouteInputCard } from '../components/ConnectedRouteInputCard';
import { VehicleServiceSelector, VEHICLE_CATEGORIES, VehicleCategory } from '../components/VehicleServiceSelector';
import { MapView } from '../components/MapView';
import { TripSummaryCard } from '../components/TripSummaryCard';
import { DriverCard } from '../components/DriverCard';
import { DriverReportModal } from '../components/DriverReportModal';
import { DriverComparisonModal } from '../components/DriverComparisonModal';
import { BookingSummaryModal } from '../components/BookingSummaryModal';
import { BookingConfirmedCard } from '../components/BookingConfirmedCard';
import { AiConciergeWidget } from '../components/AiConciergeWidget';
import { VehicleInspectionWidget } from '../components/VehicleInspectionWidget';

export const CustomerDashboard: React.FC = () => {
  // Step State: LOCATION_SELECTION -> DRIVER_SEARCH -> BOOKING_SUCCESS
  const [step, setStep] = useState<'LOCATION_SELECTION' | 'DRIVER_SEARCH' | 'BOOKING_SUCCESS'>('LOCATION_SELECTION');
  const [showAiConcierge, setShowAiConcierge] = useState(false);

  // Location & Trip State
  const [pickupText, setPickupText] = useState('Sector 62, Noida, UP');
  const [pickupLoc, setPickupLoc] = useState<LocationItem>(POPULAR_LOCATIONS[0]);

  const [destText, setDestText] = useState('DLF Cyber City, Gurgaon, HR');
  const [destLoc, setDestLoc] = useState<LocationItem | null>(POPULAR_LOCATIONS[1]);

  const [selectedCategory, setSelectedCategory] = useState<VehicleCategory>(VEHICLE_CATEGORIES[0]);
  const [bookingType, setBookingType] = useState<string>('NORMAL');

  // Drivers & Filter State
  const [availableDrivers, setAvailableDrivers] = useState<DriverProfile[]>(DEMO_DRIVERS);
  const [selectedDriversForCompare, setSelectedDriversForCompare] = useState<DriverProfile[]>([]);
  const [reportDriver, setReportDriver] = useState<DriverProfile | null>(null);
  const [summaryDriver, setSummaryDriver] = useState<DriverProfile | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<BookingRecord | null>(null);

  const [showComparisonModal, setShowComparisonModal] = useState(false);
  const [filterTransmission, setFilterTransmission] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'RECOMMENDED' | 'PRICE' | 'ETA' | 'RATING'>('RECOMMENDED');

  const { setActiveBooking } = useAppStore();

  // Calculated Trip Metrics
  const tripMetrics: RouteCalculation = calculateTripMetrics(
    pickupLoc.lat,
    pickupLoc.lng,
    destLoc ? destLoc.lat : pickupLoc.lat + 0.05,
    destLoc ? destLoc.lng : pickupLoc.lng + 0.05
  );

  const handleSwapLocations = () => {
    if (!destLoc) return;
    const tempText = pickupText;
    const tempLoc = pickupLoc;
    setPickupText(destText);
    setPickupLoc(destLoc);
    setDestText(tempText);
    setDestLoc(tempLoc);
  };

  const handleFindDrivers = () => {
    if (!pickupText || !destText || !destLoc) return;
    setStep('DRIVER_SEARCH');
    window.scrollTo({ top: 100, behavior: 'smooth' });
  };

  const handleToggleCompare = (driver: DriverProfile) => {
    if (selectedDriversForCompare.find((d) => d.id === driver.id)) {
      setSelectedDriversForCompare(selectedDriversForCompare.filter((d) => d.id !== driver.id));
    } else {
      if (selectedDriversForCompare.length >= 3) return;
      setSelectedDriversForCompare([...selectedDriversForCompare, driver]);
    }
  };

  const handleConfirmBookingRecord = (record: BookingRecord) => {
    setConfirmedBooking(record);
    setSummaryDriver(null);
    setStep('BOOKING_SUCCESS');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Filter & Sort Drivers List
  const filteredDrivers = availableDrivers
    .filter((drv) => {
      if (filterTransmission !== 'ALL' && !drv.transmissionSupport.includes(filterTransmission as any)) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'PRICE') return a.estimatedPrice - b.estimatedPrice;
      if (sortBy === 'ETA') return a.etaMins - b.etaMins;
      if (sortBy === 'RATING') return b.rating - a.rating;
      return b.rating * b.totalTrips - a.rating * a.totalTrips; // Recommended score
    });

  return (
    <div className="w-full space-y-6">
      
      {/* Confirmed Booking View */}
      {step === 'BOOKING_SUCCESS' && confirmedBooking && (
        <div className="max-w-7xl mx-auto px-4 py-6">
          <BookingConfirmedCard
            booking={confirmedBooking}
            onNewBooking={() => {
              setStep('LOCATION_SELECTION');
              setConfirmedBooking(null);
            }}
          />
        </div>
      )}

      {/* Step 1: LOCATION SELECTION & MAP-FIRST RIDE BOOKING (Matching Visual Reference Image) */}
      {step === 'LOCATION_SELECTION' && (
        <div className="relative w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-2 pb-8 space-y-6">
          
          {/* Top Map-First Canvas Container */}
          <div className="relative w-full h-[460px] sm:h-[520px] lg:h-[580px] rounded-3xl overflow-hidden border border-slate-200/90 shadow-xl bg-slate-100">
            
            {/* Interactive Leaflet Map Background */}
            <div className="absolute inset-0 w-full h-full z-0">
              <MapView
                pickupLoc={pickupLoc}
                destLoc={destLoc}
                drivers={availableDrivers}
                routePolyline={tripMetrics.routePolyline}
                heightClass="h-full w-full"
                distanceKm={tripMetrics.distanceKm}
                durationMins={tripMetrics.durationMins}
              />
            </div>

            {/* Floating Booking Panel Overlay (Positioned Over Map - Matching Reference Image) */}
            <div className="absolute top-3 left-3 right-3 sm:top-5 sm:left-5 sm:max-w-md lg:max-w-lg z-20 pointer-events-auto">
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
                onSwapLocations={handleSwapLocations}
                vehicleType={selectedCategory.name.includes('SUV') ? 'SUV' : selectedCategory.name.includes('Manual') ? 'Manual' : 'Sedan'}
                onVehicleTypeChange={(val) => {
                  const match = VEHICLE_CATEGORIES.find(c => c.name.toLowerCase().includes(val.toLowerCase()));
                  if (match) setSelectedCategory(match);
                }}
                transmission={selectedCategory.transmission === 'AUTOMATIC' ? 'Automatic' : 'Manual'}
                onTransmissionChange={(val) => {
                  const match = VEHICLE_CATEGORIES.find(c => c.transmission === (val === 'Manual' ? 'MANUAL' : 'AUTOMATIC'));
                  if (match) setSelectedCategory(match);
                }}
                serviceType={bookingType === 'SCHEDULE' ? 'Schedule' : 'Instant Ride'}
                onServiceTypeChange={(val) => setBookingType(val === 'Schedule' ? 'SCHEDULE' : 'NORMAL')}
                onFindDrivers={handleFindDrivers}
              />
            </div>

          </div>

          {/* Select Vehicle Category Section (Matching Reference Image) */}
          <div className="pt-2">
            <VehicleServiceSelector
              selectedCategory={selectedCategory}
              onSelectCategory={(cat) => setSelectedCategory(cat)}
              basePrice={tripMetrics.estimatedFareMin}
            />
          </div>

          {/* Bottom AI Concierge Card (Matching Reference Image) */}
          <div className="bg-[#e6f4f1] border border-emerald-100 rounded-3xl p-4 sm:p-5 flex items-center justify-between gap-4 shadow-xs">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 text-[#004d40] flex items-center justify-center shrink-0">
                <Sparkles className="w-5.5 h-5.5 font-bold" />
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-[#004d40]">
                  Not sure what to enter?
                </h4>
                <p className="text-xs text-slate-600 font-medium mt-0.5">
                  Let our AI assistant fill the details for you.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowAiConcierge(true)}
              className="bg-white hover:bg-slate-50 text-[#004d40] border border-slate-200/90 shadow-sm px-4.5 py-2.5 rounded-2xl font-extrabold text-xs flex items-center gap-1 shrink-0 transition hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Ask AI</span>
              <ChevronRight className="w-4 h-4 text-[#004d40]" />
            </button>
          </div>

          {/* Vehicle Inspection AI Widget */}
          <VehicleInspectionWidget />

        </div>
      )}

      {/* Step 2: DRIVER SEARCH / DISCOVERY PAGE */}
      {step === 'DRIVER_SEARCH' && (
        <div className="max-w-7xl mx-auto px-4 py-6 space-y-6 animate-fadeIn text-slate-900">
          
          {/* Header Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setStep('LOCATION_SELECTION')}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 border border-slate-200 transition"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">Available Drivers Near You</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Verified drivers matched to your trip ({tripMetrics.distanceKm} km · ~{tripMetrics.durationMins} min)
                </p>
              </div>
            </div>

            {selectedDriversForCompare.length > 0 && (
              <button
                onClick={() => setShowComparisonModal(true)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center gap-1.5"
              >
                <span>Compare {selectedDriversForCompare.length} Drivers</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filters Toolbar */}
          <div className="bg-white border border-slate-200 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4 text-xs shadow-xs">
            <div className="flex items-center gap-3">
              <span className="font-bold text-slate-600 flex items-center gap-1">
                <SlidersHorizontal className="w-3.5 h-3.5 text-slate-900" /> Transmission:
              </span>
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
                {['ALL', 'AUTOMATIC', 'MANUAL'].map((t) => (
                  <button
                    key={t}
                    onClick={() => setFilterTransmission(t)}
                    className={`px-3 py-1 rounded-lg text-[11px] font-bold transition ${
                      filterTransmission === t ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-600">Sort By:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-slate-50 border border-slate-200 text-slate-900 text-xs px-3 py-1.5 rounded-xl focus:outline-none focus:border-slate-900 font-semibold"
              >
                <option value="RECOMMENDED">Recommended Match Score</option>
                <option value="PRICE">Price: Low to High</option>
                <option value="ETA">Fastest ETA</option>
                <option value="RATING">Highest Rating</option>
              </select>
            </div>
          </div>

          {/* Driver Cards Grid */}
          {filteredDrivers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredDrivers.map((driver) => (
                <DriverCard
                  key={driver.id}
                  driver={driver}
                  isCompared={Boolean(selectedDriversForCompare.find((d) => d.id === driver.id))}
                  onToggleCompare={handleToggleCompare}
                  onViewReport={(drv) => setReportDriver(drv)}
                  onSelectDriver={(drv) => setSummaryDriver(drv)}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-4 shadow-sm">
              <AlertCircle className="w-12 h-12 text-amber-500 mx-auto" />
              <h3 className="text-lg font-bold text-slate-900">No drivers available nearby matching your criteria</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Try expanding your search parameters or resetting filters.
              </p>
              <button
                onClick={() => setFilterTransmission('ALL')}
                className="px-4 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl shadow-md"
              >
                Reset Filters
              </button>
            </div>
          )}

        </div>
      )}

      {/* Driver Report Profile Modal */}
      {reportDriver && (
        <DriverReportModal
          driver={reportDriver}
          onClose={() => setReportDriver(null)}
          onSelectDriver={(drv) => {
            setReportDriver(null);
            setSummaryDriver(drv);
          }}
        />
      )}

      {/* Driver Comparison Modal */}
      {showComparisonModal && (
        <DriverComparisonModal
          drivers={selectedDriversForCompare}
          onClose={() => setShowComparisonModal(false)}
          onSelectDriver={(drv) => {
            setShowComparisonModal(false);
            setSummaryDriver(drv);
          }}
          onRemoveFromCompare={(id) =>
            setSelectedDriversForCompare(selectedDriversForCompare.filter((d) => d.id !== id))
          }
        />
      )}

      {/* Booking Summary Confirmation Modal */}
      {summaryDriver && (
        <BookingSummaryModal
          driver={summaryDriver}
          pickup={pickupLoc}
          destination={destLoc}
          metrics={tripMetrics}
          bookingType={bookingType}
          onClose={() => setSummaryDriver(null)}
          onConfirmBooking={handleConfirmBookingRecord}
        />
      )}

      {/* AI Concierge Modal */}
      {showAiConcierge && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowAiConcierge(false)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
            <AiConciergeWidget
              onBookingCreated={(b) => {
                setActiveBooking(b);
                setShowAiConcierge(false);
              }}
              onOpenPassport={(d) => setReportDriver(d as any)}
            />
          </div>
        </div>
      )}

    </div>
  );
};
