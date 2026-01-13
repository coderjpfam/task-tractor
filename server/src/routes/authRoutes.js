import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { changePassword } from '../controllers/userController.js';
import upload from '../config/multer.js';
import {
  login,
  logout,
  refreshToken,
  forgotPassword,
  resetPassword,
  verifyRegisterToken,
  registerInvitedUser,
  verifyToken
} from '../controllers/authController.js';

const router = express.Router();

// Public authentication routes (no auth required)
router.post('/login', login);
router.post('/refresh', refreshToken);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/verify-register-token', verifyRegisterToken);
router.post('/register-invited', upload.single('profilePic'), registerInvitedUser);
router.get('/verify-token', verifyToken);

// Protected authentication routes (require auth)
router.post('/logout', logout);
router.put('/change-password', authenticate, changePassword);

export default router;
