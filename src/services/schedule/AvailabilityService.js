// REFACTORED: November 29, 2025 - Verified Architecture & Integration
// BR-001: Thời gian phải là giờ chẵn (00 phút)
// BR: Không được overlap với availability slots khác
// Architecture: Services import Repositories ONLY

import AvailabilityRepository from '../../repositories/AvailabilityRepository.js';
import TutorRepository from '../../repositories/TutorRepository.js';
import { 
  ValidationError, 
  ConflictError, 
  NotFoundError,
  AuthorizationError
} from '../../utils/error.js';

/**
 * Validate time format "HH:MM" và giờ chẵn (BR-001)
 */
function validateTimeFormat(timeString) {
  // BR-001: Validate format "HH:MM"
  const timeRegex = /^([0-1][0-9]|2[0-3]):([0-5][0-9])$/;
  if (!timeRegex.test(timeString)) {
    throw new ValidationError('Format thời gian phải là HH:MM');
  }

  // BR-001: Kiểm tra giờ chẵn (phút phải = 0)
  const [hours, minutes] = timeString.split(':').map(Number);
  if (minutes !== 0) {
    throw new ValidationError('Thời gian phải là giờ chẵn (VD: 09:00, 10:00)');
  }

  return { isValid: true, hours };
}

/**
 * Validate availability data
 */
function validateAvailabilityData(availabilityData) {
  // Step 1: BR-001 - Validate time format
  validateTimeFormat(availabilityData.startTime);
  validateTimeFormat(availabilityData.endTime);

  // Step 2: Validate endTime > startTime
  const [startHour] = availabilityData.startTime.split(':').map(Number);
  const [endHour] = availabilityData.endTime.split(':').map(Number);
  
  if (endHour <= startHour) {
    throw new ValidationError('Thời gian kết thúc phải sau thời gian bắt đầu');
  }

  // Step 3: Validate type-specific fields
  if (availabilityData.type === 'RECURRING') {
    if (availabilityData.dayOfWeek === null || availabilityData.dayOfWeek === undefined) {
      throw new ValidationError('RECURRING type cần dayOfWeek (0-6)');
    }
    if (availabilityData.dayOfWeek < 0 || availabilityData.dayOfWeek > 6) {
      throw new ValidationError('dayOfWeek phải từ 0-6 (Sunday-Saturday)');
    }
  } else if (availabilityData.type === 'SPECIFIC_DATE') {
    if (!availabilityData.specificDate) {
      throw new ValidationError('SPECIFIC_DATE type cần specificDate');
    }
  }

  // Step 4: Validate maxSlots
  if (availabilityData.maxSlots < 1) {
    throw new ValidationError('maxSlots phải >= 1');
  }

  return { isValid: true };
}

/**
 * Check overlap với availability slots khác (BR)
 */
async function checkOverlap(tutorId, newAvailability, excludeId = null) {
  const query = {
    tutorId,
    isActive: true
  };

  if (excludeId) {
    query._id = { $ne: excludeId };
  }

  // Add type-specific conditions
  if (newAvailability.type === 'RECURRING') {
    query.type = 'RECURRING';
    query.dayOfWeek = newAvailability.dayOfWeek;
  } else if (newAvailability.type === 'SPECIFIC_DATE') {
    query.type = 'SPECIFIC_DATE';
    query.specificDate = newAvailability.specificDate;
  }

  const existingSlots = await AvailabilityRepository.findAll(query);

  // BR: Check time overlap
  const [newStartHour] = newAvailability.startTime.split(':').map(Number);
  const [newEndHour] = newAvailability.endTime.split(':').map(Number);

  for (const slot of existingSlots) {
    const [existingStartHour] = slot.startTime.split(':').map(Number);
    const [existingEndHour] = slot.endTime.split(':').map(Number);

    // Overlap condition: intervals intersect
    if (newStartHour < existingEndHour && newEndHour > existingStartHour) {
      return { hasOverlap: true, conflictingSlot: slot };
    }
  }

  return { hasOverlap: false };
}

/**
 * Create availability slot (UC-10)
 */
