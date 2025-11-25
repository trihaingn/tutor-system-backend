/**
 * CONTROLLER: FeedbackController
 * FILE: feedback.controller.js
 * MỤC ĐÍCH: Xử lý HTTP requests liên quan đến Session Feedback/Report (UC-18)
 * 
 * USE CASES:
 * - UC-18: Tutor creates session report after completion
 * 
 * DEPENDENCIES:
 * - FeedbackService: Handle feedback/report creation
 * - ValidationError, NotFoundError, ConflictError
 */

// ============================================================
// FUNCTION: createSessionReport()
// ============================================================
// METHOD: POST /api/v1/feedback/sessions/:sessionId
// PURPOSE: Tutor tạo report sau buổi học (UC-18)
// 
// REQUEST:
// - Params: { sessionId: 'ObjectId' }
// - Body: {
//     "summary": "Covered derivatives and chain rule...",
//     "topicsCovered": ["Đạo hàm cơ bản", "Quy tắc tích"],
//     "studentProgress": [
//       {
//         "studentId": "ObjectId",
//         "progressNotes": "Good understanding",
//         "comprehensionLevel": "HIGH"
//       }
//     ],
//     "nextSteps": ["Ôn tập lý thuyết giới hạn"],
//     "attachments": [
//       {
//         "fileName": "notes.pdf",
//         "fileUrl": "https://storage.../notes.pdf",
//         "fileType": "PDF"
//       }
//     ]
//   }
// - Headers: { Authorization: 'Bearer <JWT>' }
// Role: TUTOR or ADMIN only
// 
// VALIDATION:
// - Session must exist and status = COMPLETED
// - ⚠️ Validate ownership: session.tutorId === tutorId
// - 1 session chỉ có 1 report (unique sessionId)
// 
// PROCESS:
// 1. Extract tutorId from JWT
// 2. Call FeedbackService.createSessionReport()
//    - Validate session status = COMPLETED
//    - Validate session ownership
//    - Check no existing report (unique sessionId)
//    - Create Feedback record
//    - AUTO SIDE EFFECT: Set ConsultationSession.hasReport = true
// 3. Return report data
// 
// RESPONSE:
// {
//   "success": true,
//   "data": {
//     "feedbackId": "...",
//     "sessionId": "...",
//     "tutorId": "...",
//     "summary": "Covered derivatives...",
//     "topicsCovered": [...],
//     "createdAt": "2025-01-20T12:00:00Z"
//   }
// }
// 
// ERROR HANDLING:
// - Session not found → 404 NotFoundError
// - Session not COMPLETED → 403 ForbiddenError
// - Not session owner → 403 ForbiddenError
// - Report already exists → 409 ConflictError

// ============================================================
// FUNCTION: getSessionReport()
// ============================================================
// METHOD: GET /api/v1/feedback/sessions/:sessionId
// PURPOSE: Xem session report
// 
// REQUEST:
// - Params: { sessionId: 'ObjectId' }
// - Headers: { Authorization: 'Bearer <JWT>' }
// 
// ACCESS CONTROL:
// - Tutor who created session
// - Students who attended session
// - Admin
// 
// PROCESS:
// 1. Extract userId and role from JWT
// 2. Find session by id
// 3. Validate access:
//    - If role=TUTOR → session.tutorId === userId
//    - If role=STUDENT → Check Appointment exists
//    - If role=ADMIN → Allow
// 4. Query Feedback model (sessionId match)
// 5. Populate tutorId, studentProgress.studentId
// 6. Return report
// 
// RESPONSE:
// {
//   "success": true,
//   "data": {
//     "feedbackId": "...",
//     "session": {
//       "sessionId": "...",
//       "title": "Math 101 - Derivatives"
//     },
//     "tutor": {
//       "fullName": "Prof. A"
//     },
//     "summary": "...",
//     "topicsCovered": [...],
//     "studentProgress": [...],
//     "nextSteps": [...],
//     "attachments": [...],
//     "createdAt": "2025-01-20T12:00:00Z"
//   }
// }
// 
// ERROR HANDLING:
// - Session not found → 404 NotFoundError
// - Report not found → 404 NotFoundError
// - No access → 403 ForbiddenError

// ============================================================
// FUNCTION: updateSessionReport()
// ============================================================
// METHOD: PUT /api/v1/feedback/:feedbackId
// PURPOSE: Tutor update existing report
// 
// REQUEST:
// - Params: { feedbackId: 'ObjectId' }
// - Body: { summary?, topicsCovered?, studentProgress?, nextSteps?, attachments? }
// - Headers: { Authorization: 'Bearer <JWT>' }
// 
// VALIDATION:
// - ⚠️ Validate ownership: feedback.tutorId === tutorId
// 
// PROCESS:
// 1. Extract tutorId from JWT
// 2. Find feedback by id
// 3. Validate ownership
// 4. Update fields
// 5. Return updated report
// 
// RESPONSE:
// {
//   "success": true,
//   "data": { ...updated feedback }
// }

// TODO: Import dependencies (FeedbackService, error classes)

// TODO: Implement createSessionReport() - POST /api/v1/feedback/sessions/:sessionId
// - Validate session COMPLETED
// - Validate ownership
// - Check no duplicate report (unique sessionId)
// - Call service layer
// - Set session.hasReport = true

// TODO: Implement getSessionReport() - GET /api/v1/feedback/sessions/:sessionId
// - Validate access (tutor, attending students, or admin)
// - Query Feedback model
// - Populate related data

// TODO: Implement updateSessionReport() - PUT /api/v1/feedback/:feedbackId
// - Validate ownership
// - Update fields

// TODO: Export controller functions
