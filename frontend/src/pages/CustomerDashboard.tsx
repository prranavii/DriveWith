import React, { useState } from 'react';
import {
  Search,
  ArrowLeft,
  ChevronRight,
  SlidersHorizontal,
  AlertCircle,
  RefreshCw,
  Car,
  ShieldCheck,
  Sparkles,
  X,
  Home as HomeIcon,
  Calendar,
  User,
  Shield,
  Zap,
  Clock,
  MapPin,
  CheckCircle,
  Signal,
  ArrowUpRight,
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

import { LocationItem, POPULAR_LOCATIONS } from '../services/locationService';
import { calculateTripMetrics, RouteCalculation } from '../services/mapService';
import { DriverProfile, DEMO_DRIVERS } from '../services/driverService';
import { BookingRecord } from '../services/bookingService';

import { ConnectedRouteInputCard } from '../components/ConnectedRouteInputCard';
import { VehicleServiceSelector, VEHICLE_CATEGORIES, VehicleCategory } from '../components/VehicleServiceSelector';
import { MapView } from '../components/MapView';
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
  const [showTraffic, setShowTraffic] = useState(false);

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
    setActiveBooking(record);
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

  const tripModes = [
    { id: 'mode-instant', title: 'Instant Ride', desc: 'Drive now', icon: Zap },
    { id: 'mode-scheduled', title: 'Scheduled Ride', desc: 'Plan ahead', icon: Calendar },
    { id: 'mode-hourly', title: 'Hourly Driver', desc: 'By the hour', icon: Clock },
    { id: 'mode-outstation', title: 'Outstation', desc: 'Long distance', icon: Car },
  ];

  const recentBookings = [
    { id: 'b1', route: 'Sector 62, Noida → DLF Cyber City, Gurgaon', fare: 630, status: 'Completed', date: 'Yesterday' },
    { id: 'b2', route: 'Sector 62, Noida → IGI Airport T3, Delhi', fare: 720, status: 'Completed', date: '14 Sep 2026' },
  ];

  return (
    <div className="w-full space-y-8 pb-20 sm:pb-8 text-black bg-[#F8F8F8] min-h-screen">
      
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

      {/* Step 1: LOCATION SELECTION & AI-NATIVE HERO EXPERIENCE */}
      {step === 'LOCATION_SELECTION' && (
        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 space-y-8">
          
          {/* Section 1: Hero Experience Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left Hero Branding & Dual-Mode Booking Card (5 Cols Desktop) */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Hero Headlines */}
              <div className="space-y-3">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black text-white text-[11px] font-bold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Minimal Monochrome 2.0</span>
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-black tracking-tight leading-tight">
                  Same Car. <br />
                  <span className="text-neutral-500">A Smarter Journey.</span>
                </h1>
                <p className="text-xs sm:text-sm text-neutral-600 font-medium leading-relaxed">
                  Professional drivers for your own vehicle. Safe. Reliable. On-Demand.
                </p>

                {/* 4 Feature Badges */}
                <div className="grid grid-cols-2 gap-2 pt-1 text-xs font-bold text-black">
                  <div className="flex items-center gap-2 bg-white p-2.5 rounded-2xl border border-[#E5E7EB] shadow-xs">
                    <ShieldCheck className="w-4 h-4 text-black" />
                    <span>Verified Drivers</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white p-2.5 rounded-2xl border border-[#E5E7EB] shadow-xs">
                    <Signal className="w-4 h-4 text-black" />
                    <span>Real-time Tracking</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white p-2.5 rounded-2xl border border-[#E5E7EB] shadow-xs">
                    <Sparkles className="w-4 h-4 text-black" />
                    <span>AI Trip Assistant</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white p-2.5 rounded-2xl border border-[#E5E7EB] shadow-xs">
                    <Car className="w-4 h-4 text-black" />
                    <span>Your Car, Your Comfort</span>
                  </div>
                </div>
              </div>

              {/* Floating Dual-Mode Booking Card */}
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
                onOpenAiConcierge={() => setShowAiConcierge(true)}
              />

              {/* Hero Banner */}
              <div className="rounded-2xl border border-[#E5E7EB] bg-black p-5 text-white flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-bold">"You drive life. We'll handle the rest."</p>
                  <p className="text-[11px] text-neutral-400 font-medium">On-demand verified personal drivers</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-700 flex items-center justify-center font-bold text-lg shrink-0">
                  🚘
                </div>
              </div>

            </div>

            {/* Right Immersive Leaflet Map Canvas (7 Cols Desktop) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="relative w-full h-[520px] sm:h-[600px] lg:h-[660px] rounded-3xl overflow-hidden border border-[#E5E7EB] shadow-sm bg-neutral-100">
                <MapView
                  pickupLoc={pickupLoc}
                  destLoc={destLoc}
                  drivers={availableDrivers}
                  routePolyline={tripMetrics.routePolyline}
                  heightClass="h-full w-full"
                  distanceKm={tripMetrics.distanceKm}
                  durationMins={tripMetrics.durationMins}
                />

                {/* Live Traffic Toggle Button */}
                <button
                  type="button"
                  onClick={() => setShowTraffic(!showTraffic)}
                  className={`absolute bottom-6 right-6 z-10 px-3.5 py-2 rounded-xl border shadow-md text-xs font-bold flex items-center gap-1.5 transition ${
                    showTraffic
                      ? 'bg-black text-white border-black'
                      : 'bg-white text-black border-[#E5E7EB] hover:bg-neutral-50'
                  }`}
                >
                  <Signal className="w-3.5 h-3.5" />
                  <span>Live Traffic</span>
                </button>
              </div>
            </div>

          </div>

          {/* Section: Choose Your Trip Mode */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg sm:text-xl font-black text-black tracking-tight">Choose Your Trip Mode</h3>
                <p className="text-xs text-neutral-500 font-medium">Flexible options for every journey.</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
              {tripModes.map((mode) => {
                const Icon = mode.icon;
                const isSelected = (mode.id === 'mode-instant' && bookingType === 'NORMAL') || (mode.id === 'mode-scheduled' && bookingType === 'SCHEDULE');
                return (
                  <div
                    key={mode.id}
                    onClick={() => {
                      if (mode.id === 'mode-instant') setBookingType('NORMAL');
                      if (mode.id === 'mode-scheduled') setBookingType('SCHEDULE');
                    }}
                    className={`bg-white border rounded-2xl p-4 shadow-xs transition-all cursor-pointer space-y-2 text-left group ${
                      isSelected ? 'border-black ring-1 ring-black' : 'border-[#E5E7EB] hover:border-black'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-neutral-100 border border-[#E5E7EB] flex items-center justify-center group-hover:bg-black group-hover:text-white transition">
                      <Icon className="w-5 h-5 text-black group-hover:text-white transition" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-black">{mode.title}</h4>
                      <p className="text-[11px] text-neutral-500 font-medium mt-0.5">{mode.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Select Vehicle Category Section */}
          <div className="pt-4">
            <VehicleServiceSelector
              selectedCategory={selectedCategory}
              onSelectCategory={(cat) => setSelectedCategory(cat)}
              basePrice={tripMetrics.estimatedFareMin}
              onOpenAiConcierge={() => setShowAiConcierge(true)}
            />
          </div>

          {/* AI Concierge Banner */}
          <div className="bg-white border border-[#E5E7EB] rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs relative overflow-hidden">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-black text-white flex items-center justify-center font-bold text-2xl shadow-sm shrink-0">
                🤖
              </div>
              <div className="space-y-1">
                <h4 className="text-base sm:text-lg font-bold text-black">
                  Not sure what to enter?
                </h4>
                <p className="text-xs text-neutral-600 font-medium">
                  Let our AI Concierge plan your ride automatically.
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="text-[10px] bg-neutral-100 px-2.5 py-1 rounded-full border border-neutral-200 font-bold text-black">"Take my parents to airport"</span>
                  <span className="text-[10px] bg-neutral-100 px-2.5 py-1 rounded-full border border-neutral-200 font-bold text-black">"Driver for full day in Delhi"</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowAiConcierge(true)}
              className="bg-black hover:bg-neutral-800 text-white shadow-sm px-5 py-3 rounded-2xl font-bold text-xs flex items-center gap-1.5 shrink-0 transition"
            >
              <Sparkles className="w-4 h-4 text-white" />
              <span>Ask DriveWith AI →</span>
            </button>
          </div>

          {/* Trust Proof Banner */}
          <div className="bg-white border border-[#E5E7EB] rounded-3xl p-6 sm:p-8 shadow-xs text-center space-y-6">
            <div className="space-y-1">
              <h3 className="text-xl sm:text-2xl font-black text-black">"Same Roads. Better Stories."</h3>
              <p className="text-xs text-neutral-500 font-medium">Trusted mobility platform for personal vehicle owners across NCR</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
              <div className="space-y-0.5">
                <div className="text-2xl font-black text-black">10K+</div>
                <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Happy Users</p>
              </div>
              <div className="space-y-0.5">
                <div className="text-2xl font-black text-black">4.8★</div>
                <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Avg. Rating</p>
              </div>
              <div className="space-y-0.5">
                <div className="text-2xl font-black text-black">25+</div>
                <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Cities Supported</p>
              </div>
              <div className="space-y-0.5">
                <div className="text-2xl font-black text-black">100%</div>
                <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Verified Drivers</p>
              </div>
            </div>
          </div>

          {/* Recent Trips List */}
          <div className="space-y-3 pt-2">
            <h3 className="text-base font-bold text-black">Recent Trips</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {recentBookings.map((b) => (
                <div key={b.id} className="bg-white border border-[#E5E7EB] rounded-2xl p-4 shadow-xs flex items-center justify-between text-xs">
                  <div className="space-y-0.5">
                    <p className="font-bold text-black">{b.route}</p>
                    <p className="text-[11px] text-neutral-500 font-medium">{b.date} • ₹{b.fare}</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-neutral-100 text-black border border-neutral-200">
                    {b.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Vehicle Inspection AI Widget */}
          <VehicleInspectionWidget />

        </div>
      )}

      {/* Step 2: DRIVER SEARCH / DISCOVERY PAGE */}
      {step === 'DRIVER_SEARCH' && (
        <div className="max-w-7xl mx-auto px-4 py-6 space-y-6 animate-fadeIn text-black">
          
          {/* Header Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-white border border-[#E5E7EB] p-5 rounded-3xl shadow-xs">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setStep('LOCATION_SELECTION')}
                className="p-2.5 rounded-2xl bg-neutral-100 hover:bg-neutral-200 text-black border border-neutral-200 transition"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-black">Drivers Near You</h2>
                <p className="text-xs text-neutral-500 font-medium mt-0.5">
                  {filteredDrivers.length} verified drivers available ({tripMetrics.distanceKm} km · ~{tripMetrics.durationMins} min)
                </p>
              </div>
            </div>

            {selectedDriversForCompare.length > 0 && (
              <button
                onClick={() => setShowComparisonModal(true)}
                className="px-4 py-2.5 bg-black hover:bg-neutral-800 text-white font-bold text-xs rounded-2xl shadow-sm transition flex items-center gap-1.5"
              >
                <span>Compare {selectedDriversForCompare.length} Drivers</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filters Toolbar */}
          <div className="bg-white border border-[#E5E7EB] p-4 rounded-3xl flex flex-wrap items-center justify-between gap-4 text-xs shadow-xs">
            <div className="flex items-center gap-3">
              <span className="font-bold text-neutral-600 flex items-center gap-1">
                <SlidersHorizontal className="w-3.5 h-3.5 text-black" /> Transmission:
              </span>
              <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-xl border border-neutral-200 font-bold">
                {['ALL', 'AUTOMATIC', 'MANUAL'].map((t) => (
                  <button
                    key={t}
                    onClick={() => setFilterTransmission(t)}
                    className={`px-3 py-1 rounded-lg transition ${
                      filterTransmission === t
                        ? 'bg-black text-white shadow-xs'
                        : 'text-neutral-600 hover:text-black'
                    }`}
                  >
                    {t === 'ALL' ? 'All' : t === 'AUTOMATIC' ? 'Automatic' : 'Manual'}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 font-bold">
              <span className="text-neutral-500">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="bg-neutral-100 border border-neutral-200 rounded-xl px-3 py-1.5 text-xs text-black focus:outline-none cursor-pointer font-bold"
              >
                <option value="RECOMMENDED">Best Match</option>
                <option value="PRICE">Lowest Price</option>
                <option value="ETA">Nearest (Fastest ETA)</option>
                <option value="RATING">Highest Rating</option>
              </select>
            </div>
          </div>

          {/* Driver Discovery Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDrivers.map((driver, index) => (
              <DriverCard
                key={driver.id}
                driver={driver}
                isCompared={!!selectedDriversForCompare.find((d) => d.id === driver.id)}
                onToggleCompare={handleToggleCompare}
                onViewReport={(drv) => setReportDriver(drv)}
                onSelectDriver={(drv) => setSummaryDriver(drv)}
                isTopMatch={index === 0}
              />
            ))}
          </div>

        </div>
      )}

      {/* Mobile Bottom Navigation Bar */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E5E7EB] px-6 py-2 flex items-center justify-between text-[10px] font-bold text-black shadow-lg">
        <button
          onClick={() => setStep('LOCATION_SELECTION')}
          className={`flex flex-col items-center gap-0.5 ${step === 'LOCATION_SELECTION' ? 'text-black' : 'text-neutral-400'}`}
        >
          <HomeIcon className="w-5 h-5" />
          <span>Home</span>
        </button>
        <button
          onClick={() => setStep('DRIVER_SEARCH')}
          className={`flex flex-col items-center gap-0.5 ${step === 'DRIVER_SEARCH' ? 'text-black' : 'text-neutral-400'}`}
        >
          <Calendar className="w-5 h-5" />
          <span>Bookings</span>
        </button>
        <button
          onClick={() => setShowAiConcierge(true)}
          className="flex flex-col items-center gap-0.5 text-black"
        >
          <Sparkles className="w-5 h-5 text-black" />
          <span>AI</span>
        </button>
        <button
          onClick={() => setStep('LOCATION_SELECTION')}
          className="flex flex-col items-center gap-0.5 text-neutral-400"
        >
          <User className="w-5 h-5" />
          <span>Profile</span>
        </button>
      </div>

      {showAiConcierge && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-2xl w-full">
            <AiConciergeWidget
              onClose={() => setShowAiConcierge(false)}
              onBookingCreated={(booking) => {
                setShowAiConcierge(false);
                handleConfirmBookingRecord(booking);
              }}
              onOpenPassport={(drv) => {
                setReportDriver(drv);
                setShowAiConcierge(false);
              }}
            />
          </div>
        </div>
      )}

      {reportDriver && (
        <DriverReportModal
          driver={reportDriver}
          onClose={() => setReportDriver(null)}
          onSelectDriver={(drv) => {
            setSummaryDriver(drv);
            setReportDriver(null);
          }}
        />
      )}

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

      {showComparisonModal && (
        <DriverComparisonModal
          drivers={selectedDriversForCompare}
          onClose={() => setShowComparisonModal(false)}
          onSelectDriver={(drv) => {
            setSummaryDriver(drv);
            setShowComparisonModal(false);
          }}
          onRemoveFromCompare={(driverId) => {
            setSelectedDriversForCompare(selectedDriversForCompare.filter((d) => d.id !== driverId));
          }}
        />
      )}

    </div>
  );
};
