import { Router } from 'express';
import * as leaveController from '../controllers/leave.controller.js';

const router = Router();

router.route('/')
  .get(leaveController.getAllLeaveRequests)
  .post(leaveController.createLeaveRequest);

router.patch('/:id', leaveController.updateLeaveStatus);

export default router;