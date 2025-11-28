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

// Simple console-based logger implementation
// Can be replaced with Winston when winston is installed

const logger = {
  info: (message, meta = {}) => {
    const timestamp = new Date().toISOString();
    console.log(`${timestamp} [INFO]: ${message}`, Object.keys(meta).length > 0 ? meta : '');
  },
  
  error: (message, meta = {}) => {
    const timestamp = new Date().toISOString();
    console.error(`${timestamp} [ERROR]: ${message}`, Object.keys(meta).length > 0 ? meta : '');
  },
  
  warn: (message, meta = {}) => {
    const timestamp = new Date().toISOString();
    console.warn(`${timestamp} [WARN]: ${message}`, Object.keys(meta).length > 0 ? meta : '');
  },
  
  debug: (message, meta = {}) => {
    if (process.env.NODE_ENV === 'development') {
      const timestamp = new Date().toISOString();
      console.debug(`${timestamp} [DEBUG]: ${message}`, Object.keys(meta).length > 0 ? meta : '');
    }
  }
};

// ============================================================
// LOGGER METHODS
// ============================================================
// PURPOSE: Helper methods for common logging patterns

const logRequest = (req) => {
  logger.info('HTTP Request', {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userId: req.userId || null
  });
};

const logError = (error, context = {}) => {
  logger.error(error.message, {
    stack: error.stack,
    ...context
  });
};

const logDebug = (message, data = {}) => {
  if (process.env.NODE_ENV === 'development') {
    logger.debug(message, data);
  }
};

// ============================================================
// STREAM FOR MORGAN
// ============================================================
// PURPOSE: Stream Winston logs to Morgan (HTTP logger)

const morganStream = {
  write: (message) => {
    logger.info(message.trim());
  }
};

// ============================================================
// USAGE EXAMPLES
// ============================================================
// logger.info('Server started', { port: 5000 })
// logger.error('Database connection failed', { error: err.message })
// logger.warn('Rate limit exceeded', { userId: '123', endpoint: '/api/sessions' })
// logger.debug('Query result', { result: data })

module.exports = {
  logger,
  logRequest,
  logError,
  logDebug,
  morganStream,
  // Also export logger methods directly for convenience
  info: logger.info,
  error: logger.error,
  warn: logger.warn,
  debug: logger.debug
};
