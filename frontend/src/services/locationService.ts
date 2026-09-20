export interface LocationItem {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  city: string;
}

export const POPULAR_LOCATIONS: LocationItem[] = [
  { id: 'loc-1', name: 'Sector 62, Noida', address: 'Sector 62, Noida, Uttar Pradesh 201301', lat: 28.6270, lng: 77.3726, city: 'Noida' },
  { id: 'loc-2', name: 'DLF Cyber City, Gurgaon', address: 'DLF Phase 2, Gurgaon, Haryana 122002', lat: 28.4950, lng: 77.0895, city: 'Gurgaon' },
  { id: 'loc-3', name: 'Connaught Place, New Delhi', address: 'Connaught Place, New Delhi, Delhi 110001', lat: 28.6315, lng: 77.2167, city: 'Delhi' },
  { id: 'loc-4', name: 'Indira Gandhi Int. Airport (T3)', address: 'New Delhi, Delhi 110037', lat: 28.5562, lng: 77.1000, city: 'Delhi' },
  { id: 'loc-5', name: 'Sector 18, Noida', address: 'Sector 18, Noida, Uttar Pradesh 201301', lat: 28.5708, lng: 77.3261, city: 'Noida' },
  { id: 'loc-6', name: 'Golf Course Road, Gurgaon', address: 'Sector 54, Gurgaon, Haryana 122011', lat: 28.4390, lng: 77.1020, city: 'Gurgaon' },
  { id: 'loc-7', name: 'South Extension, Delhi', address: 'South Extension II, New Delhi, Delhi 110049', lat: 28.5683, lng: 77.2205, city: 'Delhi' },
  { id: 'loc-8', name: 'Greater Noida West', address: 'Gaur City 1, Greater Noida, UP 201318', lat: 28.6080, lng: 77.4290, city: 'Noida' },
  { id: 'loc-9', name: 'Bandra Kurla Complex (BKC)', address: 'BKC, Mumbai, Maharashtra 400051', lat: 19.0657, lng: 72.8686, city: 'Mumbai' },
  { id: 'loc-10', name: 'Koramangala, Bengaluru', address: 'Koramangala 5th Block, Bengaluru, Karnataka 560095', lat: 12.9352, lng: 77.6245, city: 'Bengaluru' },
];

export async function getCurrentUserLocation(): Promise<{ lat: number; lng: number; address: string }> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        resolve({
          lat: latitude,
          lng: longitude,
          address: `Current Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`,
        });
      },
      (error) => {
        let msg = 'Failed to detect current location.';
        if (error.code === error.PERMISSION_DENIED) {
          msg = 'Location permission denied. Please enter your location manually.';
        }
        reject(new Error(msg));
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  });
}

export function searchLocations(query: string): LocationItem[] {
  if (!query || query.trim().length === 0) return POPULAR_LOCATIONS.slice(0, 5);
  const q = query.toLowerCase().trim();
  return POPULAR_LOCATIONS.filter(
    (loc) => loc.name.toLowerCase().includes(q) || loc.address.toLowerCase().includes(q) || loc.city.toLowerCase().includes(q)
  );
}
