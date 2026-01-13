import User from '../models/User.js';
import Department from '../models/Department.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken, getTokenExpiration, JWT_ACCESS_EXPIRES_IN } from '../utils/jwt.js';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import fs from 'fs/promises';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// @desc    User Login
// @route   POST /auth/login
// @access  Public
// Body: { email, password, remember_me? }
export const login = async (req, res, next) => {
  try {
    const { email, password, remember_me } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required'
      });
    }

    // Find user by email
    const user = await User.findOne({
      email: email.toLowerCase(),
      isDeleted: false
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }

    // Fetch department information
    let department = null;
    if (user.departmentId) {
      const departmentDoc = await Department.findOne({
        departmentId: user.departmentId,
        isDeleted: false
      }).select('departmentId name');
      if (departmentDoc) {
        department = {
          id: departmentDoc.departmentId,
          name: departmentDoc.name
        };
      }
    }

    // Generate tokens
    const accessToken = generateAccessToken(user.userId, user.email, user.role);
    const refreshToken = generateRefreshToken(user.userId);

    // Save refresh token to user (store last 5 tokens)
    user.refreshTokens = user.refreshTokens || [];
    user.refreshTokens.push({ token: refreshToken });
    
    // Keep only last 5 refresh tokens
    if (user.refreshTokens.length > 5) {
      user.refreshTokens = user.refreshTokens.slice(-5);
    }
    
    await user.save();

    // Prepare user data (exclude password)
    const userData = {
      userId: user.userId,
      fullName: user.fullName,
      email: user.email,
      profilePath: user.profilePath,
      department: department,
      role: user.role,
      createdAt: user.createdAt,
      joinedAt: user.joinedAt,
      invitedOn: user.invitedOn,
      status: user.status
    };

    res.status(200).json({
      success: true,
      user: userData,
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_in: getTokenExpiration(JWT_ACCESS_EXPIRES_IN)
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Logout
// @route   POST /auth/logout
// @access  Required
// Body: { refresh_token, all_devices? }
export const logout = async (req, res, next) => {
  try {
    const { refresh_token, all_devices } = req.body;
    const authHeader = req.headers.authorization;
    const accessToken = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    // Get userId from token or body
    let userId = null;
    if (accessToken) {
      try {
        const { verifyAccessToken } = await import('../utils/jwt.js');
        const decoded = verifyAccessToken(accessToken);
        userId = decoded.userId;
      } catch (error) {
        // Token invalid, continue with refresh_token
      }
    }
    
    // If still no userId, try to get from refresh_token
    if (!userId && refresh_token) {
      try {
        const decoded = verifyRefreshToken(refresh_token);
        userId = decoded.userId;
      } catch (error) {
        return res.status(401).json({
          success: false,
          error: 'Invalid token'
        });
      }
    }

    if (!userId && !refresh_token) {
      return res.status(400).json({
        success: false,
        error: 'Refresh token or access token is required'
      });
    }

    // Find user
    const user = await User.findOne({
      userId: userId || (refresh_token ? verifyRefreshToken(refresh_token).userId : null),
      isDeleted: false
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Remove tokens
    if (all_devices) {
      // Remove all refresh tokens
      user.refreshTokens = [];
    } else if (refresh_token) {
      // Remove specific refresh token
      user.refreshTokens = user.refreshTokens.filter(
        rt => rt.token !== refresh_token
      );
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Refresh Token
// @route   POST /auth/refresh
// @access  Public (with refresh token)
// Body: { refresh_token }
export const refreshToken = async (req, res, next) => {
  try {
    const { refresh_token } = req.body;

    if (!refresh_token) {
      return res.status(400).json({
        success: false,
        error: 'Refresh token is required'
      });
    }

    // Verify refresh token
    const decoded = verifyRefreshToken(refresh_token);
    
    // Find user and verify token exists in their tokens
    const user = await User.findOne({
      userId: decoded.userId,
      isDeleted: false
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Check if refresh token exists in user's tokens
    const tokenExists = user.refreshTokens?.some(rt => rt.token === refresh_token);
    if (!tokenExists) {
      return res.status(401).json({
        success: false,
        error: 'Invalid refresh token'
      });
    }

    // Fetch department information
    let department = null;
    if (user.departmentId) {
      const departmentDoc = await Department.findOne({
        departmentId: user.departmentId,
        isDeleted: false
      }).select('departmentId name');
      if (departmentDoc) {
        department = {
          id: departmentDoc.departmentId,
          name: departmentDoc.name
        };
      }
    }

    // Generate new access token
    const accessToken = generateAccessToken(user.userId, user.email, user.role);

    // Prepare user data (exclude password)
    const userData = {
      userId: user.userId,
      fullName: user.fullName,
      email: user.email,
      profilePath: user.profilePath,
      department: department,
      role: user.role,
      createdAt: user.createdAt,
      joinedAt: user.joinedAt,
      invitedOn: user.invitedOn,
      status: user.status
    };

    res.status(200).json({
      success: true,
      user: userData,
      access_token: accessToken,
      expires_in: getTokenExpiration(JWT_ACCESS_EXPIRES_IN)
    });
  } catch (error) {
    if (error.message.includes('Invalid or expired')) {
      return res.status(401).json({
        success: false,
        error: error.message
      });
    }
    next(error);
  }
};

// @desc    Forgot Password
// @route   POST /auth/forgot-password
// @access  Public
// Body: { email }
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Email is required'
      });
    }

    // Find user
    const user = await User.findOne({
      email: email.toLowerCase(),
      isDeleted: false
    });

    // Always return success message (security: don't reveal if email exists)
    // In production, only send email if user exists
    if (user) {
      // Generate reset token
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
      
      // Set token and expiration (1 hour from now)
      user.passwordResetToken = resetTokenHash;
      user.passwordResetExpires = Date.now() + 60 * 60 * 1000; // 1 hour
      await user.save();

      // TODO: Send email with reset token
      // In production, send email with reset link containing the token
      console.log(`Password reset token for ${email}: ${resetToken}`);
    }

    res.status(200).json({
      success: true,
      message: 'If the email exists, a password reset link has been sent'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reset Password
// @route   POST /auth/reset-password
// @access  Public
// Body: { token, email, password, password_confirmation }
export const resetPassword = async (req, res, next) => {
  try {
    const { token, email, password, password_confirmation } = req.body;

    // Validation
    if (!token || !email || !password || !password_confirmation) {
      return res.status(400).json({
        success: false,
        error: 'Token, email, password, and password confirmation are required'
      });
    }

    if (password !== password_confirmation) {
      return res.status(400).json({
        success: false,
        error: 'Password and confirmation do not match'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 6 characters'
      });
    }

    // Hash the token to compare with stored hash
    const resetTokenHash = crypto.createHash('sha256').update(token).digest('hex');

    // Find user with valid reset token
    const user = await User.findOne({
      email: email.toLowerCase(),
      isDeleted: false,
      passwordResetToken: resetTokenHash,
      passwordResetExpires: { $gt: Date.now() } // Token not expired
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        error: 'Invalid or expired reset token'
      });
    }

    // Update password
    user.hashedPassword = password;
    user.passwordResetToken = null;
    user.passwordResetExpires = null;
    user.lastUpdatedAt = new Date();
    
    // Optionally invalidate all refresh tokens on password reset
    user.refreshTokens = [];
    
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password reset successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify Register Token
// @route   GET /auth/verify-register-token
// @access  Public
// Query: { token }
export const verifyRegisterToken = async (req, res, next) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({
        success: false,
        error: 'Token is required'
      });
    }

    // Verify invitation token
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
      
      // Check if token is an invitation token
      if (decoded.type !== 'invitation') {
        return res.status(400).json({
          success: false,
          error: 'Invalid invitation token'
        });
      }
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: 'Invalid or expired invitation token'
      });
    }

    // Extract email and userId from token
    const email = decoded.email;
    const userId = decoded.userId;

    if (!email || !userId) {
      return res.status(400).json({
        success: false,
        error: 'Invalid invitation token format'
      });
    }

    // Find user by email or userId
    const user = await User.findOne({
      $or: [
        { email: email.toLowerCase() },
        { userId: userId }
      ],
      isDeleted: false,
      status: { $ne: 'deleted' }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found for this invitation'
      });
    }

    // Check if user already has a password (already registered)
    if (user.hashedPassword || user.status !== 'invited') {
      return res.status(400).json({
        success: false,
        error: 'User has already completed registration'
      });
    }

    // Fetch department information
    let department = null;
    if (user.departmentId) {
      const departmentDoc = await Department.findOne({
        departmentId: user.departmentId,
        isDeleted: false
      }).select('departmentId name');
      if (departmentDoc) {
        department = {
          id: departmentDoc.departmentId,
          name: departmentDoc.name
        };
      }
    }

    // Return user information
    res.status(200).json({
      success: true,
      data: {
        userId: user.userId,
        fullName: user.fullName,
        email: user.email,
        department: department
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Register Invited User
// @route   POST /auth/register-invited
// @access  Public
// Body: { token, fullName, password, password_confirmation } + profile pic (multipart/form-data)
export const registerInvitedUser = async (req, res, next) => {
  try {
    const { token, fullName, password, password_confirmation } = req.body;

    // Validation
    if (!token || !fullName || !password || !password_confirmation) {
      // Delete uploaded file if validation fails
      if (req.file) {
        try {
          await fs.unlink(req.file.path);
        } catch (unlinkError) {
          console.error('Error deleting file:', unlinkError);
        }
      }
      return res.status(400).json({
        success: false,
        error: 'Token, full name, password, and password confirmation are required'
      });
    }

    if (password !== password_confirmation) {
      // Delete uploaded file if validation fails
      if (req.file) {
        try {
          await fs.unlink(req.file.path);
        } catch (unlinkError) {
          console.error('Error deleting file:', unlinkError);
        }
      }
      return res.status(400).json({
        success: false,
        error: 'Password and confirmation do not match'
      });
    }

    if (password.length < 6) {
      // Delete uploaded file if validation fails
      if (req.file) {
        try {
          await fs.unlink(req.file.path);
        } catch (unlinkError) {
          console.error('Error deleting file:', unlinkError);
        }
      }
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 6 characters'
      });
    }

    // Verify invitation token
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
      
      // Check if token is an invitation token
      if (decoded.type !== 'invitation') {
        // Delete uploaded file if validation fails
        if (req.file) {
          try {
            await fs.unlink(req.file.path);
          } catch (unlinkError) {
            console.error('Error deleting file:', unlinkError);
          }
        }
        return res.status(400).json({
          success: false,
          error: 'Invalid invitation token'
        });
      }
    } catch (error) {
      // Delete uploaded file if validation fails
      if (req.file) {
        try {
          await fs.unlink(req.file.path);
        } catch (unlinkError) {
          console.error('Error deleting file:', unlinkError);
        }
      }
      return res.status(400).json({
        success: false,
        error: 'Invalid or expired invitation token'
      });
    }

    // Extract email from token
    const email = decoded.email;
    const userId = decoded.userId;

    if (!email || !userId) {
      // Delete uploaded file if validation fails
      if (req.file) {
        try {
          await fs.unlink(req.file.path);
        } catch (unlinkError) {
          console.error('Error deleting file:', unlinkError);
        }
      }
      return res.status(400).json({
        success: false,
        error: 'Invalid invitation token format'
      });
    }

    // Find user by email or userId
    const user = await User.findOne({
      $or: [
        { email: email.toLowerCase() },
        { userId: userId }
      ],
      isDeleted: false,
      status: { $ne: 'deleted' }
    });

    if (!user) {
      // Delete uploaded file if user not found
      if (req.file) {
        try {
          await fs.unlink(req.file.path);
        } catch (unlinkError) {
          console.error('Error deleting file:', unlinkError);
        }
      }
      return res.status(404).json({
        success: false,
        error: 'User not found for this invitation'
      });
    }

    // Check if user already has a password (already registered) or status is not 'invited'
    if (user.hashedPassword || user.status !== 'invited') {
      // Delete uploaded file if user already registered
      if (req.file) {
        try {
          await fs.unlink(req.file.path);
        } catch (unlinkError) {
          console.error('Error deleting file:', unlinkError);
        }
      }
      return res.status(400).json({
        success: false,
        error: 'User has already completed registration'
      });
    }

    // Handle profile image upload
    let profilePath = user.profilePath;
    if (req.file) {
      // Delete old profile image if it exists
      if (user.profilePath) {
        try {
          await fs.unlink(user.profilePath);
        } catch (unlinkError) {
          console.error('Error deleting old file:', unlinkError);
        }
      }
      profilePath = req.file.path;
    }

    // Update user with registration details
    user.fullName = fullName.trim();
    user.hashedPassword = password; // Will be hashed by pre-save hook
    user.profilePath = profilePath;
    user.joinedAt = new Date();
    user.status = 'joined';
    user.lastUpdatedAt = new Date();
    
    await user.save();

    // Fetch department information
    let department = null;
    if (user.departmentId) {
      const departmentDoc = await Department.findOne({
        departmentId: user.departmentId,
        isDeleted: false
      }).select('departmentId name');
      if (departmentDoc) {
        department = {
          id: departmentDoc.departmentId,
          name: departmentDoc.name
        };
      }
    }

    // Prepare user data (exclude password)
    const userData = {
      userId: user.userId,
      fullName: user.fullName,
      email: user.email,
      profilePath: user.profilePath,
      department: department,
      role: user.role,
      createdAt: user.createdAt,
      joinedAt: user.joinedAt,
      invitedOn: user.invitedOn,
      status: user.status
    };

    res.status(200).json({
      success: true,
      message: 'Registration completed successfully',
      user: userData
    });
  } catch (error) {
    // Delete uploaded file if error occurs
    if (req.file && req.file.path) {
      try {
        await fs.unlink(req.file.path);
      } catch (unlinkError) {
        console.error('Error deleting file:', unlinkError);
      }
    }
    next(error);
  }
};

// @desc    Verify Access Token
// @route   GET /auth/verify-token
// @access  Public (with token)
// Header: Authorization: Bearer <access_token>
export const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Authorization token required'
      });
    }

    const token = authHeader.split(' ')[1];

    // Verify access token
    const { verifyAccessToken } = await import('../utils/jwt.js');
    const decoded = verifyAccessToken(token);
    
    // Find user
    const user = await User.findOne({
      userId: decoded.userId,
      isDeleted: false
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Fetch department information
    let department = null;
    if (user.departmentId) {
      const departmentDoc = await Department.findOne({
        departmentId: user.departmentId,
        isDeleted: false
      }).select('departmentId name');
      if (departmentDoc) {
        department = {
          id: departmentDoc.departmentId,
          name: departmentDoc.name
        };
      }
    }

    // Prepare user data (exclude password)
    const userData = {
      userId: user.userId,
      fullName: user.fullName,
      email: user.email,
      profilePath: user.profilePath,
      department: department,
      role: user.role,
      createdAt: user.createdAt,
      joinedAt: user.joinedAt,
      invitedOn: user.invitedOn,
      status: user.status
    };

    res.status(200).json({
      success: true,
      user: userData,
      valid: true
    });
  } catch (error) {
    if (error.message.includes('Invalid or expired')) {
      return res.status(401).json({
        success: false,
        error: error.message,
        valid: false
      });
    }
    next(error);
  }
};