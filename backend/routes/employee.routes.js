import { Router } from 'express';
import * as employeeController from '../controllers/employee.controller.js';

const router = Router();

router.route('/')
  .get(employeeController.getAllEmployees)
  .post(employeeController.createEmployee);

router.route('/:id')
  .get(employeeController.getEmployeeById)
  .put(employeeController.updateEmployee)
  .delete(employeeController.deleteEmployee);

export default router;