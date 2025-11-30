/**
 * CONTROLLER: TutorController
 * FILE: tutor.controller.js
 * MỤC ĐÍCH: Xử lý HTTP requests liên quan đến Tutor profile và search (UC-07, UC-20)
 * 
 * USE CASES:
 * - UC-07: Student searches for Tutors by subject
 * - UC-20: Tutor views own profile
 * - UC-21: Tutor views own sessions
 * - UC-22: Tutor views evaluations received
 * 
 * DEPENDENCIES:
 * - TutorService: Handle tutor-related queries
 * - NotFoundError
 */

// ============================================================
// FUNCTION: searchTutors()
// ============================================================
// METHOD: GET /api/v1/tutors/search
// PURPOSE: Student tìm kiếm Tutors theo môn học (UC-07)
// 
// REQUEST:
// - Query: {
//     subjectId?: 'Math_101',
//     type?: 'LECTURER' | 'RESEARCH_STUDENT' | 'SENIOR_STUDENT',
//     minRating?: 4.0,
//     isAcceptingStudents?: true,
//     page?: 1,
//     limit?: 20
//   }
// - Headers: { Authorization: 'Bearer <JWT>' }
// 
// PROCESS:
// 1. Query Tutor model với các filters:
//    - expertise.subjectId match (if subjectId provided)
//    - type match (if type provided)
//    - averageRating >= minRating (if minRating provided)
//    - isAcceptingStudents = true (if specified)
// 2. Populate userId → User info (fullName, email, faculty)
// 3. Sort by averageRating DESC
// 4. Return with pagination
// 
// RESPONSE:
// {
//   "success": true,
//   "data": [
//     {
//       "tutorId": "...",
//       "user": {
//         "fullName": "Prof. Nguyen Van A",
//         "email": "prof.a@hcmut.edu.vn",
//         "faculty": "Computer Science"
//       },
//       "maCB": "CB001",
//       "type": "LECTURER",
//       "expertise": [
//         {
//           "subjectId": "Math_101",
//           "subjectName": "Calculus I",
//           "yearsOfExperience": 10
//         }
//       ],
//       "averageRating": 4.8,
//       "totalReviews": 50,
//       "totalStudents": 120,
//       "isAcceptingStudents": true
//     }
//   ],
//   "pagination": {...}
// }

// ============================================================
// FUNCTION: getTutorDetails()
// ============================================================
// METHOD: GET /api/v1/tutors/:id
// PURPOSE: Xem chi tiết Tutor profile (public view)
// 
// REQUEST:
// - Params: { id: tutorId }
// - Headers: { Authorization: 'Bearer <JWT>' }
// 
// PROCESS:
// 1. Query Tutor model by id
// 2. Populate userId → User info
// 3. Return full profile with statistics
// 
// RESPONSE:
// {
//   "success": true,
//   "data": {
//     "tutorId": "...",
//     "user": {...},
//     "expertise": [...],
//     "bio": "Experienced in teaching Calculus...",
//     "statistics": {
//       "totalStudents": 120,
//       "totalSessions": 200,
//       "completedSessions": 180,
//       "averageRating": 4.8,
//       "totalReviews": 50
//     }
//   }
// }
// 
// ERROR HANDLING:
// - Tutor not found → 404 NotFoundError

// ============================================================
// FUNCTION: getMyProfile()
// ============================================================
// METHOD: GET /api/v1/tutors/me
// PURPOSE: Tutor xem own profile (UC-20)
// 
// REQUEST:
// - Headers: { Authorization: 'Bearer <JWT>' }
// Role: TUTOR or ADMIN only
// 
// PROCESS:
// 1. Extract tutorId from JWT
// 2. Query Tutor model (populate userId)
// 3. Return full profile with statistics
// 
// RESPONSE:
// {
//   "success": true,
//   "data": {
//     "tutorId": "...",
//     "user": {...},
//     "expertise": [...],
//     "statistics": {...},
//     "isAcceptingStudents": true
//   }
// }

