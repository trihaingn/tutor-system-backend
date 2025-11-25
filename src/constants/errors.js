/**
 * FILE: errors.js
 * MỤC ĐÍCH: Định nghĩa các lớp lỗi tùy chỉnh (Custom Error Classes) cho hệ thống
 * 
 * DANH SÁCH CÁC LỖI:
 * 
 * 1. ValidationError (HTTP 400 Bad Request):
 *    - Dùng khi: Input không hợp lệ (thiếu field, sai format, vi phạm business rules)
 *    - Ví dụ: "Start time must be on-the-hour", "Duration must be >= 1 hour"
 * 
 * 2. AuthenticationError (HTTP 401 Unauthorized):
 *    - Dùng khi: JWT token invalid, expired, hoặc thiếu token
 *    - Ví dụ: "Invalid SSO ticket", "Token expired"
 * 
 * 3. ForbiddenError (HTTP 403 Forbidden):
 *    - Dùng khi: User không có quyền thực hiện hành động (wrong role)
 *    - Ví dụ: "Only TUTOR can create sessions", "You can only edit your own sessions"
 * 
 * 4. NotFoundError (HTTP 404 Not Found):
 *    - Dùng khi: Resource không tồn tại trong database
 *    - Ví dụ: "Session not found", "Tutor not found"
 * 
 * 5. ConflictError (HTTP 409 Conflict):
 *    - Dùng khi: Vi phạm business rules (duplicate, conflict)
 *    - Ví dụ: "You have already registered this Tutor", "Time slot conflict"
 * 
 * 6. InternalServerError (HTTP 500 Internal Server Error):
 *    - Dùng khi: Lỗi không mong đợi từ server (database error, external service error)
 *    - Ví dụ: "Database connection failed", "SSO service unavailable"
 */

// TODO: Tạo các class kế thừa từ Error
// class ValidationError extends Error {
//   constructor(message) {
//     super(message);
//     this.name = 'ValidationError';
//     this.statusCode = 400;
//   }
// }

// TODO: Export tất cả error classes
// module.exports = {
//   ValidationError,
//   AuthenticationError,
//   ForbiddenError,
//   NotFoundError,
//   ConflictError,
//   InternalServerError
// };
