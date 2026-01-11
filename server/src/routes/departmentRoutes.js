import express from 'express';
import { authenticate } from '../middleware/auth.js';
import {
  getDepartments,
  getDepartment,
  createDepartment,
  updateDepartment,
  deleteDepartment
} from '../controllers/departmentController.js';

const router = express.Router();

// All department routes require authentication
router.use(authenticate);

router.route('/').get(getDepartments).post(createDepartment);
router.route('/:id').get(getDepartment).put(updateDepartment).delete(deleteDepartment);

export default router;
