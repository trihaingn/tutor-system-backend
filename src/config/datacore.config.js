/**
 * CONFIG: DATACORE Configuration
 * FILE: datacore.config.js
 * MỤC ĐÍCH: Cấu hình kết nối đến hệ thống DATACORE (Database trung tâm HCMUT)
 * 
 * ENVIRONMENT VARIABLES:
 * - DATACORE_API_URL: Base URL của DATACORE API
 * - DATACORE_API_KEY: API key để xác thực
 * - DATACORE_TIMEOUT: Request timeout (ms)
 */

// TODO: Import dotenv
// require('dotenv').config()

// ============================================================
// DATACORE CONFIGURATION
// ============================================================
// PURPOSE: Export DATACORE API settings
// 
// PSEUDOCODE:
// const datacoreConfig = {
//   // API Base URL
//   apiUrl: process.env.DATACORE_API_URL || 'https://datacore.hcmut.edu.vn/api',
//   
//   // API Authentication
//   apiKey: process.env.DATACORE_API_KEY || '',
//   
//   // Request Timeout (5 seconds)
//   timeout: parseInt(process.env.DATACORE_TIMEOUT) || 5000,
//   
//   // API Endpoints
//   endpoints: {
//     // Lấy thông tin sinh viên
//     getStudent: '/students/:mssv',
//     
//     // Lấy thông tin cán bộ/giảng viên
//     getStaff: '/staff/:maCB',
//     
//     // Lấy danh sách môn học
//     getSubjects: '/subjects',
//     
//     // Health check
//     healthCheck: '/health'
//   },
//   
//   // Request Headers
//   headers: {
//     'Content-Type': 'application/json',
//     'Accept': 'application/json',
//     'X-API-Key': process.env.DATACORE_API_KEY || ''
//   },
//   
//   // Retry Configuration
//   retry: {
//     // Số lần retry khi fail
//     maxRetries: 3,
//     
//     // Delay giữa các retry (ms)
//     retryDelay: 1000
//   }
// }

// ============================================================
// API RESPONSE FORMAT (from DATACORE)
// ============================================================
// GET /students/:mssv
// {
//   "student_id": "1234567",
//   "full_name": "Nguyễn Văn A",
//   "email": "a.nguyen@hcmut.edu.vn",
//   "faculty": "Computer Science",
//   "major": "Software Engineering",
//   "year": 3,
//   "status": "ACTIVE"
// }
// 
// GET /staff/:maCB
// {
//   "staff_id": "CB001",
//   "full_name": "TS. Trần Thị B",
//   "email": "b.tran@hcmut.edu.vn",
//   "faculty": "Computer Science",
//   "position": "Lecturer",
//   "subjects": [
//     {
//       "subject_id": "Math_101",
//       "subject_name": "Calculus I",
//       "level": "ADVANCED"
//     }
//   ]
// }

// ============================================================
// FIELD MAPPING
// ============================================================
// PURPOSE: Map DATACORE fields đến internal schema
// 
// PSEUDOCODE:
// const fieldMapping = {
//   // Student mapping
//   student: {
//     'student_id': 'mssv',
//     'full_name': 'fullName',
//     'email': 'email',
//     'faculty': 'faculty',
//     'major': 'major',
//     'year': 'year',
//     'status': 'status'
//   },
//   
//   // Staff mapping
//   staff: {
//     'staff_id': 'maCB',
//     'full_name': 'fullName',
//     'email': 'email',
//     'faculty': 'faculty',
//     'position': 'position',
//     'subjects': 'expertise'
//   }
// }

// ============================================================
// ERROR HANDLING
// ============================================================
// PURPOSE: Handle DATACORE API errors
// 
// ERROR CODES:
// - 404: Not Found (MSSV/Mã CB không tồn tại)
// - 401: Unauthorized (API key invalid)
// - 403: Forbidden (No permission)
// - 500: Internal Server Error
// - TIMEOUT: Request timeout

// ============================================================
// SYNC SCHEDULE
// ============================================================
// PURPOSE: Thiết lập lịch đồng bộ dữ liệu
// 
// PSEUDOCODE:
// const syncConfig = {
//   // Đồng bộ mỗi 24 giờ
//   syncInterval: 24 * 60 * 60 * 1000, // 24 hours in ms
//   
//   // Thời điểm chạy sync (2AM daily)
//   cronSchedule: '0 2 * * *',
//   
//   // Batch size cho sync
//   batchSize: 100
// }

// TODO: Export configuration
// module.exports = {
//   datacoreConfig,
//   fieldMapping,
//   syncConfig
// }
