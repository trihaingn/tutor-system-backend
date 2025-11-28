/**
 * CONFIG: SSO Configuration
 * FILE: sso.config.js
 * MỤC ĐÍCH: Cấu hình SSO HCMUT (Central Authentication Service - CAS)
 * 
 * ENVIRONMENT VARIABLES:
 * - SSO_BASE_URL: Base URL của SSO server
 * - SSO_SERVICE_URL: Callback URL của backend (sau khi login thành công)
 * - SSO_VERSION: CAS protocol version (2.0 or 3.0)
 */

import dotenv from 'dotenv';
dotenv.config();

export default {
  enabled: process.env.SSO_ENABLED === 'true',
  baseUrl: process.env.SSO_BASE_URL || 'http://localhost:5001',
  serviceUrl: process.env.SSO_SERVICE_URL || 'http://localhost:5000/api/v1/auth/callback',
  validateUrl: process.env.SSO_VALIDATE_URL || 'http://localhost:5001/api/validate',
  loginUrl: process.env.SSO_LOGIN_URL || 'http://localhost:5001/login',
  logoutUrl: process.env.SSO_LOGOUT_URL || 'http://localhost:5001/logout'
};
