/**
 * REPOSITORY: Session Repository
 * FILE: SessionRepository.js
 * MỤC ĐÍCH: Truy vấn database cho ConsultationSession model
 * 
 * EXTENDS: BaseRepository
 * MODEL: ConsultationSession
 */

// TODO: Import BaseRepository, ConsultationSession model
// const BaseRepository = require('./BaseRepository')
// const ConsultationSession = require('../models/ConsultationSession')

// ============================================================
// CLASS: SessionRepository extends BaseRepository
// ============================================================
// CONSTRUCTOR:
// constructor() {
//   super(ConsultationSession)
// }

// ============================================================
// METHOD: findOverlappingSessions(tutorId, startTime, endTime, excludeSessionId = null)
// ============================================================
// PURPOSE: Kiểm tra sessions chồng lấp thời gian (BR-002)
// USE CASE: ScheduleService.checkSessionConflicts()
// 
// INPUT:
// - tutorId: ObjectId
// - startTime: Date
// - endTime: Date
// - excludeSessionId: ObjectId (optional, khi update session)
// 
// PSEUDOCODE:
// Step 1: Build query
//   const filter = {
//     tutorId: tutorId,
//     status: { $ne: 'CANCELLED' }, // Ignore cancelled sessions
//     $or: [
//       // Case 1: New session starts during existing session
//       {
//         startTime: { $lte: startTime },
//         endTime: { $gt: startTime }
//       },
//       // Case 2: New session ends during existing session
//       {
//         startTime: { $lt: endTime },
//         endTime: { $gte: endTime }
//       },
//       // Case 3: New session completely covers existing session
//       {
//         startTime: { $gte: startTime },
//         endTime: { $lte: endTime }
//       }
//     ]
//   }
//   
//   // Exclude current session (when updating)
//   if (excludeSessionId) {
//     filter._id = { $ne: excludeSessionId }
//   }
// 
// Step 2: Query overlapping sessions
//   const sessions = await this.model.find(filter)
// 
// Step 3: Return sessions
//   return sessions
// 
// OUTPUT:
// - Array of overlapping sessions (empty if no conflicts)

// ============================================================
// METHOD: findUpcomingSessions(tutorId, limit = 10)
// ============================================================
// PURPOSE: Lấy các sessions sắp tới của tutor (UC-16)
// 
// INPUT:
// - tutorId: ObjectId
// - limit: Number
// 
// PSEUDOCODE:
// Step 1: Query upcoming sessions
//   const sessions = await this.model.find({
//     tutorId: tutorId,
//     startTime: { $gte: new Date() },
//     status: 'SCHEDULED'
//   })
//     .sort({ startTime: 1 }) // Ascending order (earliest first)
//     .limit(limit)
// 
// Step 2: Return sessions
//   return sessions
// 
// OUTPUT:
// - Array of upcoming ConsultationSessions

// ============================================================
// METHOD: findStudentUpcomingSessions(studentId, limit = 10)
// ============================================================
// PURPOSE: Lấy sessions mà student đã book (UC-17)
// 
// INPUT:
// - studentId: ObjectId
// - limit: Number
// 
// PSEUDOCODE:
// Step 1: Find student's confirmed appointments
//   const Appointment = require('../models/Appointment')
//   const appointments = await Appointment.find({
//     studentId: studentId,
//     status: { $in: ['PENDING', 'CONFIRMED'] }
//   }).select('sessionId')
//   
//   const sessionIds = appointments.map(a => a.sessionId)
// 
// Step 2: Query sessions
//   const sessions = await this.model.find({
//     _id: { $in: sessionIds },
//     startTime: { $gte: new Date() },
//     status: 'SCHEDULED'
//   })
//     .populate('tutorId')
//     .sort({ startTime: 1 })
//     .limit(limit)
// 
// Step 3: Return sessions
//   return sessions
// 
// OUTPUT:
// - Array of upcoming sessions student joined

// ============================================================
// METHOD: findSessionsByDateRange(tutorId, startDate, endDate)
// ============================================================
// PURPOSE: Lấy sessions trong khoảng thời gian
// USE CASE: ReportService.generateTutorReport()
// 
// INPUT:
// - tutorId: ObjectId
// - startDate: Date
// - endDate: Date
// 
// PSEUDOCODE:
// Step 1: Query sessions in date range
//   const sessions = await this.model.find({
//     tutorId: tutorId,
//     startTime: {
//       $gte: startDate,
//       $lte: endDate
//     }
//   })
//     .sort({ startTime: 1 })
// 
// Step 2: Return sessions
//   return sessions
// 
// OUTPUT:
// - Array of ConsultationSessions trong range

