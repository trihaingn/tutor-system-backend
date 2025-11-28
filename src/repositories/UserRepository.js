/**
 * REPOSITORY: User Repository
 * FILE: UserRepository.js
 * MỤC ĐÍCH: Truy vấn database cho User model
 * 
 * EXTENDS: BaseRepository
 * MODEL: User
 */

// TODO: Import BaseRepository, User model
// const BaseRepository = require('./BaseRepository')
// const User = require('../models/User')

// ============================================================
// CLASS: UserRepository extends BaseRepository
// ============================================================
// CONSTRUCTOR:
// constructor() {
//   super(User) // Pass User model to BaseRepository
// }

// ============================================================
// METHOD: findByEmail(email)
// ============================================================
// PURPOSE: Tìm user theo email (unique field)
// 
// INPUT:
// - email: String
// 
// PSEUDOCODE:
// Step 1: Query by email
//   const user = await this.model.findOne({ email: email })
//     .populate('student')
//     .populate('tutor')
// 
// Step 2: Return user
//   return user
// 
// OUTPUT:
// - User document với student/tutor populated hoặc null

// ============================================================
// METHOD: findByMSSV(mssv)
// ============================================================
// PURPOSE: Tìm user qua Student.mssv
// 
// INPUT:
// - mssv: String (7 digits)
// 
// PSEUDOCODE:
// Step 1: Find Student by mssv
//   const Student = require('../models/Student')
//   const student = await Student.findOne({ mssv: mssv })
// 
// Step 2: If student exists, find User
//   if (!student) return null
//   
//   const user = await this.model.findById(student.userId)
//     .populate('student')
//     .populate('tutor')
// 
// Step 3: Return user
//   return user
// 
// OUTPUT:
// - User document hoặc null

// ============================================================
// METHOD: findByMaCB(maCB)
// ============================================================
// PURPOSE: Tìm user qua Tutor.maCB
// 
// INPUT:
// - maCB: String (mã cán bộ)
// 
// PSEUDOCODE:
// Step 1: Find Tutor by maCB
//   const Tutor = require('../models/Tutor')
//   const tutor = await Tutor.findOne({ maCB: maCB })
// 
// Step 2: If tutor exists, find User
//   if (!tutor) return null
//   
//   const user = await this.model.findById(tutor.userId)
//     .populate('student')
//     .populate('tutor')
// 
// Step 3: Return user
//   return user
// 
// OUTPUT:
// - User document hoặc null

// ============================================================
// METHOD: findUsersNeedSync()
// ============================================================
// PURPOSE: Tìm users cần đồng bộ DATACORE (lastSyncAt > 24h)
// USE CASE: DataSyncService.syncAllUsers()
// 
// PSEUDOCODE:
// Step 1: Calculate cutoff time
//   const cutoffTime = new Date(Date.now() - 24 * 60 * 60 * 1000) // 24 hours ago
// 
// Step 2: Query users
//   const users = await this.model.find({
//     $or: [
//       { lastSyncAt: null },
//       { lastSyncAt: { $lt: cutoffTime } }
//     ]
//   })
//     .populate('student')
//     .populate('tutor')
//     .limit(100) // Batch size
// 
// Step 3: Return users
//   return users
// 
// OUTPUT:
// - Array of Users cần sync

// ============================================================
// METHOD: updateLastSync(userId)
// ============================================================
// PURPOSE: Cập nhật lastSyncAt sau khi sync DATACORE
// 
// INPUT:
// - userId: ObjectId
// 
// PSEUDOCODE:
// Step 1: Update lastSyncAt
//   const user = await this.model.findByIdAndUpdate(
//     userId,
//     { lastSyncAt: new Date() },
//     { new: true }
//   )
// 
// Step 2: Return updated user
//   return user
// 
// OUTPUT:
// - Updated User document

// ============================================================
// METHOD: findActiveUsers()
// ============================================================
// PURPOSE: Lấy danh sách users đang active
// 
// PSEUDOCODE:
// Step 1: Query active users
//   const users = await this.model.find({ status: 'ACTIVE' })
//     .select('-__v')
//     .sort({ createdAt: -1 })
// 
// Step 2: Return users
//   return users
// 
// OUTPUT:
// - Array of active Users

import BaseRepository from './BaseRepository.js';
import User from '../models/User.model.js';
import Student from '../models/Student.model.js';
import Tutor from '../models/Tutor.model.js';

class UserRepository extends BaseRepository {
  constructor() {
    super(User);
  }

  async findByEmail(email) {
    return await this.model
      .findOne({ email: email.toLowerCase() })
      .populate('student')
      .populate('tutor');
  }

  async findByMSSV(mssv) {
    const student = await Student.findOne({ mssv });
    if (!student) return null;

    return await this.model
      .findById(student.userId)
      .populate('student')
      .populate('tutor');
  }

  async findByMaCB(maCB) {
    const tutor = await Tutor.findOne({ maCB });
    if (!tutor) return null;

    return await this.model
      .findById(tutor.userId)
      .populate('student')
      .populate('tutor');
  }

  async findUsersNeedSync() {
    const cutoffTime = new Date(Date.now() - 24 * 60 * 60 * 1000);
    return await this.model
      .find({
        $or: [{ lastSyncAt: null }, { lastSyncAt: { $lt: cutoffTime } }]
      })
      .populate('student')
      .populate('tutor')
      .limit(100);
  }

  async updateLastSync(userId) {
    return await this.model.findByIdAndUpdate(
      userId,
      { lastSyncAt: new Date() },
      { new: true }
    );
  }

  async findActiveUsers() {
    return await this.model
      .find({ status: 'ACTIVE' })
      .select('-__v')
      .sort({ createdAt: -1 });
  }
}

export default new UserRepository();
