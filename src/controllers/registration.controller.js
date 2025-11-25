/**
 * CONTROLLER: RegistrationController
 * FILE: registration.controller.js
 * MỤC ĐÍCH: Xử lý HTTP requests liên quan đến Course Registration (UC-08)
 * 
 * USE CASES:
 * - UC-08: Student registers with Tutor for a subject
 * 
 * DEPENDENCIES:
 * - CourseRegistrationService: Handle registration logic
 * - ValidationError, ConflictError, NotFoundError
 */

// ============================================================
// FUNCTION: registerCourse()
// ============================================================
// METHOD: POST /api/v1/registrations
// PURPOSE: Student đăng ký môn học với Tutor (UC-08)
// 
// REQUEST:
// {
//   "tutorId": "ObjectId",
//   "subjectId": "Math_101"
// }
// Headers: { Authorization: 'Bearer <JWT>' }
// 
// VALIDATION:
// - tutorId required, must be valid ObjectId
// - subjectId required, must be non-empty string
// - User role must be STUDENT (via authMiddleware + roleMiddleware)
// 
// PROCESS:
// 1. Extract studentId from JWT (req.user.userId)
// 2. Call CourseRegistrationService.registerCourse(studentId, tutorId, subjectId)
//    ⚠️ Service will:
//    - Check if Tutor exists and active
//    - Check duplicate registration (BR-006)
//    - INSTANT APPROVAL: status = 'ACTIVE' (BR-005)
//    - Trigger notification to Tutor (BR-008)
// 3. Return success response with registration data
// 
// RESPONSE:
// {
//   "success": true,
//   "data": {
//     "registrationId": "...",
//     "studentId": "...",
//     "tutorId": "...",
//     "subjectId": "Math_101",
//     "status": "ACTIVE",
//     "registeredAt": "2025-01-15T10:00:00Z",
//     "message": "Registration successful! You can now book appointments."
//   }
// }
// 
// ERROR HANDLING:
// - Tutor not found → 404 NotFoundError
// - Duplicate registration → 409 ConflictError ("Already registered")
// - Invalid input → 400 ValidationError

// ============================================================
// FUNCTION: getMyRegistrations()
// ============================================================
// METHOD: GET /api/v1/registrations/me
// PURPOSE: Student xem danh sách registrations của mình
// 
// REQUEST:
// - Query params: { status?: 'ACTIVE' | 'CANCELLED' }
// - Headers: { Authorization: 'Bearer <JWT>' }
// 
// PROCESS:
// 1. Extract studentId from JWT
// 2. Query CourseRegistration model (filter by status if provided)
// 3. Populate tutorId → Tutor info (fullName, expertise)
// 4. Return list with pagination
// 
// RESPONSE:
// {
//   "success": true,
//   "data": [
//     {
//       "registrationId": "...",
//       "tutor": {
//         "tutorId": "...",
//         "fullName": "Prof. Nguyen Van A",
//         "expertise": ["Math_101", "Math_201"]
//       },
//       "subjectId": "Math_101",
//       "status": "ACTIVE",
//       "registeredAt": "2025-01-15T10:00:00Z"
//     }
//   ],
//   "pagination": {...}
// }

// ============================================================
// FUNCTION: cancelRegistration()
// ============================================================
// METHOD: DELETE /api/v1/registrations/:id
// PURPOSE: Student hủy registration (cancel)
// 
// REQUEST:
// - Params: { id: registrationId }
// - Headers: { Authorization: 'Bearer <JWT>' }
// 
// PROCESS:
// 1. Extract studentId from JWT
// 2. Find registration by id
// 3. ⚠️ Validate ownership: registration.studentId === studentId
// 4. Update status to 'CANCELLED'
// 5. Return success response
// 
// RESPONSE:
// {
//   "success": true,
//   "message": "Registration cancelled successfully"
// }
// 
// ERROR HANDLING:
// - Registration not found → 404 NotFoundError
// - Not owned by user → 403 ForbiddenError

// TODO: Import dependencies (CourseRegistrationService, error classes)

// TODO: Implement registerCourse() - POST /api/v1/registrations
// - Extract studentId from req.user
// - Validate input
// - Call service layer
// - Return response

// TODO: Implement getMyRegistrations() - GET /api/v1/registrations/me
// - Extract studentId
// - Query with optional status filter
// - Populate tutor info
// - Return with pagination

// TODO: Implement cancelRegistration() - DELETE /api/v1/registrations/:id
// - Validate ownership
// - Update status to CANCELLED

// TODO: Export controller functions
