/**
 * FILE: status.js
 * MỤC ĐÍCH: Định nghĩa các trạng thái (Status) cho các entities trong hệ thống
 * 
 * DANH SÁCH TRẠNG THÁI:
 * 
 * 1. USER STATUS:
 *    - ACTIVE: Tài khoản đang hoạt động
 *    - SUSPENDED: Tài khoản bị đình chỉ
 *    - GRADUATED: Sinh viên đã tốt nghiệp (không còn sử dụng hệ thống)
 *    - RESIGNED: Cán bộ đã nghỉ việc
 * 
 * 2. REGISTRATION STATUS (CourseRegistration):
 *    - ACTIVE: Đang hoạt động
 *    - INACTIVE: Không hoạt động
 *    - CANCELLED: Đã hủy
 * 
 * 3. SESSION STATUS (ConsultationSession):
 *    - SCHEDULED: Đã lên lịch (chưa bắt đầu)
 *    - IN_PROGRESS: Đang diễn ra
 *    - COMPLETED: Đã hoàn thành
 *    - CANCELLED: Đã hủy
 * 
 * 4. APPOINTMENT STATUS:
 *    - PENDING: Chờ Tutor xác nhận
 *    - CONFIRMED: Đã được Tutor xác nhận
 *    - REJECTED: Tutor từ chối
 *    - CANCELLED: Đã hủy (bởi Student hoặc Tutor)
 * 
 * 5. NOTIFICATION STATUS:
 *    - UNREAD: Chưa đọc
 *    - READ: Đã đọc
 */

// TODO: Export các objects chứa status constants
// module.exports = {
//   USER_STATUS: { ACTIVE: 'ACTIVE', SUSPENDED: 'SUSPENDED', ... },
//   REGISTRATION_STATUS: { ACTIVE: 'ACTIVE', INACTIVE: 'INACTIVE', ... },
//   SESSION_STATUS: { SCHEDULED: 'SCHEDULED', IN_PROGRESS: 'IN_PROGRESS', ... },
//   APPOINTMENT_STATUS: { PENDING: 'PENDING', CONFIRMED: 'CONFIRMED', ... },
//   NOTIFICATION_STATUS: { UNREAD: 'UNREAD', READ: 'READ' }
// };
