import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { changePassword } from '../controllers/userController.js';
import {
  login,
  logout,
  refreshToken,
  forgotPassword,
  resetPassword
} from '../controllers/authController.js';

const router = express.Router();

// Public authentication routes (no auth required)
router.post('/login', login);
router.post('/refresh', refreshToken);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Protected authentication routes (require auth)
router.post('/logout', logout);
router.put('/change-password', authenticate, changePassword);

export default router;
