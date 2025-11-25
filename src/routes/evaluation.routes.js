/**
 * ROUTES: Evaluation Routes
 * FILE: evaluation.routes.js
 * MỤC ĐÍCH: Định nghĩa API endpoints cho Evaluations (Student & Tutor)
 * 
 * BASE PATH: /api/v1/evaluations
 * 
 * ENDPOINTS:
 * - POST   /student           - Student evaluates session (UC-26)
 * - POST   /tutor             - Tutor evaluates student (UC-27)
 * - GET    /session/:sessionId - Get all evaluations for session
 */

// TODO: Import express.Router, evaluationController
// TODO: Import authMiddleware, roleMiddleware

// ============================================================
// ROUTE: POST /api/v1/evaluations/student
// ============================================================
// PURPOSE: Student đánh giá session (UC-26)
// ACCESS: Protected - STUDENT only
// CONTROLLER: evaluationController.createStudentEvaluation
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
// - Unique constraint: 1 student + 1 session = 1 evaluation
// 
// SIDE EFFECTS:
// - Update Tutor.averageRating
// - Update Tutor.totalReviews++
// - Update session.hasEvaluation=true
// 
// PSEUDOCODE:
// router.post(
//   '/student',
//   authMiddleware,
//   roleMiddleware(['STUDENT']),
//   evaluationController.createStudentEvaluation
// )

// ============================================================
// ROUTE: POST /api/v1/evaluations/tutor
// ============================================================
// PURPOSE: Tutor đánh giá student (UC-27)
// ACCESS: Protected - TUTOR or ADMIN only
// CONTROLLER: evaluationController.createTutorEvaluation
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
// - Unique constraint: 1 tutor + 1 student + 1 session = 1 evaluation
// 
// SIDE EFFECTS:
// - Update Student statistics (average progress score)
// 
// PSEUDOCODE:
// router.post(
//   '/tutor',
//   authMiddleware,
//   roleMiddleware(['TUTOR', 'ADMIN']),
//   evaluationController.createTutorEvaluation
// )

// ============================================================
// ROUTE: GET /api/v1/evaluations/session/:sessionId
// ============================================================
// PURPOSE: Get all evaluations for a session
// ACCESS: Protected - TUTOR (owner) or ADMIN only
// CONTROLLER: evaluationController.getSessionEvaluations
// 
// RETURN:
// {
//   "studentEvaluations": [...],
//   "tutorEvaluations": [...]
// }
// 
// PSEUDOCODE:
// router.get(
//   '/session/:sessionId',
//   authMiddleware,
//   roleMiddleware(['TUTOR', 'ADMIN']),
//   evaluationController.getSessionEvaluations
// )

// TODO: Initialize router, define routes, export