// ============================================================
// METHOD: findSessionsNeedingFeedback(tutorId)
// ============================================================
// PURPOSE: Lấy sessions COMPLETED chưa có report
// USE CASE: Remind tutor to create feedback
// 
// INPUT:
// - tutorId: ObjectId
// 
// PSEUDOCODE:
// Step 1: Query sessions without feedback
//   const sessions = await this.model.find({
//     tutorId: tutorId,
//     status: 'COMPLETED',
//     hasReport: false
//   })
//     .sort({ endTime: -1 })
//     .limit(20)
// 
// Step 2: Return sessions
//   return sessions
// 
// OUTPUT:
// - Array of sessions cần feedback

// ============================================================
// METHOD: updateSessionStatus(sessionId, newStatus)
// ============================================================
// PURPOSE: Cập nhật trạng thái session
// 
// INPUT:
// - sessionId: ObjectId
// - newStatus: String (SCHEDULED | COMPLETED | CANCELLED)
// 
// PSEUDOCODE:
// Step 1: Update status
//   const session = await this.model.findByIdAndUpdate(
//     sessionId,
//     { status: newStatus },
//     { new: true }
//   )
// 
// Step 2: Return updated session
//   return session
// 
// OUTPUT:
// - Updated ConsultationSession

// ============================================================
// METHOD: incrementParticipants(sessionId)
// ============================================================
// PURPOSE: Tăng currentParticipants khi có student book
// 
// INPUT:
// - sessionId: ObjectId
// 
// PSEUDOCODE:
// Step 1: Increment counter
//   const session = await this.model.findByIdAndUpdate(
//     sessionId,
//     { $inc: { currentParticipants: 1 } },
//     { new: true }
//   )
// 
// Step 2: Return updated session
//   return session
// 
// OUTPUT:
// - Updated ConsultationSession

// ============================================================
// METHOD: decrementParticipants(sessionId)
// ============================================================
// PURPOSE: Giảm currentParticipants khi student hủy
// 
// INPUT:
// - sessionId: ObjectId
// 
// PSEUDOCODE:
// Step 1: Decrement counter (ensure not negative)
//   const session = await this.model.findByIdAndUpdate(
//     sessionId,
//     { $inc: { currentParticipants: -1 } },
//     { new: true }
//   )
//   
//   // Ensure currentParticipants >= 0
//   if (session.currentParticipants < 0) {
//     session.currentParticipants = 0
//     await session.save()
//   }
// 
// Step 2: Return updated session
//   return session
// 
// OUTPUT:
// - Updated ConsultationSession

// ============================================================
// METHOD: getSessionStatistics(tutorId, startDate, endDate)
// ============================================================
// PURPOSE: Tính toán thống kê sessions cho report
// 
// INPUT:
// - tutorId: ObjectId
// - startDate: Date
// - endDate: Date
// 
// PSEUDOCODE:
// Step 1: Aggregate statistics
//   const stats = await this.model.aggregate([
//     {
//       $match: {
//         tutorId: tutorId,
//         startTime: { $gte: startDate, $lte: endDate }
//       }
//     },
//     {
//       $group: {
//         _id: '$status',
//         count: { $sum: 1 },
//         totalParticipants: { $sum: '$currentParticipants' }
//       }
//     }
//   ])
// 
// Step 2: Format result
//   const result = {
//     totalSessions: 0,
//     completedSessions: 0,
//     cancelledSessions: 0,
//     totalParticipants: 0,
//     averageParticipants: 0
//   }
//   
//   stats.forEach(stat => {
//     result.totalSessions += stat.count
//     if (stat._id === 'COMPLETED') {
//       result.completedSessions = stat.count
//     }
//     if (stat._id === 'CANCELLED') {
//       result.cancelledSessions = stat.count
//     }
//     result.totalParticipants += stat.totalParticipants
//   })
//   
//   if (result.completedSessions > 0) {
//     result.averageParticipants = result.totalParticipants / result.completedSessions
//   }
// 
// Step 3: Return statistics
//   return result
// 
// OUTPUT:
// - { totalSessions, completedSessions, cancelledSessions, totalParticipants, averageParticipants }

// TODO: Implement SessionRepository class
// class SessionRepository extends BaseRepository { ... }

// TODO: Export singleton instance
// module.exports = new SessionRepository()
