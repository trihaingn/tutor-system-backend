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

// TODO: Import dotenv
// require('dotenv').config()

// ============================================================
// SSO CONFIGURATION
// ============================================================
// PURPOSE: Export SSO settings
// 
// PSEUDOCODE:
// const ssoConfig = {
//   // SSO Server Base URL
//   baseUrl: process.env.SSO_BASE_URL || 'https://sso.hcmut.edu.vn/cas',
//   
//   // Service URL (callback URL after login)
//   serviceUrl: process.env.SSO_SERVICE_URL || 'http://localhost:5000/api/v1/auth/callback',
//   
//   // CAS Protocol Version
//   version: process.env.SSO_VERSION || '2.0',
//   
//   // SSO Endpoints
//   endpoints: {
//     // Login endpoint
//     login: '/login',
//     
//     // Logout endpoint
//     logout: '/logout',
//     
//     // Ticket validation endpoint
//     validate: '/serviceValidate', // CAS 2.0
//     // validate: '/p3/serviceValidate', // CAS 3.0 (if needed)
//   },
//   
//   // Validation Options
//   validation: {
//     // Auto-renew ticket if expired
//     renew: false,
//     
//     // Gateway mode (silent authentication)
//     gateway: false
//   }
// }

// ============================================================
// HELPER FUNCTIONS
// ============================================================
// PURPOSE: Generate full URLs
// 
// PSEUDOCODE:
// const getLoginUrl = (service) => {
//   return `${ssoConfig.baseUrl}${ssoConfig.endpoints.login}?service=${encodeURIComponent(service || ssoConfig.serviceUrl)}`
// }
// 
// const getLogoutUrl = (service) => {
//   return `${ssoConfig.baseUrl}${ssoConfig.endpoints.logout}?service=${encodeURIComponent(service || ssoConfig.serviceUrl)}`
// }
// 
// const getValidateUrl = (ticket, service) => {
//   return `${ssoConfig.baseUrl}${ssoConfig.endpoints.validate}?ticket=${ticket}&service=${encodeURIComponent(service || ssoConfig.serviceUrl)}`
// }

// ============================================================
// SSO FLOW EXAMPLE
// ============================================================
// Step 1: User clicks "Login" on frontend
// Step 2: Frontend redirects to getLoginUrl()
//   -> https://sso.hcmut.edu.vn/cas/login?service=http://localhost:5000/api/v1/auth/callback
// 
// Step 3: User enters HCMUT credentials on SSO portal
// Step 4: SSO redirects back to serviceUrl with ticket
//   -> http://localhost:5000/api/v1/auth/callback?ticket=ST-12345-xxxxx
// 
// Step 5: Backend validates ticket with getValidateUrl(ticket)
//   -> https://sso.hcmut.edu.vn/cas/serviceValidate?ticket=ST-12345-xxxxx&service=...
// 
// Step 6: SSO returns XML response with user info
//   <cas:serviceResponse>
//     <cas:authenticationSuccess>
//       <cas:user>1234567</cas:user>
//       <cas:attributes>
//         <cas:mssv>1234567</cas:mssv>
//         <cas:fullName>Nguyen Van A</cas:fullName>
//         <cas:email>a.nguyen@hcmut.edu.vn</cas:email>
//       </cas:attributes>
//     </cas:authenticationSuccess>
//   </cas:serviceResponse>
// 
// Step 7: Backend extracts user info, syncs with DATACORE, generates JWT
// Step 8: Backend redirects to frontend with JWT token

// ============================================================
// ENVIRONMENT-SPECIFIC CONFIGS
// ============================================================
// PSEUDOCODE:
// if (process.env.NODE_ENV === 'development') {
//   ssoConfig.serviceUrl = 'http://localhost:5000/api/v1/auth/callback'
// }
// 
// if (process.env.NODE_ENV === 'production') {
//   ssoConfig.serviceUrl = 'https://tutor.hcmut.edu.vn/api/v1/auth/callback'
// }

// TODO: Export configuration and helper functions
// module.exports = {
//   ssoConfig,
//   getLoginUrl,
//   getLogoutUrl,
//   getValidateUrl
// }
