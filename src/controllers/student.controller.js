/**
 * CONTROLLER: StudentController
 * FILE: student.controller.js
 * MỤC ĐÍCH: Xử lý HTTP requests liên quan đến Student profile (UC-06)
 * 
 * USE CASES:
 * - UC-06: Student views own profile
 * - UC-28: Student views own appointment history
 * - UC-29: Student views own feedback history
 * 
 * DEPENDENCIES:
 * - StudentService: Handle student-related queries
 * - NotFoundError
 */

// ============================================================
// FUNCTION: getMyProfile()
// ============================================================
// METHOD: GET /api/v1/students/me
// PURPOSE: Student xem thông tin cá nhân (UC-06)
// 
// REQUEST:
// - Headers: { Authorization: 'Bearer <JWT>' }
// Role: STUDENT only
// 
// PROCESS:
// 1. Extract studentId from JWT (req.user.userId)
// 2. Query Student model (populate userId → User info)
// 3. Return profile with statistics
// 
// RESPONSE:
// {
//   "success": true,
//   "data": {
//     "studentId": "...",
//     "user": {
//       "email": "student@hcmut.edu.vn",
//       "fullName": "Nguyen Van A",
//       "faculty": "Computer Science"
//     },
//     "mssv": "2210001",
//     "major": "Computer Science",
//     "enrollmentYear": 2022,
//     "currentYear": 2,
//     "gpa": 3.5,
//     "totalCredits": 60,
//     "statistics": {
//       "registeredTutors": 5,
//       "totalSessionsAttended": 20,
//       "totalAppointments": 25,
//       "completedAppointments": 20,
//       "cancelledAppointments": 5,
//       "averageRatingGiven": 4.5
//     }
//   }
// }

// ============================================================
// FUNCTION: getMyAppointments()
// ============================================================
// METHOD: GET /api/v1/students/me/appointments
// PURPOSE: Student xem lịch sử appointments (UC-28)
// 
// REQUEST:
// - Query: { status?: 'PENDING' | 'CONFIRMED' | 'COMPLETED', page?: 1, limit?: 20 }
// - Headers: { Authorization: 'Bearer <JWT>' }
// 
// PROCESS:
// 1. Extract studentId from JWT
// 2. Query Appointment model (filter by status if provided)
// 3. Populate sessionId → TutorSession info
// 4. Return with pagination
// 
// RESPONSE:
// {
//   "success": true,
//   "data": [
//     {
//       "appointmentId": "...",
//       "session": {
//         "sessionId": "...",
//         "title": "Math 101 - Derivatives",
//         "startTime": "2025-01-20T09:00:00Z",
//         "tutor": {
//           "fullName": "Prof. A"
//         }
//       },
//       "status": "CONFIRMED",
//       "bookedAt": "2025-01-15T10:00:00Z"
//     }
//   ],
//   "pagination": {...}
// }

// ============================================================
// FUNCTION: getMyFeedbacks()
// ============================================================
// METHOD: GET /api/v1/students/me/feedbacks
// PURPOSE: Student xem lịch sử evaluations đã cho (UC-29)
// 
// REQUEST:
// - Query: { page?: 1, limit?: 20 }
// - Headers: { Authorization: 'Bearer <JWT>' }
// 
// PROCESS:
// 1. Extract studentId from JWT
// 2. Query StudentFeedback model
// 3. Populate tutorId, sessionId
// 4. Return with pagination
// 
// RESPONSE:
// {
//   "success": true,
//   "data": [
//     {
//       "feedbackId": "...",
//       "tutor": {
//         "fullName": "Prof. A"
//       },
//       "session": {
//         "title": "Math 101"
//       },
//       "rating": 5,
//       "comment": "Very helpful!",
//       "evaluatedAt": "2025-01-20T12:00:00Z"
//     }
//   ],
//   "pagination": {...}
// }

import * as StudentService from '../services/user/StudentService.js';
import StudentRepository from '../repositories/StudentRepository.js';
import { asyncHandler, ValidationError } from '../middleware/errorMiddleware.js';

class StudentController {
  /**
   * GET /api/v1/students/me
   * Student views own profile (UC-06)
   */
  getMyProfile = asyncHandler(async (req, res) => {
    // Get userId from authenticated user
    const userId = req.userId;
    
    // Find student by userId
    const student = await StudentRepository.findByUserId(userId);
    
    if (!student) {
      throw new ValidationError('User is not a student');
    }

    // Get full profile
    const profile = await StudentService.getStudentProfile(student._id);

    res.status(200).json({
      success: true,
      data: profile
    });
  });

