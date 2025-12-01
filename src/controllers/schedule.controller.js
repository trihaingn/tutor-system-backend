/**
 * CONTROLLER: ScheduleController
 * FILE: schedule.controller.js
 * MỤC ĐÍCH: Xử lý HTTP requests liên quan đến Tutor Availability (UC-10)
 * 
 * USE CASES:
 * - UC-10: Tutor set availability slots
 * 
 * DEPENDENCIES:
 * - ScheduleService: Handle availability logic
 * - ValidationError, ConflictError
 */

// ============================================================
// FUNCTION: setAvailability()
// ============================================================
// METHOD: POST /api/v1/schedules/availability
// PURPOSE: Tutor set lịch rảnh (UC-10)
// 
// REQUEST:
// {
//   "type": "RECURRING",
//   "dayOfWeek": 1,          // Monday
//   "startTime": "09:00",
//   "endTime": "11:00",
//   "maxSlots": 3
// }
// OR
// {
//   "type": "SPECIFIC_DATE",
//   "specificDate": "2025-01-20",
//   "startTime": "14:00",
//   "endTime": "16:00",
//   "maxSlots": 2
// }
// Headers: { Authorization: 'Bearer <JWT>' }
// Role: TUTOR or ADMIN only
// 
// VALIDATION:
// - ⚠️ BR-001: startTime và endTime phải là giờ tròn (HH:00)
// - If type=RECURRING → dayOfWeek required (0-6)
// - If type=SPECIFIC_DATE → specificDate required
// - endTime > startTime
// - No overlap với existing availability slots
// 
// PROCESS:
// 1. Extract tutorId from JWT
// 2. Call ScheduleService.setAvailability()
//    - Validate hourly times (BR-001)
//    - Check for overlaps
//    - Create Availability record
// 3. Return created availability slot
// 
// RESPONSE:
// {
//   "success": true,
//   "data": {
//     "availabilityId": "...",
//     "tutorId": "...",
//     "type": "RECURRING",
//     "dayOfWeek": 1,
//     "startTime": "09:00",
//     "endTime": "11:00",
//     "maxSlots": 3,
//     "isActive": true
//   }
// }
// 
// ERROR HANDLING:
// - Not hourly → 400 ValidationError
// - endTime <= startTime → 400 ValidationError
// - Overlap with existing slot → 409 ConflictError

// ============================================================
// FUNCTION: getMyAvailability()
// ============================================================
// METHOD: GET /api/v1/schedules/availability/me
// PURPOSE: Tutor xem danh sách availability slots của mình
// 
// REQUEST:
// - Query: { type?: 'RECURRING' | 'SPECIFIC_DATE', isActive?: true/false }
// - Headers: { Authorization: 'Bearer <JWT>' }
// 
// PROCESS:
// 1. Extract tutorId from JWT
// 2. Query Availability model (filter by type, isActive if provided)
// 3. Return sorted list
// 
// RESPONSE:
// {
//   "success": true,
//   "data": [
//     {
//       "availabilityId": "...",
//       "type": "RECURRING",
//       "dayOfWeek": 1,
//       "startTime": "09:00",
//       "endTime": "11:00",
//       "maxSlots": 3,
//       "isActive": true
//     }
//   ]
// }

// ============================================================
// FUNCTION: updateAvailability()
// ============================================================
// METHOD: PUT /api/v1/schedules/availability/:id
// PURPOSE: Tutor update availability slot
// 
// REQUEST:
// - Params: { id: availabilityId }
// - Body: { startTime?, endTime?, maxSlots?, isActive? }
// - Headers: { Authorization: 'Bearer <JWT>' }
// 
// VALIDATION:
// - Same as setAvailability (BR-001, no overlap)
// - ⚠️ Validate ownership: availability.tutorId === tutorId
// 
// PROCESS:
// 1. Extract tutorId from JWT
// 2. Find availability by id
// 3. Validate ownership
// 4. Validate updates (hourly, no overlap)
// 5. Update record
// 6. Return updated availability
// 
// RESPONSE:
// {
//   "success": true,
//   "data": { ...updated availability }
// }

