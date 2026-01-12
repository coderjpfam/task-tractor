import User from '../models/User.js';
import Department from '../models/Department.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// @desc    Get all users
// @route   GET /api/users
// @access  Public
export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({ isDeleted: false })
      .select('-hashedPassword')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Public
export const getUser = async (req, res, next) => {
  try {
    const user = await User.findOne({
      userId: req.params.id,
      isDeleted: false
    }).select('-hashedPassword');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new user
// @route   POST /api/users
// @access  Required (Auth)
// Body: { email, fullName, departmentId } (createdBy comes from JWT token)
export const createUser = async (req, res, next) => {
  try {
    const { email, fullName, departmentId } = req.body;

    // Validation - only email, fullName, and departmentId should be in payload
    if (!email || !fullName || !departmentId) {
      return res.status(400).json({
        success: false,
        error: 'Email, full name, and department ID are required'
      });
    }

    // Get createdBy from authenticated user (from JWT token via middleware)
    if (!req.user || !req.user.userId) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
    }

    const createdBy = req.user.userId;

    // Get creator's full info (inviter)
    const creator = await User.findOne({
      userId: createdBy,
      isDeleted: false
    }).select('fullName role');

    if (!creator) {
      return res.status(404).json({
        success: false,
        error: 'Creator user not found'
      });
    }

    // Check if department exists
    const department = await Department.findOne({
      departmentId: departmentId,
      isDeleted: false
    });

    if (!department) {
      return res.status(400).json({
        success: false,
        error: 'Department not found'
      });
    }

    // Check if user with email already exists
    const existingUser = await User.findOne({
      email: email.toLowerCase(),
      isDeleted: false
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'User with this email already exists'
      });
    }

    // Create user data
    const userData = {
      email: email.toLowerCase(),
      fullName: fullName.trim(),
      departmentId: departmentId,
      createdBy: createdBy,
      role: 'employee' // Default role
    };

    const user = await User.create(userData);
    
    // Send welcome/invitation email
    try {
      const { sendMail } = await import('../utils/email.js');
      const jwt = await import('jsonwebtoken');
      const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
      const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';
      const COMPANY_NAME = process.env.COMPANY_NAME || 'Task Manager';
      const SUPPORT_EMAIL = process.env.SUPPORT_EMAIL || '';
      const HELP_URL = process.env.HELP_URL || '#';
      const PRIVACY_URL = process.env.PRIVACY_URL || '#';
      const CONTACT_URL = process.env.CONTACT_URL || '#';
      
      // Generate JWT invitation token (valid for 7 days)
      const invitationToken = jwt.default.sign(
        {
          userId: user.userId,
          email: user.email,
          type: 'invitation'
        },
        JWT_SECRET,
        { expiresIn: '7d' }
      );
      
      const invitationUrl = `${CLIENT_URL}/register?token=${invitationToken}`;
      
      // Calculate expiry date (7 days from now)
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 7);
      const formattedExpiryDate = expiryDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      
      // Send email using new flow with templateId and options
      const mailOptions = {
        inviter_name: creator.fullName,
        inviter_role: creator.role,
        company_name: COMPANY_NAME,
        user_email: user.email,
        assigned_role: user.role,
        department_name: department.name,
        personal_message: '',
        expiry_date: formattedExpiryDate,
        invitation_url: invitationUrl,
        support_email: SUPPORT_EMAIL,
        help_url: HELP_URL,
        privacy_url: PRIVACY_URL,
        contact_url: CONTACT_URL
      };
      await sendMail(user.email, 'welcome', mailOptions);
    } catch (emailError) {
      console.error('Error sending welcome email:', emailError);
      // Don't fail user creation if email fails, just log the error
    }
    
    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.hashedPassword;
    delete userResponse.refreshTokens;
    delete userResponse.passwordResetToken;
    delete userResponse.passwordResetExpires;

    res.status(201).json({
      success: true,
      data: userResponse,
      message: 'User created successfully. Welcome email sent.'
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: 'User ID or Email already exists'
      });
    }
    next(error);
  }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Public
export const updateUser = async (req, res, next) => {
  try {
    const user = await User.findOne({
      userId: req.params.id,
      isDeleted: false
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Check if department exists (if being updated)
    if (req.body.departmentId && req.body.departmentId !== user.departmentId) {
      const department = await Department.findOne({
        departmentId: req.body.departmentId,
        isDeleted: false
      });

      if (!department) {
        return res.status(400).json({
          success: false,
          error: 'Department not found'
        });
      }
    }

    // Handle profile image update
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

    // Don't allow updating userId, createdAt
    delete req.body.userId;
    delete req.body.createdAt;

    // Handle password update
    if (req.body.password) {
      req.body.hashedPassword = req.body.password;
      delete req.body.password;
    }

    const updatedUser = await User.findOneAndUpdate(
      { userId: req.params.id, isDeleted: false },
      { ...req.body, profilePath, lastUpdatedAt: new Date() },
      {
        new: true,
        runValidators: true
      }
    ).select('-hashedPassword');

    res.status(200).json({
      success: true,
      data: updatedUser
    });
  } catch (error) {
    // Delete uploaded file if update fails
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

// @desc    Delete user (soft delete)
// @route   DELETE /api/users/:id
// @access  Public
export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findOne({
      userId: req.params.id,
      isDeleted: false
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Delete profile image if it exists
    if (user.profilePath) {
      try {
        await fs.unlink(user.profilePath);
      } catch (unlinkError) {
        console.error('Error deleting file:', unlinkError);
      }
    }

    await User.findOneAndUpdate(
      { userId: req.params.id, isDeleted: false },
      { isDeleted: true, lastUpdatedAt: new Date() }
    );

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Change password for logged-in user
// @route   PUT /auth/change-password
// @access  Required (Auth)
// Body: { current_password, new_password, new_password_confirmation, userId }
export const changePassword = async (req, res, next) => {
  try {
    const { current_password, new_password, new_password_confirmation, userId } = req.body;

    // Validation
    if (!current_password || !new_password || !new_password_confirmation) {
      return res.status(400).json({
        success: false,
        error: 'Current password, new password, and confirmation are required'
      });
    }

    if (new_password !== new_password_confirmation) {
      return res.status(400).json({
        success: false,
        error: 'New password and confirmation do not match'
      });
    }

    if (new_password.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'New password must be at least 6 characters'
      });
    }

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'User ID is required'
      });
    }

    // Find user
    const user = await User.findOne({
      userId: userId,
      isDeleted: false
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Verify current password
    const isPasswordValid = await user.comparePassword(current_password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: 'Current password is incorrect'
      });
    }

    // Check if new password is different from current password
    const isSamePassword = await user.comparePassword(new_password);
    if (isSamePassword) {
      return res.status(400).json({
        success: false,
        error: 'New password must be different from current password'
      });
    }

    // Update password (will be hashed by pre-save hook)
    user.hashedPassword = new_password;
    user.lastUpdatedAt = new Date();
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    next(error);
  }
};
