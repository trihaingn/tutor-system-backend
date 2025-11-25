/**
 * ROOT FILE: app.js
 * MỤC ĐÍCH: Cấu hình Express application
 * 
 * FLOW:
 * 1. Import dependencies
 * 2. Initialize Express app
 * 3. Load middleware (theo thứ tự)
 * 4. Mount routes
 * 5. Error handling
 * 6. Export app
 */

// TODO: Import dependencies
// const express = require('express')
// const cors = require('cors')
// const cookieParser = require('cookie-parser')
// const morgan = require('morgan')

// ============================================================
// IMPORT MIDDLEWARE
// ============================================================
// const corsMiddleware = require('./middleware/corsMiddleware')
// const loggingMiddleware = require('./middleware/loggingMiddleware')
// const rateLimitMiddleware = require('./middleware/rateLimitMiddleware')
// const errorMiddleware = require('./middleware/errorMiddleware')
// const { logger, morganStream } = require('./utils/logger')

// ============================================================
// IMPORT ROUTES
// ============================================================
// const routes = require('./routes')

// ============================================================
// INITIALIZE EXPRESS APP
// ============================================================
// PURPOSE: Tạo Express application instance
// 
// PSEUDOCODE:
// const app = express()

// ============================================================
// MIDDLEWARE: CORS
// ============================================================
// PURPOSE: Enable CORS với whitelist từ app.config
// 
// PSEUDOCODE:
// app.use(corsMiddleware)

// ============================================================
// MIDDLEWARE: BODY PARSER
// ============================================================
// PURPOSE: Parse JSON và URL-encoded data
// 
// PSEUDOCODE:
// app.use(express.json({ limit: '10mb' }))
// app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// ============================================================
// MIDDLEWARE: COOKIE PARSER
// ============================================================
// PURPOSE: Parse cookies từ request headers
// 
// PSEUDOCODE:
// app.use(cookieParser())

// ============================================================
// MIDDLEWARE: LOGGING (Morgan)
// ============================================================
// PURPOSE: Log HTTP requests
// 
// PSEUDOCODE:
// if (process.env.NODE_ENV === 'development') {
//   app.use(morgan('dev'))
// } else {
//   app.use(morgan('combined', { stream: morganStream }))
// }
// 
// app.use(loggingMiddleware)

// ============================================================
// MIDDLEWARE: RATE LIMITING
// ============================================================
// PURPOSE: Giới hạn số request (DDoS protection)
// 
// PSEUDOCODE:
// app.use(rateLimitMiddleware)

// ============================================================
// HEALTH CHECK ENDPOINT
// ============================================================
// PURPOSE: Endpoint kiểm tra server status (không qua routes)
// 
// PSEUDOCODE:
// app.get('/health', (req, res) => {
//   res.status(200).json({
//     status: 'UP',
//     timestamp: new Date().toISOString(),
//     uptime: process.uptime(),
//     environment: process.env.NODE_ENV
//   })
// })

// ============================================================
// MOUNT ROUTES
// ============================================================
// PURPOSE: Mount tất cả API routes
// 
// PSEUDOCODE:
// app.use('/api/v1', routes)

// ============================================================
// 404 HANDLER
// ============================================================
// PURPOSE: Handle routes không tồn tại
// 
// PSEUDOCODE:
// app.use('*', (req, res) => {
//   res.status(404).json({
//     success: false,
//     message: `Route ${req.originalUrl} not found`,
//     statusCode: 404
//   })
// })

// ============================================================
// ERROR HANDLING MIDDLEWARE
// ============================================================
// PURPOSE: Global error handler (phải là middleware cuối cùng)
// 
// PSEUDOCODE:
// app.use(errorMiddleware)

// ============================================================
// EXPORT APP
// ============================================================
// PURPOSE: Export app để sử dụng trong server.js
// 
// PSEUDOCODE:
// module.exports = app
