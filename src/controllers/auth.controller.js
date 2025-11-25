/**
 * CONTROLLER: AuthController
 * FILE: auth.controller.js
 * MỤC ĐÍCH: Xử lý HTTP requests liên quan đến Authentication (UC-01, UC-02, UC-04)
 * 
 * USE CASES:
 * - UC-01: Login via SSO HCMUT
 * - UC-02: Logout
 * - UC-04: Auto-sync DATACORE on login (BR-007)
 * 
 * DEPENDENCIES:
 * - AuthService: Handle authentication logic
 * - DatacoreService: Sync user data from DATACORE
 */

// ============================================================
// FUNCTION: login()
// ============================================================
// METHOD: GET /api/v1/auth/login
// PURPOSE: Redirect user to SSO HCMUT login page
// 
// REQUEST:
// - No body (just redirect)
// 
// PROCESS:
// 1. Generate SSO login URL (from SSOConfig)
// 2. Redirect user to SSO portal
// 
// RESPONSE:
// - 302 Redirect to SSO_LOGIN_URL

// ============================================================
// FUNCTION: handleCallback()
// ============================================================
// METHOD: GET /api/v1/auth/callback
// PURPOSE: Handle callback từ SSO HCMUT sau khi login (UC-01, UC-04)
// 
// REQUEST:
// - Query params: { ticket: 'ST-xxxxx' }
// 
// PROCESS:
// 1. Validate ticket với SSO HCMUT (AuthService)
// 2. Extract user info from SSO response (email, mssv/maCB, fullName, faculty)
// 3. ⚠️ BR-007: Sync data from DATACORE (DatacoreService)
//    - Nếu mssv/maCB exists → Sync profile từ DATACORE
//    - Create/Update User model
//    - Create/Update Student/Tutor model (if applicable)
// 4. Generate JWT token (AuthService)
// 5. Set JWT in HTTP-only cookie
// 6. Redirect to frontend dashboard
// 
// RESPONSE:
// - 302 Redirect to FRONTEND_URL with JWT cookie
// 
// ERROR HANDLING:
// - Invalid ticket → 401 Unauthorized
// - DATACORE sync failure → 500 Internal Server Error
// - Missing required fields → 400 Bad Request

// ============================================================
// FUNCTION: logout()
// ============================================================
// METHOD: POST /api/v1/auth/logout
// PURPOSE: Logout user (UC-02)
// 
// REQUEST:
// - Headers: { Authorization: 'Bearer <JWT>' }
// 
// PROCESS:
// 1. Clear JWT cookie
// 2. (Optional) Blacklist JWT token (if using token blacklist)
// 3. Return success response
// 
// RESPONSE:
// {
//   "success": true,
//   "message": "Logged out successfully"
// }

// ============================================================
// FUNCTION: getCurrentUser()
// ============================================================
// METHOD: GET /api/v1/auth/me
// PURPOSE: Get current logged-in user info (UC-03)
// 
// REQUEST:
// - Headers: { Authorization: 'Bearer <JWT>' }
// 
// PROCESS:
// 1. Extract userId from JWT (via authMiddleware)
// 2. Query User model (populate Student/Tutor if applicable)
// 3. Return user profile
// 
// RESPONSE:
// {
//   "success": true,
//   "data": {
//     "userId": "...",
//     "email": "user@hcmut.edu.vn",
//     "fullName": "Nguyen Van A",
//     "role": "STUDENT",
//     "status": "ACTIVE",
//     "student": {
//       "mssv": "2210001",
//       "major": "Computer Science",
//       "gpa": 3.5
//     }
//   }
// }

// TODO: Import dependencies (AuthService, DatacoreService)

// TODO: Implement login() - Redirect to SSO

// TODO: Implement handleCallback()
// - Validate SSO ticket
// - Sync DATACORE (BR-007)
// - Generate JWT
// - Set cookie

// TODO: Implement logout() - Clear cookie

// TODO: Implement getCurrentUser() - Return user profile

// TODO: Export controller functions
