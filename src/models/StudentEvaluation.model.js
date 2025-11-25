/**
 * MODEL: StudentEvaluation
 * FILE: StudentEvaluation.model.js
 * MỤC ĐÍCH: Lưu trữ đánh giá từ Student về Tutor sau buổi học (UC-26)
 *           Dùng để tính rating và feedback cho Tutor (PUBLIC visibility)
 * 
 * QUAN HỆ:
 * - N-1 với Student (1 student có nhiều evaluations cho nhiều tutors)
 * - N-1 với Tutor (1 tutor nhận nhiều evaluations từ nhiều students)
 * - N-1 với ConsultationSession (1 session có nhiều evaluations)
 * 
 * CÁC TRƯỜNG (FIELDS):
 * 
 * 1. WHO EVALUATES WHOM:
 *    - studentId (ObjectId, ref: 'Student', required, index): Sinh viên đánh giá
 *    - tutorId (ObjectId, ref: 'Tutor', required, index): Tutor được đánh giá
 * 
 * 2. RELATED SESSION:
 *    - sessionId (ObjectId, ref: 'ConsultationSession', required, index): Buổi học liên quan
 * 
 * 3. RATING & FEEDBACK:
 *    - rating (Number, required, min: 1, max: 5): Điểm đánh giá (1-5 stars) - BR-010
 *      Must be integer (validator: Number.isInteger)
 *    - comment (String, maxlength: 1000, default: ''): Nhận xét chung
 * 
 * 4. DETAILED FEEDBACK:
 *    - strengths (Array of String, maxlength: 200): Điểm mạnh của Tutor
 *    - improvements (Array of String, maxlength: 200): Điểm cần cải thiện
 * 
 * 5. PRIVACY:
 *    - isAnonymous (Boolean, default: false): Ẩn danh hay không
 * 
 * 6. METADATA:
 *    - evaluatedAt (Date, default: Date.now, index): Ngày đánh giá
 * 
 * 7. TIMESTAMPS:
 *    - createdAt, updatedAt (auto-generated)
 * 
 * INDEXES:
 * - ⚠️ CRITICAL: { studentId: 1, tutorId: 1, sessionId: 1 } - unique composite
 *   (Ngăn chặn: Student đánh giá same session twice)
 * - { tutorId: 1, rating: 1 } - Query tutors by rating
 * - { sessionId: 1 }
 * 
 * BUSINESS RULES:
 * - BR-009: Chỉ có thể đánh giá sau khi session COMPLETED
 * - BR-010: Rating phải là integer 1-5 stars
 * - Không thể đánh giá same session twice (unique index enforcement)
 * - AUTO SIDE EFFECT: Update Tutor.stats.averageRating (EvaluationService)
 * 
 * SO SÁNH với TutorEvaluation:
 * | Aspect              | StudentEvaluation        | TutorEvaluation         |
 * |---------------------|--------------------------|-------------------------|
 * | Purpose             | Rate teaching quality    | Assess student progress |
 * | Rating Field        | rating (1-5 stars)       | progressScore (1-5)     |
 * | Public Visibility   | YES (affects Tutor rating)| NO (private feedback)   |
 * | Use Case            | UC-26                    | UC-27                   |
 */

// TODO: Import mongoose

// TODO: Định nghĩa StudentEvaluationSchema với các trường trên

// TODO: ⚠️ CRITICAL - Thêm composite unique index để ngăn duplicate evaluation
// StudentEvaluationSchema.index(
//   { studentId: 1, tutorId: 1, sessionId: 1 },
//   { unique: true }
// );

// TODO: Thêm query optimization indexes
// StudentEvaluationSchema.index({ tutorId: 1, rating: 1 });
// StudentEvaluationSchema.index({ sessionId: 1 });

// TODO: Export model
