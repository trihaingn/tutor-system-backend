/**
 * SERVICE: UserService
 * FILE: UserService.js
 * MỤC ĐÍCH: Xử lý logic tạo/update User, Student, Tutor records
 * 
 * DEPENDENCIES:
 * - User Model, Student Model, Tutor Model
 */

// ============================================================
// FUNCTION: createOrUpdateUser(userData)
// ============================================================
// PURPOSE: Tạo hoặc update User record (called from AuthService)
// 
// INPUT:
// - userData: Object {
//     email: String (unique),
//     mssv?: String,
//     maCB?: String,
//     fullName: String,
//     faculty: String,
//     role: 'STUDENT' | 'TUTOR' | 'ADMIN',
//     status: 'ACTIVE',
//     lastSyncAt: Date,
//     syncSource: 'DATACORE'
//   }
// 
// PSEUDOCODE:
// Step 1: Tìm User theo email
//   - let user = await User.findOne({ email: userData.email })
// 
// Step 2: Nếu tồn tại → Update
//   - If user:
//     → Object.assign(user, userData)
//     → user.lastSyncAt = new Date()
//     → await user.save()
// 
// Step 3: Nếu chưa tồn tại → Create
//   - Else:
//     → user = await User.create(userData)
// 
// OUTPUT:
// - Return User object

// ============================================================
// FUNCTION: createOrUpdateStudent(userId, studentData)
// ============================================================
// PURPOSE: Tạo hoặc update Student profile
// 
// INPUT:
// - userId: ObjectId
// - studentData: Object {
//     mssv: String,
//     major: String,
//     enrollmentYear: Number,
//     currentYear: Number,
//     gpa?: Number,
//     totalCredits?: Number
//   }
// 
// PSEUDOCODE:
// Step 1: Tìm Student theo userId
//   - let student = await Student.findOne({ userId: userId })
// 
// Step 2: Nếu tồn tại → Update
//   - If student:
//     → Object.assign(student, studentData)
//     → await student.save()
// 
// Step 3: Nếu chưa tồn tại → Create
//   - Else:
//     → student = await Student.create({
//         userId: userId,
//         ...studentData,
//         registeredTutors: 0,
//         totalSessionsAttended: 0,
//         totalAppointments: 0,
//         completedAppointments: 0,
//         cancelledAppointments: 0,
//         averageRatingGiven: 0
//       })
// 
// OUTPUT:
// - Return Student object

// ============================================================
// FUNCTION: createOrUpdateTutor(userId, tutorData)
// ============================================================
// PURPOSE: Tạo hoặc update Tutor profile
// 
// INPUT:
// - userId: ObjectId
// - tutorData: Object {
//     maCB: String,
//     type: 'LECTURER' | 'RESEARCH_STUDENT' | 'SENIOR_STUDENT',
//     expertise: Array<Object>,
//     bio?: String
//   }
// 
// PSEUDOCODE:
// Step 1: Tìm Tutor theo userId
//   - let tutor = await Tutor.findOne({ userId: userId })
// 
// Step 2: Nếu tồn tại → Update
//   - If tutor:
//     → Object.assign(tutor, tutorData)
//     → await tutor.save()
// 
// Step 3: Nếu chưa tồn tại → Create
//   - Else:
//     → tutor = await Tutor.create({
//         userId: userId,
//         ...tutorData,
//         totalStudents: 0,
//         totalSessions: 0,
//         completedSessions: 0,
//         averageRating: 0,
//         totalReviews: 0,
//         isAcceptingStudents: true
//       })
// 
// OUTPUT:
// - Return Tutor object

// ============================================================
// FUNCTION: getUserById(userId)
// ============================================================
// PURPOSE: Lấy User với populated Student/Tutor
// 
// PSEUDOCODE:
// Step 1: Query User
//   - const user = await User.findById(userId)
//   - If !user → Throw NotFoundError("User không tồn tại")
// 
// Step 2: Populate based on role
//   - If user.role === 'STUDENT':
//     → await user.populate('student')
//   - Else if user.role === 'TUTOR' OR user.role === 'ADMIN':
//     → await user.populate('tutor')
// 
// OUTPUT:
// - Return User object (populated)

// REFACTORED: November 29, 2025 - Verified Architecture & Integration
// Architecture: Services import Repositories ONLY (not Models directly)
// Verified with: /backend/src/repositories/index.js

import UserRepository from '../../repositories/UserRepository.js';
import StudentRepository from '../../repositories/StudentRepository.js';
import TutorRepository from '../../repositories/TutorRepository.js';
import { NotFoundError } from '../../utils/error.js';

/**
 * Tạo hoặc update User record
 */
async function createOrUpdateUser(userData) {
  let user = await UserRepository.findOne({ email: userData.email });

  // Set hcmutId: use mssv, maCB, or email as fallback
  const hcmutId = userData.mssv || userData.maCB || userData.email.split('@')[0];

  if (user) {
    // Update existing user
    const updateData = {
      ...userData,
      hcmutId: hcmutId,
      lastSyncAt: new Date()
    };
    user = await UserRepository.update(user._id, updateData);
  } else {
    // Create new user
    user = await UserRepository.create({
      ...userData,
      hcmutId: hcmutId,
      lastSyncAt: new Date(),
      syncSource: 'DATACORE'
    });
  }

  return user;
}

/**
 * Tạo hoặc update Student profile
 */
async function createOrUpdateStudent(userId, studentData) {
  let student = await StudentRepository.findOne({ userId });

  if (student) {
    // Update existing student
    student = await StudentRepository.update(student._id, studentData);
  } else {
    // Create new student with default statistics
    student = await StudentRepository.create({
      userId,
      ...studentData,
      registeredTutors: [],
      stats: {
        totalSessionAttended: 0,
        completedSessionAttended: 0,
        cancelledSessionAttended: 0
      }
    });
  }

  return student;
}

/**
 * Tạo hoặc update Tutor profile
 */
async function createOrUpdateTutor(userId, tutorData) {
  let tutor = await TutorRepository.findOne({ userId });

  if (tutor) {
    // Update existing tutor
    tutor = await TutorRepository.update(tutor._id, tutorData);
  } else {
    // Create new tutor with default statistics
    tutor = await TutorRepository.create({
      userId,
      subjects: tutorData.subjects || tutorData.expertise || [],
      bio: tutorData.bio || '',
      maxStudents: tutorData.maxStudents || 200,
      isAcceptingStudents: true,
      stats: {
        totalStudents: 0,
        totalSessions: 0,
        completedSessions: 0,
        cancelledSessions: 0,
        averageRating: 0,
        totalReviews: 0
      }
    });
  }

  return tutor;
}

/**
 * Lấy User với populated Student/Tutor
 */
async function getUserById(userId) {
  const user = await UserRepository.findById(userId);
  
  if (!user) {
    throw new NotFoundError('User không tồn tại');
  }

  // Populate based on role
  if (user.role === 'STUDENT') {
    const student = await StudentRepository.findOne({ userId: user._id });
    user.student = student;
  } else if (user.role === 'TUTOR' || user.role === 'ADMIN') {
    const tutor = await TutorRepository.findOne({ userId: user._id });
    user.tutor = tutor;
  }

  return user;
}

export {
  createOrUpdateUser,
  createOrUpdateStudent,
  createOrUpdateTutor,
  getUserById
};
