/**
 * REPOSITORY: Tutor Repository
 * FILE: TutorRepository.js
 * MỤC ĐÍCH: Truy vấn database cho Tutor model
 * 
 * EXTENDS: BaseRepository
 * MODEL: Tutor
 */

// TODO: Import BaseRepository, Tutor model
// const BaseRepository = require('./BaseRepository')
// const Tutor = require('../models/Tutor')

// ============================================================
// CLASS: TutorRepository extends BaseRepository
// ============================================================
// CONSTRUCTOR:
// constructor() {
//   super(Tutor)
// }

// ============================================================
// METHOD: findByUserId(userId)
// ============================================================
// PURPOSE: Tìm Tutor record theo userId
// 
// INPUT:
// - userId: ObjectId
// 
// PSEUDOCODE:
// Step 1: Query by userId
//   const tutor = await this.model.findOne({ userId: userId })
//     .populate('userId')
// 
// Step 2: Return tutor
//   return tutor
// 
// OUTPUT:
// - Tutor document hoặc null

// ============================================================
// METHOD: findByMaCB(maCB)
// ============================================================
// PURPOSE: Tìm Tutor theo mã cán bộ
// 
// INPUT:
// - maCB: String
// 
// PSEUDOCODE:
// Step 1: Query by maCB
//   const tutor = await this.model.findOne({ maCB: maCB })
//     .populate('userId')
// 
// Step 2: Return tutor
//   return tutor
// 
// OUTPUT:
// - Tutor document hoặc null

// ============================================================
// METHOD: searchTutors(criteria, options)
// ============================================================
// PURPOSE: Tìm kiếm tutors với nhiều tiêu chí (UC-07)
// 
// INPUT:
// - criteria: { subjectId?, type?, minRating?, isAcceptingStudents? }
// - options: { page, limit, sort }
// 
// PSEUDOCODE:
// Step 1: Build filter
//   const filter = {}
//   
//   // Filter by subject
//   if (criteria.subjectId) {
//     filter['expertise.subjectId'] = criteria.subjectId
//   }
//   
//   // Filter by type
//   if (criteria.type) {
//     filter.type = criteria.type
//   }
//   
//   // Filter by rating
//   if (criteria.minRating) {
//     filter.averageRating = { $gte: criteria.minRating }
//   }
//   
//   // Filter by accepting students
//   if (criteria.isAcceptingStudents !== undefined) {
//     filter.isAcceptingStudents = criteria.isAcceptingStudents
//   }
// 
// Step 2: Calculate pagination
//   const page = options.page || 1
//   const limit = options.limit || 10
//   const skip = (page - 1) * limit
// 
// Step 3: Query tutors
//   const tutors = await this.model.find(filter)
//     .populate('userId', 'email fullName')
//     .sort(options.sort || { averageRating: -1, totalReviews: -1 })
//     .skip(skip)
//     .limit(limit)
// 
// Step 4: Count total
//   const total = await this.model.countDocuments(filter)
// 
// Step 5: Return paginated result
//   return {
//     data: tutors,
//     pagination: {
//       page,
//       limit,
//       total,
//       totalPages: Math.ceil(total / limit)
//     }
//   }
// 
// OUTPUT:
// - { data: [tutors], pagination: {...} }

// ============================================================
// METHOD: updateStatistics(tutorId, updates)
// ============================================================
// PURPOSE: Cập nhật statistics của tutor
// 
// INPUT:
// - tutorId: ObjectId
// - updates: Object {
//     totalStudents?,
//     totalSessions?,
//     completedSessions?,
//     cancelledSessions?,
//     averageRating?,
//     totalReviews?
//   }
// 
// PSEUDOCODE:
// Step 1: Build update query
//   const updateData = {}
//   
//   Object.keys(updates).forEach(key => {
//     if (updates[key] !== undefined) {
//       updateData[`statistics.${key}`] = updates[key]
//     }
//   })
// 
// Step 2: Update tutor
//   const tutor = await this.model.findByIdAndUpdate(
//     tutorId,
//     { $set: updateData },
//     { new: true }
//   )
// 
// Step 3: Return updated tutor
//   return tutor
// 
// OUTPUT:
// - Updated Tutor document

