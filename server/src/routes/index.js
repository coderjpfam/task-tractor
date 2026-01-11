import express from 'express';
import departmentRoutes from './departmentRoutes.js';
import userRoutes from './userRoutes.js';
import authRoutes from './authRoutes.js';

const router = express.Router();

router.get('/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

router.use('/departments', departmentRoutes);
router.use('/users', userRoutes);
router.use('/auth', authRoutes);

export default router;

