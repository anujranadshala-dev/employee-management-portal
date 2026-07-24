import { Router } from 'express';
import * as announcementController from '../controllers/announcement.controller.js';

const router = Router();

router.route('/')
  .get(announcementController.getAllAnnouncements)
  .post(announcementController.createAnnouncement);

export default router;