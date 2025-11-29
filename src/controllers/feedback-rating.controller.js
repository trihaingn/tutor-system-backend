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

// TODO: Export controller functions