// ============================================================
// METHOD: incrementStatistic(tutorId, field)
// ============================================================
// PURPOSE: Increment một field trong statistics
// 
// INPUT:
// - tutorId: ObjectId
// - field: String (e.g., 'totalStudents', 'totalSessions')
// 
// PSEUDOCODE:
// Step 1: Increment field
//   const tutor = await this.model.findByIdAndUpdate(
//     tutorId,
//     { $inc: { [`statistics.${field}`]: 1 } },
//     { new: true }
//   )
// 
// Step 2: Return updated tutor
//   return tutor
// 
// OUTPUT:
// - Updated Tutor document

// ============================================================
// METHOD: updateRating(tutorId, newRating)
// ============================================================
// PURPOSE: Cập nhật averageRating sau khi có evaluation mới
// 
// INPUT:
// - tutorId: ObjectId
// - newRating: Number (1-5)
// 
// PSEUDOCODE:
// Step 1: Get current tutor
//   const tutor = await this.model.findById(tutorId)
//   if (!tutor) throw new Error('Tutor not found')
// 
// Step 2: Calculate new average
//   const currentTotal = tutor.statistics.averageRating * tutor.statistics.totalReviews
//   const newTotalReviews = tutor.statistics.totalReviews + 1
//   const newAverage = (currentTotal + newRating) / newTotalReviews
// 
// Step 3: Update tutor
//   const updatedTutor = await this.model.findByIdAndUpdate(
//     tutorId,
//     {
//       $set: {
//         'statistics.averageRating': newAverage,
//         'statistics.totalReviews': newTotalReviews
//       }
//     },
//     { new: true }
//   )
// 
// Step 4: Return updated tutor
//   return updatedTutor
// 
// OUTPUT:
// - Updated Tutor document với rating mới

// ============================================================
// METHOD: getTutorSessions(tutorId, filters, options)
// ============================================================
// PURPOSE: Lấy danh sách sessions của tutor (UC-21)
// 
// INPUT:
// - tutorId: ObjectId
// - filters: { status?, startDate?, endDate? }
// - options: { page, limit, sort }
// 
// PSEUDOCODE:
// Step 1: Build filter
//   const ConsultationSession = require('../models/ConsultationSession')
//   const filter = { tutorId: tutorId }
//   
//   if (filters.status) {
//     filter.status = filters.status
//   }
//   
//   if (filters.startDate || filters.endDate) {
//     filter.startTime = {}
//     if (filters.startDate) {
//       filter.startTime.$gte = new Date(filters.startDate)
//     }
//     if (filters.endDate) {
//       filter.startTime.$lte = new Date(filters.endDate)
//     }
//   }
// 
// Step 2: Calculate pagination
//   const page = options.page || 1
//   const limit = options.limit || 10
//   const skip = (page - 1) * limit
// 
// Step 3: Query sessions
//   const sessions = await ConsultationSession.find(filter)
//     .sort(options.sort || { startTime: -1 })
//     .skip(skip)
//     .limit(limit)
// 
// Step 4: Count total
//   const total = await ConsultationSession.countDocuments(filter)
// 
// Step 5: Return result
//   return {
//     data: sessions,
//     pagination: {
//       page,
//       limit,
//       total,
//       totalPages: Math.ceil(total / limit)
//     }
//   }
// 
// OUTPUT:
// - { data: [sessions], pagination: {...} }

// ============================================================
// METHOD: getTopRatedTutors(limit = 10)
// ============================================================
// PURPOSE: Lấy danh sách top tutors theo rating
// USE CASE: Homepage, ReportService
// 
// INPUT:
// - limit: Number (default 10)
// 
// PSEUDOCODE:
// Step 1: Query top tutors
//   const tutors = await this.model.find({
//     isAcceptingStudents: true,
//     'statistics.averageRating': { $gte: 4.5 }
//   })
//     .populate('userId', 'fullName email')
//     .sort({
//       'statistics.averageRating': -1,
//       'statistics.totalReviews': -1
//     })
//     .limit(limit)
// 
// Step 2: Return tutors
//   return tutors
// 
// OUTPUT:
// - Array of top-rated Tutors

// TODO: Implement TutorRepository class
// class TutorRepository extends BaseRepository { ... }

// TODO: Export singleton instance
// module.exports = new TutorRepository()
