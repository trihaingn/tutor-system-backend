/**
 * SERVICE: AvailabilityService
 * FILE: AvailabilityService.js
 * MỤC ĐÍCH: Xử lý logic quản lý Tutor availability slots (UC-10)
 * 
 * BUSINESS RULES:
 * - BR-001: Thời gian phải là giờ chẵn (00 phút)
 * - Không được overlap với availability slots khác của cùng Tutor
 * 
 * DEPENDENCIES:
 * - Availability Model
 * - ValidationError, ConflictError, NotFoundError
 */

// ============================================================
// FUNCTION: validateTimeFormat(timeString)
// ============================================================
// PURPOSE: Validate time string format "HH:MM" và giờ chẵn (BR-001)
// 
// INPUT:
// - timeString: String (e.g., "09:00", "14:30")
// 
// PSEUDOCODE:
// Step 1: Validate format "HH:MM"
//   - Regex: /^([0-1][0-9]|2[0-3]):([0-5][0-9])$/
//   - If không match → Throw ValidationError("Format thời gian phải là HH:MM")
// 
// Step 2: ⚠️ BR-001 - Kiểm tra giờ chẵn
//   - Extract minutes: const [hours, minutes] = timeString.split(':')
//   - If parseInt(minutes) !== 0:
//     → Throw ValidationError("Thời gian phải là giờ chẵn (VD: 09:00, 10:00)")
// 
// OUTPUT:
// - Return { isValid: true, hours: Number } nếu pass

// ============================================================
// FUNCTION: validateAvailabilityData(availabilityData)
// ============================================================
// PURPOSE: Validate dữ liệu availability trước khi tạo/update
// 
// INPUT:
// - availabilityData: Object {
//     type: 'RECURRING' | 'SPECIFIC_DATE',
//     dayOfWeek?: Number (0-6),
//     specificDate?: Date,
//     startTime: String "HH:MM",
//     endTime: String "HH:MM",
//     maxSlots: Number
//   }
// 
// PSEUDOCODE:
// Step 1: Validate time format (BR-001)
//   - Call validateTimeFormat(availabilityData.startTime)
//   - Call validateTimeFormat(availabilityData.endTime)
// 
// Step 2: Validate endTime > startTime
//   - const [startHour] = availabilityData.startTime.split(':').map(Number)
//   - const [endHour] = availabilityData.endTime.split(':').map(Number)
//   - If endHour <= startHour:
//     → Throw ValidationError("Thời gian kết thúc phải sau thời gian bắt đầu")
// 
// Step 3: Validate type-specific fields
//   - If type === 'RECURRING':
//     → If dayOfWeek === null OR dayOfWeek === undefined:
//       → Throw ValidationError("RECURRING type cần dayOfWeek (0-6)")
//     → If dayOfWeek < 0 OR dayOfWeek > 6:
//       → Throw ValidationError("dayOfWeek phải từ 0-6 (Sunday-Saturday)")
//     → specificDate phải là null
//   
//   - If type === 'SPECIFIC_DATE':
//     → If !specificDate:
//       → Throw ValidationError("SPECIFIC_DATE type cần specificDate")
//     → Validate specificDate là Date hợp lệ
//     → dayOfWeek phải là null
// 
// Step 4: Validate maxSlots
//   - If maxSlots < 1:
//     → Throw ValidationError("maxSlots phải >= 1")
// 
// OUTPUT:
// - Return { isValid: true } nếu pass

// ============================================================
// FUNCTION: checkOverlap(tutorId, newAvailability, excludeId = null)
// ============================================================
// PURPOSE: Kiểm tra overlap với availability slots khác của cùng Tutor
// 
// INPUT:
// - tutorId: ObjectId
// - newAvailability: Object (availability data cần check)
// - excludeId: ObjectId (optional, khi update thì exclude chính slot đang update)
// 
// PSEUDOCODE:
// Step 1: Build query để tìm overlapping slots
//   query = {
//     tutorId: tutorId,
//     isActive: true,
//     _id: { $ne: excludeId }
//   }
// 
// Step 2: Thêm điều kiện theo type
//   - If newAvailability.type === 'RECURRING':
//     → query.type = 'RECURRING'
//     → query.dayOfWeek = newAvailability.dayOfWeek
//   
//   - If newAvailability.type === 'SPECIFIC_DATE':
//     → query.type = 'SPECIFIC_DATE'
//     → query.specificDate = newAvailability.specificDate
// 
// Step 3: Query Availability model
//   - const existingSlots = await Availability.find(query)
// 
// Step 4: Kiểm tra time overlap với từng slot
//   - const [newStartHour] = newAvailability.startTime.split(':').map(Number)
//   - const [newEndHour] = newAvailability.endTime.split(':').map(Number)
//   
//   - For each existingSlot in existingSlots:
//     → const [existingStartHour] = existingSlot.startTime.split(':').map(Number)
//     → const [existingEndHour] = existingSlot.endTime.split(':').map(Number)
//     
//     → Check overlap condition:
//       If (newStartHour < existingEndHour AND newEndHour > existingStartHour):
//         → Return { hasOverlap: true, conflictingSlot: existingSlot }
// 
// OUTPUT:
// - Return { hasOverlap: true, conflictingSlot: Availability } nếu có overlap
// - Return { hasOverlap: false } nếu không có overlap

