/**
 * MODEL: ConsultationSession
 * FILE: ConsultationSession.model.js
 * MỤC ĐÍCH: Lưu trữ thông tin buổi học/tư vấn (1-1 hoặc group sessions)
 * 
 * QUAN HỆ:
 * - N-1 với Tutor (nhiều sessions thuộc 1 tutor)
 * - 1-N với StudentEvaluation (1 session có nhiều evaluations từ nhiều students)
 * - 1-N với TutorEvaluation (1 session có nhiều evaluations từ tutor cho nhiều students)
 * - 1-1 với SessionReport (1 session có 1 report)
 * 
 * CÁC TRƯỜNG (FIELDS):
 * 
 * 1. TUTOR:
 *    - tutorId (ObjectId, ref: 'Tutor', required, index): Tutor host buổi học
 * 
 * 2. SESSION INFORMATION:
 *    - title (String, required, trim): Tiêu đề buổi học
 *    - subjectId (String, required, index): Môn học (ví dụ: 'Math_101')
 *    - description (String, maxlength: 2000): Mô tả chi tiết
 * 
 * 3. SCHEDULING:
 *    - startTime (Date, required, index): Thời gian bắt đầu
 *    - endTime (Date, required): Thời gian kết thúc
 *    - duration (Number, required, min: 60): Thời lượng (phút) - BR-002: >= 60 phút
 * 
 * 4. SESSION TYPE & LOCATION:
 *    - sessionType (String, enum, required): Loại buổi học
 *      Enum: ['ONLINE', 'OFFLINE']
 *    - meetingLink (String, default: null): Link meeting (required nếu ONLINE) - BR-003
 *    - location (String, default: null): Địa điểm (required nếu OFFLINE) - BR-004
 *      Ví dụ: "H1-101", "H6-201"
 * 
 * 5. PARTICIPANTS:
 *    - maxParticipants (Number, default: 10, min: 1, max: 50): Số lượng tối đa
 *    - currentParticipants (Number, default: 0): Số lượng hiện tại
 *    - participants (Array of Objects): Danh sách participants
 *      [{ studentId: ObjectId, registeredAt: Date, attended: Boolean }]
 * 
 * 6. STATUS:
 *    - status (String, enum, default: 'SCHEDULED', index): Trạng thái
 *      Enum: ['SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']
 * 
 * 7. SESSION REPORT:
 *    - hasReport (Boolean, default: false): Có biên bản chưa
 * 
 * 8. TIMESTAMPS:
 *    - createdAt, updatedAt (auto-generated)
 * 
 * INDEXES:
 * - { tutorId: 1, startTime: 1 }
 * - { subjectId: 1, status: 1 }
 * - { status: 1, startTime: 1 }
 * 
 * VIRTUAL FIELDS:
 * - report: Populate từ SessionReport (localField: _id, foreignField: sessionId)
 * 
 * BUSINESS RULES:
 * - BR-001: startTime.getMinutes() === 0 (hourly validation - checked in Service)
 * - BR-002: duration >= 60 minutes
 * - BR-003: ONLINE requires meetingLink !== null
 * - BR-004: OFFLINE requires location !== null
 * - Tutor chỉ có thể edit own sessions
 */

// TODO: Import mongoose

// TODO: Định nghĩa ConsultationSessionSchema với các trường trên

// TODO: Thêm indexes

// TODO: Định nghĩa virtual field cho session report
// ConsultationSessionSchema.virtual('report', {
//   ref: 'SessionReport',
//   localField: '_id',
//   foreignField: 'sessionId',
//   justOne: true
// });

// TODO: Export model
