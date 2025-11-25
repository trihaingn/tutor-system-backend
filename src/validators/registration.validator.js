/**
 * VALIDATOR: Registration Validation Schemas
 * FILE: registration.validator.js
 * MỤC ĐÍCH: Validation schemas cho CourseRegistration endpoints
 * 
 * BUSINESS RULES:
 * - BR-006: Một student chỉ đăng ký 1 lần với cặp (tutorId, subjectId)
 */

// TODO: Import Joi
// const Joi = require('joi')

// ============================================================
// CREATE REGISTRATION SCHEMA (UC-08)
// ============================================================
// PURPOSE: Validate request body khi đăng ký môn học
// 
// PSEUDOCODE:
// const createRegistrationSchema = Joi.object({
//   tutorId: Joi.string()
//     .pattern(/^[0-9a-fA-F]{24}$/)
//     .required()
//     .messages({
//       'string.pattern.base': 'Tutor ID không hợp lệ',
//       'any.required': 'Tutor ID là bắt buộc'
//     }),
//   
//   subjectId: Joi.string()
//     .pattern(/^[0-9a-fA-F]{24}$/)
//     .required()
//     .messages({
//       'string.pattern.base': 'Subject ID không hợp lệ',
//       'any.required': 'Subject ID là bắt buộc'
//     }),
//   
//   note: Joi.string()
//     .max(500)
//     .allow('')
//     .messages({
//       'string.max': 'Ghi chú không được vượt quá 500 ký tự'
//     })
// })

// ============================================================
// UPDATE REGISTRATION STATUS SCHEMA
// ============================================================
// PURPOSE: Validate status update (Tutor approve/reject)
// 
// PSEUDOCODE:
// const updateRegistrationStatusSchema = Joi.object({
//   status: Joi.string()
//     .valid('APPROVED', 'REJECTED')
//     .required()
//     .messages({
//       'any.only': 'Status phải là APPROVED hoặc REJECTED',
//       'any.required': 'Status là bắt buộc'
//     }),
//   
//   rejectionReason: Joi.string()
//     .when('status', {
//       is: 'REJECTED',
//       then: Joi.string().min(10).max(500).required(),
//       otherwise: Joi.forbidden()
//     })
//     .messages({
//       'string.min': 'Lý do từ chối phải có ít nhất 10 ký tự',
//       'string.max': 'Lý do từ chối không được vượt quá 500 ký tự',
//       'any.required': 'Lý do từ chối là bắt buộc khi status=REJECTED'
//     })
// })

// ============================================================
// CANCEL REGISTRATION SCHEMA
// ============================================================
// PURPOSE: Validate cancel request (Student cancel)
// 
// PSEUDOCODE:
// const cancelRegistrationSchema = Joi.object({
//   reason: Joi.string()
//     .min(10)
//     .max(500)
//     .messages({
//       'string.min': 'Lý do hủy phải có ít nhất 10 ký tự',
//       'string.max': 'Lý do hủy không được vượt quá 500 ký tự'
//     })
// })

// ============================================================
// QUERY PARAMS SCHEMA
// ============================================================
// PURPOSE: Validate query parameters cho list registrations
// 
// PSEUDOCODE:
// const registrationQuerySchema = Joi.object({
//   status: Joi.string().valid('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'),
//   tutorId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/),
//   studentId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/),
//   subjectId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/),
//   page: Joi.number().integer().min(1).default(1),
//   limit: Joi.number().integer().min(1).max(100).default(10),
//   sortBy: Joi.string().valid('createdAt', 'updatedAt').default('createdAt'),
//   sortOrder: Joi.string().valid('asc', 'desc').default('desc')
// })

// ============================================================
// VALIDATION MIDDLEWARE
// ============================================================
// PURPOSE: Middleware để áp dụng validation schema
// 
// PSEUDOCODE:
// const validateRegistration = (schema, source = 'body') => {
//   return (req, res, next) => {
//     const data = source === 'query' ? req.query : req.body
//     
//     const { error, value } = schema.validate(data, {
//       abortEarly: false,
//       stripUnknown: true
//     })
//     
//     if (error) {
//       const errors = error.details.map(detail => ({
//         field: detail.path.join('.'),
//         message: detail.message
//       }))
//       
//       return res.status(400).json({
//         success: false,
//         message: 'Validation failed',
//         errors: errors
//       })
//     }
//     
//     if (source === 'query') {
//       req.query = value
//     } else {
//       req.body = value
//     }
//     
//     next()
//   }
// }

// ============================================================
// USAGE IN ROUTES
// ============================================================
// const { validateRegistration, createRegistrationSchema } = require('../validators/registration.validator')
// 
// router.post('/registrations', 
//   authMiddleware,
//   roleMiddleware(['STUDENT']),
//   validateRegistration(createRegistrationSchema),
//   registrationController.createRegistration
// )

// TODO: Export schemas and validator
// module.exports = {
//   createRegistrationSchema,
//   updateRegistrationStatusSchema,
//   cancelRegistrationSchema,
//   registrationQuerySchema,
//   validateRegistration
// }
