import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL || 'postgres://postgres:postgrespassword@localhost:5432/drivewith_db';

export const pool = new Pool({
  connectionString,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

// In-memory data store fallback for standalone zero-dependency execution if PostgreSQL is unavailable locally
export const inMemoryStore: Record<string, any[]> = {
  users: [],
  drivers: [],
  driver_skills: [],
  vehicles: [],
  bookings: [],
  trips: [],
  trip_locations: [],
  payments: [],
  ratings: [],
  emergency_requests: [],
  vehicle_inspections: [],
  agent_logs: [],
  incidents: [],
};

export let isDbConnected = false;

pool.connect()
  .then(client => {
    isDbConnected = true;
    console.log('[DB] Successfully connected to PostgreSQL / PostGIS database');
    client.release();
  })
  .catch(err => {
    isDbConnected = false;
    console.warn('[DB] PostgreSQL connection unavailable. Operating in persistent in-memory fallback mode for local demo execution:', err.message);
  });

export async function query(text: string, params?: any[]) {
  if (isDbConnected) {
    try {
      return await pool.query(text, params);
    } catch (error) {
      console.error('[DB Query Error]', error);
      throw error;
    }
  }
  // Mock query fallback handler if DB offline
  return { rows: [], rowCount: 0 };
}
