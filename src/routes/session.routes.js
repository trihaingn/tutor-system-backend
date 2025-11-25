/**
 * ROUTES: Session Routes
 * FILE: session.routes.js
 * MỤC ĐÍCH: Định nghĩa API endpoints cho Consultation Sessions
 * 
 * BASE PATH: /api/v1/sessions
 * 
 * ENDPOINTS:
 * - POST   /                      - Tutor creates session (UC-11)
 * - GET    /upcoming              - Get upcoming sessions (UC-16, UC-17)
 * - DELETE /:id                   - Tutor cancels session (UC-15)
 * - POST   /:sessionId/appointments - Student books appointment (UC-12)
 */

// TODO: Import express.Router, sessionController
// TODO: Import authMiddleware, roleMiddleware

// ============================================================
// ROUTE: POST /api/v1/sessions
// ============================================================
// PURPOSE: Tutor tạo consultation session (UC-11)
// ACCESS: Protected - TUTOR or ADMIN only
// CONTROLLER: sessionController.createSession
// MIDDLEWARE: authMiddleware, roleMiddleware(['TUTOR', 'ADMIN'])
// 
// REQUEST BODY:
// {
//   "title": "Math 101 - Derivatives",
//   "subjectId": "Math_101",
//   "description": "...",
//   "startTime": "2025-01-20T09:00:00Z",
//   "endTime": "2025-01-20T11:00:00Z",
//   "sessionType": "ONLINE",
//   "meetingLink": "https://meet.google.com/xxx",
//   "maxParticipants": 10
// }
// 
// VALIDATION:
// - BR-001: startTime, endTime must be hourly
// - BR-002: Duration >= 60 minutes
// - BR-003: ONLINE needs meetingLink
// - BR-004: OFFLINE needs location
// 
// PSEUDOCODE:
// router.post(
//   '/',
//   authMiddleware,
//   roleMiddleware(['TUTOR', 'ADMIN']),
//   sessionController.createSession
// )

// ============================================================
// ROUTE: GET /api/v1/sessions/upcoming
// ============================================================
// PURPOSE: Get upcoming sessions (Student/Tutor view)
// ACCESS: Protected - ALL authenticated users
// CONTROLLER: sessionController.getUpcomingSessions
// QUERY PARAMS: { role?: 'student' | 'tutor', startDate?, endDate? }
// 
// PSEUDOCODE:
// router.get(
//   '/upcoming',
//   authMiddleware,
//   sessionController.getUpcomingSessions
// )

// ============================================================
// ROUTE: DELETE /api/v1/sessions/:id
// ============================================================
// PURPOSE: Tutor cancels session (UC-15)
// ACCESS: Protected - TUTOR or ADMIN only
// CONTROLLER: sessionController.cancelSession
// 
// PSEUDOCODE:
// router.delete(
//   '/:id',
//   authMiddleware,
//   roleMiddleware(['TUTOR', 'ADMIN']),
//   sessionController.cancelSession
// )

// ============================================================
// ROUTE: POST /api/v1/sessions/:sessionId/appointments
// ============================================================
// PURPOSE: Student book appointment (UC-12)
// ACCESS: Protected - STUDENT only
// CONTROLLER: sessionController.bookAppointment
// 
// REQUEST BODY:
// {
//   "notes": "Optional notes"
// }
// 
// PSEUDOCODE:
// router.post(
//   '/:sessionId/appointments',
//   authMiddleware,
//   roleMiddleware(['STUDENT']),
//   sessionController.bookAppointment
// )

// TODO: Initialize router
// TODO: Define routes
// TODO: Export router
