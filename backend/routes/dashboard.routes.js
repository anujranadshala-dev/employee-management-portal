import { Router } from 'express';
import { getDashboardStats } from '../controllers/dashboard.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = Router();

// @route   GET /api/dashboard/stats
// @desc    Get aggregated stats for the dashboard
// @access  Private
router.get('/stats', protect, getDashboardStats);

export default router;