import { Router } from 'express';
import employeeRoutes from './routes/employee.routes.js';
import leaveRoutes from './routes/leave.routes.js';
import announcementRoutes from './routes/announcement.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';

const router = Router();

// Mount the routes for each feature
router.use('/employees', employeeRoutes);
router.use('/leave', leaveRoutes);
router.use('/announcements', announcementRoutes);
router.use('/dashboard', dashboardRoutes);

export default router;