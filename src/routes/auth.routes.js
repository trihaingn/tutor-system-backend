/**
 * ROUTES: Auth Routes
 * FILE: auth.routes.js
 * MỤC ĐÍCH: Định nghĩa API endpoints cho Authentication
 * 
 * BASE PATH: /api/v1/auth
 * 
 * ENDPOINTS:
 * - GET  /login          - Redirect to SSO login page (UC-01)
 * - GET  /callback       - Handle SSO callback (UC-01, UC-04)
 * - POST /logout         - Logout user (UC-02)
 * - GET  /me             - Get current user info (UC-03)
 */

// TODO: Import express.Router
// TODO: Import authController (login, handleCallback, logout, getCurrentUser)
// TODO: Import authMiddleware (protect routes)

// ============================================================
// ROUTE: GET /api/v1/auth/login
// ============================================================
// PURPOSE: Redirect user to SSO HCMUT login page
// ACCESS: Public (no authentication required)
// CONTROLLER: authController.login
// 
// PSEUDOCODE:
// router.get('/login', authController.login)
// 
// FLOW:
// 1. User clicks "Login" button on frontend
// 2. Frontend redirects to this endpoint
// 3. Backend redirects to SSO portal
// 4. SSO portal shows login form
// 5. After login, SSO redirects back to /callback

// ============================================================
// ROUTE: GET /api/v1/auth/callback
// ============================================================
// PURPOSE: Handle callback from SSO (with ticket)
// ACCESS: Public
// CONTROLLER: authController.handleCallback
// QUERY PARAMS: { ticket: 'ST-xxxxx' }
// 
// PSEUDOCODE:
// router.get('/callback', authController.handleCallback)
// 
// FLOW:
// 1. SSO redirects here with ticket in query param
// 2. Validate ticket with SSO
// 3. Sync DATACORE data (BR-007)
// 4. Generate JWT token
// 5. Set JWT in HTTP-only cookie
// 6. Redirect to frontend dashboard

// ============================================================
// ROUTE: POST /api/v1/auth/logout
// ============================================================
// PURPOSE: Logout user
// ACCESS: Protected (authMiddleware)
// CONTROLLER: authController.logout
// 
// PSEUDOCODE:
// router.post('/logout', authMiddleware, authController.logout)
// 
// FLOW:
// 1. Verify JWT token (authMiddleware)
// 2. Clear JWT cookie
// 3. (Optional) Blacklist token
// 4. Return success response

// ============================================================
// ROUTE: GET /api/v1/auth/me
// ============================================================
// PURPOSE: Get current logged-in user info
// ACCESS: Protected (authMiddleware)
// CONTROLLER: authController.getCurrentUser
// 
// PSEUDOCODE:
// router.get('/me', authMiddleware, authController.getCurrentUser)
// 
// FLOW:
// 1. Verify JWT token (authMiddleware)
// 2. Extract userId from token
// 3. Query User with populated Student/Tutor
// 4. Return user profile

// TODO: Initialize router
// const router = express.Router()

// TODO: Define routes
// router.get('/login', authController.login)
// router.get('/callback', authController.handleCallback)
// router.post('/logout', authMiddleware, authController.logout)
// router.get('/me', authMiddleware, authController.getCurrentUser)

// TODO: Export router
// module.exports = router
