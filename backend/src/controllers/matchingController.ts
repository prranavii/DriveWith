import { Request, Response } from 'express';
import { searchCompatibleDrivers } from '../services/matchingService';

export const findDrivers = async (req: Request, res: Response) => {
  try {
    const { pickupLat = 28.5355, pickupLng = 77.3910, transmission = 'AUTOMATIC', vehicleType = 'SEDAN', isNightTrip, isHighwayTrip, isEmergencyTrip } = req.body;

    const matchedDrivers = searchCompatibleDrivers({
      pickupLat: parseFloat(pickupLat),
      pickupLng: parseFloat(pickupLng),
      transmission: transmission.toUpperCase() as 'MANUAL' | 'AUTOMATIC',
      vehicleType: vehicleType.toUpperCase() as any,
      isNightTrip: Boolean(isNightTrip),
      isHighwayTrip: Boolean(isHighwayTrip),
      isEmergencyTrip: Boolean(isEmergencyTrip),
    });

    res.json({
      totalCandidates: matchedDrivers.length,
      drivers: matchedDrivers,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Driver search failed' });
  }
};
