/**
 * CONFIG: DATACORE Configuration
 * FILE: datacore.config.js
 * MỤC ĐÍCH: Cấu hình kết nối đến hệ thống DATACORE (Database trung tâm HCMUT)
 * 
 * ENVIRONMENT VARIABLES:
 * - DATACORE_API_URL: Base URL của DATACORE API
 * - DATACORE_API_KEY: API key để xác thực
 * - DATACORE_TIMEOUT: Request timeout (ms)
 */

require('dotenv').config();

module.exports = {
  apiUrl: process.env.DATACORE_API_URL || 'http://localhost:8001/api',
  timeout: parseInt(process.env.DATACORE_TIMEOUT) || 5000,
  retryAttempts: parseInt(process.env.DATACORE_RETRY_ATTEMPTS) || 3,
  
  endpoints: {
    getUser: '/users/profile/:id',
    getAllUsers: '/users/sync',
    health: '/health'
  }
};
