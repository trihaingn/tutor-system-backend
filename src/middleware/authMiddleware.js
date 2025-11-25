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

// TODO: Import jsonwebtoken, User model
// const jwt = require('jsonwebtoken')
// const User = require('../models/User')
// const { ERROR_MESSAGES, HTTP_STATUS } = require('../constants')

// ============================================================
// MIDDLEWARE: authMiddleware (protect routes)
// ============================================================
// PURPOSE: Xác thực JWT token từ request
// 
// INPUT:
// - req.headers.authorization: "Bearer <token>"
// - OR req.cookies.token: "<token>"
// 
// PSEUDOCODE:
// Step 1: Extract token from Authorization header or cookie
//   - Check req.headers.authorization.startsWith('Bearer ')
//   - Extract: token = authorization.split(' ')[1]
//   - If not found, check req.cookies.token
//   - If no token -> return 401 Unauthorized
// 
// Step 2: Verify JWT token
//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET)
//     // decoded = { userId: 'xxx', email: 'xxx@hcmut.edu.vn', role: 'STUDENT' }
//   } catch (err) {
//     - If err.name === 'TokenExpiredError' -> return 401 "Token expired"
//     - If err.name === 'JsonWebTokenError' -> return 401 "Invalid token"
//   }
// 
// Step 3: Retrieve user from database
//   const user = await User.findById(decoded.userId)
//     .populate('student')
//     .populate('tutor')
//   - If !user -> return 401 "User not found"
//   - If user.status === 'INACTIVE' -> return 403 "Account deactivated"
// 
// Step 4: Attach user to request object
//   req.user = user
//   req.userId = user._id
//   req.userRole = user.role
// 
// Step 5: Call next middleware
//   next()
// 
// OUTPUT:
// - req.user = { _id, email, role, student, tutor, ... }
// - req.userId = ObjectId
// - req.userRole = 'STUDENT' | 'TUTOR' | 'ADMIN'

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

// TODO: Implement authMiddleware function
// const authMiddleware = async (req, res, next) => { ... }

// TODO: Implement optionalAuth function
// const optionalAuth = async (req, res, next) => { ... }

// TODO: Export middleware
// module.exports = { authMiddleware, optionalAuth }
