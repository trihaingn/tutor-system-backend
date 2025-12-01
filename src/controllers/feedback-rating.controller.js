/**
 * CONTROLLER: Feedback Rating Controller
 * FILE: feedback-rating.controller.js
 * MỤC ĐÍCH: Xử lý HTTP requests liên quan đến Feedbacks (UC-26, UC-27)
 * 
 * USE CASES:
 * - UC-26: Student evaluates Tutor after session
 * - UC-27: Tutor evaluates Student after session
 * 
 * DEPENDENCIES:
 * - FeedbackService: Handle feedback creation and validation
 * - ValidationError, NotFoundError, ForbiddenError, ConflictError
 */

// ============================================================
// FUNCTION: createStudentFeedback()
// ============================================================
// METHOD: POST /api/v1/evaluations/student
// PURPOSE: Student đánh giá Tutor sau buổi học (UC-26)
// 
// REQUEST:
// {
//   "tutorId": "ObjectId",
//   "sessionId": "ObjectId",
//   "rating": 5,                           // 1-5 stars (integer)
//   "comment": "Very helpful!",
//   "strengths": ["Clear explanation", "Patient"],
//   "improvements": ["Could be more interactive"],
//   "isAnonymous": false
// }
// Headers: { Authorization: 'Bearer <JWT>' }
// Role: STUDENT only
// 
// VALIDATION:
// - ⚠️ BR-009: Session must be COMPLETED
// - ⚠️ BR-010: Rating must be integer 1-5
// - Student must have attended session (Appointment exists)
// - Cannot evaluate same session twice (unique composite index)
// 
// PROCESS:
// 1. Extract studentId from JWT
// 2. Call FeedbackService.createStudentFeedback()
//    - Validate session status = COMPLETED (BR-009)
//    - Validate rating is integer 1-5 (BR-010)
//    - Check appointment exists
//    - Check no duplicate feedback (composite unique)
//    - Create StudentFeedback record
//    - AUTO SIDE EFFECT: Update Tutor.stats.averageRating
// 3. Return feedback data
// 
// RESPONSE:
// {
//   "success": true,
//   "data": {
//     "feedbackId": "...",
//     "studentId": "...",
//     "tutorId": "...",
//     "sessionId": "...",
//     "rating": 5,
//     "comment": "Very helpful!",
//     "evaluatedAt": "2025-01-20T12:00:00Z"
//   }
// }
// 
// ERROR HANDLING:
// - Session not COMPLETED → 403 ForbiddenError ("Cannot evaluate ongoing session")
// - Invalid rating → 400 ValidationError ("Rating must be integer 1-5")
// - Already evaluated → 409 ConflictError ("Already evaluated this session")
// - No appointment → 403 ForbiddenError ("You did not attend this session")

// ============================================================
// FUNCTION: createTutorFeedback()
// ============================================================
// METHOD: POST /api/v1/evaluations/tutor
// PURPOSE: Tutor đánh giá Student sau buổi học (UC-27)
// 
// REQUEST:
// {
//   "studentId": "ObjectId",
//   "sessionId": "ObjectId",
//   "progressScore": 4,                    // 1-5 integer
//   "effortLevel": "HIGH",                 // LOW, MEDIUM, HIGH
//   "skillsImproved": ["Problem solving"],
//   "areasNeedingWork": ["Time management"],
//   "notes": "Good progress overall",
//   "homeworkCompleted": true
// }
// Headers: { Authorization: 'Bearer <JWT>' }
// Role: TUTOR or ADMIN only
// 
// VALIDATION:
// - Session must be COMPLETED
// - progressScore must be integer 1-5
// - Cannot evaluate same student in same session twice
// 
// PROCESS:
// 1. Extract tutorId from JWT
// 2. Call FeedbackService.createTutorFeedback()
//    - Validate session status = COMPLETED
//    - Validate progressScore is integer 1-5
//    - Validate session ownership (session.tutorId === tutorId)
//    - Check no duplicate feedback
//    - Create TutorFeedback record
// 3. Return feedback data
// 
// RESPONSE:
// {
//   "success": true,
//   "data": {
//     "feedbackId": "...",
//     "tutorId": "...",
//     "studentId": "...",
//     "sessionId": "...",
//     "progressScore": 4,
//     "effortLevel": "HIGH",
//     "evaluatedAt": "2025-01-20T12:00:00Z"
//   }
// }
// 
// ERROR HANDLING:
// - Session not COMPLETED → 403 ForbiddenError
// - Invalid progressScore → 400 ValidationError
// - Already evaluated → 409 ConflictError
// - Not session owner → 403 ForbiddenError

