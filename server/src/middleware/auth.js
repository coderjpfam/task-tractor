import { verifyAccessToken } from '../utils/jwt.js';

/**
 * Authentication middleware
 * Extracts and verifies JWT token from Authorization header
 * Attaches user info to req.user
 */
export const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Authorization token required'
      });
    }

    const token = authHeader.split(' ')[1]; // Extract token from "Bearer TOKEN"

    try {
      const decoded = verifyAccessToken(token);
      req.user = decoded; // Attach user info (userId, email, role) to request
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        error: 'Invalid or expired token'
      });
    }
  } catch (error) {
    next(error);
  }
};
