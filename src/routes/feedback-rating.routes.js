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
import feedbackController from '../controllers/feedback-rating.controller.js';
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

/**
 * @swagger
 * /evaluations/student:
 *   post:
 *     summary: Student evaluates session (UC-26)
 *     tags: [Feedback & Rating]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [sessionId, tutorId, rating]
 *             properties:
 *               sessionId:
 *                 type: string
 *                 example: "507f1f77bcf86cd799439011"
 *               tutorId:
 *                 type: string
 *                 example: "507f1f77bcf86cd799439022"
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 5
 *                 description: Rating must be integer 1-5 (BR-010)
 *               content:
 *                 type: string
 *                 example: "Buổi học rất hay, thầy giảng rất dễ hiểu!"
 *     responses:
 *       201:
 *         description: Feedback created successfully (auto-updates tutor rating)
 *       400:
 *         description: Session not COMPLETED (BR-009) or invalid rating (BR-010)
 *       403:
 *         description: Student not in session participants or only STUDENT allowed
 *       409:
 *         description: Duplicate feedback (already submitted)
 */
// POST /api/v1/evaluations/student - Student evaluates session (UC-26)
router.post(
  '/student',
  authMiddleware,
  roleMiddleware(['STUDENT']),
  feedbackController.createStudentFeedback
);

/**
 * @swagger
 * /evaluations/tutor:
 *   post:
 *     summary: Tutor evaluates student (UC-27)
 *     tags: [Feedback & Rating]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [sessionId, studentId, rating]
 *             properties:
 *               sessionId:
 *                 type: string
 *               studentId:
 *                 type: string
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 description: Rating must be integer 1-5 (BR-010)
 *               content:
 *                 type: string
 *                 example: "Sinh viên học tập tích cực, tiếp thu tốt"
 *     responses:
 *       201:
 *         description: Tutor feedback created successfully
 *       400:
 *         description: Invalid rating or session not COMPLETED
 *       403:
 *         description: Not session owner or only TUTOR/ADMIN allowed
 *       409:
 *         description: Duplicate feedback
 */
// POST /api/v1/evaluations/tutor - Tutor evaluates student (UC-27)
router.post(
  '/tutor',
  authMiddleware,
  roleMiddleware(['TUTOR', 'ADMIN']),
  feedbackController.createTutorFeedback
);

/**
 * @swagger
 * /evaluations/session/{sessionId}:
 *   get:
 *     summary: Get all evaluations for session (UC-28)
 *     tags: [Feedback & Rating]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         required: true
 *         schema:
 *           type: string
 *         description: Session ID
 *     responses:
 *       200:
 *         description: Both student and tutor feedbacks for session
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     studentFeedbacks:
 *                       type: array
 *                       items:
 *                         type: object
 *                     tutorFeedbacks:
 *                       type: array
 *                       items:
 *                         type: object
 *       403:
 *         description: Only session owner (tutor) or ADMIN allowed
 *       404:
 *         description: Session not found
 */
// GET /api/v1/evaluations/session/:sessionId - Get all evaluations for session (UC-28)
router.get(
  '/session/:sessionId',
  authMiddleware,
  feedbackController.getSessionEvaluations
);

export default router;
