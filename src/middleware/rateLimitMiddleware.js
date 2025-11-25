/**
 * MIDDLEWARE: Rate Limiting Middleware
 * FILE: rateLimitMiddleware.js
 * MỤC ĐÍCH: Giới hạn số lượng requests để chống abuse/DDoS
 * 
 * DEPENDENCIES:
 * - express-rate-limit (rate limiting library)
 * 
 * USE CASES:
 * - Prevent brute-force login attacks
 * - Prevent API abuse
 * - Protect server resources
 */

// TODO: Import express-rate-limit
// const rateLimit = require('express-rate-limit')

// ============================================================
// MIDDLEWARE: generalLimiter
// ============================================================
// PURPOSE: General rate limit cho tất cả API endpoints
// 
// CONFIGURATION:
// - windowMs: 15 * 60 * 1000 (15 minutes)
// - max: 100 requests per window
// - message: "Too many requests, please try again later"
// - standardHeaders: true (Return rate limit info in `RateLimit-*` headers)
// - legacyHeaders: false (Disable `X-RateLimit-*` headers)
// 
// PSEUDOCODE:
// const generalLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100, // limit each IP to 100 requests per windowMs
//   message: {
//     success: false,
//     message: 'Too many requests from this IP, please try again after 15 minutes',
//     statusCode: 429
//   },
//   standardHeaders: true,
//   legacyHeaders: false
// })
// 
// USAGE:
// app.use('/api', generalLimiter)

// ============================================================
// MIDDLEWARE: authLimiter
// ============================================================
// PURPOSE: Strict rate limit cho authentication endpoints
// USE CASE: Chống brute-force attacks trên login
// 
// CONFIGURATION:
// - windowMs: 15 * 60 * 1000 (15 minutes)
// - max: 5 requests per window
// - skipSuccessfulRequests: true (Don't count successful logins)
// 
// PSEUDOCODE:
// const authLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 5, // only 5 failed login attempts per 15 minutes
//   message: {
//     success: false,
//     message: 'Too many login attempts, please try again after 15 minutes',
//     statusCode: 429
//   },
//   skipSuccessfulRequests: true, // don't count successful logins
//   standardHeaders: true,
//   legacyHeaders: false
// })
// 
// USAGE:
// router.post('/auth/login', authLimiter, authController.login)

// ============================================================
// MIDDLEWARE: registrationLimiter
// ============================================================
// PURPOSE: Limit registration requests
// USE CASE: Chống spam registrations
// 
// CONFIGURATION:
// - windowMs: 60 * 60 * 1000 (1 hour)
// - max: 10 registrations per hour
// 
// PSEUDOCODE:
// const registrationLimiter = rateLimit({
//   windowMs: 60 * 60 * 1000,
//   max: 10,
//   message: {
//     success: false,
//     message: 'Too many registration attempts, please try again later',
//     statusCode: 429
//   }
// })

// ============================================================
// MIDDLEWARE: sessionCreationLimiter
// ============================================================
// PURPOSE: Limit session creation
// USE CASE: Chống Tutors spam tạo sessions
// 
// CONFIGURATION:
// - windowMs: 60 * 60 * 1000 (1 hour)
// - max: 20 sessions per hour
// 
// PSEUDOCODE:
// const sessionCreationLimiter = rateLimit({
//   windowMs: 60 * 60 * 1000,
//   max: 20,
//   message: {
//     success: false,
//     message: 'Too many sessions created, please try again later',
//     statusCode: 429
//   },
//   keyGenerator: (req) => req.userId // Rate limit by userId instead of IP
// })

// ============================================================
// ADVANCED: Redis-based Rate Limiting (for production)
// ============================================================
// PURPOSE: Use Redis store for distributed rate limiting
// USE CASE: Multiple server instances need shared rate limit state
// 
// PSEUDOCODE:
// const RedisStore = require('rate-limit-redis')
// const redisClient = require('../config/redis')
// 
// const advancedLimiter = rateLimit({
//   store: new RedisStore({
//     client: redisClient,
//     prefix: 'rl:' // key prefix in Redis
//   }),
//   windowMs: 15 * 60 * 1000,
//   max: 100
// })

// ============================================================
// CUSTOM KEY GENERATOR
// ============================================================
// PURPOSE: Custom logic để xác định rate limit key
// 
// PSEUDOCODE:
// const customKeyGenerator = (req) => {
//   // Rate limit by userId if authenticated, else by IP
//   if (req.userId) {
//     return `user:${req.userId}`
//   }
//   return req.ip
// }

// TODO: Implement rate limiters
// TODO: Export all limiters
// module.exports = {
//   generalLimiter,
//   authLimiter,
//   registrationLimiter,
//   sessionCreationLimiter
// }
