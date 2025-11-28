/**
 * REPOSITORY: Student Repository
 * FILE: StudentRepository.js
 * MỤC ĐÍCH: Truy vấn database cho Student model
 * 
 * EXTENDS: BaseRepository
 * MODEL: Student
 */

// TODO: Import BaseRepository, Student model
// const BaseRepository = require('./BaseRepository')
// const Student = require('../models/Student')

// ============================================================
// CLASS: StudentRepository extends BaseRepository
// ============================================================
// CONSTRUCTOR:
// constructor() {
//   super(Student)
// }

// ============================================================
// METHOD: findByUserId(userId)
// ============================================================
// PURPOSE: Tìm Student record theo userId
// 
// INPUT:
// - userId: ObjectId
// 
// PSEUDOCODE:
// Step 1: Query by userId
//   const student = await this.model.findOne({ userId: userId })
//     .populate('userId') // Populate User info
// 
// Step 2: Return student
//   return student
// 
// OUTPUT:
// - Student document hoặc null

// ============================================================
// METHOD: findByMSSV(mssv)
// ============================================================
// PURPOSE: Tìm Student theo mã số sinh viên
// 
// INPUT:
// - mssv: String (7 digits)
// 
// PSEUDOCODE:
// Step 1: Query by mssv
//   const student = await this.model.findOne({ mssv: mssv })
//     .populate('userId')
// 
// Step 2: Return student
//   return student
// 
// OUTPUT:
// - Student document hoặc null

// ============================================================
// METHOD: updateStatistics(studentId, updates)
// ============================================================
// PURPOSE: Cập nhật statistics của student
// USE CASE: Increment sau khi register, book appointment, evaluate, etc.
// 
// INPUT:
// - studentId: ObjectId
// - updates: Object { registeredTutors?, totalAppointments?, totalEvaluations? }
// 
// PSEUDOCODE:
// Step 1: Build update query
//   const updateData = {}
//   
//   if (updates.registeredTutors !== undefined) {
//     updateData['statistics.registeredTutors'] = updates.registeredTutors
//   }
//   
//   if (updates.totalAppointments !== undefined) {
//     updateData['statistics.totalAppointments'] = updates.totalAppointments
//   }
//   
//   if (updates.totalEvaluations !== undefined) {
//     updateData['statistics.totalEvaluations'] = updates.totalEvaluations
//   }
// 
// Step 2: Update student
//   const student = await this.model.findByIdAndUpdate(
//     studentId,
//     { $set: updateData },
//     { new: true }
//   )
// 
// Step 3: Return updated student
//   return student
// 
// OUTPUT:
// - Updated Student document

// ============================================================
// METHOD: incrementStatistic(studentId, field)
// ============================================================
// PURPOSE: Increment một field trong statistics
// 
// INPUT:
// - studentId: ObjectId
// - field: String ('registeredTutors' | 'totalAppointments' | 'totalEvaluations')
// 
// PSEUDOCODE:
// Step 1: Increment field
//   const student = await this.model.findByIdAndUpdate(
//     studentId,
//     { $inc: { [`statistics.${field}`]: 1 } },
//     { new: true }
//   )
// 
// Step 2: Return updated student
//   return student
// 
// OUTPUT:
// - Updated Student document

// ============================================================
// METHOD: getAppointmentHistory(studentId, options)
// ============================================================
// PURPOSE: Lấy lịch sử appointments của student (UC-28)
// 
// INPUT:
// - studentId: ObjectId
// - options: { status?, page, limit, sort }
// 
// PSEUDOCODE:
// Step 1: Build query
//   const Appointment = require('../models/Appointment')
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
// Step 3: Query appointments
//   const appointments = await Appointment.find(filter)
//     .populate('sessionId')
//     .populate('tutorId')
//     .sort(options.sort || { createdAt: -1 })
//     .skip(skip)
//     .limit(limit)
// 
// Step 4: Count total
//   const total = await Appointment.countDocuments(filter)
// 
// Step 5: Return paginated result
//   return {
//     data: appointments,
//     pagination: {
//       page,
//       limit,
//       total,
//       totalPages: Math.ceil(total / limit)
//     }
//   }
// 
// OUTPUT:
// - { data: [], pagination: {...} }

// ============================================================
// METHOD: getEvaluationHistory(studentId, options)
// ============================================================
// PURPOSE: Lấy lịch sử evaluations đã cho (UC-29)
// 
// INPUT:
// - studentId: ObjectId
// - options: { page, limit }
// 
// PSEUDOCODE:
// Step 1: Calculate pagination
//   const page = options.page || 1
//   const limit = options.limit || 10
//   const skip = (page - 1) * limit
// 
// Step 2: Query StudentEvaluations
//   const StudentEvaluation = require('../models/StudentEvaluation')
//   const evaluations = await StudentEvaluation.find({ studentId: studentId })
//     .populate('sessionId')
//     .populate('tutorId')
//     .sort({ createdAt: -1 })
//     .skip(skip)
//     .limit(limit)
// 
// Step 3: Count total
//   const total = await StudentEvaluation.countDocuments({ studentId: studentId })
// 
// Step 4: Return paginated result
//   return {
//     data: evaluations,
//     pagination: {
//       page,
//       limit,
//       total,
//       totalPages: Math.ceil(total / limit)
//     }
//   }
// 
// OUTPUT:
// - { data: [], pagination: {...} }

import BaseRepository from './BaseRepository.js';
import Student from '../models/Student.model.js';

class StudentRepository extends BaseRepository {
  constructor() {
    super(Student);
  }

  async findByUserId(userId) {
    return await this.model.findOne({ userId }).populate('userId');
  }

  async findByMSSV(mssv) {
    return await this.model.findOne({ mssv }).populate('userId');
  }

  async updateStatistics(studentId, updates) {
    const updateData = {};
    Object.keys(updates).forEach(key => {
      if (updates[key] !== undefined) {
        updateData[`stats.${key}`] = updates[key];
      }
    });

    return await this.model.findByIdAndUpdate(
      studentId,
      { $set: updateData },
      { new: true }
    );
  }

  async incrementStatistic(studentId, field) {
    return await this.model.findByIdAndUpdate(
      studentId,
      { $inc: { [`stats.${field}`]: 1 } },
      { new: true }
    );
  }
}

export default new StudentRepository();
