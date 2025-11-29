/**
 * ROUTES: Record Routes
 * FILE: record.routes.js
 * MỤC ĐÍCH: Định nghĩa API endpoints cho Session Record/Reports
 * 
 * BASE PATH: /api/v1/record
 * 
 * ENDPOINTS:
 * - POST   /sessions/:sessionId  - Tutor creates report (UC-18)
 * - GET    /sessions/:sessionId  - Get session report
 * - PUT    /:recordId          - Update report
 */

// TODO: Import express.Router, recordController
// TODO: Import authMiddleware, roleMiddleware

// ============================================================
// ROUTE: POST /api/v1/record/sessions/:sessionId
// ============================================================
// PURPOSE: Tutor tạo session report (UC-18)
// ACCESS: Protected - TUTOR or ADMIN only
// CONTROLLER: recordController.createSessionReport
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
//   recordController.createSessionReport
// )

// ============================================================
// ROUTE: GET /api/v1/record/sessions/:sessionId
// ============================================================
// PURPOSE: Xem session report
// ACCESS: Protected - TUTOR (owner) or participating STUDENTS or ADMIN
// CONTROLLER: recordController.getSessionReport
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
//   recordController.getSessionReport
// )

// ============================================================
// ROUTE: PUT /api/v1/record/:recordId
// ============================================================
// PURPOSE: Tutor update session report
// ACCESS: Protected - TUTOR (owner) or ADMIN
// CONTROLLER: recordController.updateSessionReport
// 
// VALIDATION:
// - Check record.tutorId === userId or ADMIN
// 
// PSEUDOCODE:
// router.put(
//   '/:recordId',
//   authMiddleware,
//   roleMiddleware(['TUTOR', 'ADMIN']),
//   recordController.updateSessionReport
// )

// TODO: Initialize router, define routes, export
