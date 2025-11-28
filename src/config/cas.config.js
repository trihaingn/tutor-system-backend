/**
 * CONFIG: CAS Configuration
 * FILE: cas.config.js
 * PURPOSE: Configuration for CAS (Central Authentication Service) integration
 * 
 * ENVIRONMENT VARIABLES:
 * - CAS_ENABLED: Enable/disable CAS authentication (true/false)
 * - CAS_BASE_URL: Base URL of the CAS server (e.g., http://localhost:5000)
 * - CAS_SERVICE_URL: Callback URL of this backend (e.g., http://localhost:3000/api/v1/auth/cas/callback)
 * - CAS_TIMEOUT: Timeout for CAS API calls in milliseconds
 * 
 * SECURITY NOTES:
 * - Always use HTTPS for CAS in production
 * - Service URL must match exactly (including protocol, domain, port, path)
 * - CAS tickets are single-use only
 */

import dotenv from 'dotenv';
dotenv.config();

export default {
  // Enable/disable CAS authentication
  enabled: process.env.CAS_ENABLED === 'true',

  // CAS server base URL (where CAS server is running)
  // Example: http://localhost:5000 (development) or https://cas.example.com (production)
  baseUrl: process.env.CAS_BASE_URL || 'http://localhost:5000',

  // Service callback URL (where CAS redirects after successful login)
  // This MUST match the URL that initiated the CAS login
  // Example: http://localhost:3000/api/v1/auth/cas/callback
  serviceUrl: process.env.CAS_SERVICE_URL || 'http://localhost:3000/api/v1/auth/cas/callback',

  // Timeout for CAS API calls (milliseconds)
  timeout: parseInt(process.env.CAS_TIMEOUT) || 5000,

  // Frontend redirect URL after successful authentication
  // After CAS authentication and JWT creation, redirect user to this URL
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3001/dashboard'
};
