/**
 * MODEL: Student
 * FILE: Student.model.js
 * MỤC ĐÍCH: Lưu trữ thông tin bổ sung dành riêng cho Sinh viên
 *           (enrollment info, academic data, participation statistics)
 * 
 * QUAN HỆ:
 * - N-1 với User (1-1 unique thực tế)
 * - 1-N với CourseRegistration (1 student có nhiều registrations)
 * - 1-N với Appointment (1 student có nhiều appointments)
 * - 1-N với StudentEvaluation (1 student đánh giá nhiều tutors)
 * 
 * CÁC TRƯỜNG (FIELDS):
 * 
 * 1. REFERENCE:
 *    - userId (ObjectId, ref: 'User', required, unique, index): Liên kết tới User model
 * 
 * 2. ACADEMIC INFORMATION (Thông tin học tập từ DATACORE):
 *    - mssv (String, required, unique, index): Mã số sinh viên
 *    - major (String, required): Ngành học (ví dụ: 'Computer Science', 'Electrical Engineering')
 *    - enrollmentYear (Number, required): Năm nhập học (ví dụ: 2020, 2021)
 *    - currentYear (Number, min: 1, max: 6, default: 1): Năm học hiện tại (1-6)
 * 
 * 3. ACADEMIC STATUS:
 *    - gpa (Number, min: 0.0, max: 4.0, default: null): Điểm trung bình tích lũy
 *    - totalCredits (Number, default: 0): Tổng số tín chỉ đã hoàn thành
 * 
 * 4. TUTOR PROGRAM PARTICIPATION:
 *    - registeredTutors (Array of ObjectId, ref: 'Tutor'): Danh sách Tutors đã đăng ký
 *    - totalSessionsAttended (Number, default: 0): Tổng số buổi học đã tham gia
 * 
 * 5. STATISTICS (Thống kê):
 *    - stats.totalAppointments (Number, default: 0): Tổng số lịch hẹn đã đặt
 *    - stats.completedAppointments (Number, default: 0): Số lịch hẹn đã hoàn thành
 *    - stats.cancelledAppointments (Number, default: 0): Số lịch hẹn đã hủy
 *    - stats.averageRatingGiven (Number, default: 0): Điểm đánh giá trung bình student cho tutors
 * 
 * 6. TIMESTAMPS:
 *    - createdAt, updatedAt (auto-generated)
 * 
 * INDEXES:
 * - { userId: 1 } - unique
 * - { mssv: 1 } - unique
 * - { major: 1, enrollmentYear: 1 } - composite
 * 
 * BUSINESS RULES:
 * - 1-1 relationship với User (userId phải unique)
 * - Academic data được sync từ DATACORE
 * - Statistics tự động cập nhật bởi Services (không manual update)
 */

const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema(
  {
    // Reference to User
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true
    },
    
    // Academic Information
    mssv: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    major: {
      type: String,
      required: true
    },
    enrollmentYear: {
      type: Number,
      required: true
    },
    currentYear: {
      type: Number,
      min: 1,
      max: 6,
      default: 1
    },
    
    // Academic Status
    gpa: {
      type: Number,
      min: 0.0,
      max: 4.0,
      default: null
    },
    totalCredits: {
      type: Number,
      default: 0
    },
    
    // Tutor Program Participation
    registeredTutors: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tutor'
      }
    ],
    totalSessionsAttended: {
      type: Number,
      default: 0
    },
    
    // Statistics
    stats: {
      totalAppointments: { type: Number, default: 0 },
      completedAppointments: { type: Number, default: 0 },
      cancelledAppointments: { type: Number, default: 0 },
      averageRatingGiven: { type: Number, default: 0 }
    }
  },
  {
    timestamps: true,
    collection: 'students'
  }
);

// Indexes
StudentSchema.index({ userId: 1 });
StudentSchema.index({ mssv: 1 });
StudentSchema.index({ major: 1, enrollmentYear: 1 });

module.exports = mongoose.model('Student', StudentSchema);
