// REFACTORED: November 29, 2025 - Verified Architecture & Integration
// Role-Based Access Control (RBAC) implementation

import { AuthorizationError } from '../../utils/error.js';

/**
 * Kiểm tra user có role được phép hay không
 * @param {string} userRole - Current user role
 * @param {string[]} allowedRoles - List of allowed roles
 * @returns {boolean}
 */
function checkRole(userRole, allowedRoles) {
  return allowedRoles.includes(userRole);
}

/**
 * Kiểm tra user có phải Tutor không (TUTOR hoặc ADMIN)
 * @param {string} userRole
 * @returns {boolean}
 */
function isTutor(userRole) {
  return userRole === 'TUTOR' || userRole === 'ADMIN';
}

/**
 * Kiểm tra user có phải Student không
 * @param {string} userRole
 * @returns {boolean}
 */
function isStudent(userRole) {
  return userRole === 'STUDENT';
}

/**
 * Kiểm tra user có phải Admin không
 * @param {string} userRole
 * @returns {boolean}
 */
function isAdmin(userRole) {
  return userRole === 'ADMIN';
}

/**
 * Kiểm tra user có phải owner của resource không
 * @param {string} userId - User ID from JWT
 * @param {string} resourceOwnerId - Resource owner ID
 * @returns {boolean}
 */
function checkOwnership(userId, resourceOwnerId) {
  return userId.toString() === resourceOwnerId.toString();
}

/**
 * Kiểm tra user có quyền access session không
 * @param {Object} user - { userId, role }
 * @param {Object} session - TutorSession object
 * @returns {boolean}
 */
function canAccessSession(user, session) {
  // ADMIN: always true
  if (user.role === 'ADMIN') {
    return true;
  }

  // TUTOR: check ownership
  if (user.role === 'TUTOR') {
    return checkOwnership(user.userId, session.tutorId);
  }

  // STUDENT: Would need to check if appointment exists
  // For now, return false (implement in future with AppointmentRepository)
  if (user.role === 'STUDENT') {
    return false; // TODO: Check appointment exists
  }

  return false;
}

/**
 * Kiểm tra user có quyền modify session không
 * @param {Object} user - { userId, role }
 * @param {Object} session - TutorSession object
 * @returns {boolean}
 */
function canModifySession(user, session) {
  // ADMIN: always true
  if (user.role === 'ADMIN') {
    return true;
  }

  // TUTOR: check ownership
  if (user.role === 'TUTOR') {
    return checkOwnership(user.userId, session.tutorId);
  }

  // Students cannot modify sessions
  return false;
}

/**
 * Require specific role(s) - Throw error if not authorized
 * @param {string} userRole
 * @param {string[]} allowedRoles
 * @throws {AuthorizationError}
 */
function requireRole(userRole, allowedRoles) {
  if (!checkRole(userRole, allowedRoles)) {
    throw new AuthorizationError('Access denied: Insufficient permissions');
  }
}

/**
 * Require ownership - Throw error if not owner
 * @param {string} userId
 * @param {string} resourceOwnerId
 * @throws {AuthorizationError}
 */
function requireOwnership(userId, resourceOwnerId) {
  if (!checkOwnership(userId, resourceOwnerId)) {
    throw new AuthorizationError('Access denied: You do not own this resource');
  }
}

export {
  checkRole,
  isTutor,
  isStudent,
  isAdmin,
  checkOwnership,
  canAccessSession,
  canModifySession,
  requireRole,
  requireOwnership
};
