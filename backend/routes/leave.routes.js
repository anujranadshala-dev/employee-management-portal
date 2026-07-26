import { Router } from 'express';
import {
  getAllLeaveRequests,
  createLeaveRequest,
  updateLeaveRequestStatus,
} from '../controllers/leave.controller.js';
import { protect, authorizeAdminOrManager } from '../middleware/auth.middleware.js';

const router = Router();

// All leave routes require a user to be logged in
router.use(protect);

router.route('/').get(getAllLeaveRequests).post(createLeaveRequest);
router.route('/:id/status').patch(authorizeAdminOrManager, updateLeaveRequestStatus);

export default router;