// ============================================================
// FUNCTION: deleteAvailability()
// ============================================================
// METHOD: DELETE /api/v1/schedules/availability/:id
// PURPOSE: Tutor xóa availability slot
// 
// REQUEST:
// - Params: { id: availabilityId }
// - Headers: { Authorization: 'Bearer <JWT>' }
// 
// PROCESS:
// 1. Extract tutorId from JWT
// 2. Find availability by id
// 3. Validate ownership
// 4. Delete record (or set isActive=false)
// 5. Return success response
// 
// RESPONSE:
// {
//   "success": true,
//   "message": "Availability slot deleted successfully"
// }

// TODO: Import dependencies (ScheduleService, error classes)

// TODO: Implement setAvailability() - POST /api/v1/schedules/availability
// - Validate BR-001 (hourly)
// - Check overlaps
// - Call service layer

// TODO: Implement getMyAvailability() - GET /api/v1/schedules/availability/me
// - Filter by type, isActive
// - Return sorted list

// TODO: Implement updateAvailability() - PUT /api/v1/schedules/availability/:id
// - Validate ownership
// - Validate updates
// - Update record

// TODO: Implement deleteAvailability() - DELETE /api/v1/schedules/availability/:id
// - Validate ownership
// - Delete or deactivate

import { asyncHandler, ValidationError, NotFoundError } from '../middleware/errorMiddleware.js';

class ScheduleController {
  /**
   * POST /api/v1/schedules/availability
   * Tutor sets availability slot (UC-10)
   */
  setAvailability = asyncHandler(async (req, res) => {
    const userId = req.userId;
    const { ConflictError } = await import('../middleware/errorMiddleware.js');
    
    // Find tutor profile
    const Tutor = (await import('../models/Tutor.model.js')).default;
    const tutor = await Tutor.findOne({ userId });
    
    if (!tutor) {
      throw new NotFoundError('Tutor profile not found');
    }

    const { dayOfWeek, startTime, endTime } = req.body;

    // Validate required fields
    if (dayOfWeek === undefined || !startTime || !endTime) {
      throw new ValidationError('dayOfWeek, startTime, and endTime are required');
    }

    // Validate dayOfWeek range
    if (dayOfWeek < 0 || dayOfWeek > 6) {
      throw new ValidationError('dayOfWeek must be between 0 (Sunday) and 6 (Saturday)');
    }

    // BR-001: Validate hourly times (HH:00 format)
    const hourlyRegex = /^([01]\d|2[0-3]):00$/;
    if (!hourlyRegex.test(startTime)) {
      throw new ValidationError('startTime must be hourly format (HH:00)');
    }
    if (!hourlyRegex.test(endTime)) {
      throw new ValidationError('endTime must be hourly format (HH:00)');
    }

    // Validate endTime > startTime
    if (endTime <= startTime) {
      throw new ValidationError('endTime must be greater than startTime');
    }

    // Check for overlapping slots
    const Availability = (await import('../models/Availability.model.js')).default;
    const overlap = await Availability.findOne({
      tutorId: tutor._id,
      dayOfWeek,
      isActive: true,
      $or: [
        { startTime: { $lt: endTime }, endTime: { $gt: startTime } }
      ]
    });

    if (overlap) {
      throw new ConflictError('Time slot overlaps with existing availability');
    }

    // Create availability
    const availability = await Availability.create({
      tutorId: tutor._id,
      dayOfWeek,
      startTime,
      endTime,
      isActive: true
    });

    res.status(201).json({
      success: true,
      data: availability
    });
  });

