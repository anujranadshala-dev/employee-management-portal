import { Router } from 'express';
import { getAllAnnouncements, createAnnouncement } from '../controllers/announcements.controller.js';
import { protect, authorizeAdminOrManager } from '../middleware/auth.middleware.js';

const router = Router();

// All announcement routes require a user to be logged in.
router.use(protect);

router.route('/')
  .get(getAllAnnouncements)
  .post(authorizeAdminOrManager, createAnnouncement);

export default router;