export interface RouteCalculation {
  distanceKm: number;
  durationMins: number;
  estimatedFareMin: number;
  estimatedFareMax: number;
  routePolyline: [number, number][];
}

function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
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

export function calculateTripMetrics(
  pickupLat: number,
  pickupLng: number,
  destLat: number,
  destLng: number
): RouteCalculation {
  const straightKm = haversineDistance(pickupLat, pickupLng, destLat, destLng);
  // Real road multiplier ~1.3x
  const distanceKm = parseFloat(Math.max(2.5, straightKm * 1.3).toFixed(1));
  const durationMins = Math.max(10, Math.round(distanceKm * 2.4));

  // Base fare ₹250 + ₹18/km
  const baseFare = 250 + distanceKm * 18;
  const estimatedFareMin = Math.round(baseFare);
  const estimatedFareMax = Math.round(baseFare * 1.15);

  // Generate intermediate points for polyline representation
  const intermediate1: [number, number] = [
    pickupLat + (destLat - pickupLat) * 0.33 + 0.005,
    pickupLng + (destLng - pickupLng) * 0.33 - 0.005,
  ];
  const intermediate2: [number, number] = [
    pickupLat + (destLat - pickupLat) * 0.66 - 0.003,
    pickupLng + (destLng - pickupLng) * 0.66 + 0.004,
  ];

  const routePolyline: [number, number][] = [
    [pickupLat, pickupLng],
    intermediate1,
    intermediate2,
    [destLat, destLng],
  ];

  return {
    distanceKm,
    durationMins,
    estimatedFareMin,
    estimatedFareMax,
    routePolyline,
  };
}
