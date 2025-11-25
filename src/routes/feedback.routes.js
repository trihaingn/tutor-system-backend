/**
 * ROUTES: Feedback Routes
 * FILE: feedback.routes.js
 * MỤC ĐÍCH: Định nghĩa API endpoints cho Session Feedback/Reports
 * 
 * BASE PATH: /api/v1/feedback
 * 
 * ENDPOINTS:
 * - POST   /sessions/:sessionId  - Tutor creates report (UC-18)
 * - GET    /sessions/:sessionId  - Get session report
 * - PUT    /:feedbackId          - Update report
 */

// TODO: Import express.Router, feedbackController
// TODO: Import authMiddleware, roleMiddleware

// ============================================================
// ROUTE: POST /api/v1/feedback/sessions/:sessionId
// ============================================================
// PURPOSE: Tutor tạo session report (UC-18)
// ACCESS: Protected - TUTOR or ADMIN only
// CONTROLLER: feedbackController.createSessionReport
// 
// REQUEST BODY:
// {
//   "content": "Buổi học diễn ra tốt...",
//   "studentsPresent": ["studentId1", "studentId2"],
//   "studentsAbsent": ["studentId3"]
// }
// 
// VALIDATION:
// - Session must be COMPLETED status
// - tutorId must own session
// - Unique constraint: 1 session = 1 report
// 
// PSEUDOCODE:
// router.post(
//   '/sessions/:sessionId',
//   authMiddleware,
//   roleMiddleware(['TUTOR', 'ADMIN']),
//   feedbackController.createSessionReport
// )

// ============================================================
// ROUTE: GET /api/v1/feedback/sessions/:sessionId
// ============================================================
// PURPOSE: Xem session report
// ACCESS: Protected - TUTOR (owner) or participating STUDENTS or ADMIN
// CONTROLLER: feedbackController.getSessionReport
// 
// ACCESS CONTROL:
// - ADMIN: Always allowed
// - TUTOR: If session.tutorId === userId
// - STUDENT: If studentId in session.participants
// 
// PSEUDOCODE:
// router.get(
//   '/sessions/:sessionId',
//   authMiddleware,
//   feedbackController.getSessionReport
// )

// ============================================================
// ROUTE: PUT /api/v1/feedback/:feedbackId
// ============================================================
// PURPOSE: Tutor update session report
// ACCESS: Protected - TUTOR (owner) or ADMIN
// CONTROLLER: feedbackController.updateSessionReport
// 
// VALIDATION:
// - Check feedback.tutorId === userId or ADMIN
// 
// PSEUDOCODE:
// router.put(
//   '/:feedbackId',
//   authMiddleware,
//   roleMiddleware(['TUTOR', 'ADMIN']),
//   feedbackController.updateSessionReport
// )

// TODO: Initialize router, define routes, export
