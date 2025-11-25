/**
 * MIDDLEWARE: Validation Middleware
 * FILE: validationMiddleware.js
 * MỤC ĐÍCH: Validate request body/params/query using Joi or Yup
 * 
 * DEPENDENCIES:
 * - joi (validation library)
 * 
 * USAGE:
 * router.post('/sessions', authMiddleware, validate(createSessionSchema), controller)
 */

// TODO: Import Joi
// const Joi = require('joi')

// ============================================================
// MIDDLEWARE: validate(schema)
// ============================================================
// PURPOSE: Validate request data against Joi schema
// 
// INPUT:
// - schema: Joi schema object { body?, params?, query? }
// - req.body: Request body
// - req.params: URL parameters
// - req.query: Query parameters
// 
// PSEUDOCODE:
// Step 1: Extract validation targets
//   const { body, params, query } = req
// 
// Step 2: Validate each target if schema exists
//   if (schema.body) {
//     const { error, value } = schema.body.validate(body, { abortEarly: false })
//     if (error) -> collect errors
//     else -> req.body = value (use validated/sanitized value)
//   }
//   
//   if (schema.params) {
//     const { error, value } = schema.params.validate(params, { abortEarly: false })
//     if (error) -> collect errors
//     else -> req.params = value
//   }
//   
//   if (schema.query) {
//     const { error, value } = schema.query.validate(query, { abortEarly: false })
//     if (error) -> collect errors
//     else -> req.query = value
//   }
// 
// Step 3: If any errors -> return 400
//   if (errors.length > 0) {
//     return res.status(400).json({
//       success: false,
//       message: 'Validation Error',
//       errors: errors.map(err => ({
//         field: err.path.join('.'),
//         message: err.message
//       }))
//     })
//   }
// 
// Step 4: If valid -> continue
//   next()
// 
// OUTPUT:
// - Validated and sanitized req.body/params/query
// - Or 400 error response

// ============================================================
// VALIDATION SCHEMAS (Examples)
// ============================================================
// PURPOSE: Define reusable schemas for common validations

// SCHEMA: createSessionSchema
// const createSessionSchema = {
//   body: Joi.object({
//     title: Joi.string().min(3).max(200).required(),
//     subjectId: Joi.string().required(),
//     description: Joi.string().max(2000).optional(),
//     startTime: Joi.date().iso().required(),
//     endTime: Joi.date().iso().greater(Joi.ref('startTime')).required(),
//     sessionType: Joi.string().valid('ONLINE', 'OFFLINE').required(),
//     meetingLink: Joi.string().uri().when('sessionType', {
//       is: 'ONLINE',
//       then: Joi.required(),
//       otherwise: Joi.optional()
//     }),
//     location: Joi.string().when('sessionType', {
//       is: 'OFFLINE',
//       then: Joi.required(),
//       otherwise: Joi.optional()
//     }),
//     maxParticipants: Joi.number().integer().min(1).max(100).required()
//   })
// }

// SCHEMA: registerCourseSchema
// const registerCourseSchema = {
//   body: Joi.object({
//     tutorId: Joi.string().hex().length(24).required(), // MongoDB ObjectId
//     subjectId: Joi.string().required()
//   })
// }

// SCHEMA: bookAppointmentSchema
// const bookAppointmentSchema = {
//   params: Joi.object({
//     sessionId: Joi.string().hex().length(24).required()
//   }),
//   body: Joi.object({
//     notes: Joi.string().max(500).optional()
//   })
// }

// SCHEMA: createEvaluationSchema
// const createEvaluationSchema = {
//   body: Joi.object({
//     sessionId: Joi.string().hex().length(24).required(),
//     rating: Joi.number().integer().min(1).max(5).required(),
//     comment: Joi.string().max(1000).optional(),
//     isAnonymous: Joi.boolean().default(false)
//   })
// }

// ============================================================
// CUSTOM VALIDATORS
// ============================================================
// PURPOSE: Custom Joi validators for business rules

// VALIDATOR: hourlyTime
// PURPOSE: Validate time is on the hour (BR-001)
// const hourlyTimeValidator = Joi.extend((joi) => ({
//   type: 'hourlyTime',
//   base: joi.date(),
//   messages: {
//     'hourlyTime.notHourly': 'Time must be on the hour (e.g., 09:00, 10:00)'
//   },
//   validate(value, helpers) {
//     const minutes = value.getMinutes()
//     const seconds = value.getSeconds()
//     if (minutes !== 0 || seconds !== 0) {
//       return { value, errors: helpers.error('hourlyTime.notHourly') }
//     }
//     return value
//   }
// }))

// VALIDATOR: mssv
// PURPOSE: Validate HCMUT student ID format
// const mssvValidator = Joi.string().pattern(/^[0-9]{7}$/).message('Invalid MSSV format')

// TODO: Implement validate middleware factory
// TODO: Define common validation schemas
// TODO: Export validate function and schemas
// module.exports = {
//   validate,
//   createSessionSchema,
//   registerCourseSchema,
//   bookAppointmentSchema,
//   createEvaluationSchema
// }
