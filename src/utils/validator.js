/**
 * UTILITY: Validator
 * FILE: validator.js
 * MỤC ĐÍCH: Custom validation functions cho business rules
 * 
 * USE CASE:
 * - Validate MSSV format
 * - Validate email HCMUT
 * - Validate time format
 * - Validate date ranges
 */

// ============================================================
// VALIDATE MSSV (Mã số sinh viên)
// ============================================================
// PURPOSE: Kiểm tra MSSV có đúng format không
// FORMAT: 7 digits (e.g., 2011234)
// 
// INPUT:
// - mssv: String
// 
// PSEUDOCODE:
// const isValidMSSV = (mssv) => {
//   const mssvRegex = /^[0-9]{7}$/
//   return mssvRegex.test(mssv)
// }
// 
// OUTPUT:
// - Boolean

// ============================================================
// VALIDATE HCMUT EMAIL
// ============================================================
// PURPOSE: Kiểm tra email có phải HCMUT không
// FORMAT: xxx@hcmut.edu.vn
// 
// INPUT:
// - email: String
// 
// PSEUDOCODE:
// const isValidHCMUTEmail = (email) => {
//   const emailRegex = /^[a-zA-Z0-9._%+-]+@hcmut\.edu\.vn$/
//   return emailRegex.test(email)
// }
// 
// OUTPUT:
// - Boolean

// ============================================================
// VALIDATE TIME FORMAT
// ============================================================
// PURPOSE: Kiểm tra time format "HH:MM"
// 
// INPUT:
// - time: String (e.g., "09:00")
// 
// PSEUDOCODE:
// const isValidTimeFormat = (time) => {
//   const timeRegex = /^([0-1][0-9]|2[0-3]):([0-5][0-9])$/
//   return timeRegex.test(time)
// }
// 
// OUTPUT:
// - Boolean

// ============================================================
// VALIDATE HOURLY TIME (BR-001)
// ============================================================
// PURPOSE: Kiểm tra time phải là giờ chẵn (HH:00)
// 
// INPUT:
// - time: String | Date
// 
// PSEUDOCODE:
// const isHourlyTime = (time) => {
//   if (typeof time === 'string') {
//     // Format: "HH:MM"
//     const minutes = time.split(':')[1]
//     return minutes === '00'
//   } else if (time instanceof Date) {
//     return time.getMinutes() === 0 && time.getSeconds() === 0
//   }
//   return false
// }
// 
// OUTPUT:
// - Boolean

// ============================================================
// VALIDATE DURATION
// ============================================================
// PURPOSE: Kiểm tra duration >= 60 minutes (BR-002)
// 
// INPUT:
// - startTime: Date
// - endTime: Date
// 
// PSEUDOCODE:
// const isValidDuration = (startTime, endTime) => {
//   const durationMs = endTime - startTime
//   const durationMinutes = durationMs / (1000 * 60)
//   return durationMinutes >= 60
// }
// 
// OUTPUT:
// - Boolean

// ============================================================
// VALIDATE DATE RANGE
// ============================================================
// PURPOSE: Kiểm tra startDate <= endDate
// 
// INPUT:
// - startDate: Date
// - endDate: Date
// 
// PSEUDOCODE:
// const isValidDateRange = (startDate, endDate) => {
//   return startDate <= endDate
// }
// 
// OUTPUT:
// - Boolean

// ============================================================
// VALIDATE FUTURE DATE
// ============================================================
// PURPOSE: Kiểm tra date phải là tương lai
// 
// INPUT:
// - date: Date
// 
// PSEUDOCODE:
// const isFutureDate = (date) => {
//   return date > new Date()
// }
// 
// OUTPUT:
// - Boolean

// ============================================================
// VALIDATE RATING
// ============================================================
// PURPOSE: Kiểm tra rating trong range 1-5
// 
// INPUT:
// - rating: Number
// 
// PSEUDOCODE:
// const isValidRating = (rating) => {
//   return Number.isInteger(rating) && rating >= 1 && rating <= 5
// }
// 
// OUTPUT:
// - Boolean

// ============================================================
// VALIDATE DAY OF WEEK
// ============================================================
// PURPOSE: Kiểm tra dayOfWeek trong range 0-6
// 
// INPUT:
// - dayOfWeek: Number (0=Sunday, 6=Saturday)
// 
// PSEUDOCODE:
// const isValidDayOfWeek = (dayOfWeek) => {
//   return Number.isInteger(dayOfWeek) && dayOfWeek >= 0 && dayOfWeek <= 6
// }
// 
// OUTPUT:
// - Boolean

// ============================================================
// SANITIZE STRING
// ============================================================
// PURPOSE: Xóa XSS/malicious code khỏi string
// 
// INPUT:
// - str: String
// 
// PSEUDOCODE:
// const sanitizeString = (str) => {
//   if (typeof str !== 'string') return str
//   
//   // Remove HTML tags
//   return str.replace(/<[^>]*>/g, '')
//     .trim()
// }
// 
// OUTPUT:
// - Sanitized string

// ============================================================
// VALIDATE OBJECT ID
// ============================================================
// PURPOSE: Kiểm tra có phải MongoDB ObjectId không
// 
// INPUT:
// - id: String
// 
// PSEUDOCODE:
// const mongoose = require('mongoose')
// 
// const isValidObjectId = (id) => {
//   return mongoose.Types.ObjectId.isValid(id)
// }
// 
// OUTPUT:
// - Boolean

// TODO: Export validation functions
// module.exports = {
//   isValidMSSV,
//   isValidHCMUTEmail,
//   isValidTimeFormat,
//   isHourlyTime,
//   isValidDuration,
//   isValidDateRange,
//   isFutureDate,
//   isValidRating,
//   isValidDayOfWeek,
//   sanitizeString,
//   isValidObjectId
// }
