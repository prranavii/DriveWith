import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { inMemoryStore, query, isDbConnected } from '../config/db';

export const getAllDrivers = async (req: Request, res: Response) => {
  try {
    const drivers = inMemoryStore.drivers.map(d => {
      const u = inMemoryStore.users.find(usr => usr.id === d.user_id);
      const skills = inMemoryStore.driver_skills.find(s => s.driver_id === d.id);
      return {
        ...d,
        name: u?.name || 'Driver',
        phone: u?.phone,
        email: u?.email,
        skills,
      };
    });
    res.json({ drivers });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getDriverById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const driver = inMemoryStore.drivers.find(d => d.id === id || d.user_id === id);
    if (!driver) {
      return res.status(404).json({ error: 'Driver not found' });
    }
    const user = inMemoryStore.users.find(u => u.id === driver.user_id);
    const skills = inMemoryStore.driver_skills.find(s => s.driver_id === driver.id);

    res.json({
      driver: {
        ...driver,
        name: user?.name,
        email: user?.email,
        phone: user?.phone,
        skills,
      },
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateAvailability = async (req: AuthRequest, res: Response) => {
  try {
    const driverId = req.user?.driverId || inMemoryStore.drivers[0]?.id;
    const { isOnline } = req.body;

    const driver = inMemoryStore.drivers.find(d => d.id === driverId);
    if (driver) {
      driver.is_online = Boolean(isOnline);
    }
    res.json({ message: 'Driver availability updated', isOnline: driver?.is_online });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateSkills = async (req: AuthRequest, res: Response) => {
  try {
    const driverId = req.user?.driverId || inMemoryStore.drivers[0]?.id;
    const skills = inMemoryStore.driver_skills.find(s => s.driver_id === driverId);
    if (skills) {
      Object.assign(skills, req.body);
    }
    res.json({ message: 'Skill Passport updated', skills });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getNearbyDrivers = async (req: Request, res: Response) => {
  try {
    const { lat = 28.5355, lng = 77.3910, radiusKm = 10 } = req.query;
    const onlineDrivers = inMemoryStore.drivers
      .filter(d => d.is_online)
      .map(d => {
        const u = inMemoryStore.users.find(usr => usr.id === d.user_id);
        const skills = inMemoryStore.driver_skills.find(s => s.driver_id === d.id);
        return {
          id: d.id,
          name: u?.name || 'Driver',
          rating: d.rating,
          lat: d.current_lat,
          lng: d.current_lng,
          badge: skills?.badge || 'VERIFIED',
          transmission: skills?.transmission_auto ? 'AUTOMATIC' : 'MANUAL',
        };
      });
    res.json({ drivers: onlineDrivers });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
