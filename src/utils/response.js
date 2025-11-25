/**
 * UTILITY: Response Formatter
 * FILE: response.js
 * MỤC ĐÍCH: Chuẩn hóa format của API responses
 * 
 * CONSISTENT FORMAT:
 * {
 *   success: boolean,
 *   message: string,
 *   data: any,
 *   statusCode: number,
 *   errors: array (optional)
 * }
 */

// ============================================================
// SUCCESS RESPONSE
// ============================================================
// PURPOSE: Format successful response
// 
// INPUT:
// - res: Express response object
// - statusCode: Number (default 200)
// - message: String
// - data: Any
// 
// PSEUDOCODE:
// const successResponse = (res, statusCode = 200, message = 'Success', data = null) => {
//   return res.status(statusCode).json({
//     success: true,
//     message: message,
//     data: data,
//     statusCode: statusCode
//   })
// }
// 
// USAGE:
// successResponse(res, 200, 'Student profile retrieved', studentData)

// ============================================================
// ERROR RESPONSE
// ============================================================
// PURPOSE: Format error response
// 
// INPUT:
// - res: Express response object
// - statusCode: Number (default 500)
// - message: String
// - errors: Array (optional, validation errors)
// 
// PSEUDOCODE:
// const errorResponse = (res, statusCode = 500, message = 'Internal Server Error', errors = null) => {
//   return res.status(statusCode).json({
//     success: false,
//     message: message,
//     statusCode: statusCode,
//     errors: errors
//   })
// }
// 
// USAGE:
// errorResponse(res, 404, 'Session not found')
// errorResponse(res, 400, 'Validation failed', [
//   { field: 'startTime', message: 'Must be hourly' }
// ])

// ============================================================
// PAGINATED RESPONSE
// ============================================================
// PURPOSE: Format response with pagination
// 
// INPUT:
// - res: Express response object
// - statusCode: Number (default 200)
// - message: String
// - data: Array
// - pagination: Object { page, limit, total, totalPages }
// 
// PSEUDOCODE:
// const paginatedResponse = (res, statusCode = 200, message = 'Success', data = [], pagination = {}) => {
//   return res.status(statusCode).json({
//     success: true,
//     message: message,
//     data: data,
//     pagination: {
//       page: pagination.page || 1,
//       limit: pagination.limit || 10,
//       total: pagination.total || 0,
//       totalPages: pagination.totalPages || 0
//     },
//     statusCode: statusCode
//   })
// }
// 
// USAGE:
// paginatedResponse(res, 200, 'Tutors retrieved', tutors, {
//   page: 1,
//   limit: 10,
//   total: 50,
//   totalPages: 5
// })

// ============================================================
// CREATED RESPONSE
// ============================================================
// PURPOSE: Shorthand for 201 Created
// 
// PSEUDOCODE:
// const createdResponse = (res, message = 'Resource created', data = null) => {
//   return successResponse(res, 201, message, data)
// }
// 
// USAGE:
// createdResponse(res, 'Session created successfully', newSession)

// ============================================================
// NOT FOUND RESPONSE
// ============================================================
// PURPOSE: Shorthand for 404 Not Found
// 
// PSEUDOCODE:
// const notFoundResponse = (res, message = 'Resource not found') => {
//   return errorResponse(res, 404, message)
// }
// 
// USAGE:
// notFoundResponse(res, 'Tutor not found')

// ============================================================
// UNAUTHORIZED RESPONSE
// ============================================================
// PURPOSE: Shorthand for 401 Unauthorized
// 
// PSEUDOCODE:
// const unauthorizedResponse = (res, message = 'Unauthorized') => {
//   return errorResponse(res, 401, message)
// }
// 
// USAGE:
// unauthorizedResponse(res, 'Invalid token')

// ============================================================
// FORBIDDEN RESPONSE
// ============================================================
// PURPOSE: Shorthand for 403 Forbidden
// 
// PSEUDOCODE:
// const forbiddenResponse = (res, message = 'Forbidden') => {
//   return errorResponse(res, 403, message)
// }
// 
// USAGE:
// forbiddenResponse(res, 'You do not have permission to access this resource')

// ============================================================
// BAD REQUEST RESPONSE
// ============================================================
// PURPOSE: Shorthand for 400 Bad Request
// 
// PSEUDOCODE:
// const badRequestResponse = (res, message = 'Bad request', errors = null) => {
//   return errorResponse(res, 400, message, errors)
// }
// 
// USAGE:
// badRequestResponse(res, 'Validation failed', validationErrors)

// ============================================================
// CONFLICT RESPONSE
// ============================================================
// PURPOSE: Shorthand for 409 Conflict
// 
// PSEUDOCODE:
// const conflictResponse = (res, message = 'Conflict') => {
//   return errorResponse(res, 409, message)
// }
// 
// USAGE:
// conflictResponse(res, 'Session time conflicts with existing session')

// ============================================================
// USAGE IN CONTROLLER
// ============================================================
// const { successResponse, errorResponse } = require('../utils/response')
// 
// const getStudentProfile = async (req, res) => {
//   try {
//     const student = await StudentService.getProfile(req.userId)
//     return successResponse(res, 200, 'Profile retrieved', student)
//   } catch (error) {
//     return errorResponse(res, 500, error.message)
//   }
// }

// TODO: Export response helpers
// module.exports = {
//   successResponse,
//   errorResponse,
//   paginatedResponse,
//   createdResponse,
//   notFoundResponse,
//   unauthorizedResponse,
//   forbiddenResponse,
//   badRequestResponse,
//   conflictResponse
// }
