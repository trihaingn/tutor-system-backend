/**
 * MIDDLEWARE: Role-Based Access Control (RBAC) Middleware
 * FILE: roleMiddleware.js
 * MỤC ĐÍCH: Kiểm tra role của user cho phép truy cập endpoint
 * 
 * DEPENDENCIES:
 * - Constants (ROLES, ERROR_MESSAGES)
 * 
 * USAGE:
 * router.post('/sessions', authMiddleware, roleMiddleware(['TUTOR', 'ADMIN']), controller)
 */

// TODO: Import constants
// const { ROLES, ERROR_MESSAGES, HTTP_STATUS } = require('../constants')

// ============================================================
// MIDDLEWARE: roleMiddleware(allowedRoles)
// ============================================================
// PURPOSE: Kiểm tra user có role phù hợp không
// 
// INPUT:
// - allowedRoles: Array of roles ['STUDENT', 'TUTOR', 'ADMIN']
// - req.user (from authMiddleware)
// - req.userRole (from authMiddleware)
// 
// PSEUDOCODE:
// Step 1: Check if authMiddleware has run
//   - If !req.user or !req.userRole -> return 401 "Authentication required"
//   - Note: roleMiddleware MUST come after authMiddleware
// 
// Step 2: Check if user's role is in allowedRoles
//   - If allowedRoles.includes(req.userRole) -> next()
//   - Else -> return 403 Forbidden
// 
// Step 3: (Optional) Check additional conditions
//   - If role === 'TUTOR' -> Check tutor.isAcceptingStudents?
//   - If role === 'STUDENT' -> Check student.status === 'ACTIVE'?
// 
// OUTPUT:
// - Continue to next middleware or controller
// - Or throw 403 Forbidden error

// ============================================================
// HELPER MIDDLEWARES
// ============================================================
// PURPOSE: Shorthand middlewares for common role checks

// MIDDLEWARE: isStudent
// PSEUDOCODE:
// const isStudent = roleMiddleware([ROLES.STUDENT])

// MIDDLEWARE: isTutor
// PSEUDOCODE:
// const isTutor = roleMiddleware([ROLES.TUTOR, ROLES.ADMIN])

// MIDDLEWARE: isAdmin
// PSEUDOCODE:
// const isAdmin = roleMiddleware([ROLES.ADMIN])

// MIDDLEWARE: isStudentOrTutor
// PSEUDOCODE:
// const isStudentOrTutor = roleMiddleware([ROLES.STUDENT, ROLES.TUTOR])

// ============================================================
// IMPLEMENTATION PATTERN
// ============================================================
// PURPOSE: Factory pattern to create middleware with allowed roles
// 
// PSEUDOCODE:
// const roleMiddleware = (allowedRoles) => {
//   return async (req, res, next) => {
//     // Validate authentication
//     if (!req.user || !req.userRole) {
//       return res.status(401).json({
//         success: false,
//         message: ERROR_MESSAGES.AUTH.AUTHENTICATION_REQUIRED
//       })
//     }
//     
//     // Check role
//     if (!allowedRoles.includes(req.userRole)) {
//       return res.status(403).json({
//         success: false,
//         message: ERROR_MESSAGES.AUTH.INSUFFICIENT_PERMISSIONS,
//         required: allowedRoles,
//         current: req.userRole
//       })
//     }
//     
//     next()
//   }
// }

// TODO: Implement roleMiddleware factory
// TODO: Export roleMiddleware and helper functions
// module.exports = {
//   roleMiddleware,
//   isStudent,
//   isTutor,
//   isAdmin,
//   isStudentOrTutor
// }
