import mongoose from 'mongoose';
import { generateNextId } from '../utils/idGenerator.js';

const departmentSchema = new mongoose.Schema({
  departmentId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: [true, 'Department name is required'],
    trim: true,
    maxlength: [100, 'Department name cannot be more than 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  createdBy: {
    type: String,
    required: [true, 'Created by is required'],
    trim: true
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Generate departmentId before saving
departmentSchema.pre('save', async function(next) {
  if (!this.isNew || this.departmentId) {
    return next();
  }

  try {
    // Find the last department to get the previous ID
    const lastDepartment = await mongoose.model('Department')
      .findOne({ isDeleted: false })
      .sort({ departmentId: -1 })
      .select('departmentId')
      .lean();

    const prevId = lastDepartment?.departmentId || null;
    this.departmentId = generateNextId(prevId, 'D');
    next();
  } catch (error) {
    next(error);
  }
});

// Index for faster queries
departmentSchema.index({ departmentId: 1 });
departmentSchema.index({ isDeleted: 1 });
departmentSchema.index({ name: 1 });

const Department = mongoose.model('Department', departmentSchema);

export default Department;
