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

import { asyncHandler } from '../middleware/errorMiddleware.js';

class ScheduleController {
  setAvailability = asyncHandler(async (req, res) => {
    res.status(501).json({
      success: false,
      message: 'setAvailability - Not implemented yet'
    });
  });

  getMyAvailability = asyncHandler(async (req, res) => {
    res.status(501).json({
      success: false,
      message: 'getMyAvailability - Not implemented yet'
    });
  });

  updateAvailability = asyncHandler(async (req, res) => {
    res.status(501).json({
      success: false,
      message: 'updateAvailability - Not implemented yet'
    });
  });

  deleteAvailability = asyncHandler(async (req, res) => {
    res.status(501).json({
      success: false,
      message: 'deleteAvailability - Not implemented yet'
    });
  });
}

export default new ScheduleController();
