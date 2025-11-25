/**
 * SERVICE: DataSyncService
 * FILE: DataSyncService.js
 * MỤC ĐÍCH: Background job để sync dữ liệu từ DATACORE (scheduled task)
 * 
 * BUSINESS RULES:
 * - BR-007: Sync DATACORE data định kỳ (ví dụ: hàng ngày lúc 2AM)
 * - Chỉ sync Users có lastSyncAt cũ hơn 24 giờ
 * 
 * DEPENDENCIES:
 * - DatacoreService
 * - UserService
 * - node-cron (for scheduling)
 */

// ============================================================
// FUNCTION: syncAllUsers()
// ============================================================
// PURPOSE: Sync toàn bộ Users từ DATACORE (manual trigger hoặc cron)
// 
// PSEUDOCODE:
// Step 1: Tìm Users cần sync (lastSyncAt > 24h hoặc null)
//   - const cutoffTime = new Date(Date.now() - 24 * 60 * 60 * 1000)
//   - const users = await User.find({
//       $or: [
//         { lastSyncAt: { $lt: cutoffTime } },
//         { lastSyncAt: null }
//       ]
//     })
// 
// Step 2: Sync từng User
//   - const results = { success: 0, failed: 0, errors: [] }
//   
//   - For each user in users:
//     → try {
//         If user.mssv:
//           const studentData = await DatacoreService.getStudentData(user.mssv)
//           await UserService.createOrUpdateStudent(user._id, studentData)
//         
//         If user.maCB:
//           const tutorData = await DatacoreService.getTutorData(user.maCB)
//           await UserService.createOrUpdateTutor(user._id, tutorData)
//         
//         user.lastSyncAt = new Date()
//         await user.save()
//         
//         results.success++
//       }
//     → catch (error):
//         results.failed++
//         results.errors.push({ userId: user._id, error: error.message })
// 
// Step 3: Log results
//   - console.log(`Sync completed: ${results.success} success, ${results.failed} failed`)
//   - If results.errors.length > 0:
//     → Log errors to file or monitoring system
// 
// OUTPUT:
// - Return { success: Number, failed: Number, errors: Array }

// ============================================================
// FUNCTION: syncSingleUser(userId)
// ============================================================
// PURPOSE: Sync 1 User cụ thể (called from login hoặc admin trigger)
// 
// PSEUDOCODE:
// Step 1: Tìm User
//   - const user = await User.findById(userId)
//   - If !user → Throw NotFoundError
// 
// Step 2: Sync from DATACORE
//   - If user.mssv:
//     → const studentData = await DatacoreService.getStudentData(user.mssv)
//     → await UserService.createOrUpdateStudent(user._id, studentData)
//   
//   - If user.maCB:
//     → const tutorData = await DatacoreService.getTutorData(user.maCB)
//     → await UserService.createOrUpdateTutor(user._id, tutorData)
// 
// Step 3: Update lastSyncAt
//   - user.lastSyncAt = new Date()
//   - await user.save()
// 
// OUTPUT:
// - Return { success: true, user }

// ============================================================
// FUNCTION: scheduleDailySync()
// ============================================================
// PURPOSE: Setup cron job để sync hàng ngày
// 
// PSEUDOCODE:
// Step 1: Setup cron schedule
//   - const cron = require('node-cron')
//   
//   - // Chạy hàng ngày lúc 2AM
//   - cron.schedule('0 2 * * *', async () => {
//       console.log('Starting daily DATACORE sync...')
//       
//       try {
//         const results = await syncAllUsers()
//         console.log('Daily sync completed:', results)
//       }
//       catch (error) {
//         console.error('Daily sync failed:', error)
//       }
//     })
// 
// NOTE: Call this function once at server startup

// TODO: Import DatacoreService, UserService
// TODO: Import User model
// TODO: Import node-cron
// TODO: Import error classes (NotFoundError)

// TODO: Implement syncAllUsers()
// TODO: Implement syncSingleUser(userId)
// TODO: Implement scheduleDailySync() - call at server.js startup

// TODO: Export all functions
