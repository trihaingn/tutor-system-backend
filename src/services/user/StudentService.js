/**
 * SERVICE: StudentService
 * FILE: StudentService.js
 * MỤC ĐÍCH: Xử lý logic liên quan đến Student profile và statistics
 * 
 * DEPENDENCIES:
 * - Student Model, User Model
 * - Appointment Model, StudentEvaluation Model
 */

// ============================================================
// FUNCTION: getStudentProfile(studentId)
// ============================================================
// PURPOSE: Lấy full profile của Student (UC-06)
// 
// PSEUDOCODE:
// Step 1: Query Student với populate
//   - const student = await Student.findById(studentId)
//       .populate('userId', 'email fullName faculty status')
//   - If !student → Throw NotFoundError("Student không tồn tại")
// 
// Step 2: Return profile với statistics
//   - Return {
//       studentId: student._id,
//       user: student.userId,
//       mssv: student.mssv,
//       major: student.major,
//       enrollmentYear: student.enrollmentYear,
//       currentYear: student.currentYear,
//       gpa: student.gpa,
//       totalCredits: student.totalCredits,
//       statistics: {
//         registeredTutors: student.registeredTutors,
//         totalSessionsAttended: student.totalSessionsAttended,
//         totalAppointments: student.totalAppointments,
//         completedAppointments: student.completedAppointments,
//         cancelledAppointments: student.cancelledAppointments,
//         averageRatingGiven: student.averageRatingGiven
//       }
//     }

// ============================================================
// FUNCTION: getStudentAppointmentHistory(studentId, filters)
// ============================================================
// PURPOSE: Lấy lịch sử appointments của Student (UC-28)
// 
// INPUT:
// - studentId: ObjectId
// - filters: Object { status?, page?, limit? }
// 
// PSEUDOCODE:
// Step 1: Build query
//   query = { studentId: studentId }
//   If filters.status → query.status = filters.status
// 
// Step 2: Pagination setup
//   - const page = filters.page || 1
//   - const limit = filters.limit || 20
//   - const skip = (page - 1) * limit
// 
// Step 3: Query appointments
//   - const appointments = await Appointment.find(query)
//       .populate({
//         path: 'sessionId',
//         populate: {
//           path: 'tutorId',
//           populate: { path: 'userId', select: 'fullName email' }
//         }
//       })
//       .sort({ bookedAt: -1 })
//       .skip(skip)
//       .limit(limit)
// 
// Step 4: Count total
//   - const total = await Appointment.countDocuments(query)
// 
// OUTPUT:
// - Return {
//     data: appointments,
//     pagination: {
//       currentPage: page,
//       totalPages: Math.ceil(total / limit),
//       totalItems: total,
//       itemsPerPage: limit
//     }
//   }

// ============================================================
// FUNCTION: getStudentEvaluationHistory(studentId, filters)
// ============================================================
// PURPOSE: Lấy lịch sử evaluations Student đã cho (UC-29)
// 
// PSEUDOCODE:
// Step 1-4: Tương tự getStudentAppointmentHistory
//   - Query StudentEvaluation where studentId = studentId
//   - Populate tutorId, sessionId
//   - Sort by evaluatedAt DESC
//   - Return với pagination

// ============================================================
// FUNCTION: updateStudentStatistics(studentId, updates)
// ============================================================
// PURPOSE: Update Student statistics (called from other services)
// 
// INPUT:
// - studentId: ObjectId
// - updates: Object (fields to increment/set)
// 
// PSEUDOCODE:
// Step 1: Update student record
//   - await Student.findByIdAndUpdate(studentId, updates)
// 
// OUTPUT:
// - Return { success: true }

const Student = require('../../models/Student.model');
const { NotFoundError } = require('../../middleware/errorMiddleware');
const StudentRepository = require('../../repositories/StudentRepository');

/**
 * Lấy full profile của Student (UC-06)
 */
async function getStudentProfile(studentId) {
  const student = await Student.findById(studentId)
    .populate('userId', 'email fullName faculty status');
  
  if (!student) {
    throw new NotFoundError('Student không tồn tại');
  }

  return {
    studentId: student._id,
    user: student.userId,
    mssv: student.mssv,
    major: student.major,
    enrollmentYear: student.enrollmentYear,
    currentYear: student.currentYear,
    gpa: student.gpa,
    totalCredits: student.totalCredits,
    statistics: {
      registeredTutors: student.registeredTutors,
      totalSessionsAttended: student.totalSessionsAttended,
      totalAppointments: student.totalAppointments,
      completedAppointments: student.completedAppointments,
      cancelledAppointments: student.cancelledAppointments,
      averageRatingGiven: student.averageRatingGiven
    }
  };
}

/**
 * Update Student statistics
 */
async function updateStudentStatistics(studentId, updates) {
  await StudentRepository.update(studentId, updates);
  return { success: true };
}

module.exports = {
  getStudentProfile,
  updateStudentStatistics
};
