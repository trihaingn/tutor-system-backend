/**
 * MIDDLEWARE: CAS Authentication Middleware
 * FILE: casAuthMiddleware.js
 * PURPOSE: Protect routes by checking JWT token or redirecting to CAS login
 * 
 * USAGE:
 * - Apply to routes that require authentication
 * - If user has valid JWT → allow access
 * - If user has no JWT → redirect to CAS login
 * 
 * FLOW:
 * 1. Check for JWT token in cookie or Authorization header
 * 2. If token exists → verify and attach user to request
 * 3. If no token → redirect to CAS login
 * 4. If token invalid/expired → redirect to CAS login
 */

import jwt from 'jsonwebtoken';
import CASService from '../services/auth/CASService.js';
import casConfig from '../config/cas.config.js';
import { logger } from '../utils/logger.js';

/**
 * Middleware: Require CAS Authentication
 * 
 * Checks if user has valid JWT session
 * If not authenticated → redirects to CAS login
 * 
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {Function} next - Express next middleware function
 */
async function requireCASAuthentication(req, res, next) {
  try {
    // Step 1: Extract JWT token from cookie or Authorization header
    let token;
    
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // Step 2: If no token found, redirect to CAS login
    if (!token) {
      logger.info('No JWT token found, redirecting to CAS login');
      return redirectToCASLogin(req, res);
    }

    // Step 3: Verify JWT token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      logger.warn(`Invalid or expired JWT token: ${err.message}`);
      
      // Token expired or invalid → redirect to CAS login
      return redirectToCASLogin(req, res);
    }

    // Step 4: Attach user info to request
    req.userId = decoded.userId;
    req.userEmail = decoded.email;
    req.userRole = decoded.role;

    // Step 5: (Optional) Load full user from database
    const { default: User } = await import('../models/User.model.js');
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      logger.warn(`User not found for ID: ${decoded.userId}`);
      return redirectToCASLogin(req, res);
    }

    if (user.status !== 'ACTIVE') {
      return res.status(403).json({
        success: false,
        message: 'Account is not active'
      });
    }

    // Attach full user object to request
    req.user = user;

    // Step 6: Continue to next middleware
    next();

  } catch (error) {
    logger.error(`CAS authentication middleware error: ${error.message}`);
    
    return res.status(500).json({
      success: false,
      message: 'Authentication error',
      error: error.message
    });
  }
}

/**
 * Helper function: Redirect to CAS login
 * 
 * Generates CAS login URL and redirects user
 * Preserves original request URL for post-login redirect
 * 
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
function redirectToCASLogin(req, res) {
  // Check if CAS is enabled
  if (!CASService.isEnabled()) {
    return res.status(503).json({
      success: false,
      message: 'CAS authentication is not enabled. Please provide a valid JWT token.'
    });
  }

  // Build the service callback URL
  const serviceUrl = casConfig.serviceUrl || `${req.protocol}://${req.get('host')}/api/v1/auth/cas/callback`;
  
  // Generate CAS login URL
  const loginUrl = CASService.generateLoginUrl(serviceUrl);

  // For API requests (Accept: application/json), return 401 with login URL
  if (req.accepts('json') && !req.accepts('html')) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required',
      loginUrl: loginUrl
    });
  }

  // For browser requests, redirect to CAS login
  res.redirect(loginUrl);
}

/**
 * Middleware: Optional CAS Authentication
 * 
 * Checks for JWT token but doesn't require it
 * Useful for public endpoints that show additional info when logged in
 * 
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {Function} next - Express next middleware function
 */
async function optionalCASAuthentication(req, res, next) {
  try {
    // Extract JWT token
    let token;
    
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // If no token, just continue without user info
    if (!token) {
      return next();
    }

    // Try to verify token
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      req.userId = decoded.userId;
      req.userEmail = decoded.email;
      req.userRole = decoded.role;

      // Load user from database
      const { default: User } = await import('../models/User.model.js');
      const user = await User.findById(decoded.userId).select('-password');
      
      if (user && user.status === 'ACTIVE') {
        req.user = user;
      }
    } catch (err) {
      // Token invalid, just continue without user info
      logger.debug(`Optional auth: Invalid token - ${err.message}`);
    }

    next();

  } catch (error) {
    // Don't fail the request, just continue without user info
    logger.error(`Optional CAS authentication error: ${error.message}`);
    next();
  }
}

export {
  requireCASAuthentication,
  optionalCASAuthentication
};
