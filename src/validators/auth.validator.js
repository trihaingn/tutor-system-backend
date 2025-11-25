/**
 * VALIDATOR: Auth Validation Schemas
 * FILE: auth.validator.js
 * MỤC ĐÍCH: Validation schemas cho authentication endpoints
 * 
 * LIBRARY: Joi hoặc Zod
 * USE CASE:
 * - Validate SSO callback data
 * - Validate login request
 */

// TODO: Import Joi
// const Joi = require('joi')

// ============================================================
// LOGIN SCHEMA
// ============================================================
// PURPOSE: Validate login request (nếu có fallback mechanism)
// 
// PSEUDOCODE:
// const loginSchema = Joi.object({
//   email: Joi.string()
//     .email()
//     .pattern(/@hcmut\.edu\.vn$/)
//     .required()
//     .messages({
//       'string.email': 'Email không hợp lệ',
//       'string.pattern.base': 'Phải sử dụng email HCMUT (@hcmut.edu.vn)',
//       'any.required': 'Email là bắt buộc'
//     }),
//   
//   // NOTE: Hệ thống dùng SSO nên không cần password
//   // Field này chỉ để demo validation pattern
// })

// ============================================================
// SSO CALLBACK SCHEMA
// ============================================================
// PURPOSE: Validate SSO callback parameters
// 
// PSEUDOCODE:
// const ssoCallbackSchema = Joi.object({
//   ticket: Joi.string()
//     .required()
//     .messages({
//       'any.required': 'Ticket SSO là bắt buộc',
//       'string.empty': 'Ticket SSO không được rỗng'
//     })
// })

// ============================================================
// REFRESH TOKEN SCHEMA
// ============================================================
// PURPOSE: Validate refresh token request
// 
// PSEUDOCODE:
// const refreshTokenSchema = Joi.object({
//   refreshToken: Joi.string()
//     .required()
//     .messages({
//       'any.required': 'Refresh token là bắt buộc',
//       'string.empty': 'Refresh token không được rỗng'
//     })
// })

// ============================================================
// VALIDATION MIDDLEWARE
// ============================================================
// PURPOSE: Middleware để áp dụng validation schema
// 
// PSEUDOCODE:
// const validateAuth = (schema) => {
//   return (req, res, next) => {
//     const { error, value } = schema.validate(req.body, {
//       abortEarly: false, // Return all errors
//       stripUnknown: true  // Remove unknown fields
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
//     // Replace req.body with validated data
//     req.body = value
//     next()
//   }
// }

// ============================================================
// USAGE IN ROUTES
// ============================================================
// const { validateAuth, ssoCallbackSchema } = require('../validators/auth.validator')
// 
// router.get('/auth/sso/callback', 
//   validateAuth(ssoCallbackSchema), 
//   authController.ssoCallback
// )

// TODO: Export schemas and validator
// module.exports = {
//   loginSchema,
//   ssoCallbackSchema,
//   refreshTokenSchema,
//   validateAuth
// }
