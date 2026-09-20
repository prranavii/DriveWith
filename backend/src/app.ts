import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import { seedDatabase } from './config/seed';
import { initWebSocketServer } from './websocket/server';

import authRoutes from './routes/authRoutes';
import vehicleRoutes from './routes/vehicleRoutes';
import driverRoutes from './routes/driverRoutes';
import matchingRoutes from './routes/matchingRoutes';
import bookingRoutes from './routes/bookingRoutes';
import paymentRoutes from './routes/paymentRoutes';
import adminRoutes from './routes/adminRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Seed Database
seedDatabase().catch(err => console.error('[Seed Error]', err));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/drivers', driverRoutes);
app.use('/api/matching', matchingRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/admin', adminRoutes);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'DriveWith Core Express Backend',
    timestamp: new Date().toISOString(),
  });
});

const server = http.createServer(app);
initWebSocketServer(server);

export default app;

if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`[DriveWith Backend] Server & WebSockets listening on http://localhost:${PORT}`);
  });
}
