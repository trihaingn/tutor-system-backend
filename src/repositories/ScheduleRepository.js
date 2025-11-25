/**
 * REPOSITORY: Schedule Repository (CourseRegistration)
 * FILE: ScheduleRepository.js
 * MỤC ĐÍCH: Truy vấn database cho CourseRegistration model
 * 
 * EXTENDS: BaseRepository
 * MODEL: CourseRegistration
 * 
 * NOTE: File name "ScheduleRepository" đặt không chuẩn, nên đổi thành "RegistrationRepository"
 */

// TODO: Import BaseRepository, CourseRegistration model
// const BaseRepository = require('./BaseRepository')
// const CourseRegistration = require('../models/CourseRegistration')

// ============================================================
// CLASS: ScheduleRepository extends BaseRepository
// ============================================================
// CONSTRUCTOR:
// constructor() {
//   super(CourseRegistration)
// }

// ============================================================
// METHOD: findDuplicateRegistration(studentId, tutorId, subjectId)
// ============================================================
// PURPOSE: Kiểm tra registration trùng lặp (BR-006)
// USE CASE: RegistrationService.checkDuplicateRegistration()
// 
// INPUT:
// - studentId: ObjectId
// - tutorId: ObjectId
// - subjectId: String
// 
// PSEUDOCODE:
// Step 1: Query for existing registration
//   const registration = await this.model.findOne({
//     studentId: studentId,
//     tutorId: tutorId,
//     subjectId: subjectId,
//     status: 'ACTIVE' // Only check active registrations
//   })
// 
// Step 2: Return registration
//   return registration
// 
// OUTPUT:
// - CourseRegistration hoặc null

// ============================================================
// METHOD: findStudentRegistrations(studentId, options)
// ============================================================
// PURPOSE: Lấy danh sách registrations của student
// 
// INPUT:
// - studentId: ObjectId
// - options: { status?, page, limit }
// 
// PSEUDOCODE:
// Step 1: Build filter
//   const filter = { studentId: studentId }
//   
//   if (options.status) {
//     filter.status = options.status
//   }
// 
// Step 2: Calculate pagination
//   const page = options.page || 1
//   const limit = options.limit || 10
//   const skip = (page - 1) * limit
// 
// Step 3: Query registrations
//   const registrations = await this.model.find(filter)
//     .populate('tutorId')
//     .populate('studentId')
//     .sort({ createdAt: -1 })
//     .skip(skip)
//     .limit(limit)
// 
// Step 4: Count total
//   const total = await this.model.countDocuments(filter)
// 
// Step 5: Return result
//   return {
//     data: registrations,
//     pagination: {
//       page,
//       limit,
//       total,
//       totalPages: Math.ceil(total / limit)
//     }
//   }
// 
// OUTPUT:
// - { data: [registrations], pagination: {...} }

// ============================================================
// METHOD: findTutorRegistrations(tutorId, options)
// ============================================================
// PURPOSE: Lấy danh sách students đã đăng ký với tutor
// 
// INPUT:
// - tutorId: ObjectId
// - options: { status?, page, limit }
// 
// PSEUDOCODE:
// Step 1: Build filter
//   const filter = { tutorId: tutorId }
//   
//   if (options.status) {
//     filter.status = options.status
//   }
// 
// Step 2: Calculate pagination
//   const page = options.page || 1
//   const limit = options.limit || 10
//   const skip = (page - 1) * limit
// 
// Step 3: Query registrations
//   const registrations = await this.model.find(filter)
//     .populate('studentId')
//     .sort({ createdAt: -1 })
//     .skip(skip)
//     .limit(limit)
// 
// Step 4: Count total
//   const total = await this.model.countDocuments(filter)
// 
// Step 5: Return result
//   return {
//     data: registrations,
//     pagination: {
//       page,
//       limit,
//       total,
//       totalPages: Math.ceil(total / limit)
//     }
//   }
// 
// OUTPUT:
// - { data: [registrations], pagination: {...} }

// ============================================================
// METHOD: checkRegistrationExists(studentId, tutorId)
// ============================================================
// PURPOSE: Kiểm tra student đã đăng ký với tutor chưa
// USE CASE: SessionService.bookAppointment() validation
// 
// INPUT:
// - studentId: ObjectId
// - tutorId: ObjectId
// 
// PSEUDOCODE:
// Step 1: Check if active registration exists
//   const registration = await this.model.findOne({
//     studentId: studentId,
//     tutorId: tutorId,
//     status: 'ACTIVE'
//   })
// 
// Step 2: Return boolean
//   return !!registration
// 
// OUTPUT:
// - Boolean (true nếu đã đăng ký)

// ============================================================
// METHOD: cancelRegistration(registrationId)
// ============================================================
// PURPOSE: Hủy registration
// 
// INPUT:
// - registrationId: ObjectId
// 
// PSEUDOCODE:
// Step 1: Update status to CANCELLED
//   const registration = await this.model.findByIdAndUpdate(
//     registrationId,
//     { status: 'CANCELLED' },
//     { new: true }
//   )
// 
// Step 2: Return updated registration
//   return registration
// 
// OUTPUT:
// - Updated CourseRegistration

// ============================================================
// METHOD: countNewRegistrations(tutorId, startDate, endDate)
// ============================================================
// PURPOSE: Đếm số registrations mới trong khoảng thời gian
// USE CASE: ReportService.generateTutorReport()
// 
// INPUT:
// - tutorId: ObjectId
// - startDate: Date
// - endDate: Date
// 
// PSEUDOCODE:
// Step 1: Count registrations
//   const count = await this.model.countDocuments({
//     tutorId: tutorId,
//     status: 'ACTIVE',
//     createdAt: {
//       $gte: startDate,
//       $lte: endDate
//     }
//   })
// 
// Step 2: Return count
//   return count
// 
// OUTPUT:
// - Number (số registrations mới)

// TODO: Implement ScheduleRepository class
// class ScheduleRepository extends BaseRepository { ... }

// TODO: Export singleton instance
// module.exports = new ScheduleRepository()
