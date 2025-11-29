/**
 * ROUTES: Feedback Rating Routes
 * FILE: feedback-rating.routes.js
 * MỤC ĐÍCH: Định nghĩa API endpoints cho Feedbacks (Student & Tutor)
 * 
 * BASE PATH: /api/v1/feedbacks
 * 
 * ENDPOINTS:
 * - POST   /student           - Student evaluates session (UC-26)
 * - POST   /tutor             - Tutor evaluates student (UC-27)
 * - GET    /session/:sessionId - Get all evaluations for session
 */

// TODO: Import express.Router, feedbackRatingController
// TODO: Import authMiddleware, roleMiddleware

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

// TODO: Initialize router, define routes, export
