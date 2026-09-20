export interface DriverVerification {
  identityVerified: boolean;
  licenseVerified: boolean;
  backgroundChecked: boolean;
  addressVerified: boolean;
  experienceVerified: boolean;
  isDemoData: boolean;
}

export interface DrivingStats {
  totalTrips: number;
  successfulTripsPct: number;
  averageRating: number;
  onTimePercentage: number;
  cancellationRatePct: number;
  repeatCustomersPct: number;
  avgResponseTimeMins: number;
}

export interface ReviewItem {
  id: string;
  customerName: string;
  rating: number;
  date: string;
  comment: string;
  tripType: string;
}

export interface SafetyRecord {
  safeDrivingScore: number; // 0-100
  accidentHistoryCount: number;
  verifiedComplaintsCount: number;
  emergencyResponseTraining: boolean;
  defensiveDrivingCert: boolean;
  isSimulatedData: boolean;
}

export interface DriverSkills {
  highwayDriving: boolean;
  nightDriving: boolean;
  automaticVehicles: boolean;
  manualVehicles: boolean;
  luxuryVehicles: boolean;
  longDistanceDriving: boolean;
  cityDriving: boolean;
  elderlyAssistance: boolean;
}

export interface DriverProfile {
  id: string;
  name: string;
  profileImage: string;
  rating: number;
  totalTrips: number;
  experienceYears: number;
  languages: string[];
  distanceKm: number;
  etaMins: number;
  estimatedPrice: number;
  badge: string;
  availability: 'AVAILABLE' | 'ON_TRIP' | 'OFFLINE';
  transmissionSupport: ('AUTOMATIC' | 'MANUAL')[];
  vehicleTypesSupport: ('SEDAN' | 'SUV' | 'HATCHBACK' | 'LUXURY')[];
  verifications: DriverVerification;
  stats: DrivingStats;
  safety: SafetyRecord;
  skills: DriverSkills;
  reviews: ReviewItem[];
  reasons: string[];
}