// ============================================================
// FUNCTION: getMySessions()
// ============================================================
// METHOD: GET /api/v1/tutors/me/sessions
// PURPOSE: Tutor xem own sessions (UC-21)
// 
// REQUEST:
// - Query: { status?: 'SCHEDULED' | 'COMPLETED', startDate?, endDate?, page?, limit? }
// - Headers: { Authorization: 'Bearer <JWT>' }
// 
// PROCESS:
// 1. Extract tutorId from JWT
// 2. Query TutorSession model (filter by status, date range)
// 3. Return with pagination
// 
// RESPONSE:
// {
//   "success": true,
//   "data": [
//     {
//       "sessionId": "...",
//       "title": "Math 101 - Derivatives",
//       "startTime": "2025-01-20T09:00:00Z",
//       "status": "SCHEDULED",
//       "currentParticipants": 5,
//       "maxParticipants": 10
//     }
//   ],
//   "pagination": {...}
// }

// ============================================================
// FUNCTION: getMyFeedbacks()
// ============================================================
// METHOD: GET /api/v1/tutors/me/feedbacks
// PURPOSE: Tutor xem evaluations received (UC-22)
// 
// REQUEST:
// - Query: { page?: 1, limit?: 20 }
// - Headers: { Authorization: 'Bearer <JWT>' }
// 
// PROCESS:
// 1. Extract tutorId from JWT
// 2. Query StudentFeedback model (tutorId match)
// 3. Populate studentId (if not anonymous), sessionId
// 4. Return with pagination
// 
// RESPONSE:
// {
//   "success": true,
//   "data": [
//     {
//       "feedbackId": "...",
//       "student": {
//         "fullName": "Nguyen Van A" // Hidden if isAnonymous=true
//       },
//       "session": {
//         "title": "Math 101"
//       },
//       "rating": 5,
//       "comment": "Very helpful!",
//       "evaluatedAt": "2025-01-20T12:00:00Z",
//       "isAnonymous": false
//     }
//   ],
//   "pagination": {...}
// }

import * as TutorService from '../services/user/TutorService.js';
import { asyncHandler } from '../middleware/errorMiddleware.js';

class TutorController {
  /**
   * GET /api/v1/tutors/search
   * Student searches for Tutors by subject (UC-07)
   */
  searchTutors = asyncHandler(async (req, res) => {
    const { subjectId, type, minRating, isAcceptingStudents, page, limit } = req.query;

    const searchCriteria = {
      subjectId,
      type,
      minRating: minRating ? parseFloat(minRating) : undefined,
      isAcceptingStudents: isAcceptingStudents !== undefined ? isAcceptingStudents === 'true' : undefined,
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 20
    };

    const result = await TutorService.searchTutors(searchCriteria);

    res.status(200).json({
      success: true,
      data: result.data,
      pagination: result.pagination
    });
  });

  /**
   * GET /api/v1/tutors/:id
   * Get Tutor details (public view)
   */
  getTutorDetails = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const tutor = await TutorService.getTutorDetails(id);

