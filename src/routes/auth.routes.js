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

const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { authMiddleware } = require('../middleware/authMiddleware');

// ============================================================
// LEGACY SSO ROUTES (if still needed)
// ============================================================
// GET /api/v1/auth/login - Redirect to SSO
router.get('/login', authController.login);

// GET /api/v1/auth/callback - Handle SSO callback
router.get('/callback', authController.handleCallback);

// ============================================================
// CAS AUTHENTICATION ROUTES
// ============================================================
/**
 * GET /api/v1/auth/cas/login
 * Redirect user to CAS login page
 * 
 * ACCESS: Public
 * FLOW:
 * 1. User clicks "Login" → Frontend redirects to this endpoint
 * 2. Backend generates CAS login URL with service callback
 * 3. Backend redirects to CAS server
 * 4. CAS shows login form to user
 * 5. After successful login, CAS redirects to /auth/cas/callback with ticket
 */
router.get('/cas/login', authController.casLogin);

/**
 * GET /api/v1/auth/cas/callback
 * Handle CAS callback and validate ticket
 * 
 * ACCESS: Public (called by CAS server)
 * QUERY PARAMS: ticket (CAS service ticket ST-xxxxx)
 * 
 * FLOW:
 * 1. Extract ticket from query params
 * 2. Validate ticket with CAS server (server-to-server POST /auth/validate)
 * 3. CAS returns user info if ticket is valid
 * 4. Find or create user in local database
 * 5. Generate JWT token
 * 6. Set JWT in HTTP-only cookie
 * 7. Redirect to frontend dashboard
 * 
 * SECURITY:
 * - Ticket is single-use (CAS invalidates after validation)
 * - Never trust client-provided user info
 * - Only trust CAS validation results
 * - Backend must call CAS /validate endpoint every time
 */
router.get('/cas/callback', authController.casCallback);

// ============================================================
// PROTECTED ROUTES
// ============================================================
// POST /api/v1/auth/logout - Logout user
router.post('/logout', authMiddleware, authController.logout);

// GET /api/v1/auth/me - Get current user info
router.get('/me', authMiddleware, authController.getCurrentUser);

module.exports = router;
