import express from 'express';
import upload from '../config/multer.js';
import { authenticate } from '../middleware/auth.js';
import {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser
} from '../controllers/userController.js';

const router = express.Router();

// All user routes require authentication
router.use(authenticate);

// Routes with file upload support (single file with field name 'profilePic')
router.route('/')
  .get(getUsers)
  .post(createUser);

router.route('/:id')
  .get(getUser)
  .put(upload.single('profilePic'), updateUser)
  .delete(deleteUser);

export default router;
