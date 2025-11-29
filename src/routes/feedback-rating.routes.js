/**
 * ROUTES: Feedback Rating Routes
 * FILE: feedback-rating.routes.js
 * MỤC ĐÍCH: Định nghĩa API endpoints cho Feedbacks (Student & Tutor)
 * 
 * BASE PATH: /api/v1/evaluations
 * 
 * ENDPOINTS:
 * - POST   /student           - Student evaluates session (UC-26)
 * - POST   /tutor             - Tutor evaluates student (UC-27)
 * - GET    /session/:sessionId - Get all evaluations for session
 */

import express from 'express';
const router = express.Router();
import * as feedbackController from '../controllers/feedback-rating.controller.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { roleMiddleware } from '../middleware/roleMiddleware.js';

// ============================================================
// ROUTE: POST /api/v1/evaluations/student
// ============================================================
// PURPOSE: Student đánh giá session (UC-26)
// ACCESS: Protected - STUDENT only
// CONTROLLER: feedbackRatingController.createStudentFeedback
// 
// REQUEST BODY:
// {
//   "sessionId": "ObjectId",
//   "rating": 5,
//   "comment": "Buổi học rất hay!",
//   "isAnonymous": false
// }
// 
// VALIDATION:
// - Session must be COMPLETED
// - Check studentId in session.participants
// - Unique constraint: 1 student + 1 session = 1 feedback
// 
// SIDE EFFECTS:
// - Update Tutor.averageRating
// - Update Tutor.totalReviews++
// - Update session.hasFeedback=true
// 
// PSEUDOCODE:
// router.post(
//   '/student',
//   authMiddleware,
//   roleMiddleware(['STUDENT']),
//   feedbackRatingController.createStudentFeedback
// )

// ============================================================
// ROUTE: POST /api/v1/evaluations/tutor
// ============================================================
// PURPOSE: Tutor đánh giá student (UC-27)
// ACCESS: Protected - TUTOR or ADMIN only
// CONTROLLER: feedbackRatingController.createTutorFeedback
// 
// REQUEST BODY:
// {
//   "sessionId": "ObjectId",
//   "studentId": "ObjectId",
//   "attendanceStatus": "PRESENT",
//   "progressScore": 8,
//   "comment": "Em học tốt!"
// }
// 
// VALIDATION:
// - Session must be COMPLETED
// - Check session.tutorId === userId
// - Unique constraint: 1 tutor + 1 student + 1 session = 1 feedback
// 
// SIDE EFFECTS:
// - Update Student statistics (average progress score)
// 
// PSEUDOCODE:
// router.post(
//   '/tutor',
//   authMiddleware,
//   roleMiddleware(['TUTOR', 'ADMIN']),
//   feedbackRatingController.createTutorFeedback
// )

// ============================================================
// ROUTE: GET /api/v1/evaluations/session/:sessionId
// ============================================================
// PURPOSE: Get all evaluations for a session
// ACCESS: Protected - TUTOR (owner) or ADMIN only
// CONTROLLER: feedbackRatingController.getSessionFeedbacks
// 
// RETURN:
// {
//   "studentFeedbacks": [...],
//   "tutorFeedbacks": [...]
// }
// 
// PSEUDOCODE:
// router.get(
//   '/session/:sessionId',
//   authMiddleware,
//   roleMiddleware(['TUTOR', 'ADMIN']),
//   feedbackRatingController.getSessionFeedbacks
// )

// ============================================================
// ROUTES IMPLEMENTATION
// ============================================================

// POST /api/v1/evaluations/student - Student evaluates session (UC-26)
router.post(
  '/student',
  authMiddleware,
  roleMiddleware(['STUDENT']),
  feedbackController.createStudentFeedback
);

// POST /api/v1/evaluations/tutor - Tutor evaluates student (UC-27)
router.post(
  '/tutor',
  authMiddleware,
  roleMiddleware(['TUTOR', 'ADMIN']),
  feedbackController.createTutorFeedback
);

// GET /api/v1/evaluations/session/:sessionId - Get all evaluations for session (UC-28)
router.get(
  '/session/:sessionId',
  authMiddleware,
  feedbackController.getSessionEvaluations
);

export default router;
