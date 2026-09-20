import { Router } from 'express';
import {
  createBooking,
  getBookings,
  getBookingById,
  acceptBooking,
  cancelBooking,
  verifyOtp,
  startTrip,
  completeTrip,
} from '../controllers/bookingController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.use(authenticateToken);
router.post('/', createBooking);
router.get('/', getBookings);
router.get('/:id', getBookingById);
router.post('/:id/accept', acceptBooking);
router.post('/:id/cancel', cancelBooking);
router.post('/:id/otp', verifyOtp);
router.post('/trips/:id/start', startTrip);
router.post('/trips/:id/complete', completeTrip);

export default router;
