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

import * as AuthService from '../services/auth/AuthService.js';
import * as UserService from '../services/user/UserService.js';
import CASService from '../services/auth/CASService.js';
import { asyncHandler } from '../middleware/errorMiddleware.js';
import ssoConfig from '../config/sso.config.js';
import casConfig from '../config/cas.config.js';
import jwt from 'jsonwebtoken';

const { SSO_LOGIN_URL, SSO_SERVICE_URL } = ssoConfig;

/**
 * GET /api/v1/auth/login
 * Redirect user to SSO HCMUT login page
 */
const login = asyncHandler(async (req, res) => {
  const serviceUrl = SSO_SERVICE_URL || `${req.protocol}://${req.get('host')}/api/v1/auth/callback`;
  const loginUrl = `${SSO_LOGIN_URL}?service=${encodeURIComponent(serviceUrl)}`;
  
  res.redirect(loginUrl);
});

/**
 * GET /api/v1/auth/callback
 * Handle callback from SSO HCMUT (UC-01, UC-04)
 */
const handleCallback = asyncHandler(async (req, res) => {
  const { ticket } = req.query;
  const service = SSO_SERVICE_URL || `${req.protocol}://${req.get('host')}/api/v1/auth/callback`;

  if (!ticket) {
    return res.status(400).json({
      success: false,
      message: 'Missing SSO ticket'
    });
  }

  // Call AuthService to handle login flow
  const result = await AuthService.login(ticket, service);

  // Set JWT in HTTP-only cookie
  res.cookie('jwt', result.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 1 day
  });

  // Return JSON response (or redirect to frontend)
  res.status(200).json({
    success: true,
    data: result.user,
    token: result.token,
    message: 'Login successful'
  });
});

/**
 * POST /api/v1/auth/logout
 * Logout user (UC-02)
 */
const logout = asyncHandler(async (req, res) => {
  // Clear JWT cookie
  res.clearCookie('jwt');

  const result = await AuthService.logout();

  res.status(200).json(result);
});

/**
 * GET /api/v1/auth/me
 * Get current logged-in user info (UC-03)
 */
const getCurrentUser = asyncHandler(async (req, res) => {
  // userId is attached by authMiddleware
  const userId = req.userId;

  const user = await UserService.getUserById(userId);

  res.status(200).json({
    success: true,
    data: {
      userId: user._id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      status: user.status,
      mssv: user.mssv,
      maCB: user.maCB,
      student: user.student || null,
      tutor: user.tutor || null
    }
  });
});

export {
  login,
  handleCallback,
  logout,
  getCurrentUser,
  casLogin,
  casCallback
};

/**
 * ============================================================
 * CAS AUTHENTICATION HANDLERS
 * ============================================================
 */

/**
 * GET /api/v1/auth/cas/login
 * Redirect user to CAS login page
 * 
 * FLOW:
 * 1. Generate CAS login URL with service callback
 * 2. Redirect user to CAS server
 * 3. CAS shows login form
 * 4. After login, CAS redirects back to /auth/cas/callback with ticket
 */
async function casLogin(req, res) {
  try {
    // Check if CAS is enabled
    if (!CASService.isEnabled()) {
      return res.status(503).json({
        success: false,
        message: 'CAS authentication is not enabled'
      });
    }

    // Generate CAS login URL with callback service URL
    const serviceUrl = casConfig.serviceUrl || `${req.protocol}://${req.get('host')}/api/v1/auth/cas/callback`;
    const loginUrl = CASService.generateLoginUrl(serviceUrl);

    // Redirect user to CAS login page
    res.redirect(loginUrl);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to initiate CAS login',
      error: error.message
    });
  }
}

