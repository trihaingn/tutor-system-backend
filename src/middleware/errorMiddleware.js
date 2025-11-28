/**
 * MIDDLEWARE: Error Handling Middleware
 * FILE: errorMiddleware.js
 * MỤC ĐÍCH: Global error handler cho Express application
 * 
 * FEATURES:
 * - Map error types to HTTP status codes
 * - Format error responses consistently
 * - Log errors for debugging
 * - Hide sensitive info in production
 */

/**
 * Error Handling Middleware
 * Global error handler for Express application
 */

// ============================================================
// MIDDLEWARE: errorHandler
// ============================================================
// PURPOSE: Catch tất cả errors from controllers/services
// 
// INPUT:
// - err: Error object
// - req: Express request
// - res: Express response
// - next: Next middleware
// 
// PSEUDOCODE:
// Step 1: Log error (for debugging)
//   logger.error({
//     message: err.message,
//     stack: err.stack,
//     url: req.originalUrl,
//     method: req.method,
//     ip: req.ip,
//     userId: req.userId || null
//   })
// 
// Step 2: Determine status code
//   let statusCode = err.statusCode || 500
//   
//   // Map Mongoose errors
//   if (err.name === 'ValidationError') -> statusCode = 400
//   if (err.name === 'CastError') -> statusCode = 400
//   if (err.code === 11000) -> statusCode = 409 (Duplicate key)
//   
//   // Map custom errors
//   if (err.name === 'AuthenticationError') -> statusCode = 401
//   if (err.name === 'AuthorizationError') -> statusCode = 403
//   if (err.name === 'NotFoundError') -> statusCode = 404
//   if (err.name === 'ValidationError') -> statusCode = 400
// 
// Step 3: Format error response
//   const errorResponse = {
//     success: false,
//     message: err.message || 'Internal Server Error',
//     statusCode: statusCode,
//     errors: err.errors || null,
//     stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
//   }
// 
// Step 4: Handle specific error types
//   // Mongoose Validation Error
//   if (err.name === 'ValidationError') {
//     errorResponse.message = 'Validation Error'
//     errorResponse.errors = Object.values(err.errors).map(e => ({
//       field: e.path,
//       message: e.message
//     }))
//   }
//   
//   // Mongoose Duplicate Key Error
//   if (err.code === 11000) {
//     errorResponse.message = 'Duplicate Entry'
//     errorResponse.errors = {
//       field: Object.keys(err.keyPattern)[0],
//       value: Object.values(err.keyValue)[0]
//     }
//   }
// 
// Step 5: Send response
//   res.status(statusCode).json(errorResponse)
// 
// OUTPUT:
// - JSON error response with consistent format

// ============================================================
// MIDDLEWARE: notFoundHandler
// ============================================================
// PURPOSE: Handle 404 errors (undefined routes)
// 
// PSEUDOCODE:
// const notFoundHandler = (req, res, next) => {
//   const error = new Error(`Route ${req.originalUrl} not found`)
//   error.statusCode = 404
//   next(error) // Pass to errorHandler
// }

// ============================================================
// HELPER: asyncHandler
// ============================================================
// PURPOSE: Wrap async route handlers to catch errors
// USE CASE: Avoid try-catch in every controller
// 
// USAGE:
// router.get('/students', asyncHandler(async (req, res) => {
//   const students = await Student.find()
//   res.json(students)
// }))
// 
// PSEUDOCODE:
// const asyncHandler = (fn) => {
//   return (req, res, next) => {
//     Promise.resolve(fn(req, res, next)).catch(next)
//   }
// }

// ============================================================
// CUSTOM ERROR CLASSES
// ============================================================
// PURPOSE: Create custom errors with specific status codes

// class AppError extends Error {
//   constructor(message, statusCode) {
//     super(message)
//     this.statusCode = statusCode
//     this.name = this.constructor.name
//     Error.captureStackTrace(this, this.constructor)
//   }
// }

// class AuthenticationError extends AppError {
//   constructor(message = 'Authentication failed') {
//     super(message, 401)
//   }
// }

// class AuthorizationError extends AppError {
//   constructor(message = 'Insufficient permissions') {
//     super(message, 403)
//   }
// }

// class NotFoundError extends AppError {
//   constructor(message = 'Resource not found') {
//     super(message, 404)
//   }
// }

// class ValidationError extends AppError {
//   constructor(message = 'Validation failed', errors = null) {
//     super(message, 400)
//     this.errors = errors
//   }
// }

// Custom Error Classes
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

class AuthenticationError extends AppError {
  constructor(message = 'Authentication failed') {
    super(message, 401);
  }
}

class AuthorizationError extends AppError {
  constructor(message = 'Insufficient permissions') {
    super(message, 403);
  }
}

class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404);
  }
}

class ValidationError extends AppError {
  constructor(message = 'Validation failed', errors = null) {
    super(message, 400);
    this.errors = errors;
  }
}

class ConflictError extends AppError {
  constructor(message = 'Resource conflict') {
    super(message, 409);
  }
}

class InternalServerError extends AppError {
  constructor(message = 'Internal server error') {
    super(message, 500);
  }
}

// Error Handler Middleware
const errorHandler = (err, req, res, next) => {
  // Log error
  console.error('Error:', {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    url: req.originalUrl,
    method: req.method,
    userId: req.userId || null
  });

  // Determine status code
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let errors = err.errors || null;

  // Handle Mongoose validation errors
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation Error';
    errors = Object.values(err.errors).map(e => ({
      field: e.path,
      message: e.message
    }));
  }

  // Handle Mongoose CastError (invalid ObjectId)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  // Handle Mongoose duplicate key error
  if (err.code === 11000) {
    statusCode = 409;
    message = 'Duplicate Entry';
    const field = Object.keys(err.keyPattern)[0];
    const value = Object.values(err.keyValue)[0];
    errors = { field, value, message: `${field} '${value}' already exists` };
  }

  // Send error response
  res.status(statusCode).json({
    success: false,
    message,
    statusCode,
    errors,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};

// 404 Not Found Handler
const notFoundHandler = (req, res, next) => {
  const error = new NotFoundError(`Route ${req.originalUrl} not found`);
  next(error);
};

// Async Handler Utility
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export {
  errorHandler,
  notFoundHandler,
  asyncHandler,
  AppError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ValidationError,
  ConflictError,
  InternalServerError
};
