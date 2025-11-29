/**
 * SERVICE: TutorService
 * FILE: TutorService.js
 * MỤC ĐÍCH: Xử lý logic search Tutors và quản lý Tutor profile
 * 
 * DEPENDENCIES:
 * - Tutor Model, User Model
 * - TutorSession Model, StudentFeedback Model
 */

// ============================================================
// FUNCTION: searchTutors(searchCriteria)
// ============================================================
// PURPOSE: Student search Tutors theo subject (UC-07)
// 
// INPUT:
// - searchCriteria: Object {
//     subjectId?: String,
//     type?: 'LECTURER' | 'RESEARCH_STUDENT' | 'SENIOR_STUDENT',
//     minRating?: Number,
//     isAcceptingStudents?: Boolean,
//     page?: Number,
//     limit?: Number
//   }
// 
// PSEUDOCODE:
// Step 1: Build query
//   query = {}
//   
//   - If searchCriteria.subjectId:
//     → query['expertise.subjectId'] = searchCriteria.subjectId
//   
//   - If searchCriteria.type:
//     → query.type = searchCriteria.type
//   
//   - If searchCriteria.minRating:
//     → query.averageRating = { $gte: searchCriteria.minRating }
//   
//   - If searchCriteria.isAcceptingStudents !== undefined:
//     → query.isAcceptingStudents = searchCriteria.isAcceptingStudents
//   - Else:
//     → query.isAcceptingStudents = true (default: chỉ show tutors đang nhận HS)
// 
// Step 2: Pagination
//   - const page = searchCriteria.page || 1
//   - const limit = searchCriteria.limit || 20
//   - const skip = (page - 1) * limit
// 
// Step 3: Query với populate
//   - const tutors = await Tutor.find(query)
//       .populate('userId', 'fullName email faculty')
//       .sort({ averageRating: -1, totalReviews: -1 }) // Sort by rating DESC
//       .skip(skip)
//       .limit(limit)
// 
// Step 4: Count total
//   - const total = await Tutor.countDocuments(query)
// 
// OUTPUT:
// - Return {
//     data: tutors,
//     pagination: { currentPage, totalPages, totalItems, itemsPerPage }
//   }

// ============================================================
// FUNCTION: getTutorDetails(tutorId)
// ============================================================
// PURPOSE: Lấy chi tiết Tutor profile (public view)
// 
// PSEUDOCODE:
// Step 1: Query Tutor với populate
//   - const tutor = await Tutor.findById(tutorId)
//       .populate('userId', 'fullName email faculty')
//   - If !tutor → Throw NotFoundError("Tutor không tồn tại")
// 
// Step 2: Return full profile
//   - Return {
//       tutorId: tutor._id,
//       user: tutor.userId,
//       maCB: tutor.maCB,
//       type: tutor.type,
//       expertise: tutor.expertise,
//       bio: tutor.bio,
//       statistics: {
//         totalStudents: tutor.totalStudents,
//         totalSessions: tutor.totalSessions,
//         completedSessions: tutor.completedSessions,
//         averageRating: tutor.averageRating,
//         totalReviews: tutor.totalReviews
//       },
//       isAcceptingStudents: tutor.isAcceptingStudents
//     }

// ============================================================
// FUNCTION: getTutorSessions(tutorId, filters)
// ============================================================
// PURPOSE: Lấy danh sách sessions của Tutor (UC-21)
// 
// INPUT:
// - tutorId: ObjectId
// - filters: Object { status?, startDate?, endDate?, page?, limit? }
// 
// PSEUDOCODE:
// Step 1: Build query
//   query = { tutorId: tutorId }
//   
//   - If filters.status:
//     → query.status = filters.status
//   
//   - If filters.startDate OR filters.endDate:
//     → query.startTime = {}
//     → If filters.startDate: query.startTime.$gte = filters.startDate
//     → If filters.endDate: query.startTime.$lte = filters.endDate
// 
// Step 2: Query với pagination
//   - const sessions = await TutorSession.find(query)
//       .sort({ startTime: -1 })
//       .skip(skip)
//       .limit(limit)
// 
// OUTPUT:
// - Return { data: sessions, pagination: {...} }