/**
 * GET /api/v1/auth/cas/callback
 * Handle CAS callback with ticket validation
 * 
 * QUERY PARAMS:
 * - ticket: CAS service ticket (ST-xxxxx)
 * 
 * FLOW:
 * 1. Extract ticket from query params
 * 2. Validate ticket with CAS server (server-to-server)
 * 3. Get user info from CAS validation response
 * 4. Find or create user in local database
 * 5. Sync with DATACORE if needed (BR-007)
 * 6. Generate JWT token for user
 * 7. Set JWT in HTTP-only cookie
 * 8. Redirect to frontend dashboard
 * 
 * SECURITY:
 * - Ticket is single-use (validated and consumed by CAS)
 * - Never trust client-provided user info
 * - Only trust CAS validation results
 */
async function casCallback(req, res) {
  try {
    const { ticket } = req.query;

    // Validate required parameters
    if (!ticket) {
      return res.status(400).json({
        success: false,
        message: 'Missing CAS ticket parameter'
      });
    }

    // Check if CAS is enabled
    if (!CASService.isEnabled()) {
      return res.status(503).json({
        success: false,
        message: 'CAS authentication is not enabled'
      });
    }

    // Step 1: Validate ticket with CAS server (server-to-server call)
    const serviceUrl = casConfig.serviceUrl || `${req.protocol}://${req.get('host')}/api/v1/auth/cas/callback`;
    const casUserData = await CASService.validateTicket(ticket, serviceUrl);

    // casUserData = { id, username, email }
    // Note: CAS has already invalidated the ticket (single-use)

    // Step 2: Find or create user in local database
    // The User model should have fields: email, username, etc.
    const { default: User } = await import('../models/User.model.js');
    
    let user = await User.findOne({ email: casUserData.email });

    if (!user) {
      // Extract username from email (e.g., "student01" from "student01@hcmut.edu.vn")
      const username = casUserData.username || casUserData.email.split('@')[0];
      
      // Determine role based on username pattern or default to STUDENT
      // Tutors/Admins usually have different email patterns (e.g., lecturer@hcmut.edu.vn)
      const isStaff = /^[a-zA-Z]+$/.test(username); // Simple heuristic: staff usernames are alphabetic only
      const role = isStaff ? 'TUTOR' : 'STUDENT';
      
      // Create new user with required fields
      const userData = {
        email: casUserData.email,
        fullName: casUserData.fullName || username,
        role: role,
        status: 'ACTIVE',
        syncSource: 'MANUAL' // Will be updated when synced with DATACORE
      };
      
      // Add mssv for students or maCB for staff
      if (role === 'STUDENT') {
        // Use username as mssv (student ID), e.g., "2252123"
        userData.mssv = username;
      } else {
        // Use username as maCB (staff ID)
        userData.maCB = username;
      }
      
      user = await User.create(userData);
    } else {
      // Update last sync time
      user.lastSyncAt = new Date();
      await user.save();
    }

    // Step 3: (Optional) Sync with DATACORE if needed (BR-007)
    // TODO: Implement DATACORE sync logic here if required
    // const DatacoreService = require('../services/integration/DatacoreService');
    // if (user.mssv || user.maCB) {
    //   await DatacoreService.syncUserData(user);
    // }

    // Step 4: Generate JWT token for the user
    const jwtPayload = {
      userId: user._id.toString(),
      email: user.email,
      role: user.role
    };

    const token = jwt.sign(
      jwtPayload,
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
    );

    // Step 5: Set JWT in HTTP-only cookie (secure session)
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // HTTPS only in production
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    });

    // Step 6: Redirect to frontend dashboard (or return JSON for SPA)
    // Option A: Redirect to frontend
    const frontendUrl = casConfig.frontendUrl || 'http://localhost:3001/dashboard';
    res.redirect(frontendUrl);

    // Option B: Return JSON response (if frontend is SPA that handles routing)
    // res.status(200).json({
    //   success: true,
    //   message: 'CAS authentication successful',
    //   data: {
    //     user: {
    //       id: user._id,
    //       email: user.email,
    //       username: user.username,
    //       role: user.role
    //     },
    //     token
    //   }
    // });

  } catch (error) {
    // Handle errors (invalid ticket, CAS server down, database error, etc.)
    console.error('CAS callback error:', error);
    
    return res.status(401).json({
      success: false,
      message: 'CAS authentication failed',
      error: error.message
    });
  }
}

