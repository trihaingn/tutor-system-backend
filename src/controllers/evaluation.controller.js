/**
 * CONTROLLER: EvaluationController
 * FILE: evaluation.controller.js
 * MỤC ĐÍCH: Xử lý HTTP requests liên quan đến Evaluations (UC-26, UC-27)
 * 
 * USE CASES:
 * - UC-26: Student evaluates Tutor after session
 * - UC-27: Tutor evaluates Student after session
 * 
 * DEPENDENCIES:
 * - EvaluationService: Handle evaluation creation and validation
 * - ValidationError, NotFoundError, ForbiddenError, ConflictError
 */

// ============================================================
// FUNCTION: createStudentEvaluation()
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
// 2. Call EvaluationService.createStudentEvaluation()
//    - Validate session status = COMPLETED (BR-009)
//    - Validate rating is integer 1-5 (BR-010)
//    - Check appointment exists
//    - Check no duplicate evaluation (composite unique)
//    - Create StudentEvaluation record
//    - AUTO SIDE EFFECT: Update Tutor.stats.averageRating
// 3. Return evaluation data
// 
// RESPONSE:
// {
//   "success": true,
//   "data": {
//     "evaluationId": "...",
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
// FUNCTION: createTutorEvaluation()
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
// 2. Call EvaluationService.createTutorEvaluation()
//    - Validate session status = COMPLETED
//    - Validate progressScore is integer 1-5
//    - Validate session ownership (session.tutorId === tutorId)
//    - Check no duplicate evaluation
//    - Create TutorEvaluation record
// 3. Return evaluation data
// 
// RESPONSE:
// {
//   "success": true,
//   "data": {
//     "evaluationId": "...",
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
// 2. Query StudentEvaluation + TutorEvaluation (filter by sessionId)
// 3. Populate student/tutor info (respect isAnonymous for StudentEvaluation)
// 4. Return both lists
// 
// RESPONSE:
// {
//   "success": true,
//   "data": {
//     "studentEvaluations": [
//       {
//         "rating": 5,
//         "comment": "Very helpful!",
//         "student": {...} // Hidden if isAnonymous=true
//       }
//     ],
//     "tutorEvaluations": [
//       {
//         "progressScore": 4,
//         "effortLevel": "HIGH",
//         "student": {...}
//       }
//     ]
//   }
// }

// TODO: Import dependencies (EvaluationService, error classes)

// TODO: Implement createStudentEvaluation() - POST /api/v1/evaluations/student
// - Validate BR-009 (COMPLETED session)
// - Validate BR-010 (integer 1-5 rating)
// - Check attendance
// - Call service layer
// - Trigger Tutor.stats update

// TODO: Implement createTutorEvaluation() - POST /api/v1/evaluations/tutor
// - Validate session ownership
// - Validate progressScore
// - Call service layer

// TODO: Implement getSessionEvaluations() - GET /api/v1/evaluations/session/:sessionId
// - Validate access (session owner or admin)
// - Query both StudentEvaluation and TutorEvaluation
// - Handle anonymous evaluations

// TODO: Export controller functions