// ============================================================
// FUNCTION: createAvailability(availabilityData)
// ============================================================
// PURPOSE: Tạo availability slot mới (UC-10)
// 
// INPUT:
// - availabilityData: Object {
//     tutorId: ObjectId,
//     type: 'RECURRING' | 'SPECIFIC_DATE',
//     dayOfWeek?: Number,
//     specificDate?: Date,
//     startTime: String,
//     endTime: String,
//     maxSlots: Number
//   }
// 
// PSEUDOCODE:
// Step 1: Validate data
//   - Call validateAvailabilityData(availabilityData)
//   - If error → Throw ValidationError
// 
// Step 2: Validate Tutor exists
//   - const tutor = await Tutor.findById(availabilityData.tutorId)
//   - If !tutor → Throw NotFoundError("Tutor không tồn tại")
// 
// Step 3: Kiểm tra overlap
//   - const overlapCheck = await checkOverlap(availabilityData.tutorId, availabilityData)
//   - If overlapCheck.hasOverlap:
//     → Throw ConflictError("Khung giờ này bị trùng với lịch rảnh khác")
// 
// Step 4: Tạo availability record
//   - const newAvailability = await Availability.create({
//       tutorId: availabilityData.tutorId,
//       type: availabilityData.type,
//       dayOfWeek: availabilityData.dayOfWeek || null,
//       specificDate: availabilityData.specificDate || null,
//       startTime: availabilityData.startTime,
//       endTime: availabilityData.endTime,
//       maxSlots: availabilityData.maxSlots,
//       isActive: true
//     })
// 
// Step 5: Return created availability
//   - Return newAvailability
// 
// OUTPUT:
// - Return Availability object

// ============================================================
// FUNCTION: getAvailabilityByTutor(tutorId, filters = {})
// ============================================================
// PURPOSE: Lấy danh sách availability slots của Tutor
// 
// INPUT:
// - tutorId: ObjectId
// - filters: Object { type?, isActive? }
// 
// PSEUDOCODE:
// Step 1: Build query
//   query = { tutorId: tutorId }
//   
//   - If filters.type:
//     → query.type = filters.type
//   
//   - If filters.isActive !== undefined:
//     → query.isActive = filters.isActive
//   - Else:
//     → query.isActive = true (default: chỉ lấy active slots)
// 
// Step 2: Query và sort
//   - const availabilities = await Availability.find(query)
//       .sort({ type: 1, dayOfWeek: 1, specificDate: 1, startTime: 1 })
// 
// OUTPUT:
// - Return array of Availability objects

// ============================================================
// FUNCTION: updateAvailability(availabilityId, tutorId, updateData)
// ============================================================
// PURPOSE: Update availability slot
// 
// INPUT:
// - availabilityId: ObjectId
// - tutorId: ObjectId (for ownership validation)
// - updateData: Object (fields to update)
// 
// PSEUDOCODE:
// Step 1: Tìm availability
//   - const availability = await Availability.findById(availabilityId)
//   - If !availability → Throw NotFoundError("Availability không tồn tại")
// 
// Step 2: Validate ownership
//   - If availability.tutorId.toString() !== tutorId.toString():
//     → Throw ForbiddenError("Bạn không phải chủ availability này")
// 
// Step 3: Nếu update time fields → Validate lại
//   - If updateData.startTime OR updateData.endTime:
//     → newStartTime = updateData.startTime || availability.startTime
//     → newEndTime = updateData.endTime || availability.endTime
//     → Call validateTimeFormat(newStartTime)
//     → Call validateTimeFormat(newEndTime)
//     
//     → Kiểm tra overlap:
//       const overlapData = {
//         type: availability.type,
//         dayOfWeek: availability.dayOfWeek,
//         specificDate: availability.specificDate,
//         startTime: newStartTime,
//         endTime: newEndTime
//       }
//       const overlapCheck = await checkOverlap(tutorId, overlapData, availabilityId)
//       If overlapCheck.hasOverlap → Throw ConflictError
// 
// Step 4: Apply updates
//   - Object.assign(availability, updateData)
//   - await availability.save()
// 
// OUTPUT:
// - Return updated Availability

// ============================================================
// FUNCTION: deleteAvailability(availabilityId, tutorId)
// ============================================================
// PURPOSE: Xóa (hoặc deactivate) availability slot
// 
// INPUT:
// - availabilityId: ObjectId
// - tutorId: ObjectId
// 
// PSEUDOCODE:
// Step 1: Tìm và validate ownership
//   - const availability = await Availability.findById(availabilityId)
//   - If !availability → Throw NotFoundError
//   - If availability.tutorId !== tutorId → Throw ForbiddenError
// 
// Step 2: Soft delete (set isActive = false)
//   - availability.isActive = false
//   - await availability.save()
//   
//   - (Alternative: Hard delete)
//   - await availability.deleteOne()
// 
// OUTPUT:
// - Return { success: true }

// TODO: Import Availability model, Tutor model
// TODO: Import error classes (ValidationError, ConflictError, NotFoundError, ForbiddenError)

// TODO: Implement validateTimeFormat(timeString)

// TODO: Implement validateAvailabilityData(availabilityData)

// TODO: Implement checkOverlap(tutorId, newAvailability, excludeId)

// TODO: Implement createAvailability(availabilityData)

// TODO: Implement getAvailabilityByTutor(tutorId, filters)

// TODO: Implement updateAvailability(availabilityId, tutorId, updateData)

// TODO: Implement deleteAvailability(availabilityId, tutorId)

// TODO: Export all functions
