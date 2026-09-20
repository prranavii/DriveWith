import { DriverProfile } from './driverService';
import { LocationItem } from './locationService';

export interface BookingFareBreakdown {
  driverFee: number;
  platformFee: number;
  taxes: number;
  totalFare: number;
}

export interface BookingRecord {
  id: string;
  driver: DriverProfile;
  pickup: LocationItem | { name: string; address: string; lat: number; lng: number };
  destination: LocationItem | { name: string; address: string; lat: number; lng: number };
  vehicle: {
    make: string;
    model: string;
    transmission: string;
    vehicleType: string;
    licensePlate: string;
  };
  distanceKm: number;
  durationMins: number;
  fareBreakdown: BookingFareBreakdown;
  otp: string;
  status: 'CONFIRMED' | 'EN_ROUTE' | 'ARRIVED' | 'TRIP_STARTED' | 'COMPLETED';
  createdAt: string;
  recipientName?: string;
  recipientPhone?: string;
  bookingType: string;
}

export function calculateFareBreakdown(driverPrice: number): BookingFareBreakdown {
  const driverFee = driverPrice;
  const platformFee = 60;
  const taxes = Math.round((driverFee + platformFee) * 0.05); // 5% GST
  const totalFare = driverFee + platformFee + taxes;

  return {
    driverFee,
    platformFee,
    taxes,
    totalFare,
  };
}

export function createBookingRecord(
  driver: DriverProfile,
  pickup: any,
  destination: any,
  vehicle: any,
  distanceKm: number,
  durationMins: number,
  bookingType: string = 'NORMAL',
  recipientName?: string,
  recipientPhone?: string
): BookingRecord {
  const otp = Math.floor(1000 + Math.random() * 9000).toString();
  const bookingId = `DW-${Math.floor(10000 + Math.random() * 90000)}`;

  const fareBreakdown = calculateFareBreakdown(driver.estimatedPrice);

  return {
    id: bookingId,
    driver,
    pickup,
    destination,
    vehicle: vehicle || { make: 'Honda', model: 'City', transmission: 'AUTOMATIC', vehicleType: 'SEDAN', licensePlate: 'UP16 AB 1234' },
    distanceKm,
    durationMins,
    fareBreakdown,
    otp,
    status: 'CONFIRMED',
    createdAt: new Date().toISOString(),
    bookingType,
    recipientName,
    recipientPhone,
  };
}
