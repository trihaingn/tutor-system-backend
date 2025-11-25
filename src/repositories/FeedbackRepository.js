/**
 * REPOSITORY: Feedback Repository
 * FILE: FeedbackRepository.js
 * MỤC ĐÍCH: Truy vấn database cho Feedback model
 * 
 * EXTENDS: BaseRepository
 * MODEL: Feedback
 */

// TODO: Import BaseRepository, Feedback model
// const BaseRepository = require('./BaseRepository')
// const Feedback = require('../models/Feedback')

// ============================================================
// CLASS: FeedbackRepository extends BaseRepository
// ============================================================
// CONSTRUCTOR:
// constructor() {
//   super(Feedback)
// }

// ============================================================
// METHOD: findBySessionId(sessionId)
// ============================================================
// PURPOSE: Tìm feedback theo sessionId (unique constraint)
// 
// INPUT:
// - sessionId: ObjectId
// 
// PSEUDOCODE:
// Step 1: Query by sessionId
//   const feedback = await this.model.findOne({ sessionId: sessionId })
//     .populate('tutorId', 'fullName email')
//     .populate('sessionId')
// 
// Step 2: Return feedback
//   return feedback
// 
// OUTPUT:
// - Feedback document hoặc null

// ============================================================
// METHOD: checkFeedbackExists(sessionId)
// ============================================================
// PURPOSE: Kiểm tra session đã có feedback chưa
// USE CASE: FeedbackService.createSessionReport() validation
// 
// INPUT:
// - sessionId: ObjectId
// 
// PSEUDOCODE:
// Step 1: Check existence
//   const exists = await this.model.exists({ sessionId: sessionId })
// 
// Step 2: Return boolean
//   return !!exists
// 
// OUTPUT:
// - Boolean

// ============================================================
// METHOD: findTutorFeedbacks(tutorId, options)
// ============================================================
// PURPOSE: Lấy danh sách feedbacks của tutor
// 
// INPUT:
// - tutorId: ObjectId
// - options: { page, limit }
// 
// PSEUDOCODE:
// Step 1: Calculate pagination
//   const page = options.page || 1
//   const limit = options.limit || 10
//   const skip = (page - 1) * limit
// 
// Step 2: Query feedbacks
//   const feedbacks = await this.model.find({ tutorId: tutorId })
//     .populate('sessionId')
//     .sort({ createdAt: -1 })
//     .skip(skip)
//     .limit(limit)
// 
// Step 3: Count total
//   const total = await this.model.countDocuments({ tutorId: tutorId })
// 
// Step 4: Return result
//   return {
//     data: feedbacks,
//     pagination: {
//       page,
//       limit,
//       total,
//       totalPages: Math.ceil(total / limit)
//     }
//   }
// 
// OUTPUT:
// - { data: [feedbacks], pagination: {...} }

// TODO: Implement FeedbackRepository class
// class FeedbackRepository extends BaseRepository { ... }

// TODO: Export singleton instance
// module.exports = new FeedbackRepository()
