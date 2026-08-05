import express from 'express';
import {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee
} from '../controllers/employeeController.js';
import { validateEmployee } from '../middleware/validation.js';

const router = express.Router();

router.route('/')
  .get(getEmployees)
  .post(validateEmployee, createEmployee);

router.route('/:id')
  .get(getEmployeeById)
  .put(validateEmployee, updateEmployee)
  .delete(deleteEmployee);

export default router;
