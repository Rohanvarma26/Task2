import { AppError } from '../utils/errors.js';

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const field = Object.keys(err.keyValue)[0];
  const message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
  
  const errors = {
    [field]: message
  };
  
  const error = new AppError(message, 400);
  error.name = 'ValidationError';
  error.errors = errors;
  return error;
};

const handleValidationErrorDB = (err) => {
  const errors = {};
  Object.keys(err.errors).forEach((key) => {
    errors[key] = err.errors[key].message;
  });
  const message = 'Validation failed';
  const error = new AppError(message, 400);
  error.name = 'ValidationError';
  error.errors = errors;
  return error;
};

const handleJWTError = () => new AppError('Invalid token. Please log in again.', 401);

const handleJWTExpiredError = () => new AppError('Your token has expired. Please log in again.', 401);

const sendErrorDev = (err, req, res) => {
  return res.status(err.statusCode || 500).json({
    success: false,
    message: err.message,
    errors: err.errors,
    error: err,
    stack: err.stack
  });
};

const sendErrorProd = (err, req, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    return res.status(err.statusCode || 500).json({
      success: false,
      message: err.message,
      errors: err.errors
    });
  }
  
  // Programming or other unknown error: don't leak error details
  console.error('ERROR 💥', err);
  return res.status(500).json({
    success: false,
    message: 'Something went wrong!'
  });
};

export const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || err.status || 500;
  
  let error = Object.assign(Object.create(Object.getPrototypeOf(err)), err);
  error.message = err.message;
  error.stack = err.stack;

  if (err.name === 'CastError') {
    error = handleCastErrorDB(err);
  } else if (err.code === 11000) {
    error = handleDuplicateFieldsDB(err);
  } else if (err.name === 'ValidationError') {
    // Check if it is a Mongoose validation error (where the values of errors are objects with message properties)
    const isMongooseValidationError = err.errors && 
      Object.values(err.errors).some(val => val && typeof val === 'object' && 'message' in val);
    
    if (isMongooseValidationError) {
      error = handleValidationErrorDB(err);
    } else {
      // Already formatted by express-validator
      error = err;
    }
  } else if (err.name === 'JsonWebTokenError') {
    error = handleJWTError();
  } else if (err.name === 'TokenExpiredError') {
    error = handleJWTExpiredError();
  }

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(error, req, res);
  } else {
    sendErrorProd(error, req, res);
  }
};