// ============================================================
// FUNCTION: getTutorFeedbacks(tutorId, filters)
// ============================================================
// PURPOSE: Lấy evaluations Tutor nhận được (UC-22)
// 
// PSEUDOCODE:
// Step 1-2: Query StudentFeedback where tutorId = tutorId
//   - Populate studentId (nếu isAnonymous = false)
//   - Populate sessionId
//   - Sort by evaluatedAt DESC
//   - Return với pagination

// ============================================================
// FUNCTION: updateTutorRating(tutorId)
// ============================================================
// PURPOSE: Recalculate Tutor average rating (called when new feedback added)
// 
// PSEUDOCODE:
// Step 1: Aggregate all evaluations
//   - const evaluations = await StudentFeedback.find({ tutorId: tutorId })
//   - const totalRating = evaluations.reduce((sum, eval) => sum + eval.rating, 0)
//   - const averageRating = totalRating / evaluations.length
// 
// Step 2: Update Tutor stats
//   - await Tutor.findByIdAndUpdate(tutorId, {
//       averageRating: averageRating,
//       totalReviews: evaluations.length
//     })
// 
// OUTPUT:
// - Return { averageRating, totalReviews }

// REFACTORED: November 29, 2025 - Verified Architecture & Integration
// Architecture: Services import Repositories ONLY
// Verified with: /backend/src/repositories/index.js

import TutorRepository from '../../repositories/TutorRepository.js';
import UserRepository from '../../repositories/UserRepository.js';
import { NotFoundError, ValidationError } from '../../utils/error.js';

/**
 * Student search Tutors theo subject (UC-07)
 */
async function searchTutors(searchCriteria) {
  const query = {};
  
  if (searchCriteria.subjectId) {
    query['expertise.subjectId'] = searchCriteria.subjectId;
  }
  
  if (searchCriteria.type) {
    query.type = searchCriteria.type;
  }
  
  if (searchCriteria.minRating) {
    query.averageRating = { $gte: searchCriteria.minRating };
  }
  
  if (searchCriteria.isAcceptingStudents !== undefined) {
    query.isAcceptingStudents = searchCriteria.isAcceptingStudents;
  } else {
    query.isAcceptingStudents = true; // Default: only accepting tutors
  }

  const page = searchCriteria.page || 1;
  const limit = searchCriteria.limit || 20;
  const options = {
    skip: (page - 1) * limit,
    limit: limit,
    sort: { averageRating: -1, totalReviews: -1 }
  };

  const tutors = await TutorRepository.findAll(query, options);
  const total = await TutorRepository.count(query);

  // Manually populate userId for each tutor
  const populatedTutors = await Promise.all(
    tutors.map(async (tutor) => {
      const user = await UserRepository.findById(tutor.userId);
      return {
        ...tutor.toObject(),
        userId: user ? {
          _id: user._id,
          fullName: user.fullName,
          email: user.email,
          faculty: user.faculty
        } : null
      };
    })
  );

  return {
    data: populatedTutors,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      itemsPerPage: limit
    }
  };
}

/**
 * Lấy chi tiết Tutor profile (public view)
 */
async function getTutorDetails(tutorId) {
  const tutor = await TutorRepository.findById(tutorId);
  
  if (!tutor) {
    throw new NotFoundError('Tutor không tồn tại');
  }

  // Manually populate userId
  const user = await UserRepository.findById(tutor.userId);

  return {
    tutorId: tutor._id,
    user: user ? {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      faculty: user.faculty
    } : null,
    maCB: tutor.maCB,
    type: tutor.type,
    expertise: tutor.expertise,
    bio: tutor.bio,
    statistics: {
      totalStudents: tutor.totalStudents,
      totalSessions: tutor.totalSessions,
      completedSessions: tutor.completedSessions,
      averageRating: tutor.averageRating,
      totalReviews: tutor.totalReviews
    },
    isAcceptingStudents: tutor.isAcceptingStudents
  };
}

/**
 * Update Tutor rating (called when new feedback added)
 */
async function updateTutorRating(tutorId, newRating, totalReviews) {
  await TutorRepository.updateRating(tutorId, newRating, totalReviews);
  return { success: true };
}

export {
  searchTutors,
  getTutorDetails,
  updateTutorRating
};
