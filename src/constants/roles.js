/**
 * FILE: roles.js
 * MỤC ĐÍCH: Định nghĩa các vai trò (Roles) trong hệ thống
 * 
 * DANH SÁCH VAI TRÒ:
 * - STUDENT: Sinh viên - Có thể đăng ký Tutor, đặt lịch hẹn, đánh giá Tutor
 * - TUTOR: Tutor (Giảng viên, NCS, SVNC) - Có thể mở buổi học, xác nhận lịch hẹn, đánh giá sinh viên
 * - ADMIN: Quản trị viên (Phòng Đào tạo) - Có thể xem báo cáo, thống kê
 * 
 * LƯU Ý:
 * - Version 2.0 đã loại bỏ các role: COORDINATOR, DEPARTMENT_HEAD, FACULTY_MANAGER
 * - Roles này được sử dụng trong middleware roleMiddleware để kiểm soát quyền truy cập
 */

// TODO: Export object chứa các constant roles
// module.exports = {
//   STUDENT: 'STUDENT',
//   TUTOR: 'TUTOR',
//   ADMIN: 'ADMIN'
// };