  /**
   * GET /api/v1/students/me/feedbacks
   * Get my feedback history (UC-29)
   */
  getMyFeedbacks = asyncHandler(async (req, res) => {
    const userId = req.userId;
    
    // Find student profile
    const Student = (await import('../models/Student.model.js')).default;
    const student = await Student.findOne({ userId }).lean();
    
    if (!student) {
      const { NotFoundError } = await import('../middleware/errorMiddleware.js');
      throw new NotFoundError('Student profile not found');
    }
    
    // Query feedbacks with pagination
    const StudentFeedback = (await import('../models/StudentFeedback.model.js')).default;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const filter = { studentId: student._id };
    
    // Filter by rating if provided
    if (req.query.rating) {
      filter.rating = parseInt(req.query.rating);
    }
    
    const [feedbacks, total] = await Promise.all([
      StudentFeedback.find(filter)
        .populate('tutorId', 'userId subjects rating totalSessions')
        .populate({
          path: 'tutorId',
          populate: {
            path: 'userId',
            select: 'fullName email'
          }
        })
        .populate('sessionId', 'title subject startTime endTime status')
        .sort({ evaluatedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      StudentFeedback.countDocuments(filter)
    ]);
    
    res.status(200).json({
      success: true,
      data: feedbacks,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  });

  /**
   * POST /api/v1/students/sessions/book
   * Book a session (UC-STUDENT-BOOK)
   * 
   * BUSINESS RULES:
   * - BR-BOOK-001: Must be registered with tutor
   * - BR-BOOK-002: Check tutor availability
   * - BR-BOOK-004: No duplicate bookings
   */
  bookSession = asyncHandler(async (req, res) => {
    const userId = req.userId;
    const { sessionId } = req.body;

    if (!sessionId) {
      const { ValidationError } = await import('../middleware/errorMiddleware.js');
      throw new ValidationError('sessionId is required');
    }

    // Find student profile
    const Student = (await import('../models/Student.model.js')).default;
    const student = await Student.findOne({ userId });
    
    if (!student) {
      const { NotFoundError } = await import('../middleware/errorMiddleware.js');
      throw new NotFoundError('Student profile not found');
    }

    // Call service
    const StudentSessionService = (await import('../services/session/StudentSessionService.js')).default;
    const session = await StudentSessionService.bookSession(student._id, sessionId);

    res.status(201).json({
      success: true,
      message: 'Đặt lịch session thành công',
      data: {
        sessionId: session._id,
        title: session.title,
        subjectId: session.subjectId,
        startTime: session.startTime,
        endTime: session.endTime,
        location: session.location,
        sessionType: session.sessionType,
        status: session.status,
        tutor: session.tutorId,
        bookedAt: new Date()
      }
    });
  });

  /**
   * GET /api/v1/students/me/sessions
   * Get my booked sessions (UC-STUDENT-LIST)
   */
  getMySessions = asyncHandler(async (req, res) => {
    const userId = req.userId;
    
    // Find student profile
    const Student = (await import('../models/Student.model.js')).default;
    const student = await Student.findOne({ userId });
    
    if (!student) {
      const { NotFoundError } = await import('../middleware/errorMiddleware.js');
      throw new NotFoundError('Student profile not found');
    }

    // Get query options
    const options = {
      status: req.query.status,
      page: req.query.page,
      limit: req.query.limit
    };

    // Call service
    const StudentSessionService = (await import('../services/session/StudentSessionService.js')).default;
    const result = await StudentSessionService.getStudentSessions(student._id, options);

    res.status(200).json({
      success: true,
      data: result.sessions,
      pagination: result.pagination
    });
  });

  /**
   * GET /api/v1/students/tutors/:tutorId/sessions
   * Get all sessions created by a specific tutor
   */
  getTutorSessions = asyncHandler(async (req, res) => {
    const { tutorId } = req.params;

    if (!tutorId) {
      const { ValidationError } = await import('../middleware/errorMiddleware.js');
      throw new ValidationError('tutorId is required');
    }

    // Get query options
    const options = {
      status: req.query.status,
      subjectId: req.query.subjectId,
      startDate: req.query.startDate,
      endDate: req.query.endDate,
      page: req.query.page,
      limit: req.query.limit
    };

    // Call service
    const StudentSessionService = (await import('../services/session/StudentSessionService.js')).default;
    const result = await StudentSessionService.getTutorSessions(tutorId, options);

    res.status(200).json({
      success: true,
      data: result.sessions,
      pagination: result.pagination,
      tutor: result.tutor
    });
  });

  /**
   * DELETE /api/v1/students/sessions/:id/book
   * Cancel session booking (UC-STUDENT-CANCEL)
   */
  cancelBooking = asyncHandler(async (req, res) => {
    const userId = req.userId;
    const { id: sessionId } = req.params;

    // Find student profile
    const Student = (await import('../models/Student.model.js')).default;
    const student = await Student.findOne({ userId });
    
    if (!student) {
      const { NotFoundError } = await import('../middleware/errorMiddleware.js');
      throw new NotFoundError('Student profile not found');
    }

    // Call service
    const StudentSessionService = (await import('../services/session/StudentSessionService.js')).default;
    const result = await StudentSessionService.cancelBooking(student._id, sessionId);

    res.status(200).json(result);
  });
}

export default new StudentController();
