import { inMemoryStore } from '../config/db';

export interface DriverMatchRequirement {
  pickupLat: number;
  pickupLng: number;
  transmission: 'MANUAL' | 'AUTOMATIC';
  vehicleType: 'SEDAN' | 'SUV' | 'HATCHBACK' | 'LUXURY';
  isNightTrip?: boolean;
  isHighwayTrip?: boolean;
  isEmergencyTrip?: boolean;
}

export interface ScoredDriver {
  driverId: string;
  userId: string;
  name: string;
  phone: string;
  rating: number;
  totalTrips: number;
  distanceKm: number;
  estimatedArrivalMins: number;
  compatibilityScore: number;
  reasons: string[];
  skills: any;
}

// Haversine distance calculator in kilometers
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function searchCompatibleDrivers(req: DriverMatchRequirement): ScoredDriver[] {
  const onlineDrivers = inMemoryStore.drivers.filter(d => d.is_online);

  const scoredList: ScoredDriver[] = onlineDrivers.map(driver => {
    const user = inMemoryStore.users.find(u => u.id === driver.user_id);
    const skills = inMemoryStore.driver_skills.find(s => s.driver_id === driver.id) || {
      years_experience: 5,
      transmission_manual: true,
      transmission_auto: true,
      sedan_exp: true,
      suv_exp: true,
      luxury_exp: false,
      night_driving_exp: true,
      highway_exp: true,
      emergency_exp: true,
      on_time_percentage: 95.0,
      cancellation_rate: 1.5,
    };

    // 1. Distance & ETA (25%)
    const distanceKm = calculateDistance(req.pickupLat, req.pickupLng, driver.current_lat, driver.current_lng);
    const etaMins = Math.max(3, Math.round(distanceKm * 2.5) + 3);
    const distanceScore = Math.max(0, 100 - distanceKm * 10); // max score if <1km

    // 2. Vehicle Compatibility (20%)
    let vehicleCompScore = 50;
    if (req.transmission === 'MANUAL' && skills.transmission_manual) vehicleCompScore += 25;
    if (req.transmission === 'AUTOMATIC' && skills.transmission_auto) vehicleCompScore += 25;
    if (req.vehicleType === 'SUV' && skills.suv_exp) vehicleCompScore += 25;
    if (req.vehicleType === 'LUXURY' && skills.luxury_exp) vehicleCompScore += 25;
    if (req.vehicleType === 'SEDAN' && skills.sedan_exp) vehicleCompScore += 25;
    vehicleCompScore = Math.min(100, vehicleCompScore);

    // 3. Reliability (15%)
    const onTimeScore = skills.on_time_percentage || 95.0;
    const cancelPenalty = (skills.cancellation_rate || 1.0) * 10;
    const reliabilityScore = Math.max(0, Math.min(100, onTimeScore - cancelPenalty));

    // 4. Experience (15%)
    const expScore = Math.min(100, (skills.years_experience / 10) * 100);

    // 5. Rating (10%)
    const ratingScore = ((driver.rating || 4.5) / 5.0) * 100;

    // 6. Trip Suitability (10%)
    let suitabilityScore = 70;
    if (req.isNightTrip && skills.night_driving_exp) suitabilityScore += 10;
    if (req.isHighwayTrip && skills.highway_exp) suitabilityScore += 10;
    if (req.isEmergencyTrip && skills.emergency_exp) suitabilityScore += 10;
    suitabilityScore = Math.min(100, suitabilityScore);

    // 7. Availability (5%)
    const availabilityScore = driver.is_online ? 100 : 0;

    // Weighted Total Score Calculation
    const totalScore =
      distanceScore * 0.25 +
      vehicleCompScore * 0.20 +
      reliabilityScore * 0.15 +
      expScore * 0.15 +
      ratingScore * 0.10 +
      suitabilityScore * 0.10 +
      availabilityScore * 0.05;

    const roundedScore = parseFloat(totalScore.toFixed(1));

    // Concise Factual Reasons
    const reasons: string[] = [
      `${distanceKm.toFixed(1)} km from pickup (${etaMins} mins ETA)`,
      `Experienced with ${req.transmission.toLowerCase()} ${req.vehicleType.toLowerCase()}s`,
      `${skills.on_time_percentage}% on-time rate`,
      `${driver.rating} rating (${driver.total_trips} completed trips)`,
    ];

    if (req.isEmergencyTrip && skills.emergency_exp) {
      reasons.push('Verified Emergency Trip Experience');
    }
    if (req.isNightTrip && skills.night_driving_exp) {
      reasons.push('Certified Night Driving Veteran');
    }

    return {
      driverId: driver.id,
      userId: driver.user_id,
      name: user?.name || 'Professional Driver',
      phone: user?.phone || '+91 9000000000',
      rating: driver.rating,
      totalTrips: driver.total_trips,
      distanceKm: parseFloat(distanceKm.toFixed(2)),
      estimatedArrivalMins: etaMins,
      compatibilityScore: roundedScore,
      reasons,
      skills,
    };
  });

  // Sort descending by compatibility score
  return scoredList.sort((a, b) => b.compatibilityScore - a.compatibilityScore);
}
