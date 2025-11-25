/**
 * UTILITY: Date Time Helpers
 * FILE: dateTime.js
 * MỤC ĐÍCH: Helper functions cho xử lý date/time
 */

// ============================================================
// FORMAT DATE
// ============================================================
// PURPOSE: Format Date object thành string
// 
// INPUT:
// - date: Date
// - format: String ('YYYY-MM-DD', 'DD/MM/YYYY', 'HH:MM', etc.)
// 
// PSEUDOCODE:
// const formatDate = (date, format = 'YYYY-MM-DD') => {
//   const d = new Date(date)
//   
//   const year = d.getFullYear()
//   const month = String(d.getMonth() + 1).padStart(2, '0')
//   const day = String(d.getDate()).padStart(2, '0')
//   const hours = String(d.getHours()).padStart(2, '0')
//   const minutes = String(d.getMinutes()).padStart(2, '0')
//   
//   switch (format) {
//     case 'YYYY-MM-DD':
//       return `${year}-${month}-${day}`
//     case 'DD/MM/YYYY':
//       return `${day}/${month}/${year}`
//     case 'HH:MM':
//       return `${hours}:${minutes}`
//     case 'YYYY-MM-DD HH:MM':
//       return `${year}-${month}-${day} ${hours}:${minutes}`
//     default:
//       return d.toISOString()
//   }
// }
// 
// OUTPUT:
// - Formatted date string

// ============================================================
// PARSE TIME STRING
// ============================================================
// PURPOSE: Chuyển "HH:MM" thành Date object
// 
// INPUT:
// - timeString: String ("09:00")
// - baseDate: Date (optional, default today)
// 
// PSEUDOCODE:
// const parseTimeString = (timeString, baseDate = new Date()) => {
//   const [hours, minutes] = timeString.split(':').map(Number)
//   
//   const date = new Date(baseDate)
//   date.setHours(hours)
//   date.setMinutes(minutes)
//   date.setSeconds(0)
//   date.setMilliseconds(0)
//   
//   return date
// }
// 
// OUTPUT:
// - Date object

// ============================================================
// GET DAY OF WEEK NAME
// ============================================================
// PURPOSE: Lấy tên thứ từ dayOfWeek number
// 
// INPUT:
// - dayOfWeek: Number (0-6)
// - locale: String ('en', 'vi')
// 
// PSEUDOCODE:
// const getDayOfWeekName = (dayOfWeek, locale = 'en') => {
//   const daysEn = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
//   const daysVi = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy']
//   
//   return locale === 'vi' ? daysVi[dayOfWeek] : daysEn[dayOfWeek]
// }
// 
// OUTPUT:
// - Day name string

// ============================================================
// ADD DAYS
// ============================================================
// PURPOSE: Thêm/bớt số ngày vào Date
// 
// INPUT:
// - date: Date
// - days: Number (positive or negative)
// 
// PSEUDOCODE:
// const addDays = (date, days) => {
//   const result = new Date(date)
//   result.setDate(result.getDate() + days)
//   return result
// }
// 
// OUTPUT:
// - New Date object

// ============================================================
// ADD HOURS
// ============================================================
// PURPOSE: Thêm/bớt số giờ vào Date
// 
// INPUT:
// - date: Date
// - hours: Number
// 
// PSEUDOCODE:
// const addHours = (date, hours) => {
//   const result = new Date(date)
//   result.setHours(result.getHours() + hours)
//   return result
// }
// 
// OUTPUT:
// - New Date object

// ============================================================
// GET DURATION IN MINUTES
// ============================================================
// PURPOSE: Tính duration giữa 2 dates (in minutes)
// 
// INPUT:
// - startTime: Date
// - endTime: Date
// 
// PSEUDOCODE:
// const getDurationInMinutes = (startTime, endTime) => {
//   const durationMs = endTime - startTime
//   return Math.floor(durationMs / (1000 * 60))
// }
// 
// OUTPUT:
// - Number (minutes)

// ============================================================
// IS SAME DAY
// ============================================================
// PURPOSE: Kiểm tra 2 dates có cùng ngày không
// 
// INPUT:
// - date1: Date
// - date2: Date
// 
// PSEUDOCODE:
// const isSameDay = (date1, date2) => {
//   return date1.getFullYear() === date2.getFullYear() &&
//          date1.getMonth() === date2.getMonth() &&
//          date1.getDate() === date2.getDate()
// }
// 
// OUTPUT:
// - Boolean

// TODO: Export date/time helpers
// module.exports = {
//   formatDate,
//   parseTimeString,
//   getDayOfWeekName,
//   addDays,
//   addHours,
//   getDurationInMinutes,
//   isSameDay
// }
