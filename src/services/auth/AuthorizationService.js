/**
 * SERVICE: AuthorizationService
 * FILE: AuthorizationService.js
 * MỤC ĐÍCH: Handle role-based access control (RBAC)
 * 
 * DEPENDENCIES:
 * - ForbiddenError: Throw when access denied
 */

// ============================================================
// FUNCTION: checkRole(userRole, allowedRoles)
// ============================================================
// PURPOSE: Kiểm tra user có role được phép hay không
// 
// INPUT:
// - userRole: String (STUDENT, TUTOR, ADMIN)
// - allowedRoles: Array of String (e.g., ['TUTOR', 'ADMIN'])
// 
// PROCESS:
// 1. Check if userRole exists in allowedRoles array
// 2. If yes → Return true
// 3. If no → Return false
// 
// OUTPUT:
// - true: User has permission
// - false: User does not have permission
// 
// USAGE:
// if (!checkRole(user.role, ['TUTOR', 'ADMIN'])) {
//   throw new ForbiddenError('Access denied');
// }

// ============================================================
// FUNCTION: isTutor(userRole)
// ============================================================
// PURPOSE: Kiểm tra user có phải Tutor không
// 
// INPUT:
// - userRole: String
// 
// OUTPUT:
// - true: userRole === 'TUTOR' || userRole === 'ADMIN'
// - false: otherwise
// 
// NOTE: ADMIN cũng có quyền như TUTOR

// ============================================================
// FUNCTION: isStudent(userRole)
// ============================================================
// PURPOSE: Kiểm tra user có phải Student không
// 
// INPUT:
// - userRole: String
// 
// OUTPUT:
// - true: userRole === 'STUDENT'
// - false: otherwise

// ============================================================
// FUNCTION: isAdmin(userRole)
// ============================================================
// PURPOSE: Kiểm tra user có phải Admin không
// 
// INPUT:
// - userRole: String
// 
// OUTPUT:
// - true: userRole === 'ADMIN'
// - false: otherwise

// ============================================================
// FUNCTION: checkOwnership(userId, resourceOwnerId)
// ============================================================
// PURPOSE: Kiểm tra user có phải owner của resource không
// 
// INPUT:
// - userId: ObjectId (from JWT)
// - resourceOwnerId: ObjectId (from resource, e.g., session.tutorId)
// 
// PROCESS:
// 1. Compare userId với resourceOwnerId (convert to string if needed)
// 2. Return true if match, false otherwise
// 
// OUTPUT:
// - true: User owns resource
// - false: User does not own resource
// 
// USAGE:
// if (!checkOwnership(req.user.userId, session.tutorId)) {
//   throw new ForbiddenError('You do not own this resource');
// }

// ============================================================
// FUNCTION: canAccessSession(user, session)
// ============================================================
// PURPOSE: Kiểm tra user có quyền access session không
// 
// INPUT:
// - user: Object { userId, role }
// - session: Object (ConsultationSession)
// 
// PROCESS:
// 1. If role === ADMIN → Return true
// 2. If role === TUTOR → Check session.tutorId === userId
// 3. If role === STUDENT → Check Appointment exists (studentId === userId, sessionId === session._id)
// 4. Otherwise → Return false
// 
// OUTPUT:
// - true: User can access session
// - false: User cannot access session

// ============================================================
// FUNCTION: canModifySession(user, session)
// ============================================================
// PURPOSE: Kiểm tra user có quyền modify session không
// 
// INPUT:
// - user: Object { userId, role }
// - session: Object (ConsultationSession)
// 
// PROCESS:
// 1. If role === ADMIN → Return true
// 2. If role === TUTOR → Check session.tutorId === userId
// 3. Otherwise → Return false (Students cannot modify sessions)
// 
// OUTPUT:
// - true: User can modify session
// - false: User cannot modify session

// TODO: Import dependencies (ForbiddenError)

// TODO: Implement checkRole(userRole, allowedRoles)
// - Check if userRole in allowedRoles array

// TODO: Implement isTutor(userRole)
// - Return true if TUTOR or ADMIN

// TODO: Implement isStudent(userRole)
// - Return true if STUDENT

// TODO: Implement isAdmin(userRole)
// - Return true if ADMIN

// TODO: Implement checkOwnership(userId, resourceOwnerId)
// - Compare userId with resourceOwnerId

// TODO: Implement canAccessSession(user, session)
// - ADMIN: always true
// - TUTOR: check ownership
// - STUDENT: check appointment exists

// TODO: Implement canModifySession(user, session)
// - Only ADMIN or session owner (TUTOR)

// TODO: Export all functions
