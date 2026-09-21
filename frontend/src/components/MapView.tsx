import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Car, Clock, Navigation, Plus, Minus } from 'lucide-react';
import { LocationItem } from '../services/locationService';
import { DriverProfile } from '../services/driverService';

// Fix Leaflet marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom Minimal Black/Green/Red Pin Markers
const pickupIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-black.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const destIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const driverIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-black.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [22, 36],
  iconAnchor: [11, 36],
  popupAnchor: [1, -30],
  shadowSize: [36, 36]
});

interface MapViewProps {
  pickupLoc: LocationItem | { lat: number; lng: number; name: string };
  destLoc: LocationItem | { lat: number; lng: number; name: string } | null;
  drivers?: DriverProfile[];
  routePolyline?: [number, number][];
  onSelectMapLocation?: (lat: number, lng: number) => void;
  heightClass?: string;
  distanceKm?: number;
  durationMins?: number;
}

// Auto-fit map bounds helper
function MapBoundsUpdater({ bounds }: { bounds: L.LatLngBoundsExpression }) {
  const map = useMap();
  useEffect(() => {
    if (bounds) {
      map.fitBounds(bounds, { padding: [40, 40] });
    }
  }, [bounds, map]);
  return null;
}

// Map Click Handler Component
function MapClickHandler({ onSelectMapLocation }: { onSelectMapLocation?: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      if (onSelectMapLocation) {
        onSelectMapLocation(e.latlng.lat, e.latlng.lng);
      }
    },
  });
  return null;
}

export const MapView: React.FC<MapViewProps> = ({
  pickupLoc,
  destLoc,
  drivers = [],
  routePolyline = [],
  onSelectMapLocation,
  heightClass = 'h-80 sm:h-96 lg:h-[480px]',
  distanceKm = 12.4,
  durationMins = 32,
}) => {
  const pickupCoords: [number, number] = [pickupLoc.lat || 28.6270, pickupLoc.lng || 77.3726];
  const destCoords: [number, number] | null = destLoc ? [destLoc.lat, destLoc.lng] : null;

  // Compute map bounds containing all markers
  const allCoords: [number, number][] = [pickupCoords];
  if (destCoords) allCoords.push(destCoords);

  const bounds = L.latLngBounds(allCoords);

  return (
    <div className={`relative overflow-hidden bg-[#F8F8F8] ${heightClass}`}>
      
      {/* Map Tile Layer */}
      <MapContainer center={pickupCoords} zoom={12} className="h-full w-full z-0" zoomControl={false}>
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />

        <MapBoundsUpdater bounds={bounds} />
        <MapClickHandler onSelectMapLocation={onSelectMapLocation} />

        {/* Pickup Marker */}
        <Marker position={pickupCoords} icon={pickupIcon}>
          <Popup>
            <div className="text-xs font-black">
              <span className="text-black">Pickup Location</span>
              <p className="text-gray-700 text-[11px] font-medium">{pickupLoc.name}</p>
            </div>
          </Popup>
        </Marker>

        {/* Destination Marker */}
        {destCoords && (
          <Marker position={destCoords} icon={destIcon}>
            <Popup>
              <div className="text-xs font-black">
                <span className="text-rose-600">Destination</span>
                <p className="text-gray-700 text-[11px] font-medium">{destLoc?.name}</p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Solid Black Route Line (Matching Reference Images 4, 6, 7) */}
        {destCoords && routePolyline.length > 0 && (
          <Polyline positions={routePolyline} color="#000000" weight={5} opacity={0.95} />
        )}

        {/* Nearby Drivers Markers */}
        {drivers.map((drv) => {
          const drvLat = pickupCoords[0] + (Math.random() - 0.5) * 0.02;
          const drvLng = pickupCoords[1] + (Math.random() - 0.5) * 0.02;
          return (
            <Marker key={drv.id} position={[drvLat, drvLng]} icon={driverIcon}>
              <Popup>
                <div className="text-xs space-y-1">
                  <div className="font-bold text-black">{drv.name}</div>
                  <div className="text-amber-600 font-bold">★ {drv.rating} • {drv.distanceKm} km away</div>
                  <div className="text-black text-[10px] font-semibold">₹{drv.estimatedPrice} estimated</div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Floating Route Summary Pill (Matching Reference Images 4 & 7) */}
      {destLoc && (
        <div className="absolute top-4 left-4 z-10 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-full border border-[#E5E7EB] shadow-md text-xs font-black text-black flex items-center gap-3 animate-fadeIn">
          <div className="flex items-center gap-1.5">
            <Car className="w-4 h-4 text-black" />
            <span>{distanceKm} km</span>
          </div>
          <span className="text-gray-300">•</span>
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-black" />
            <span>{durationMins} min</span>
          </div>
        </div>
      )}

      {/* Minimal Map Controls (Locate Target & Zoom buttons) */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        <button
          type="button"
          className="w-10 h-10 rounded-2xl bg-white/95 backdrop-blur-md border border-[#E5E7EB] shadow-md text-black flex items-center justify-center transition hover:bg-gray-100"
          title="Current Location"
        >
          <Navigation className="w-4 h-4 text-black" />
        </button>

        <div className="flex flex-col bg-white/95 backdrop-blur-md border border-[#E5E7EB] rounded-2xl shadow-md overflow-hidden divide-y divide-gray-100">
          <button
            type="button"
            className="w-10 h-10 text-black hover:bg-gray-100 flex items-center justify-center transition"
            title="Zoom In"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            type="button"
            className="w-10 h-10 text-black hover:bg-gray-100 flex items-center justify-center transition"
            title="Zoom Out"
          >
            <Minus className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
};