export const DEMO_DRIVERS: DriverProfile[] = [
  {
    id: 'drv-101',
    name: 'Rahul Sharma',
    profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    rating: 4.9,
    totalTrips: 1284,
    experienceYears: 6,
    languages: ['Hindi', 'English'],
    distanceKm: 2.1,
    etaMins: 8,
    estimatedPrice: 650,
    badge: 'PLATINUM_PRO',
    availability: 'AVAILABLE',
    transmissionSupport: ['AUTOMATIC', 'MANUAL'],
    vehicleTypesSupport: ['SEDAN', 'SUV', 'LUXURY'],
    verifications: {
      identityVerified: true,
      licenseVerified: true,
      backgroundChecked: true,
      addressVerified: true,
      experienceVerified: true,
      isDemoData: true,
    },
    stats: {
      totalTrips: 1284,
      successfulTripsPct: 99.2,
      averageRating: 4.92,
      onTimePercentage: 98.4,
      cancellationRatePct: 0.8,
      repeatCustomersPct: 42.5,
      avgResponseTimeMins: 3,
    },
    safety: {
      safeDrivingScore: 98,
      accidentHistoryCount: 0,
      verifiedComplaintsCount: 0,
      emergencyResponseTraining: true,
      defensiveDrivingCert: true,
      isSimulatedData: true,
    },
    skills: {
      highwayDriving: true,
      nightDriving: true,
      automaticVehicles: true,
      manualVehicles: true,
      luxuryVehicles: true,
      longDistanceDriving: true,
      cityDriving: true,
      elderlyAssistance: true,
    },
    reviews: [
      { id: 'rev-1', customerName: 'Ananya V.', rating: 5.0, date: '2 days ago', comment: 'Very professional and punctual. Drove carefully throughout the trip from Noida to Gurgaon.', tripType: 'Outstation Trip' },
      { id: 'rev-2', customerName: 'Vikram M.', rating: 5.0, date: '1 week ago', comment: 'Drove my BMW 5 Series smoothly. Highly recommended for luxury automatic cars.', tripType: 'City Driving' },
      { id: 'rev-3', customerName: 'Rohan G.', rating: 4.8, date: '2 weeks ago', comment: 'Excellent night driving skills. Felt completely safe returning home late.', tripType: 'Safe Return' },
    ],
    reasons: ['2.1 km away · Arrives in ~8 min', '98.4% on-time record', 'Certified for Automatic SUVs & Luxury Sedans', '4.92 Rating (1,284 trips)'],
  },
  {
    id: 'drv-102',
    name: 'Suresh Kumar',
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    rating: 4.8,
    totalTrips: 940,
    experienceYears: 8,
    languages: ['Hindi', 'English', 'Punjabi'],
    distanceKm: 3.4,
    etaMins: 11,
    estimatedPrice: 610,
    badge: 'GOLD_VETERAN',
    availability: 'AVAILABLE',
    transmissionSupport: ['AUTOMATIC', 'MANUAL'],
    vehicleTypesSupport: ['SEDAN', 'SUV', 'HATCHBACK'],
    verifications: {
      identityVerified: true,
      licenseVerified: true,
      backgroundChecked: true,
      addressVerified: true,
      experienceVerified: true,
      isDemoData: true,
    },
    stats: {
      totalTrips: 940,
      successfulTripsPct: 98.6,
      averageRating: 4.85,
      onTimePercentage: 96.8,
      cancellationRatePct: 1.2,
      repeatCustomersPct: 38.0,
      avgResponseTimeMins: 4,
    },
    safety: {
      safeDrivingScore: 96,
      accidentHistoryCount: 0,
      verifiedComplaintsCount: 0,
      emergencyResponseTraining: true,
      defensiveDrivingCert: true,
      isSimulatedData: true,
    },
    skills: {
      highwayDriving: true,
      nightDriving: true,
      automaticVehicles: true,
      manualVehicles: true,
      luxuryVehicles: false,
      longDistanceDriving: true,
      cityDriving: true,
      elderlyAssistance: true,
    },
    reviews: [
      { id: 'rev-4', customerName: 'Priya P.', rating: 5.0, date: '3 days ago', comment: 'Assisted my elderly mother with great care and drove very calmly in heavy traffic.', tripType: 'Medical Appointment' },
      { id: 'rev-5', customerName: 'Amit S.', rating: 4.7, date: '5 days ago', comment: 'Great experience with manual transmission Innova Crysta.', tripType: 'Family Outing' },
    ],
    reasons: ['3.4 km away · Arrives in ~11 min', '8 years driving experience', 'Certified for Elderly Passenger Assistance', '96.8% on-time record'],
  },
  {
    id: 'drv-103',
    name: 'Vikram Yadav',
    profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    rating: 4.95,
    totalTrips: 2100,
    experienceYears: 10,
    languages: ['Hindi', 'English'],
    distanceKm: 1.5,
    etaMins: 5,
    estimatedPrice: 700,
    badge: 'MASTER_CHAUFFEUR',
    availability: 'AVAILABLE',
    transmissionSupport: ['AUTOMATIC', 'MANUAL'],
    vehicleTypesSupport: ['SEDAN', 'SUV', 'LUXURY', 'HATCHBACK'],
    verifications: {
      identityVerified: true,
      licenseVerified: true,
      backgroundChecked: true,
      addressVerified: true,
      experienceVerified: true,
      isDemoData: true,
    },
    stats: {
      totalTrips: 2100,
      successfulTripsPct: 99.8,
      averageRating: 4.95,
      onTimePercentage: 99.1,
      cancellationRatePct: 0.3,
      repeatCustomersPct: 54.0,
      avgResponseTimeMins: 2,
    },
    safety: {
      safeDrivingScore: 99,
      accidentHistoryCount: 0,
      verifiedComplaintsCount: 0,
      emergencyResponseTraining: true,
      defensiveDrivingCert: true,
      isSimulatedData: true,
    },
    skills: {
      highwayDriving: true,
      nightDriving: true,
      automaticVehicles: true,
      manualVehicles: true,
      luxuryVehicles: true,
      longDistanceDriving: true,
      cityDriving: true,
      elderlyAssistance: true,
    },
    reviews: [
      { id: 'rev-6', customerName: 'Kabir M.', rating: 5.0, date: 'Yesterday', comment: 'Flawless Master Chauffeur experience! Handled highway & city traffic expertly.', tripType: 'Business Travel' },
      { id: 'rev-7', customerName: 'Sneha R.', rating: 5.0, date: '4 days ago', comment: 'Very polite, impeccably punctual, and drove our Audi A6 effortlessly.', tripType: 'Airport Pickup' },
    ],
    reasons: ['1.5 km away · Arrives in ~5 min', 'Master Chauffeur Badge', '99.1% on-time record', '10 years experience (2,100 trips)'],
  },
  {
    id: 'drv-104',
    name: 'Amit Singh',
    profileImage: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
    rating: 4.7,
    totalTrips: 730,
    experienceYears: 4,
    languages: ['Hindi'],
    distanceKm: 4.2,
    etaMins: 14,
    estimatedPrice: 580,
    badge: 'SILVER_STAR',
    availability: 'AVAILABLE',
    transmissionSupport: ['AUTOMATIC', 'MANUAL'],
    vehicleTypesSupport: ['SEDAN', 'HATCHBACK'],
    verifications: {
      identityVerified: true,
      licenseVerified: true,
      backgroundChecked: true,
      addressVerified: true,
      experienceVerified: true,
      isDemoData: true,
    },
    stats: {
      totalTrips: 730,
      successfulTripsPct: 97.8,
      averageRating: 4.72,
      onTimePercentage: 94.5,
      cancellationRatePct: 2.1,
      repeatCustomersPct: 28.0,
      avgResponseTimeMins: 5,
    },
    safety: {
      safeDrivingScore: 94,
      accidentHistoryCount: 0,
      verifiedComplaintsCount: 0,
      emergencyResponseTraining: false,
      defensiveDrivingCert: true,
      isSimulatedData: true,
    },
    skills: {
      highwayDriving: true,
      nightDriving: false,
      automaticVehicles: true,
      manualVehicles: true,
      luxuryVehicles: false,
      longDistanceDriving: false,
      cityDriving: true,
      elderlyAssistance: false,
    },
    reviews: [
      { id: 'rev-8', customerName: 'Deepak T.', rating: 4.7, date: '1 week ago', comment: 'Punctual driver for city commute. Polite behavior.', tripType: 'City Drive' },
    ],
    reasons: ['4.2 km away · Arrives in ~14 min', 'Economical fare (₹580 estimated)', '730 successful trips'],
  },
];

export function getAvailableDrivers(pickupLat: number, pickupLng: number): DriverProfile[] {
  return DEMO_DRIVERS;
}
