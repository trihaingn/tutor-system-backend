/**
 * CONFIG: Application Configuration
 * FILE: app.config.js
 * MỤC ĐÍCH: Cấu hình tổng quan cho application
 * 
 * ENVIRONMENT VARIABLES:
 * - NODE_ENV: Environment (development | staging | production)
 * - PORT: Server port
 * - JWT_SECRET: Secret key để ký JWT
 * - JWT_EXPIRES_IN: JWT expiration time
 * - FRONTEND_URL: Frontend URL (for CORS)
 */

// TODO: Import dotenv
// require('dotenv').config()

// ============================================================
// APPLICATION CONFIGURATION
// ============================================================
// PURPOSE: Export app-wide settings
// 
// PSEUDOCODE:
// const appConfig = {
//   // Environment
//   env: process.env.NODE_ENV || 'development',
//   
//   // Server Port
//   port: parseInt(process.env.PORT) || 5000,
//   
//   // Application Name
//   appName: 'HCMUT Tutor System',
//   
//   // API Version
//   apiVersion: 'v1',
//   
//   // API Base Path
//   apiBasePath: '/api/v1',
//   
//   // Frontend URL (for CORS)
//   frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
//   
//   // JWT Configuration
//   jwt: {
//     secret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
//     expiresIn: process.env.JWT_EXPIRES_IN || '7d', // 7 days
//     refreshExpiresIn: '30d' // 30 days for refresh token
//   },
//   
//   // Cookie Configuration
//   cookie: {
//     name: 'token',
//     httpOnly: true,
//     secure: process.env.NODE_ENV === 'production', // HTTPS only in production
//     sameSite: 'lax',
//     maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in ms
//   },
//   
//   // Pagination Defaults
//   pagination: {
//     defaultPage: 1,
//     defaultLimit: 10,
//     maxLimit: 100
//   },
//   
//   // File Upload
//   upload: {
//     maxFileSize: 5 * 1024 * 1024, // 5MB
//     allowedTypes: ['image/jpeg', 'image/png', 'application/pdf']
//   },
//   
//   // Logging
//   logging: {
//     level: process.env.LOG_LEVEL || 'info', // error | warn | info | debug
//     format: process.env.NODE_ENV === 'production' ? 'json' : 'dev'
//   }
// }

// ============================================================
// ENVIRONMENT-SPECIFIC CONFIGS
// ============================================================
// PSEUDOCODE:
// if (appConfig.env === 'development') {
//   appConfig.logging.level = 'debug'
//   appConfig.cookie.secure = false
// }
// 
// if (appConfig.env === 'production') {
//   appConfig.cookie.secure = true
//   appConfig.cookie.sameSite = 'strict'
//   appConfig.logging.level = 'error'
// }

// ============================================================
// FEATURE FLAGS
// ============================================================
// PURPOSE: Enable/disable features dynamically
// 
// PSEUDOCODE:
// const featureFlags = {
//   // Enable email notifications
//   emailNotifications: process.env.ENABLE_EMAIL === 'true',
//   
//   // Enable library integration
//   libraryIntegration: process.env.ENABLE_LIBRARY === 'true',
//   
//   // Enable Redis caching
//   redisCaching: process.env.ENABLE_REDIS === 'true',
//   
//   // Enable Socket.io real-time
//   socketIO: process.env.ENABLE_SOCKET === 'true' || true,
//   
//   // Enable data sync
//   dataSync: process.env.ENABLE_SYNC === 'true' || true
// }

// ============================================================
// ALLOWED ORIGINS (CORS)
// ============================================================
// PURPOSE: Whitelist các origins được phép
// 
// PSEUDOCODE:
// const getAllowedOrigins = () => {
//   switch (appConfig.env) {
//     case 'development':
//       return [
//         'http://localhost:3000',
//         'http://localhost:5173',
//         'http://127.0.0.1:3000'
//       ]
//     
//     case 'staging':
//       return ['https://tutor-staging.hcmut.edu.vn']
//     
//     case 'production':
//       return [
//         'https://tutor.hcmut.edu.vn',
//         'https://tutor-app.hcmut.edu.vn'
//       ]
//     
//     default:
//       return [appConfig.frontendUrl]
//   }
// }

// ============================================================
// VALIDATION
// ============================================================
// PURPOSE: Validate required environment variables
// 
// PSEUDOCODE:
// const validateConfig = () => {
//   const required = ['JWT_SECRET', 'MONGO_URI', 'SSO_BASE_URL', 'DATACORE_API_URL']
//   
//   const missing = required.filter(key => !process.env[key])
//   
//   if (missing.length > 0) {
//     throw new Error(`Missing required environment variables: ${missing.join(', ')}`)
//   }
//   
//   if (appConfig.env === 'production' && appConfig.jwt.secret === 'your-secret-key-change-in-production') {
//     throw new Error('Please change JWT_SECRET in production')
//   }
// }

// TODO: Export configuration
// module.exports = {
//   appConfig,
//   featureFlags,
//   getAllowedOrigins,
//   validateConfig
// }
