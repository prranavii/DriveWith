import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { inMemoryStore, query, isDbConnected } from '../config/db';

export const getVehicles = async (req: AuthRequest, res: Response) => {
  try {
    const customerId = req.user?.id || 'c1010000-0000-0000-0000-000000000001';
    let vehicles = inMemoryStore.vehicles.filter(v => v.customer_id === customerId);

    if (isDbConnected) {
      const dbRes = await query('SELECT * FROM vehicles WHERE customer_id = $1', [customerId]);
      if (dbRes.rows.length > 0) vehicles = dbRes.rows;
    }

    res.json({ vehicles });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createVehicle = async (req: AuthRequest, res: Response) => {
  try {
    const customerId = req.user?.id || 'c1010000-0000-0000-0000-000000000001';
    const { make, model, year, license_plate, transmission, vehicle_type, color } = req.body;

    if (!make || !model || !license_plate || !transmission || !vehicle_type) {
      return res.status(400).json({ error: 'Missing vehicle parameters' });
    }

    const newVehicle = {
      id: `v-${Date.now()}`,
      customer_id: customerId,
      make,
      model,
      year: parseInt(year) || 2022,
      license_plate,
      transmission: transmission.toUpperCase(),
      vehicle_type: vehicle_type.toUpperCase(),
      color: color || 'White',
      created_at: new Date().toISOString(),
    };

    if (isDbConnected) {
      await query(
        'INSERT INTO vehicles (id, customer_id, make, model, year, license_plate, transmission, vehicle_type, color) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
        [newVehicle.id, newVehicle.customer_id, newVehicle.make, newVehicle.model, newVehicle.year, newVehicle.license_plate, newVehicle.transmission, newVehicle.vehicle_type, newVehicle.color]
      );
    }

    inMemoryStore.vehicles.push(newVehicle);
    res.status(201).json({ message: 'Vehicle added successfully', vehicle: newVehicle });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateVehicle = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const index = inMemoryStore.vehicles.findIndex(v => v.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }

    inMemoryStore.vehicles[index] = { ...inMemoryStore.vehicles[index], ...req.body };
    res.json({ message: 'Vehicle updated', vehicle: inMemoryStore.vehicles[index] });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteVehicle = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    inMemoryStore.vehicles = inMemoryStore.vehicles.filter(v => v.id !== id);
    res.json({ message: 'Vehicle deleted' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
