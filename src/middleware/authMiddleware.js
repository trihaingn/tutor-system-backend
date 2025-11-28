/**
 * MIDDLEWARE: Authentication Middleware
 * FILE: authMiddleware.js
 * MỤC ĐÍCH: Xác thực JWT token và attach user info vào request
 * 
 * DEPENDENCIES:
 * - jsonwebtoken (JWT verification)
 * - User model
 * - Constants (ERROR_MESSAGES, HTTP_STATUS)
 */

import jwt from 'jsonwebtoken';
import User from '../models/User.model.js';

/**
 * Authentication Middleware
 * Verify JWT token and attach user to request
 * 
 * INPUT:
 * - req.headers.authorization: "Bearer <token>"
 * - OR req.cookies.token: "<token>"
 * 
 * PSEUDOCODE:
 * Step 1: Extract token from Authorization header or cookie
 *   - Check req.headers.authorization.startsWith('Bearer ')
 *   - Extract: token = authorization.split(' ')[1]
 *   - If not found, check req.cookies.token
 *   - If no token -> return 401 Unauthorized
 * 
 * Step 2: Verify JWT token
 *   try {
 *     const decoded = jwt.verify(token, process.env.JWT_SECRET)
 *     // decoded = { userId: 'xxx', email: 'xxx@hcmut.edu.vn', role: 'STUDENT' }
 *   } catch (err) {
 *     - If err.name === 'TokenExpiredError' -> return 401 "Token expired"
 *     - If err.name === 'JsonWebTokenError' -> return 401 "Invalid token"
 *   }
 * 
 * Step 3: Retrieve user from database
 *   const user = await User.findById(decoded.userId)
 *     .populate('student')
 *     .populate('tutor')
 *   - If !user -> return 401 "User not found"
 *   - If user.status === 'INACTIVE' -> return 403 "Account deactivated"
 * 
 * Step 4: Attach user to request object
 *   req.user = user
 *   req.userId = user._id
 *   req.userRole = user.role
 * 
 * Step 5: Call next middleware
 *   next()
 * 
 * OUTPUT:
 * - req.user = { _id, email, role, student, tutor, ... }
 * - req.userId = ObjectId
 * - req.userRole = 'STUDENT' | 'TUTOR' | 'ADMIN'
 */

// ============================================================
// MIDDLEWARE: optionalAuth (optional authentication)
// ============================================================
// PURPOSE: Xác thực JWT nếu có token, nhưng không bắt buộc
// USE CASE: Public endpoints that show additional info if logged in
// 
// PSEUDOCODE:
// Step 1: Try to extract token
// Step 2: If token exists -> verify and attach user
// Step 3: If no token or invalid -> continue without user (don't throw error)
// Step 4: Call next()

const authMiddleware = async (req, res, next) => {
  try {
    // Step 1: Extract token from Authorization header
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please provide a valid token.'
      });
    }

    // Step 2: Verify JWT token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Token has expired. Please login again.'
        });
      }
      return res.status(401).json({
        success: false,
        message: 'Invalid token. Please login again.'
      });
    }

    // Step 3: Retrieve user from database
    const user = await User.findById(decoded.userId)
      .populate('student')
      .populate('tutor');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found. Token is invalid.'
      });
    }

    if (user.status !== 'ACTIVE') {
      return res.status(403).json({
        success: false,
        message: 'Account is not active. Please contact support.'
      });
    }

    // Step 4: Attach user to request
    req.user = user;
    req.userId = user._id;
    req.userRole = user.role;

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Authentication error',
      error: error.message
    });
  }
};

/**
 * Optional Authentication Middleware
 * Attach user if token exists, but don't require it
 */
const optionalAuth = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);
        if (user && user.status === 'ACTIVE') {
          req.user = user;
          req.userId = user._id;
          req.userRole = user.role;
        }
      } catch (err) {
        // Token invalid, continue without user
      }
    }
    next();
  } catch (error) {
    next();
  }
};

export { authMiddleware, optionalAuth };
