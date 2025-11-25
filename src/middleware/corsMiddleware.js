/**
 * MIDDLEWARE: CORS Middleware
 * FILE: corsMiddleware.js
 * MỤC ĐÍCH: Cấu hình Cross-Origin Resource Sharing (CORS)
 * 
 * DEPENDENCIES:
 * - cors (cors library)
 * 
 * USE CASE:
 * - Allow frontend (different domain/port) to access backend API
 * - Security: Only allow specific origins in production
 */

// TODO: Import cors, config
// const cors = require('cors')
// const { ALLOWED_ORIGINS } = require('../config/cors.config')

// ============================================================
// MIDDLEWARE: corsOptions
// ============================================================
// PURPOSE: Configure CORS options
// 
// CONFIGURATION:
// origin: (origin, callback) => {
//   // Allow requests with no origin (mobile apps, Postman, etc.)
//   if (!origin) return callback(null, true)
//   
//   // Check if origin is in whitelist
//   if (ALLOWED_ORIGINS.includes(origin)) {
//     callback(null, true)
//   } else {
//     callback(new Error('Not allowed by CORS'))
//   }
// }
// 
// credentials: true
// - Allow cookies to be sent with requests
// - Required for JWT in HTTP-only cookies
// 
// methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS']
// - Allowed HTTP methods
// 
// allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
// - Allowed request headers
// 
// exposedHeaders: ['X-Total-Count', 'X-Page-Count']
// - Headers that frontend can access
// 
// maxAge: 86400
// - Preflight cache duration (24 hours)

// ============================================================
// PSEUDOCODE: corsOptions Configuration
// ============================================================
// const corsOptions = {
//   origin: (origin, callback) => {
//     // Development: Allow all origins
//     if (process.env.NODE_ENV === 'development') {
//       return callback(null, true)
//     }
//     
//     // Production: Check whitelist
//     const ALLOWED_ORIGINS = [
//       'https://tutor.hcmut.edu.vn',
//       'https://tutor-frontend.vercel.app'
//     ]
//     
//     if (!origin || ALLOWED_ORIGINS.includes(origin)) {
//       callback(null, true)
//     } else {
//       callback(new Error(`Origin ${origin} not allowed by CORS`))
//     }
//   },
//   
//   credentials: true, // Allow cookies
//   
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
//   
//   allowedHeaders: [
//     'Content-Type',
//     'Authorization',
//     'X-Requested-With',
//     'Accept',
//     'Origin'
//   ],
//   
//   exposedHeaders: [
//     'X-Total-Count',
//     'X-Page-Count',
//     'X-Total-Pages'
//   ],
//   
//   maxAge: 86400 // 24 hours
// }

// ============================================================
// MIDDLEWARE: corsMiddleware
// ============================================================
// PURPOSE: Apply CORS with options
// 
// PSEUDOCODE:
// const corsMiddleware = cors(corsOptions)
// 
// USAGE:
// app.use(corsMiddleware)

// ============================================================
// PREFLIGHT HANDLING
// ============================================================
// PURPOSE: Handle OPTIONS preflight requests
// NOTE: cors() middleware handles this automatically
// 
// MANUAL IMPLEMENTATION (if needed):
// app.options('*', cors(corsOptions))

// ============================================================
// ENVIRONMENT-SPECIFIC ORIGINS
// ============================================================
// PURPOSE: Different origins for different environments
// 
// PSEUDOCODE:
// const getAllowedOrigins = () => {
//   switch (process.env.NODE_ENV) {
//     case 'development':
//       return [
//         'http://localhost:3000',
//         'http://localhost:5173',
//         'http://127.0.0.1:3000'
//       ]
//     
//     case 'staging':
//       return [
//         'https://tutor-staging.hcmut.edu.vn'
//       ]
//     
//     case 'production':
//       return [
//         'https://tutor.hcmut.edu.vn',
//         'https://tutor-app.hcmut.edu.vn'
//       ]
//     
//     default:
//       return []
//   }
// }

// TODO: Implement CORS configuration
// TODO: Export corsMiddleware
// module.exports = corsMiddleware
