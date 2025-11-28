/**
 * MODEL: Tutor
 * FILE: Tutor.model.js
 * MỤC ĐÍCH: Lưu trữ thông tin Tutor (Lecturer, Research Student, Senior Student)
 *           Bao gồm expertise, bio, availability settings, và statistics
 * 
 * QUAN HỆ:
 * - N-1 với User (1-1 unique thực tế)
 * - 1-N với CourseRegistration (1 tutor có nhiều registrations)
 * - 1-N với ConsultationSession (1 tutor host nhiều sessions)
 * - 1-N với Availability (1 tutor có nhiều availability slots)
 * - 1-N với TutorEvaluation (1 tutor đánh giá nhiều students)
 * 
 * CÁC TRƯỜNG (FIELDS):
 * 
 * 1. REFERENCE:
 *    - userId (ObjectId, ref: 'User', required, unique, index): Liên kết tới User model
 * 
 * 2. IDENTIFICATION:
 *    - maCB (String, required, unique, index): Mã cán bộ
 * 
 * 3. TUTOR TYPE:
 *    - type (String, enum, required, index): Loại Tutor
 *      Enum: ['LECTURER', 'RESEARCH_STUDENT', 'SENIOR_STUDENT']
 *      Lecturer > Research Student > Senior Student (privileges)
 * 
 * 4. EXPERTISE & SUBJECTS (Chuyên môn):
 *    - expertise (Array of Objects): Danh sách môn học có thể dạy
 *      [{ subjectId: String, subjectName: String, yearsOfExperience: Number }]
 *    - bio (String, maxlength: 1000): Giới thiệu bản thân
 *    - researchInterests (Array of String): Lĩnh vực nghiên cứu quan tâm
 * 
 * 5. AVAILABILITY SETTINGS:
 *    - maxStudentsPerSlot (Number, default: 3, min: 1, max: 20): Số student tối đa/slot
 *    - preferredSessionType (String, enum): Loại buổi học ưa thích
 *      Enum: ['ONLINE', 'OFFLINE', 'BOTH']
 * 
 * 6. STATISTICS:
 *    - stats.totalStudents (Number): Tổng số students đã đăng ký
 *    - stats.totalSessions (Number): Tổng số sessions đã tạo
 *    - stats.completedSessions (Number): Số sessions đã hoàn thành
 *    - stats.cancelledSessions (Number): Số sessions đã hủy
 *    - stats.averageRating (Number): Điểm đánh giá trung bình (từ StudentEvaluation)
 *    - stats.totalReviews (Number): Tổng số đánh giá nhận được
 * 
 * 7. STATUS:
 *    - isAcceptingStudents (Boolean, default: true): Có đang nhận students mới không
 * 
 * INDEXES:
 * - { userId: 1 } - unique
 * - { maCB: 1 } - unique
 * - { type: 1, 'stats.averageRating': -1 } - composite
 * - { 'expertise.subjectId': 1 }
 * 
 * BUSINESS RULES:
 * - 1-1 relationship với User (userId unique)
 * - averageRating được update mỗi khi có StudentEvaluation mới (EvaluationService)
 */

import mongoose from 'mongoose';

const TutorSchema = new mongoose.Schema(
  {
    // Reference to User
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true
    },
    
    // Subjects
    subject: {
        type: [String],
        validate: v => v.length > 0
    },
    maxStudents: {
        type: Number,
        default: 200,
    },
    stats: {
      totalStudents: { type: Number, default: 0 },
      totalSessions: { type: Number, default: 0 },
      completedSessions: { type: Number, default: 0 },
      cancelledSessions: { type: Number, default: 0 },
      averageRating: { type: Number, default: 0 },
      totalReviews: { type: Number, default: 0 }
    }
  },
  {
    timestamps: true,
    collection: 'tutors'
  }
);

// Indexes
TutorSchema.index({ userId: 1 });

export default mongoose.model('Tutor', TutorSchema);
