/**
 * MODEL: CourseRegistration
 * FILE: CourseRegistration.model.js
 * MỤC ĐÍCH: Giải quyết mối quan hệ M-N-M giữa Student, Tutor, và Subject
 *           Đây là Junction/Bridge Table quan trọng nhất trong hệ thống
 * 
 * ⚠️ TẠI SAO CourseRegistration CẦN TỒN TẠI:
 * - 1 Student CÓ THỂ đăng ký NHIỀU Tutors
 * - 1 Tutor CÓ THỂ nhận NHIỀU Students
 * - 1 Student có thể đăng ký 1 Tutor cho NHIỀU Subjects khác nhau
 * - KHÔNG THỂ dùng simple M-N relationship
 * - GIẢI PHÁP: Composite unique key (studentId, tutorId, subjectId)
 * 
 * QUAN HỆ:
 * - N-1 với Student (nhiều registrations thuộc 1 student)
 * - N-1 với Tutor (nhiều registrations thuộc 1 tutor)
 * 
 * CÁC TRƯỜNG (FIELDS):
 * 
 * 1. CORE RELATIONSHIP (M-N-M):
 *    - studentId (ObjectId, ref: 'Student', required, index): ID sinh viên
 *    - tutorId (ObjectId, ref: 'Tutor', required, index): ID tutor
 *    - subjectId (String, required, index): ID môn học (ví dụ: 'Math_101', 'Physics_201')
 * 
 * 2. REGISTRATION METADATA:
 *    - status (String, enum, default: 'ACTIVE', index): Trạng thái
 *      Enum: ['ACTIVE', 'INACTIVE', 'CANCELLED']
 *    - registeredAt (Date, default: Date.now, index): Ngày đăng ký
 * 
 * 3. VERSION 2.0 - AUTO-APPROVAL:
 *    - approvedAt (Date, default: Date.now): Ngày phê duyệt (instant)
 *    - approvedBy (String, default: 'SYSTEM'): Người phê duyệt (auto-approved)
 * 
 * 4. OPTIONAL:
 *    - notes (String, maxlength: 500): Ghi chú của student
 * 
 * 5. TIMESTAMPS:
 *    - createdAt, updatedAt (auto-generated)
 * 
 * INDEXES:
 * - ⚠️ CRITICAL: { studentId: 1, tutorId: 1, subjectId: 1 } - unique composite
 * - { studentId: 1, status: 1 }
 * - { tutorId: 1, status: 1 }
 * - { subjectId: 1, status: 1 }
 * 
 * BUSINESS RULES:
 * - BR-005: INSTANT APPROVAL (Version 2.0) - status = 'ACTIVE' ngay lập tức
 * - BR-006: Composite unique (studentId, tutorId, subjectId) - Không duplicate
 * - Cho phép: Student đăng ký same Tutor cho different subjects
 * - Ngăn chặn: Duplicate registration (same Student+Tutor+Subject)
 */

// TODO: Import mongoose

// TODO: Định nghĩa CourseRegistrationSchema
// const CourseRegistrationSchema = new mongoose.Schema({
//   studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true, index: true },
//   tutorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tutor', required: true, index: true },
//   subjectId: { type: String, required: true, index: true },
//   status: { type: String, enum: ['ACTIVE', 'INACTIVE', 'CANCELLED'], default: 'ACTIVE', index: true },
//   registeredAt: { type: Date, default: Date.now, index: true },
//   approvedAt: { type: Date, default: Date.now },
//   approvedBy: { type: String, default: 'SYSTEM' },
//   notes: { type: String, maxlength: 500 }
// }, {
//   timestamps: true,
//   collection: 'course_registrations'
// });

// TODO: ⚠️ CRITICAL - Thêm composite unique index
// CourseRegistrationSchema.index(
//   { studentId: 1, tutorId: 1, subjectId: 1 },
//   { unique: true }
// );

// TODO: Thêm query optimization indexes
// CourseRegistrationSchema.index({ studentId: 1, status: 1 });
// CourseRegistrationSchema.index({ tutorId: 1, status: 1 });

// TODO: Export model
// module.exports = mongoose.model('CourseRegistration', CourseRegistrationSchema);
