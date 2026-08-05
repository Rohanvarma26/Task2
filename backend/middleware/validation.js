import { body, validationResult } from 'express-validator';

export const validateEmployee = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 3 }).withMessage('Name must be at least 3 characters long'),
  
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please fill a valid email address'),

  body('phone')
    .trim()
    .notEmpty().withMessage('Phone number is required')
    .custom((value) => {
      // Must contain 10 to 15 digits (spaces and hyphens allowed)
      const digits = value.replace(/[\s-]/g, '');
      if (!/^\d{10,15}$/.test(digits)) {
        throw new Error('Phone number must contain between 10 and 15 digits');
      }
      return true;
    }),

  body('department')
    .trim()
    .notEmpty().withMessage('Department is required'),

  body('position')
    .trim()
    .notEmpty().withMessage('Position is required'),

  body('salary')
    .notEmpty().withMessage('Salary is required')
    .isFloat({ min: 0 }).withMessage('Salary cannot be negative'),

  body('dateOfJoining')
    .notEmpty().withMessage('Date of joining is required')
    .isISO8601().withMessage('Date of joining must be a valid ISO8601 date'),

  body('status')
    .optional()
    .isIn(['Active', 'On Leave', 'Inactive']).withMessage('Status must be Active, On Leave, or Inactive'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorObj = {};
      errors.array().forEach((err) => {
        const field = err.path || err.param;
        if (!errorObj[field]) {
          errorObj[field] = err.msg;
        }
      });
      const valError = new Error('Validation failed');
      valError.name = 'ValidationError';
      valError.statusCode = 400;
      valError.errors = errorObj;
      return next(valError);
    }
    next();
  }
];
