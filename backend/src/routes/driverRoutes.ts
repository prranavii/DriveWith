import { Router } from 'express';
import {
  getAllDrivers,
  getDriverById,
  updateAvailability,
  updateSkills,
  getNearbyDrivers,
} from '../controllers/driverController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.get('/', getAllDrivers);
router.get('/nearby', getNearbyDrivers);
router.get('/:id', getDriverById);
router.put('/availability', authenticateToken, updateAvailability);
router.put('/skills', authenticateToken, updateSkills);

export default router;