// ============================================================
// FUNCTION: getSessionEvaluations()
// ============================================================
// METHOD: GET /api/v1/evaluations/session/:sessionId
// PURPOSE: Xem tất cả evaluations của một session (for Tutor/Admin)
// 
// REQUEST:
// - Params: { sessionId: 'ObjectId' }
// - Headers: { Authorization: 'Bearer <JWT>' }
// Role: TUTOR or ADMIN only
// 
// PROCESS:
// 1. Validate user has access (session.tutorId === userId or role=ADMIN)
// 2. Query StudentFeedback + TutorFeedback (filter by sessionId)
// 3. Populate student/tutor info (respect isAnonymous for StudentFeedback)
// 4. Return both lists
// 
// RESPONSE:
// {
//   "success": true,
//   "data": {
//     "studentFeedbacks": [
//       {
//         "rating": 5,
//         "comment": "Very helpful!",
//         "student": {...} // Hidden if isAnonymous=true
//       }
//     ],
//     "tutorFeedbacks": [
//       {
//         "progressScore": 4,
//         "effortLevel": "HIGH",
//         "student": {...}
//       }
//     ]
//   }
// }

// TODO: Import dependencies (FeedbackService, error classes)

// TODO: Implement createStudentFeedback() - POST /api/v1/evaluations/student
// - Validate BR-009 (COMPLETED session)
// - Validate BR-010 (integer 1-5 rating)
// - Check attendance
// - Call service layer
// - Trigger Tutor.stats update

// TODO: Implement createTutorFeedback() - POST /api/v1/evaluations/tutor
// - Validate session ownership
// - Validate progressScore
// - Call service layer

// TODO: Implement getSessionEvaluations() - GET /api/v1/evaluations/session/:sessionId
// - Validate access (session owner or admin)
// - Query both StudentFeedback and TutorFeedback
// - Handle anonymous evaluations

import { asyncHandler, NotFoundError, ValidationError } from '../middleware/errorMiddleware.js';

