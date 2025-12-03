/**
 * UTILS: Custom Error Classes
 * FILE: error.js
 * PURPOSE: Centralized error definitions for Clean Architecture
 * 
 * DESIGN PRINCIPLE:
 * - Services import errors from utils layer (NOT from middleware)
 * - Middleware imports errors from utils layer for handling
 * - This avoids dependency violation (Service -> Middleware)
 * 
 * CREATED: November 29, 2025 - Clean Architecture Refactor
 */

/**
 * Base Application Error Class
 * All custom errors extend from this class
 */
export class AppError extends Error {
  constructor(message, statusCode, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = isOperational;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * 400 Bad Request Error
 * Used for general client errors
 */
export class BadRequestError extends AppError {
  constructor(message = 'Bad request') {
    super(message, 400);
  }
}

/**
 * 401 Authentication Error
 * Used when authentication fails (invalid credentials, missing token, etc.)
 */
export class AuthenticationError extends AppError {
  constructor(message = 'Authentication failed') {
    super(message, 401);
  }
}

/**
 * 403 Authorization Error
 * Used when user lacks permission for requested resource/action
 */
export class AuthorizationError extends AppError {
  constructor(message = 'Insufficient permissions') {
    super(message, 403);
  }
}

/**
 * 403 Forbidden Error
 * Used when user is not allowed to perform an action on a resource
 * This is provided for code that expects a `ForbiddenError` class name.
 */
export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden') {
    super(message, 403);
  }
}

/**
 * 404 Not Found Error
 * Used when requested resource does not exist
 */
export class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404);
  }
}

/**
 * 409 Conflict Error
 * Used for conflicts (duplicate resources, state conflicts, etc.)
 */
export class ConflictError extends AppError {
  constructor(message = 'Resource conflict') {
    super(message, 409);
  }
}

/**
 * 400 Validation Error
 * Used for data validation failures (can include detailed errors array)
 */
export class ValidationError extends AppError {
  constructor(message = 'Validation failed', errors = null) {
    super(message, 400);
    this.errors = errors;
  }
}

/**
 * 500 Internal Server Error
 * Used for unexpected server errors
 */
export class InternalServerError extends AppError {
  constructor(message = 'Internal server error') {
    super(message, 500, false); // Not operational
  }
}
