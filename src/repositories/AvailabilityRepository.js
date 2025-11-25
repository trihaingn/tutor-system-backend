/**
 * REPOSITORY: Availability Repository
 * FILE: AvailabilityRepository.js
 * MỤC ĐÍCH: Truy vấn database cho Availability model
 * 
 * EXTENDS: BaseRepository
 * MODEL: Availability
 */

// TODO: Import BaseRepository, Availability model
// const BaseRepository = require('./BaseRepository')
// const Availability = require('../models/Availability')

// ============================================================
// CLASS: AvailabilityRepository extends BaseRepository
// ============================================================
// CONSTRUCTOR:
// constructor() {
//   super(Availability)
// }

// ============================================================
// METHOD: findOverlappingSlots(tutorId, type, data, excludeId = null)
// ============================================================
// PURPOSE: Tìm các availability slots chồng lấp
// USE CASE: AvailabilityService.checkOverlap()
// 
// INPUT:
// - tutorId: ObjectId
// - type: String ('RECURRING' | 'SPECIFIC_DATE')
// - data: Object { dayOfWeek?, specificDate?, startTime, endTime }
// - excludeId: ObjectId (optional, khi update)
// 
// PSEUDOCODE:
// Step 1: Build base filter
//   const filter = {
//     tutorId: tutorId,
//     type: type,
//     isActive: true
//   }
//   
//   if (excludeId) {
//     filter._id = { $ne: excludeId }
//   }
// 
// Step 2: Add type-specific filter
//   if (type === 'RECURRING') {
//     filter.dayOfWeek = data.dayOfWeek
//   } else if (type === 'SPECIFIC_DATE') {
//     filter.specificDate = data.specificDate
//   }
// 
// Step 3: Build time overlap condition
//   // Convert "HH:MM" to comparable format
//   const startTime = data.startTime // e.g., "09:00"
//   const endTime = data.endTime     // e.g., "11:00"
//   
//   filter.$or = [
//     // Case 1: New slot starts during existing slot
//     {
//       startTime: { $lte: startTime },
//       endTime: { $gt: startTime }
//     },
//     // Case 2: New slot ends during existing slot
//     {
//       startTime: { $lt: endTime },
//       endTime: { $gte: endTime }
//     },
//     // Case 3: New slot completely covers existing slot
//     {
//       startTime: { $gte: startTime },
//       endTime: { $lte: endTime }
//     }
//   ]
// 
// Step 4: Query overlapping slots
//   const slots = await this.model.find(filter)
// 
// Step 5: Return slots
//   return slots
// 
// OUTPUT:
// - Array of overlapping Availability slots

// ============================================================
// METHOD: findTutorAvailability(tutorId, filters)
// ============================================================
// PURPOSE: Lấy availability slots của tutor
// 
// INPUT:
// - tutorId: ObjectId
// - filters: { type?, isActive?, dayOfWeek?, specificDate? }
// 
// PSEUDOCODE:
// Step 1: Build filter
//   const filter = { tutorId: tutorId }
//   
//   if (filters.type) {
//     filter.type = filters.type
//   }
//   
//   if (filters.isActive !== undefined) {
//     filter.isActive = filters.isActive
//   }
//   
//   if (filters.dayOfWeek !== undefined) {
//     filter.dayOfWeek = filters.dayOfWeek
//   }
//   
//   if (filters.specificDate) {
//     filter.specificDate = filters.specificDate
//   }
// 
// Step 2: Query availability
//   const slots = await this.model.find(filter)
//     .sort({ startTime: 1 }) // Sort by start time ascending
// 
// Step 3: Return slots
//   return slots
// 
// OUTPUT:
// - Array of Availability slots

// ============================================================
// METHOD: deactivateSlot(slotId)
// ============================================================
// PURPOSE: Vô hiệu hóa availability slot
// 
// INPUT:
// - slotId: ObjectId
// 
// PSEUDOCODE:
// Step 1: Set isActive to false
//   const slot = await this.model.findByIdAndUpdate(
//     slotId,
//     { isActive: false },
//     { new: true }
//   )
// 
// Step 2: Return updated slot
//   return slot
// 
// OUTPUT:
// - Updated Availability document

// ============================================================
// METHOD: checkAvailability(tutorId, targetDate, startTime, endTime)
// ============================================================
// PURPOSE: Kiểm tra tutor có available trong khoảng thời gian không
// USE CASE: ScheduleService.checkTutorAvailability()
// 
// INPUT:
// - tutorId: ObjectId
// - targetDate: Date
// - startTime: String ("HH:MM")
// - endTime: String ("HH:MM")
// 
// PSEUDOCODE:
// Step 1: Get day of week from targetDate
//   const dayOfWeek = targetDate.getDay() // 0=Sunday, 1=Monday, ..., 6=Saturday
// 
// Step 2: Query for matching availability
//   const slots = await this.model.find({
//     tutorId: tutorId,
//     isActive: true,
//     $or: [
//       // Check RECURRING slots for this day of week
//       {
//         type: 'RECURRING',
//         dayOfWeek: dayOfWeek,
//         startTime: { $lte: startTime },
//         endTime: { $gte: endTime }
//       },
//       // Check SPECIFIC_DATE slots for exact date
//       {
//         type: 'SPECIFIC_DATE',
//         specificDate: targetDate,
//         startTime: { $lte: startTime },
//         endTime: { $gte: endTime }
//       }
//     ]
//   })
// 
// Step 3: Return boolean
//   return slots.length > 0
// 
// OUTPUT:
// - Boolean (true nếu tutor available)

// ============================================================
// METHOD: getRecurringAvailability(tutorId)
// ============================================================
// PURPOSE: Lấy tất cả RECURRING slots của tutor
// USE CASE: Hiển thị weekly schedule
// 
// INPUT:
// - tutorId: ObjectId
// 
// PSEUDOCODE:
// Step 1: Query recurring slots
//   const slots = await this.model.find({
//     tutorId: tutorId,
//     type: 'RECURRING',
//     isActive: true
//   })
//     .sort({ dayOfWeek: 1, startTime: 1 })
// 
// Step 2: Group by day of week
//   const schedule = {}
//   const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
//   
//   slots.forEach(slot => {
//     const dayName = daysOfWeek[slot.dayOfWeek]
//     if (!schedule[dayName]) {
//       schedule[dayName] = []
//     }
//     schedule[dayName].push({
//       startTime: slot.startTime,
//       endTime: slot.endTime,
//       maxSlots: slot.maxSlots
//     })
//   })
// 
// Step 3: Return schedule
//   return schedule
// 
// OUTPUT:
// - Object { "Monday": [...slots], "Tuesday": [...], ... }

// TODO: Implement AvailabilityRepository class
// class AvailabilityRepository extends BaseRepository { ... }

// TODO: Export singleton instance
// module.exports = new AvailabilityRepository()