    res.status(200).json({
      success: true,
      data: tutor
    });
  });

  /**
   * GET /api/v1/tutors/by-hcmut-id/:hcmutId
   * Get Tutor by HCMUT ID (maCB/staff_id)
   */
  getTutorByHcmutId = asyncHandler(async (req, res) => {
    const { hcmutId } = req.params;
    const { NotFoundError } = await import('../middleware/errorMiddleware.js');

    // Find User by hcmutId
    const User = (await import('../models/User.model.js')).default;
    const user = await User.findOne({ hcmutId }).lean();

    if (!user) {
      throw new NotFoundError(`User with hcmutId '${hcmutId}' not found`);
    }

    // Find Tutor by userId
    const Tutor = (await import('../models/Tutor.model.js')).default;
    const tutor = await Tutor.findOne({ userId: user._id })
      .populate('userId', 'email fullName faculty hcmutId role status')
      .lean();

    if (!tutor) {
      throw new NotFoundError(`Tutor profile not found for user with hcmutId '${hcmutId}'`);
    }

    res.status(200).json({
      success: true,
      data: tutor
    });
  });

  /**
   * GET /api/v1/tutors/me
   * Tutor views own profile (UC-20)
   */
  getMyProfile = asyncHandler(async (req, res) => {
    const userId = req.userId;
    const { NotFoundError } = await import('../middleware/errorMiddleware.js');

    // Find tutor profile
    const Tutor = (await import('../models/Tutor.model.js')).default;
    const tutor = await Tutor.findOne({ userId })
      .populate('userId', 'email fullName faculty hcmutId role status')
      .lean();

    if (!tutor) {
      throw new NotFoundError('Tutor profile not found');
    }

    res.status(200).json({
      success: true,
      data: tutor
    });
  });

  /**
   * GET /api/v1/tutors/me/sessions
   * Tutor views own sessions (UC-21)
   */
  getMySessions = asyncHandler(async (req, res) => {
    const userId = req.userId;
    const { NotFoundError } = await import('../middleware/errorMiddleware.js');

    // Find tutor profile
    const Tutor = (await import('../models/Tutor.model.js')).default;
    const tutor = await Tutor.findOne({ userId }).lean();

    if (!tutor) {
      throw new NotFoundError('Tutor profile not found');
    }

    // Query sessions with pagination
    const TutorSession = (await import('../models/TutorSession.model.js')).default;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = { tutorId: tutor._id };

    // Filter by status if provided
    if (req.query.status) {
      filter.status = req.query.status;
    }

    const [sessions, total] = await Promise.all([
      TutorSession.find(filter)
        .populate('participants.studentId', 'userId')
        .sort({ startTime: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      TutorSession.countDocuments(filter)
    ]);

    res.status(200).json({
      success: true,
      data: sessions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  });

  /**
   * GET /api/v1/tutors/me/feedbacks
   * Tutor views feedbacks received (UC-22)
   */
  getMyFeedbacks = asyncHandler(async (req, res) => {
    const userId = req.userId;
    const { NotFoundError } = await import('../middleware/errorMiddleware.js');

    // Find tutor profile
    const Tutor = (await import('../models/Tutor.model.js')).default;
    const tutor = await Tutor.findOne({ userId }).lean();

    if (!tutor) {
      throw new NotFoundError('Tutor profile not found');
    }

    // Query feedbacks with pagination
    const StudentFeedback = (await import('../models/StudentFeedback.model.js')).default;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = { tutorId: tutor._id };

    // Filter by rating if provided
    if (req.query.rating) {
      filter.rating = parseInt(req.query.rating);
    }

    const [feedbacks, total] = await Promise.all([
      StudentFeedback.find(filter)
        .populate('studentId', 'userId')
        .populate({
          path: 'studentId',
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
   * GET /api/v1/tutors/:tutorId/availability
   * Get tutor availability schedule by MongoDB ObjectId
   */
  getTutorAvailability = asyncHandler(async (req, res) => {
    const { tutorId } = req.params;
    const { NotFoundError } = await import('../middleware/errorMiddleware.js');

    // Verify tutor exists
    const Tutor = (await import('../models/Tutor.model.js')).default;
    const tutor = await Tutor.findById(tutorId).lean();

    if (!tutor) {
      throw new NotFoundError('Tutor not found');
    }

    // Get availability schedule
    const Availability = (await import('../models/Availability.model.js')).default;
    const availability = await Availability.find({
      tutorId: tutorId,
      isActive: true
    })
      .sort({ dayOfWeek: 1, startTime: 1 })
      .lean();

    res.status(200).json({
      success: true,
      data: availability
    });
  });

  /**
   * GET /api/v1/tutors/by-hcmut-id/:hcmutId/availability
   * Get tutor availability by HCMUT ID
   */
  getTutorAvailabilityByHcmutId = asyncHandler(async (req, res) => {
    const { hcmutId } = req.params;
    const { NotFoundError } = await import('../middleware/errorMiddleware.js');

    // Find User by hcmutId
    const User = (await import('../models/User.model.js')).default;
    const user = await User.findOne({ hcmutId }).lean();

    if (!user) {
      throw new NotFoundError(`User with hcmutId '${hcmutId}' not found`);
    }

    // Find Tutor by userId
    const Tutor = (await import('../models/Tutor.model.js')).default;
    const tutor = await Tutor.findOne({ userId: user._id }).lean();

    if (!tutor) {
      throw new NotFoundError(`Tutor profile not found for user with hcmutId '${hcmutId}'`);
    }

    // Get availability schedule
    const Availability = (await import('../models/Availability.model.js')).default;
    const availability = await Availability.find({
      tutorId: tutor._id,
      isActive: true
    })
      .sort({ dayOfWeek: 1, startTime: 1 })
      .lean();

    res.status(200).json({
      success: true,
      data: availability
    });
  });
}

export default new TutorController();
