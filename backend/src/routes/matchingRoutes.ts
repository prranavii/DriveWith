import { Router } from 'express';
import { findDrivers } from '../controllers/matchingController';

const router = Router();

router.post('/search', findDrivers);

export default router;
