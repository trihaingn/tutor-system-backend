/**
 * MODEL: TutorEvaluation
 * FILE: TutorEvaluation.model.js
 * MỤC ĐÍCH: Lưu trữ đánh giá từ Tutor về Student sau buổi học (UC-27)
 *           Giúp track student progress và effort (PRIVATE feedback)
 * 
 * QUAN HỆ:
 * - N-1 với Tutor (1 tutor có nhiều evaluations cho nhiều students)
 * - N-1 với Student (1 student nhận nhiều evaluations từ nhiều tutors)
 * - N-1 với ConsultationSession (1 session có nhiều evaluations)
 * 
 * CÁC TRƯỜNG (FIELDS):
 * 
 * 1. WHO EVALUATES WHOM:
 *    - tutorId (ObjectId, ref: 'Tutor', required, index): Tutor đánh giá
 *    - studentId (ObjectId, ref: 'Student', required, index): Student được đánh giá
 * 
 * 2. RELATED SESSION:
 *    - sessionId (ObjectId, ref: 'ConsultationSession', required, index): Buổi học liên quan
 * 
 * 3. PROGRESS ASSESSMENT:
 *    - progressScore (Number, required, min: 1, max: 5): Điểm tiến bộ (1-5)
 *      Must be integer (validator: Number.isInteger)
 *      1=No progress, 2=Little, 3=Moderate, 4=Good, 5=Excellent
 * 
 * 4. DETAILED FEEDBACK:
 *    - skillsImproved (Array of String, maxlength: 200): Kỹ năng đã cải thiện
 *    - areasNeedingWork (Array of String, maxlength: 200): Mảng cần học thêm
 * 
 * 5. EFFORT LEVEL:
 *    - effortLevel (String, enum, required): Mức độ nỗ lực
 *      Enum: ['LOW', 'MEDIUM', 'HIGH']
 * 
 * 6. NOTES:
 *    - notes (String, maxlength: 1000, default: ''): Ghi chú thêm
 *    - homeworkCompleted (Boolean, default: null): Hoàn thành bài tập chưa
 * 
 * 7. METADATA:
 *    - evaluatedAt (Date, default: Date.now, index): Ngày đánh giá
 * 
 * 8. TIMESTAMPS:
 *    - createdAt, updatedAt (auto-generated)
 * 
 * INDEXES:
 * - ⚠️ CRITICAL: { tutorId: 1, studentId: 1, sessionId: 1 } - unique composite
 *   (Ngăn chặn: Tutor đánh giá same student trong same session twice)
 * - { studentId: 1, progressScore: 1 } - Track student improvement over time
 * - { sessionId: 1 }
 * 
 * BUSINESS RULES:
 * - Chỉ có thể đánh giá sau khi session COMPLETED
 * - progressScore phải là integer 1-5
 * - Không thể đánh giá same student trong same session twice
 * - Giúp track student improvement over time
 * 
 * SO SÁNH với StudentEvaluation:
 * | Aspect              | StudentEvaluation        | TutorEvaluation         |
 * |---------------------|--------------------------|-------------------------|
 * | Purpose             | Rate teaching quality    | Assess student progress |
 * | Rating Field        | rating (1-5 stars)       | progressScore (1-5)     |
 * | Public Visibility   | YES (affects Tutor rating)| NO (private feedback)   |
 * | Use Case            | UC-26                    | UC-27                   |
 * | Impacts             | Tutor's averageRating    | Student progress tracking|
 */

// TODO: Import mongoose

// TODO: Định nghĩa TutorEvaluationSchema với các trường trên

// TODO: ⚠️ CRITICAL - Thêm composite unique index
// TutorEvaluationSchema.index(
//   { tutorId: 1, studentId: 1, sessionId: 1 },
//   { unique: true }
// );

// TODO: Thêm query optimization indexes
// TutorEvaluationSchema.index({ studentId: 1, progressScore: 1 });
// TutorEvaluationSchema.index({ sessionId: 1 });

// TODO: Export model
