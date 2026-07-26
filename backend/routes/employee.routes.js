import { Router } from 'express';
import * as employeeController from '../controllers/employee.controller.js';
import { protect, authorizeAdmin, authorizeAdminOrManager } from '../middleware/auth.middleware.js';

const router = Router();

// All employee routes are protected and require a user to be logged in.
router.use(protect);

router.route('/')
  .get(employeeController.getAllEmployees)
  // Only Admins can create new employees
  .post(authorizeAdmin, employeeController.createEmployee);

router.route('/:id')
  .get(employeeController.getEmployeeById)
  // Admins and Managers can update employee profiles
  .patch(authorizeAdminOrManager, employeeController.updateEmployee)
  // Only Admins can delete employee records
  .delete(authorizeAdmin, employeeController.deleteEmployee);

export default router;