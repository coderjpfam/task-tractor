import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { generateNextId } from '../utils/idGenerator.js';

const userSchema = new mongoose.Schema({
  userId: {
    type: String,
    unique: true,
    trim: true
  },
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
    maxlength: [100, 'Full name cannot be more than 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  profilePath: {
    type: String,
    trim: true,
    default: null
  },
  hashedPassword: {
    type: String,
    minlength: [6, 'Password must be at least 6 characters']
  },
  departmentId: {
    type: String,
    required: [true, 'Department ID is required'],
    trim: true,
    ref: 'Department'
  },
  role: {
    type: String,
    enum: ['admin', 'manager', 'team_lead', 'employee'],
    required: [true, 'Role is required'],
    default: 'employee'
  },
  createdBy: {
    type: String,
    trim: true
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  refreshTokens: [{
    token: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  passwordResetToken: {
    type: String,
    default: null
  },
  passwordResetExpires: {
    type: Date,
    default: null
  },
  joinedAt: {
    type: Date,
    default: null
  },
  invitedOn: {
    type: Date,
    default: null
  },
  status: {
    type: String,
    enum: ['invited', 'joined', 'deleted'],
    default: 'invited'
  }
}, {
  timestamps: true
});

// Generate userId before saving
userSchema.pre('save', async function(next) {
  if (!this.isNew || this.userId) {
    return next();
  }

  try {
    // Find the last user to get the previous ID
    const lastUser = await mongoose.model('User')
      .findOne()
      .sort({ userId: -1 })
      .select('userId')
      .lean();

    const prevId = lastUser?.userId || null;
    this.userId = generateNextId(prevId, 'U');
    next();
  } catch (error) {
    next(error);
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('hashedPassword')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.hashedPassword = await bcrypt.hash(this.hashedPassword, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.hashedPassword);
};

// Indexes for faster queries
userSchema.index({ userId: 1 });
userSchema.index({ email: 1 });
userSchema.index({ isDeleted: 1 });
userSchema.index({ departmentId: 1 });
userSchema.index({ role: 1 });
userSchema.index({ status: 1 });

const User = mongoose.model('User', userSchema);

export default User;
