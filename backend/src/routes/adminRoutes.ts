import { Router } from 'express';
import { getAnalytics, getAgentLogs } from '../controllers/adminController';

const router = Router();

router.get('/analytics', getAnalytics);
router.get('/agent-logs', getAgentLogs);

export default router;