  /**
   * GET /api/v1/schedules/availability/me
   * Get my availability slots
   */
  getMyAvailability = asyncHandler(async (req, res) => {
    const userId = req.userId;
    
    // Find tutor profile
    const Tutor = (await import('../models/Tutor.model.js')).default;
    const tutor = await Tutor.findOne({ userId });
    
    if (!tutor) {
      throw new NotFoundError('Tutor profile not found');
    }

    const { isActive } = req.query;

    const filter = { tutorId: tutor._id };
    if (isActive !== undefined) {
      filter.isActive = isActive === 'true';
    }

    const Availability = (await import('../models/Availability.model.js')).default;
    const availabilities = await Availability.find(filter)
      .sort({ dayOfWeek: 1, startTime: 1 })
      .lean();

    res.status(200).json({
      success: true,
      data: availabilities
    });
  });

  /**
   * PUT /api/v1/schedules/availability/:id
   * Update availability slot
   */
  updateAvailability = asyncHandler(async (req, res) => {
    const userId = req.userId;
    const { id } = req.params;
    const { ForbiddenError, ConflictError } = await import('../middleware/errorMiddleware.js');
    
    // Find tutor profile
    const Tutor = (await import('../models/Tutor.model.js')).default;
    const tutor = await Tutor.findOne({ userId });
    
    if (!tutor) {
      throw new NotFoundError('Tutor profile not found');
    }

    // Find availability
    const Availability = (await import('../models/Availability.model.js')).default;
    const availability = await Availability.findById(id);
    
    if (!availability) {
      throw new NotFoundError('Availability slot not found');
    }

    // Validate ownership
    if (availability.tutorId.toString() !== tutor._id.toString()) {
      throw new ForbiddenError('Not authorized to update this availability slot');
    }

    const { startTime, endTime, isActive } = req.body;

    // Validate hourly times if provided
    const hourlyRegex = /^([01]\d|2[0-3]):00$/;
    if (startTime && !hourlyRegex.test(startTime)) {
      throw new ValidationError('startTime must be hourly format (HH:00)');
    }
    if (endTime && !hourlyRegex.test(endTime)) {
      throw new ValidationError('endTime must be hourly format (HH:00)');
    }

    const newStartTime = startTime || availability.startTime;
    const newEndTime = endTime || availability.endTime;

    // Validate endTime > startTime
    if (newEndTime <= newStartTime) {
      throw new ValidationError('endTime must be greater than startTime');
    }

    // Check for overlaps (exclude current record)
    if (startTime || endTime) {
      const overlap = await Availability.findOne({
        _id: { $ne: id },
        tutorId: tutor._id,
        dayOfWeek: availability.dayOfWeek,
        isActive: true,
        $or: [
          { startTime: { $lt: newEndTime }, endTime: { $gt: newStartTime } }
        ]
      });

      if (overlap) {
        throw new ConflictError('Updated time slot overlaps with existing availability');
      }
    }

    // Update fields
    if (startTime) availability.startTime = startTime;
    if (endTime) availability.endTime = endTime;
    if (isActive !== undefined) availability.isActive = isActive;

    await availability.save();

    res.status(200).json({
      success: true,
      data: availability
    });
  });

  /**
   * DELETE /api/v1/schedules/availability/:id
   * Delete availability slot
   */
  deleteAvailability = asyncHandler(async (req, res) => {
    const userId = req.userId;
    const { id } = req.params;
    const { ForbiddenError } = await import('../middleware/errorMiddleware.js');
    
    // Find tutor profile
    const Tutor = (await import('../models/Tutor.model.js')).default;
    const tutor = await Tutor.findOne({ userId });
    
    if (!tutor) {
      throw new NotFoundError('Tutor profile not found');
    }

    // Find availability
    const Availability = (await import('../models/Availability.model.js')).default;
    const availability = await Availability.findById(id);
    
    if (!availability) {
      throw new NotFoundError('Availability slot not found');
    }

    // Validate ownership
    if (availability.tutorId.toString() !== tutor._id.toString()) {
      throw new ForbiddenError('Not authorized to delete this availability slot');
    }

    // Soft delete: set isActive to false
    availability.isActive = false;
    await availability.save();

    res.status(200).json({
      success: true,
      message: 'Availability slot deleted successfully'
    });
  });
}

export default new ScheduleController();