async function createAvailability(availabilityData) {
  // Step 1: Validate data (BR-001 enforced here)
  validateAvailabilityData(availabilityData);

  // Step 2: Validate Tutor exists
  const tutor = await TutorRepository.findById(availabilityData.tutorId);
  if (!tutor) {
    throw new NotFoundError('Tutor không tồn tại');
  }

  // Step 3: BR - Kiểm tra overlap
  const overlapCheck = await checkOverlap(availabilityData.tutorId, availabilityData);
  if (overlapCheck.hasOverlap) {
    throw new ConflictError('Khung giờ này bị trùng với lịch rảnh khác');
  }

  // Step 4: Create availability record
  const newAvailability = await AvailabilityRepository.create({
    tutorId: availabilityData.tutorId,
    type: availabilityData.type,
    dayOfWeek: availabilityData.dayOfWeek || null,
    specificDate: availabilityData.specificDate || null,
    startTime: availabilityData.startTime,
    endTime: availabilityData.endTime,
    maxSlots: availabilityData.maxSlots,
    isActive: true
  });

  return newAvailability;
}

/**
 * Set availability ranges for tutor (UC-10 main function)
 * Called from controller with tutorId and array of time ranges
 */
async function setAvailability(tutorId, ranges) {
  // Validate Tutor exists
  const tutor = await TutorRepository.findById(tutorId);
  if (!tutor) {
    throw new NotFoundError('Tutor không tồn tại');
  }

  const createdSlots = [];

  for (const range of ranges) {
    const availabilityData = {
      tutorId,
      ...range
    };

    // BR-001: Validate each range has hourly times
    const result = await createAvailability(availabilityData);
    createdSlots.push(result);
  }

  return {
    success: true,
    created: createdSlots.length,
    slots: createdSlots
  };
}

/**
 * Get availability slots by tutor
 */
async function getAvailabilityByTutor(tutorId, filters = {}) {
  const query = { tutorId };

  if (filters.type) {
    query.type = filters.type;
  }

  if (filters.isActive !== undefined) {
    query.isActive = filters.isActive;
  } else {
    query.isActive = true; // Default: only active slots
  }

  const availabilities = await AvailabilityRepository.findAll(query, {
    sort: { type: 1, dayOfWeek: 1, specificDate: 1, startTime: 1 }
  });

  return availabilities;
}

/**
 * Update availability slot
 */
async function updateAvailability(availabilityId, tutorId, updateData) {
  // Step 1: Find availability
  const availability = await AvailabilityRepository.findById(availabilityId);
  if (!availability) {
    throw new NotFoundError('Availability không tồn tại');
  }

  // Step 2: Validate ownership
  if (availability.tutorId.toString() !== tutorId.toString()) {
    throw new AuthorizationError('Bạn không phải chủ availability này');
  }

  // Step 3: If updating time fields, validate BR-001 again
  if (updateData.startTime || updateData.endTime) {
    const newStartTime = updateData.startTime || availability.startTime;
    const newEndTime = updateData.endTime || availability.endTime;
    
    validateTimeFormat(newStartTime);
    validateTimeFormat(newEndTime);

    const overlapData = {
      type: availability.type,
      dayOfWeek: availability.dayOfWeek,
      specificDate: availability.specificDate,
      startTime: newStartTime,
      endTime: newEndTime
    };

    const overlapCheck = await checkOverlap(tutorId, overlapData, availabilityId);
    if (overlapCheck.hasOverlap) {
      throw new ConflictError('Khung giờ này bị trùng với lịch rảnh khác');
    }
  }

  // Step 4: Apply updates
  const updated = await AvailabilityRepository.update(availabilityId, updateData);
  return updated;
}

/**
 * Delete (deactivate) availability slot
 */
async function deleteAvailability(availabilityId, tutorId) {
  // Step 1: Find and validate ownership
  const availability = await AvailabilityRepository.findById(availabilityId);
  if (!availability) {
    throw new NotFoundError('Availability không tồn tại');
  }

  if (availability.tutorId.toString() !== tutorId.toString()) {
    throw new AuthorizationError('Bạn không phải chủ availability này');
  }

  // Step 2: Soft delete (set isActive = false)
  await AvailabilityRepository.update(availabilityId, { isActive: false });

  return { success: true };
}

export {
  validateTimeFormat,
  validateAvailabilityData,
  checkOverlap,
  setAvailability,
  createAvailability,
  getAvailabilityByTutor,
  updateAvailability,
  deleteAvailability
};
