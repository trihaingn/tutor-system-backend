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

import * as CourseRegistrationService from '../services/registration/CourseRegistrationService.js';
import StudentRepository from '../repositories/StudentRepository.js';
import { asyncHandler, ValidationError } from '../middleware/errorMiddleware.js';

class RegistrationController {
  /**
   * POST /api/v1/registrations
   * Student registers with Tutor for a subject (UC-08)
   */
  registerCourse = asyncHandler(async (req, res) => {
    const { tutorId, subjectId } = req.body;
    
    // Validation
    if (!tutorId || !subjectId) {
      throw new ValidationError('tutorId and subjectId are required');
    }

    // Get studentId from authenticated user
    const userId = req.userId;
    const student = await StudentRepository.findByUserId(userId);
    
    if (!student) {
      throw new ValidationError('User is not a student');
    }

    // Call service to register course
    const registration = await CourseRegistrationService.registerStudentWithTutor(
      student._id,
      tutorId,
      subjectId
    );

    res.status(201).json({
      success: true,
      data: {
        registrationId: registration._id,
        studentId: registration.studentId,
        tutorId: registration.tutorId,
        subjectId: registration.subjectId,
        status: registration.status,
        registeredAt: registration.registeredAt,
        message: 'Registration successful! You can now book appointments.'
      }
    });
  });

  /**
   * GET /api/v1/registrations/me
   * Student views own registrations
   */
  getMyRegistrations = asyncHandler(async (req, res) => {
    const { status, subjectId } = req.query;
    
    // Get studentId from authenticated user
    const userId = req.userId;
    const student = await StudentRepository.findByUserId(userId);
    
    if (!student) {
      throw new ValidationError('User is not a student');
    }

    const filters = {};
    if (status) filters.status = status;
    if (subjectId) filters.subjectId = subjectId;

    const registrations = await CourseRegistrationService.getStudentRegistrations(
      student._id,
      filters
    );

    res.status(200).json({
      success: true,
      data: registrations
    });
  });

  /**
   * DELETE /api/v1/registrations/:id
   * Student cancels registration
   */
  cancelRegistration = asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    // Get studentId from authenticated user
    const userId = req.userId;
    const student = await StudentRepository.findByUserId(userId);
    
    if (!student) {
      throw new ValidationError('User is not a student');
    }

    const result = await CourseRegistrationService.cancelRegistration(id, student._id);

    res.status(200).json({
      success: true,
      message: 'Registration cancelled successfully',
      data: result.registration
    });
  });
}

export default new RegistrationController();
