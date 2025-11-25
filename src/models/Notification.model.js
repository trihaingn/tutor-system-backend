/**
 * MODEL: Notification
 * FILE: Notification.model.js
 * MỤC ĐÍCH: Lưu trữ thông báo gửi cho User (UC-13: Get notifications)
 *           Push notifications khi có sự kiện quan trọng
 * 
 * QUAN HỆ:
 * - N-1 với User (1 user nhận nhiều notifications)
 * 
 * CÁC TRƯỜNG (FIELDS):
 * 
 * 1. RECIPIENT:
 *    - recipientId (ObjectId, ref: 'User', required, index): Người nhận
 * 
 * 2. NOTIFICATION TYPE:
 *    - type (String, enum, required, index): Loại thông báo
 *      Enum: [
 *        'APPOINTMENT_CREATED',        // Student book appointment
 *        'APPOINTMENT_CONFIRMED',      // Tutor confirm
 *        'APPOINTMENT_REJECTED',       // Tutor reject
 *        'APPOINTMENT_CANCELLED',      // Hủy appointment
 *        'SESSION_CREATED',            // Tutor tạo session mới
 *        'SESSION_UPDATED',            // Thay đổi thông tin session
 *        'SESSION_CANCELLED',          // Hủy session
 *        'EVALUATION_RECEIVED',        // Nhận được evaluation
 *        'SCHEDULE_REMINDER',          // Nhắc nhở trước 1 ngày
 *        'SYSTEM_ANNOUNCEMENT'         // Thông báo hệ thống
 *      ]
 * 
 * 3. CONTENT:
 *    - title (String, required, maxlength: 200): Tiêu đề ngắn gọn
 *    - message (String, required, maxlength: 1000): Nội dung chi tiết
 * 
 * 4. RELATED ENTITY:
 *    - relatedId (ObjectId, default: null, index): ID của entity liên quan
 *      Có thể là: sessionId, appointmentId, evaluationId
 *    - relatedType (String, enum, default: null): Loại entity
 *      Enum: ['Session', 'Appointment', 'Evaluation', null]
 * 
 * 5. READ STATUS:
 *    - isRead (Boolean, default: false, index): Đã đọc chưa
 *    - readAt (Date, default: null): Thời điểm đọc
 * 
 * 6. TIMESTAMPS:
 *    - createdAt (auto-generated, index): Thời gian tạo notification
 *    - updatedAt (auto-generated)
 * 
 * INDEXES:
 * - { recipientId: 1, createdAt: -1 } - Query notifications by user (DESC order)
 * - { recipientId: 1, isRead: 1 } - Query unread count
 * - { recipientId: 1, type: 1 } - Filter by type
 * - { relatedId: 1 } - Link back to related entity
 * 
 * BUSINESS RULES:
 * - UC-13: GET /api/notifications?isRead=false (lấy unread)
 * - UC-14: PUT /api/notifications/:id/read (mark as read)
 * - AUTO CLEANUP: Delete old read notifications after 30 days (cron job)
 * - PUSH: Real-time push via Socket.io khi có notification mới
 * 
 * USE CASES:
 * - UC-13: Student/Tutor xem danh sách notifications
 * - UC-14: Mark notification as read
 * - UC-19: Send reminder 1 day before session (scheduler)
 */

// TODO: Import mongoose

// TODO: Định nghĩa NotificationSchema với các trường trên

// TODO: Thêm composite indexes
// NotificationSchema.index({ recipientId: 1, createdAt: -1 });
// NotificationSchema.index({ recipientId: 1, isRead: 1 });
// NotificationSchema.index({ recipientId: 1, type: 1 });
// NotificationSchema.index({ relatedId: 1 });

// TODO: Export model
