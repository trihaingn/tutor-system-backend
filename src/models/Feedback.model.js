/**
 * MODEL: Feedback
 * FILE: Feedback.model.js
 * MỤC ĐÍCH: Lưu trữ session report/feedback từ Tutor sau buổi học
 *           Tương tự SessionReport trong design cũ (UC-18)
 * 
 * QUAN HỆ:
 * - 1-1 với ConsultationSession (1 session có 1 report)
 * - N-1 với Tutor (1 tutor tạo nhiều reports)
 * 
 * CÁC TRƯỜNG (FIELDS):
 * 
 * 1. RELATED SESSION:
 *    - sessionId (ObjectId, ref: 'ConsultationSession', required, unique, index):
 *      ⚠️ UNIQUE: Mỗi session chỉ có 1 feedback report
 * 
 * 2. AUTHOR:
 *    - tutorId (ObjectId, ref: 'Tutor', required, index): Tutor viết report
 * 
 * 3. REPORT CONTENT:
 *    - summary (String, required, maxlength: 2000): Tóm tắt buổi học
 *    - topicsCovered (Array of String, required): Các chủ đề đã học
 *      Example: ['Đạo hàm cơ bản', 'Quy tắc tích', 'Quy tắc thương']
 * 
 * 4. STUDENT PROGRESS:
 *    - studentProgress (Array of Object):
 *      [
 *        {
 *          studentId: ObjectId,
 *          progressNotes: String (maxlength: 500),
 *          comprehensionLevel: String (enum: ['LOW', 'MEDIUM', 'HIGH'])
 *        }
 *      ]
 *      Track từng student trong session
 * 
 * 5. NEXT STEPS:
 *    - nextSteps (Array of String): Bước tiếp theo cần làm
 *      Example: ['Ôn tập lý thuyết giới hạn', 'Làm bài tập 1.2-1.5']
 * 
 * 6. ATTACHMENTS:
 *    - attachments (Array of Object, default: []):
 *      [
 *        {
 *          fileName: String,
 *          fileUrl: String (URL to storage),
 *          fileType: String (enum: ['PDF', 'IMAGE', 'DOCUMENT'])
 *        }
 *      ]
 * 
 * 7. TIMESTAMPS:
 *    - createdAt (auto-generated, index): Thời gian tạo report
 *    - updatedAt (auto-generated)
 * 
 * INDEXES:
 * - ⚠️ CRITICAL: { sessionId: 1 } - unique index
 * - { tutorId: 1, createdAt: -1 } - Query reports by tutor
 * 
 * BUSINESS RULES:
 * - UC-18: Tutor tạo report sau khi session COMPLETED
 * - 1 session chỉ có 1 report (unique sessionId)
 * - Report có thể update sau khi tạo
 * - AUTO SIDE EFFECT: Set ConsultationSession.hasReport = true
 * 
 * VIRTUAL FIELD (trong ConsultationSession):
 * ConsultationSessionSchema.virtual('report', {
 *   ref: 'Feedback',
 *   localField: '_id',
 *   foreignField: 'sessionId',
 *   justOne: true
 * });
 */

// TODO: Import mongoose

// TODO: Định nghĩa FeedbackSchema với các trường trên

// TODO: ⚠️ CRITICAL - Thêm unique index cho sessionId
// FeedbackSchema.index({ sessionId: 1 }, { unique: true });

// TODO: Thêm query optimization index
// FeedbackSchema.index({ tutorId: 1, createdAt: -1 });

// TODO: Export model