class FeedbackRatingController {
  /**
   * POST /api/v1/feedback/student
   * Student submits feedback for tutor (UC-26)
   */
  createStudentFeedback = asyncHandler(async (req, res) => {
    const userId = req.userId;
    const { tutorId, sessionId, rating, content } = req.body;
    const { ForbiddenError, ConflictError } = await import('../middleware/errorMiddleware.js');

    // Validate required fields
    if (!tutorId || !sessionId || !rating || !content) {
      throw new ValidationError('tutorId, sessionId, rating, and content are required');
    }

    // BR-010: Validate rating is integer 1-5
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      throw new ValidationError('Rating must be an integer between 1 and 5');
    }

    // Find student profile
    const Student = (await import('../models/Student.model.js')).default;
    const student = await Student.findOne({ userId });

    if (!student) {
      throw new NotFoundError('Student profile not found');
    }

    // Find session
    const TutorSession = (await import('../models/TutorSession.model.js')).default;
    const session = await TutorSession.findById(sessionId);

    if (!session) {
      throw new NotFoundError('Session not found');
    }

    // BR-009: Session must be COMPLETED
    if (session.status !== 'COMPLETED') {
      throw new ForbiddenError('Cannot evaluate ongoing or cancelled session');
    }

    // Check if student attended
    const attended = session.participants.some(
      p => p.studentId.toString() === student._id.toString()
    );

    if (!attended) {
      throw new ForbiddenError('You did not attend this session');
    }

    // Check for duplicate feedback
    const StudentFeedback = (await import('../models/StudentFeedback.model.js')).default;
    const existingFeedback = await StudentFeedback.findOne({
      studentId: student._id,
      tutorId,
      sessionId
    });

    if (existingFeedback) {
      throw new ConflictError('You have already evaluated this session');
    }

    // Create feedback
    const feedback = await StudentFeedback.create({
      studentId: student._id,
      tutorId,
      sessionId,
      rating,
      content,
      evaluatedAt: new Date()
    });

    // Update tutor's average rating
    const Tutor = (await import('../models/Tutor.model.js')).default;
    const tutor = await Tutor.findById(tutorId);
    
    if (tutor) {
      const allFeedbacks = await StudentFeedback.find({ tutorId });
      const totalRating = allFeedbacks.reduce((sum, fb) => sum + fb.rating, 0);
      const avgRating = totalRating / allFeedbacks.length;
      
      tutor.stats.averageRating = Math.round(avgRating * 10) / 10;
      tutor.stats.totalReviews = allFeedbacks.length;
      await tutor.save();
    }

    res.status(201).json({
      success: true,
      data: feedback
    });
  });

  /**
   * POST /api/v1/feedback/tutor
   * Tutor submits feedback for student (UC-27)
   */
  createTutorFeedback = asyncHandler(async (req, res) => {
    const userId = req.userId;
    const { studentId, sessionId, rating, content } = req.body;
    const { ForbiddenError, ConflictError } = await import('../middleware/errorMiddleware.js');

    // Validate required fields
    if (!studentId || !sessionId || !rating || !content) {
      throw new ValidationError('studentId, sessionId, rating, and content are required');
    }

    // Validate rating
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      throw new ValidationError('Rating must be an integer between 1 and 5');
    }

    // Find tutor profile
    const Tutor = (await import('../models/Tutor.model.js')).default;
    const tutor = await Tutor.findOne({ userId });

    if (!tutor) {
      throw new NotFoundError('Tutor profile not found');
    }

    // Find session
    const TutorSession = (await import('../models/TutorSession.model.js')).default;
    const session = await TutorSession.findById(sessionId);

    if (!session) {
      throw new NotFoundError('Session not found');
    }

    // Validate session status
    if (session.status !== 'COMPLETED') {
      throw new ForbiddenError('Cannot evaluate ongoing or cancelled session');
    }

    // Validate ownership
    if (session.tutorId.toString() !== tutor._id.toString()) {
      throw new ForbiddenError('You can only evaluate students from your own sessions');
    }

    // Check for duplicate feedback
    const TutorFeedback = (await import('../models/TutorFeedback.model.js')).default;
    const existingFeedback = await TutorFeedback.findOne({
      tutorId: tutor._id,
      studentId,
      sessionId
    });

    if (existingFeedback) {
      throw new ConflictError('You have already evaluated this student for this session');
    }

    // Create feedback
    const feedback = await TutorFeedback.create({
      tutorId: tutor._id,
      studentId,
      sessionId,
      rating,
      content,
      evaluatedAt: new Date()
    });

    res.status(201).json({
      success: true,
      data: feedback
    });
  });

  /**
   * GET /api/v1/feedback/session/:sessionId
   * Get all evaluations for a session
   */
  getSessionEvaluations = asyncHandler(async (req, res) => {
    const userId = req.userId;
    const userRole = req.userRole;
    const { sessionId } = req.params;
    const { ForbiddenError } = await import('../middleware/errorMiddleware.js');

    // Find session
    const TutorSession = (await import('../models/TutorSession.model.js')).default;
    const session = await TutorSession.findById(sessionId);

    if (!session) {
      throw new NotFoundError('Session not found');
    }

    // Validate access (tutor or admin)
    if (userRole === 'TUTOR') {
      const Tutor = (await import('../models/Tutor.model.js')).default;
      const tutor = await Tutor.findOne({ userId });
      
      if (!tutor || session.tutorId.toString() !== tutor._id.toString()) {
        throw new ForbiddenError('You can only view evaluations for your own sessions');
      }
    } else if (userRole !== 'ADMIN') {
      throw new ForbiddenError('Only tutors and admins can view session evaluations');
    }

    // Get both student and tutor feedbacks
    const StudentFeedback = (await import('../models/StudentFeedback.model.js')).default;
    const TutorFeedback = (await import('../models/TutorFeedback.model.js')).default;

    const [studentFeedbacks, tutorFeedbacks] = await Promise.all([
      StudentFeedback.find({ sessionId })
        .populate('studentId', 'userId')
        .populate({
          path: 'studentId',
          populate: {
            path: 'userId',
            select: 'fullName email'
          }
        })
        .lean(),
      TutorFeedback.find({ sessionId })
        .populate('studentId', 'userId')
        .populate({
          path: 'studentId',
          populate: {
            path: 'userId',
            select: 'fullName email'
          }
        })
        .lean()
    ]);

    res.status(200).json({
      success: true,
      data: {
        studentFeedbacks,
        tutorFeedbacks
      }
    });
  });
}

export default new FeedbackRatingController();
