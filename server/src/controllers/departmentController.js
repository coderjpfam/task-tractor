import Department from '../models/Department.js';

// @desc    Get all departments
// @route   GET /api/departments
// @access  Public
export const getDepartments = async (req, res, next) => {
  try {
    const departments = await Department.find({ isDeleted: false })
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: departments.length,
      data: departments
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single department
// @route   GET /api/departments/:id
// @access  Public
export const getDepartment = async (req, res, next) => {
  try {
    const department = await Department.findOne({
      departmentId: req.params.id,
      isDeleted: false
    });
    
    if (!department) {
      return res.status(404).json({
        success: false,
        error: 'Department not found'
      });
    }

    res.status(200).json({
      success: true,
      data: department
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new department
// @route   POST /api/departments
// @access  Public
export const createDepartment = async (req, res, next) => {
  try {
    const department = await Department.create(req.body);
    
    res.status(201).json({
      success: true,
      data: department
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: 'Department ID already exists'
      });
    }
    next(error);
  }
};

// @desc    Update department
// @route   PUT /api/departments/:id
// @access  Public
export const updateDepartment = async (req, res, next) => {
  try {
    // Don't allow updating departmentId
    delete req.body.departmentId;
    delete req.body.createdAt;
    
    const department = await Department.findOneAndUpdate(
      { departmentId: req.params.id, isDeleted: false },
      { ...req.body, lastUpdatedAt: new Date() },
      {
        new: true,
        runValidators: true
      }
    );

    if (!department) {
      return res.status(404).json({
        success: false,
        error: 'Department not found'
      });
    }

    res.status(200).json({
      success: true,
      data: department
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete department (soft delete)
// @route   DELETE /api/departments/:id
// @access  Public
export const deleteDepartment = async (req, res, next) => {
  try {
    const department = await Department.findOneAndUpdate(
      { departmentId: req.params.id, isDeleted: false },
      { isDeleted: true, lastUpdatedAt: new Date() },
      { new: true }
    );

    if (!department) {
      return res.status(404).json({
        success: false,
        error: 'Department not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};
