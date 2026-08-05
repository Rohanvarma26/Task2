import Employee from '../models/Employee.js';
import { NotFoundError } from '../utils/errors.js';

// @desc    Get all employees with pagination, search and filters
// @route   GET /api/employees
export const getEmployees = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const department = req.query.department || '';
    const status = req.query.status || '';
    const sortField = req.query.sortField || 'createdAt';
    const sortOrder = req.query.sortOrder || 'desc';

    const query = {};

    // Search query on multiple fields
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { department: { $regex: search, $options: 'i' } },
        { position: { $regex: search, $options: 'i' } }
      ];
    }

    // Filter values
    if (department) {
      query.department = department;
    }

    if (status) {
      query.status = status;
    }

    const skip = (page - 1) * limit;
    const total = await Employee.countDocuments(query);
    
    // System-wide statistics for the dashboard cards
    const stats = {
      total: await Employee.countDocuments({}),
      active: await Employee.countDocuments({ status: 'Active' }),
      leave: await Employee.countDocuments({ status: 'On Leave' }),
      inactive: await Employee.countDocuments({ status: 'Inactive' })
    };
    
    const employees = await Employee.find(query)
      .sort({ [sortField]: sortOrder === 'desc' ? -1 : 1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      employees,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      },
      stats
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single employee details
// @route   GET /api/employees/:id
export const getEmployeeById = async (req, res, next) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      throw new NotFoundError('Employee not found');
    }
    res.status(200).json({
      success: true,
      employee
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new employee
// @route   POST /api/employees
export const createEmployee = async (req, res, next) => {
  try {
    const { name, email, phone, department, position, salary, dateOfJoining, status } = req.body;

    const employee = new Employee({
      name,
      email,
      phone,
      department,
      position,
      salary,
      dateOfJoining,
      status
    });

    const savedEmployee = await employee.save();
    res.status(201).json({
      success: true,
      message: 'Employee registered successfully',
      employee: savedEmployee
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update employee details
// @route   PUT /api/employees/:id
export const updateEmployee = async (req, res, next) => {
  try {
    const { name, email, phone, department, position, salary, dateOfJoining, status } = req.body;

    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      throw new NotFoundError('Employee not found');
    }

    // Assign updates
    employee.name = name || employee.name;
    employee.email = email || employee.email;
    employee.phone = phone || employee.phone;
    employee.department = department || employee.department;
    employee.position = position || employee.position;
    employee.salary = salary !== undefined ? salary : employee.salary;
    employee.dateOfJoining = dateOfJoining || employee.dateOfJoining;
    employee.status = status || employee.status;

    const updatedEmployee = await employee.save();
    res.status(200).json({
      success: true,
      message: 'Employee details updated successfully',
      employee: updatedEmployee
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete employee
// @route   DELETE /api/employees/:id
export const deleteEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      throw new NotFoundError('Employee not found');
    }

    await Employee.findByIdAndDelete(req.params.id);
    res.status(200).json({
      success: true,
      message: 'Employee record deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
