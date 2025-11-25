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

// TODO: Import logger, constants
// const logger = require('../utils/logger')
// const { HTTP_STATUS } = require('../constants')

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

// TODO: Implement errorHandler middleware
// TODO: Implement notFoundHandler middleware
// TODO: Implement asyncHandler utility
// TODO: Export all functions
// module.exports = {
//   errorHandler,
//   notFoundHandler,
//   asyncHandler,
//   AppError,
//   AuthenticationError,
//   AuthorizationError,
//   NotFoundError,
//   ValidationError
// }
