import { Server as HttpServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import { inMemoryStore } from '../config/db';

export interface LocationTick {
  driverId: string;
  tripId?: string;
  lat: number;
  lng: number;
  speed: number;
  bearing: number;
}

export function initWebSocketServer(server: HttpServer) {
  const wss = new WebSocketServer({ server });

  console.log('[WebSocket] Driver GPS Tracking & Telemetry Server initialized');

  wss.on('connection', (ws: WebSocket) => {
    ws.send(JSON.stringify({ type: 'CONNECTED', message: 'Connected to DriveWith Telemetry Stream' }));

    ws.on('message', (message: string) => {
      try {
        const data = JSON.parse(message.toString());
        if (data.type === 'GPS_UPDATE') {
          const { driverId, lat, lng } = data;
          const driver = inMemoryStore.drivers.find(d => d.id === driverId);
          if (driver) {
            driver.current_lat = lat;
            driver.current_lng = lng;
          }

          // Broadcast GPS update to all connected clients
          wss.clients.forEach(client => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify({
                type: 'DRIVER_LOCATION_UPDATE',
                driverId,
                lat,
                lng,
                timestamp: new Date().toISOString(),
              }));
            }
          });
        }
      } catch (err) {
        console.error('[WebSocket Message Error]', err);
      }
    });
  });

  // GPS Simulation Loop: simulate driver movement toward customer for active trips
  setInterval(() => {
    inMemoryStore.drivers.forEach((driver, idx) => {
      if (driver.is_online) {
        // Small random GPS delta simulation near Noida/Delhi
        const deltaLat = (Math.random() - 0.5) * 0.0008;
        const deltaLng = (Math.random() - 0.5) * 0.0008;
        driver.current_lat = parseFloat((driver.current_lat + deltaLat).toFixed(4));
        driver.current_lng = parseFloat((driver.current_lng + deltaLng).toFixed(4));

        wss.clients.forEach(client => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({
              type: 'DRIVER_LOCATION_TICK',
              driverId: driver.id,
              lat: driver.current_lat,
              lng: driver.current_lng,
            }));
          }
        });
      }
    });
  }, 4000);

  return wss;
}
