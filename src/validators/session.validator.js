/**
 * VALIDATOR: Session Validation Schemas
 * FILE: session.validator.js
 * MỤC ĐÍCH: Validation schemas cho TutorSession endpoints
 * 
 * BUSINESS RULES:
 * - BR-001: Giờ bắt đầu/kết thúc phải là giờ tròn (HH:00)
 * - BR-002: Duration >= 60 phút
 * - BR-003: startTime < endTime
 * - BR-004: startTime phải là tương lai
 */

// TODO: Import Joi
// const Joi = require('joi')

// ============================================================
// CUSTOM VALIDATORS
// ============================================================
// PURPOSE: Custom validation functions cho business rules
// 
// PSEUDOCODE:
// const isHourlyTime = (value, helpers) => {
//   const date = new Date(value)
//   if (date.getMinutes() !== 0 || date.getSeconds() !== 0) {
//     return helpers.error('custom.hourlyTime')
//   }
//   return value
// }
// 
// const isFutureDate = (value, helpers) => {
//   if (new Date(value) <= new Date()) {
//     return helpers.error('custom.futureDate')
//   }
//   return value
// }
// 
// const isValidDuration = (value, helpers) => {
//   const { startTime, endTime } = helpers.state.ancestors[0]
//   const durationMs = new Date(endTime) - new Date(startTime)
//   const durationMinutes = durationMs / (1000 * 60)
//   
//   if (durationMinutes < 60) {
//     return helpers.error('custom.minDuration')
//   }
//   return value
// }

// ============================================================
// CREATE SESSION SCHEMA (UC-11)
// ============================================================
// PURPOSE: Validate request body khi tạo session mới
// 
// PSEUDOCODE:
// const createSessionSchema = Joi.object({
//   title: Joi.string()
//     .min(5)
//     .max(200)
//     .required()
//     .messages({
//       'string.min': 'Tiêu đề phải có ít nhất 5 ký tự',
//       'string.max': 'Tiêu đề không được vượt quá 200 ký tự',
//       'any.required': 'Tiêu đề là bắt buộc'
//     }),
//   
//   description: Joi.string()
//     .max(2000)
//     .allow('')
//     .messages({
//       'string.max': 'Mô tả không được vượt quá 2000 ký tự'
//     }),
//   
//   subjectId: Joi.string()
//     .pattern(/^[0-9a-fA-F]{24}$/)
//     .required()
//     .messages({
//       'string.pattern.base': 'Subject ID không hợp lệ',
//       'any.required': 'Môn học là bắt buộc'
//     }),
//   
//   startTime: Joi.date()
//     .iso()
//     .custom(isHourlyTime)
//     .custom(isFutureDate)
//     .required()
//     .messages({
//       'custom.hourlyTime': 'Giờ bắt đầu phải là giờ tròn (HH:00) - BR-001',
//       'custom.futureDate': 'Giờ bắt đầu phải trong tương lai',
//       'any.required': 'Giờ bắt đầu là bắt buộc'
//     }),
//   
//   endTime: Joi.date()
//     .iso()
//     .custom(isHourlyTime)
//     .custom(isValidDuration)
//     .greater(Joi.ref('startTime'))
//     .required()
//     .messages({
//       'custom.hourlyTime': 'Giờ kết thúc phải là giờ tròn (HH:00) - BR-001',
//       'custom.minDuration': 'Thời lượng phải >= 60 phút - BR-002',
//       'date.greater': 'Giờ kết thúc phải sau giờ bắt đầu - BR-003',
//       'any.required': 'Giờ kết thúc là bắt buộc'
//     }),
//   
//   sessionType: Joi.string()
//     .valid('INDIVIDUAL', 'GROUP', 'WORKSHOP')
//     .required()
//     .messages({
//       'any.only': 'Loại session phải là INDIVIDUAL, GROUP hoặc WORKSHOP',
//       'any.required': 'Loại session là bắt buộc'
//     }),
//   
//   maxParticipants: Joi.number()
//     .integer()
//     .min(1)
//     .max(100)
//     .required()
//     .messages({
//       'number.min': 'Số lượng tối thiểu phải >= 1',
//       'number.max': 'Số lượng tối đa không được vượt quá 100',
//       'any.required': 'Số lượng tối đa là bắt buộc'
//     }),
//   
//   location: Joi.string()
//     .max(200)
//     .allow('')
//     .messages({
//       'string.max': 'Địa điểm không được vượt quá 200 ký tự'
//     }),
//   
//   meetingLink: Joi.string()
//     .uri()
//     .allow('')
//     .messages({
//       'string.uri': 'Meeting link không hợp lệ'
//     })
// })

// ============================================================
// UPDATE SESSION SCHEMA (UC-12)
// ============================================================
// PURPOSE: Validate request body khi cập nhật session
// NOTE: Tất cả fields đều optional (chỉ update fields được gửi lên)
// 
// PSEUDOCODE:
// const updateSessionSchema = Joi.object({
//   title: Joi.string().min(5).max(200),
//   description: Joi.string().max(2000).allow(''),
//   startTime: Joi.date().iso().custom(isHourlyTime).custom(isFutureDate),
//   endTime: Joi.date().iso().custom(isHourlyTime).custom(isValidDuration).greater(Joi.ref('startTime')),
//   maxParticipants: Joi.number().integer().min(1).max(100),
//   location: Joi.string().max(200).allow(''),
//   meetingLink: Joi.string().uri().allow(''),
//   status: Joi.string().valid('SCHEDULED', 'ONGOING', 'COMPLETED', 'CANCELLED')
// }).min(1) // At least 1 field must be provided

// ============================================================
// CANCEL SESSION SCHEMA
// ============================================================
// PURPOSE: Validate cancel reason
// 
// PSEUDOCODE:
// const cancelSessionSchema = Joi.object({
//   reason: Joi.string()
//     .min(10)
//     .max(500)
//     .required()
//     .messages({
//       'string.min': 'Lý do hủy phải có ít nhất 10 ký tự',
//       'string.max': 'Lý do hủy không được vượt quá 500 ký tự',
//       'any.required': 'Lý do hủy là bắt buộc'
//     })
// })

// ============================================================
// QUERY PARAMS SCHEMA
// ============================================================
// PURPOSE: Validate query parameters cho search/filter
// 
// PSEUDOCODE:
// const sessionQuerySchema = Joi.object({
//   status: Joi.string().valid('SCHEDULED', 'ONGOING', 'COMPLETED', 'CANCELLED'),
//   subjectId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/),
//   startDate: Joi.date().iso(),
//   endDate: Joi.date().iso().min(Joi.ref('startDate')),
//   page: Joi.number().integer().min(1).default(1),
//   limit: Joi.number().integer().min(1).max(100).default(10)
// })

// ============================================================
// VALIDATION MIDDLEWARE
// ============================================================
// PURPOSE: Middleware để áp dụng validation schema
// 
// PSEUDOCODE:
// const validateSession = (schema, source = 'body') => {
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
// const { validateSession, createSessionSchema } = require('../validators/session.validator')
// 
// router.post('/sessions', 
//   authMiddleware,
//   roleMiddleware(['TUTOR']),
//   validateSession(createSessionSchema),
//   sessionController.createSession
// )

// TODO: Export schemas and validator
// module.exports = {
//   createSessionSchema,
//   updateSessionSchema,
//   cancelSessionSchema,
//   sessionQuerySchema,
//   validateSession
// }
