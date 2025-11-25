/**
 * CONTROLLER: StudentController
 * FILE: student.controller.js
 * MỤC ĐÍCH: Xử lý HTTP requests liên quan đến Student profile (UC-06)
 * 
 * USE CASES:
 * - UC-06: Student views own profile
 * - UC-28: Student views own appointment history
 * - UC-29: Student views own evaluation history
 * 
 * DEPENDENCIES:
 * - StudentService: Handle student-related queries
 * - NotFoundError
 */

// ============================================================
// FUNCTION: getMyProfile()
// ============================================================
// METHOD: GET /api/v1/students/me
// PURPOSE: Student xem thông tin cá nhân (UC-06)
// 
// REQUEST:
// - Headers: { Authorization: 'Bearer <JWT>' }
// Role: STUDENT only
// 
// PROCESS:
// 1. Extract studentId from JWT (req.user.userId)
// 2. Query Student model (populate userId → User info)
// 3. Return profile with statistics
// 
// RESPONSE:
// {
//   "success": true,
//   "data": {
//     "studentId": "...",
//     "user": {
//       "email": "student@hcmut.edu.vn",
//       "fullName": "Nguyen Van A",
//       "faculty": "Computer Science"
//     },
//     "mssv": "2210001",
//     "major": "Computer Science",
//     "enrollmentYear": 2022,
//     "currentYear": 2,
//     "gpa": 3.5,
//     "totalCredits": 60,
//     "statistics": {
//       "registeredTutors": 5,
//       "totalSessionsAttended": 20,
//       "totalAppointments": 25,
//       "completedAppointments": 20,
//       "cancelledAppointments": 5,
//       "averageRatingGiven": 4.5
//     }
//   }
// }

// ============================================================
// FUNCTION: getMyAppointments()
// ============================================================
// METHOD: GET /api/v1/students/me/appointments
// PURPOSE: Student xem lịch sử appointments (UC-28)
// 
// REQUEST:
// - Query: { status?: 'PENDING' | 'CONFIRMED' | 'COMPLETED', page?: 1, limit?: 20 }
// - Headers: { Authorization: 'Bearer <JWT>' }
// 
// PROCESS:
// 1. Extract studentId from JWT
// 2. Query Appointment model (filter by status if provided)
// 3. Populate sessionId → ConsultationSession info
// 4. Return with pagination
// 
// RESPONSE:
// {
//   "success": true,
//   "data": [
//     {
//       "appointmentId": "...",
//       "session": {
//         "sessionId": "...",
//         "title": "Math 101 - Derivatives",
//         "startTime": "2025-01-20T09:00:00Z",
//         "tutor": {
//           "fullName": "Prof. A"
//         }
//       },
//       "status": "CONFIRMED",
//       "bookedAt": "2025-01-15T10:00:00Z"
//     }
//   ],
//   "pagination": {...}
// }

// ============================================================
// FUNCTION: getMyEvaluations()
// ============================================================
// METHOD: GET /api/v1/students/me/evaluations
// PURPOSE: Student xem lịch sử evaluations đã cho (UC-29)
// 
// REQUEST:
// - Query: { page?: 1, limit?: 20 }
// - Headers: { Authorization: 'Bearer <JWT>' }
// 
// PROCESS:
// 1. Extract studentId from JWT
// 2. Query StudentEvaluation model
// 3. Populate tutorId, sessionId
// 4. Return with pagination
// 
// RESPONSE:
// {
//   "success": true,
//   "data": [
//     {
//       "evaluationId": "...",
//       "tutor": {
//         "fullName": "Prof. A"
//       },
//       "session": {
//         "title": "Math 101"
//       },
//       "rating": 5,
//       "comment": "Very helpful!",
//       "evaluatedAt": "2025-01-20T12:00:00Z"
//     }
//   ],
//   "pagination": {...}
// }

// TODO: Import dependencies (StudentService, error classes)

// TODO: Implement getMyProfile() - GET /api/v1/students/me
// - Extract studentId from JWT
// - Query Student model with populate
// - Return profile with statistics

// TODO: Implement getMyAppointments() - GET /api/v1/students/me/appointments
// - Filter by status
// - Populate session and tutor info
// - Return with pagination

// TODO: Implement getMyEvaluations() - GET /api/v1/students/me/evaluations
// - Query StudentEvaluation model
// - Populate tutor and session
// - Return with pagination

// TODO: Export controller functions
