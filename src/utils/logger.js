/**
 * UTILITY: Logger
 * FILE: logger.js
 * MỤC ĐÍCH: Cấu hình logging với Winston
 * 
 * LOG LEVELS:
 * - error: Errors that need immediate attention
 * - warn: Warning messages
 * - info: General information
 * - debug: Debug information (development only)
 * 
 * OUTPUT:
 * - Console: Development
 * - File: Production (logs/error.log, logs/combined.log)
 */

// TODO: Import winston
// const winston = require('winston')
// const path = require('path')

// ============================================================
// LOG FORMATS
// ============================================================
// PURPOSE: Define log format
// 
// PSEUDOCODE:
// const logFormat = winston.format.combine(
//   // Add timestamp
//   winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
//   
//   // Add error stack trace
//   winston.format.errors({ stack: true }),
//   
//   // Add metadata
//   winston.format.metadata(),
//   
//   // Format message
//   winston.format.printf((info) => {
//     const { timestamp, level, message, metadata } = info
//     
//     let log = `${timestamp} [${level.toUpperCase()}]: ${message}`
//     
//     // Add metadata if exists
//     if (Object.keys(metadata).length > 0) {
//       log += ` ${JSON.stringify(metadata)}`
//     }
//     
//     return log
//   })
// )

// ============================================================
// CONSOLE TRANSPORT (Development)
// ============================================================
// PSEUDOCODE:
// const consoleTransport = new winston.transports.Console({
//   format: winston.format.combine(
//     winston.format.colorize(),
//     logFormat
//   )
// })

// ============================================================
// FILE TRANSPORTS (Production)
// ============================================================
// PSEUDOCODE:
// const fileTransports = [
//   // Error logs
//   new winston.transports.File({
//     filename: path.join(__dirname, '../../logs/error.log'),
//     level: 'error',
//     maxsize: 5242880, // 5MB
//     maxFiles: 5,
//     format: logFormat
//   }),
//   
//   // Combined logs (all levels)
//   new winston.transports.File({
//     filename: path.join(__dirname, '../../logs/combined.log'),
//     maxsize: 5242880, // 5MB
//     maxFiles: 5,
//     format: logFormat
//   })
// ]

// ============================================================
// LOGGER INSTANCE
// ============================================================
// PURPOSE: Create Winston logger
// 
// PSEUDOCODE:
// const logger = winston.createLogger({
//   level: process.env.LOG_LEVEL || 'info',
//   
//   transports: [
//     consoleTransport,
//     ...(process.env.NODE_ENV === 'production' ? fileTransports : [])
//   ],
//   
//   // Don't exit on error
//   exitOnError: false
// })

// ============================================================
// LOGGER METHODS
// ============================================================
// PURPOSE: Helper methods cho common logging patterns
// 
// PSEUDOCODE:
// const logRequest = (req) => {
//   logger.info('HTTP Request', {
//     method: req.method,
//     url: req.originalUrl,
//     ip: req.ip,
//     userId: req.userId || null
//   })
// }
// 
// const logError = (error, context = {}) => {
//   logger.error(error.message, {
//     stack: error.stack,
//     ...context
//   })
// }
// 
// const logDebug = (message, data = {}) => {
//   if (process.env.NODE_ENV === 'development') {
//     logger.debug(message, data)
//   }
// }

// ============================================================
// STREAM FOR MORGAN
// ============================================================
// PURPOSE: Stream Winston logs to Morgan (HTTP logger)
// 
// PSEUDOCODE:
// const morganStream = {
//   write: (message) => {
//     logger.info(message.trim())
//   }
// }

// ============================================================
// USAGE EXAMPLES
// ============================================================
// logger.info('Server started', { port: 5000 })
// logger.error('Database connection failed', { error: err.message })
// logger.warn('Rate limit exceeded', { userId: '123', endpoint: '/api/sessions' })
// logger.debug('Query result', { result: data })

// TODO: Export logger and helpers
// module.exports = {
//   logger,
//   logRequest,
//   logError,
//   logDebug,
//   morganStream
// }
