import express from 'express';
import taskRoutes from './taskRoutes.js';

const router = express.Router();

router.get('/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

router.use('/tasks', taskRoutes);

export default router;

