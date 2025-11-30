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

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: SSO/CAS authentication endpoints
 */

/**
 * @swagger
 * /auth/login:
 *   get:
 *     summary: Redirect to SSO login page
 *     description: Initiates SSO authentication by redirecting to HCMUT SSO portal
 *     tags: [Authentication]
 *     responses:
 *       302:
 *         description: Redirects to SSO login page
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /auth/callback:
 *   get:
 *     summary: Handle SSO callback
 *     description: Processes SSO callback with ticket, validates user, syncs DATACORE, generates JWT
 *     tags: [Authentication]
 *     parameters:
 *       - in: query
 *         name: ticket
 *         required: true
 *         schema:
 *           type: string
 *         description: SSO ticket from CAS server
 *         example: ST-123456-abcdefghijklmnop
 *     responses:
 *       302:
 *         description: Redirects to frontend dashboard with JWT in cookie
 *         headers:
 *           Set-Cookie:
 *             description: JWT access token
 *             schema:
 *               type: string
 *               example: accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...; HttpOnly; Path=/
 *       401:
 *         description: Invalid ticket or authentication failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout user
 *     description: Clears JWT token and logs out the current user
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Successfully logged out
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Logged out successfully
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Get current user info
 *     description: Returns profile information of the currently authenticated user
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
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

import express from 'express';
const router = express.Router();
import authController from '../controllers/auth.controller.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

// ============================================================
// CAS AUTHENTICATION ROUTES (Primary)
// ============================================================
/**
 * GET /api/v1/auth/login
 * Redirect user to CAS login page (main login endpoint)
 * 
 * NOTE: This is the primary login route that redirects to CAS
 * For backward compatibility, also available at /auth/cas/login
 */
router.get('/login', authController.casLogin);

/**
 * GET /api/v1/auth/callback
 * Handle CAS callback and validate ticket (main callback endpoint)
 * 
 * NOTE: This is the primary callback route from CAS
 * For backward compatibility, also available at /auth/cas/callback
 */
router.get('/callback', authController.casCallback);

// ============================================================
// CAS AUTHENTICATION ROUTES (Alternative paths)
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

export default router;
