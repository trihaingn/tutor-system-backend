// REFACTORED: November 29, 2025 - Verified Architecture & Integration
// BR-001: Thời gian bắt đầu/kết thúc phải là giờ chẵn (00 phút)
// BR-002: Thời lượng tối thiểu 60 phút
// BR-003: Session ONLINE phải có meetingLink
// BR-004: Session OFFLINE phải có location
// Architecture: Services import Repositories ONLY

import TutorSessionRepository from '../../repositories/TutorSessionRepository.js';
import AvailabilityRepository from '../../repositories/AvailabilityRepository.js';
import TutorRepository from '../../repositories/TutorRepository.js';
import UserRepository from '../../repositories/UserRepository.js';
import { 
  ValidationError, 
  ConflictError, 
  NotFoundError,
  AuthorizationError
} from '../../utils/error.js';

/**
 * Validate session time theo BR-001, BR-002
 */
function validateSessionTime(startTime, endTime) {
  // Convert to Date objects if needed
  const start = new Date(startTime);
  const end = new Date(endTime);

  // BR-001: Kiểm tra giờ chẵn (phút phải = 0)
  if (start.getMinutes() !== 0 || end.getMinutes() !== 0) {
    throw new ValidationError('Thời gian phải là giờ chẵn (VD: 09:00, 10:00)');
  }

  // Validate end > start
  if (end <= start) {
    throw new ValidationError('Thời gian kết thúc phải sau thời gian bắt đầu');
  }

  // BR-002: Kiểm tra thời lượng tối thiểu 60 phút
  const durationMinutes = (end - start) / 60000;
  if (durationMinutes < 60) {
    throw new ValidationError('Thời lượng tối thiểu là 60 phút');
  }

  return { isValid: true, duration: durationMinutes };
}

/**
 * Validate session type theo BR-003, BR-004
 */
function validateSessionType(sessionType, meetingLink, location) {
  // BR-003: ONLINE phải có meetingLink
  if (sessionType === 'ONLINE') {
    if (!meetingLink || meetingLink.trim() === '') {
      throw new ValidationError('Session ONLINE phải có meetingLink');
    }
  }

  // BR-004: OFFLINE phải có location
  if (sessionType === 'OFFLINE') {
    if (!location || location.trim() === '') {
      throw new ValidationError('Session OFFLINE phải có location');
    }
  }

  return { isValid: true };
}

/**
 * Check tutor availability trong time slot (BR-003)
 */
async function checkTutorAvailability(tutorId, startTime, endTime) {
  const start = new Date(startTime);
  const end = new Date(endTime);

  const dayOfWeek = start.getDay(); // 0-6, Sunday=0
  const startHour = start.getHours();
  const endHour = end.getHours();
  
  // Format date for SPECIFIC_DATE check
  const specificDate = start.toISOString().split('T')[0];

  // Query availability slots
  const query = {
    tutorId,
    isActive: true,
    $or: [
      // RECURRING slots matching dayOfWeek
      {
        type: 'RECURRING',
        dayOfWeek: dayOfWeek
      },
      // SPECIFIC_DATE slots matching exact date
      {
        type: 'SPECIFIC_DATE',
        specificDate: specificDate
      }
    ]
  };

  const availabilitySlots = await AvailabilityRepository.findAll(query);

  // Check if session time fits within any availability slot
  for (const slot of availabilitySlots) {
    const [slotStartHour] = slot.startTime.split(':').map(Number);
    const [slotEndHour] = slot.endTime.split(':').map(Number);

    // Session must be completely within availability window
    if (startHour >= slotStartHour && endHour <= slotEndHour) {
      return { available: true, slot };
    }
  }

  return { available: false };
}

/**
 * Check session conflicts (no overlapping sessions)
 */
async function checkSessionConflicts(tutorId, startTime, endTime, excludeSessionId = null) {
  const query = {
    tutorId,
    status: { $in: ['SCHEDULED', 'IN_PROGRESS', 'CONFIRMED'] }, // Only active sessions
    $or: [
      // Case 1: New session starts during existing session
      {
        startTime: { $lte: startTime },
        endTime: { $gt: startTime }
      },
      // Case 2: New session ends during existing session
      {
        startTime: { $lt: endTime },
        endTime: { $gte: endTime }
      },
      // Case 3: New session completely covers existing session
      {
        startTime: { $gte: startTime },
        endTime: { $lte: endTime }
      }
    ]
  };

  if (excludeSessionId) {
    query._id = { $ne: excludeSessionId };
  }

  const conflictingSessions = await TutorSessionRepository.findAll(query);

  if (conflictingSessions.length > 0) {
    return { hasConflict: true, conflicts: conflictingSessions };
  }

  return { hasConflict: false };
}

/**
 * Open tutor session (UC-11 main function)
 * Called from controller with tutorId and session data
 */
async function openTutorSession(tutorId, sessionData) {
  // Step 1: BR-001, BR-002 - Validate time
  validateSessionTime(sessionData.startTime, sessionData.endTime);

  // Step 2: BR-003, BR-004 - Validate session type
  validateSessionType(
    sessionData.sessionType,
    sessionData.meetingLink,
    sessionData.location
  );

  // Step 3: BR - Check tutor availability
  const availability = await checkTutorAvailability(
    tutorId,
    sessionData.startTime,
    sessionData.endTime
  );

  if (!availability.available) {
    throw new ConflictError('Tutor không có lịch rảnh trong khung giờ này');
  }

  // Step 4: Check session conflicts
  const conflicts = await checkSessionConflicts(
    tutorId,
    sessionData.startTime,
    sessionData.endTime
  );

  if (conflicts.hasConflict) {
    throw new ConflictError('Tutor đã có session khác trong khung giờ này');
  }

  // Step 5: Validate Tutor exists và active
  const tutor = await TutorRepository.findById(tutorId);
  if (!tutor) {
    throw new NotFoundError('Tutor không tồn tại');
  }

  const tutorUser = await UserRepository.findById(tutor.userId);
  if (!tutorUser || tutorUser.status !== 'ACTIVE') {
    throw new AuthorizationError('Tutor không hoạt động');
  }

  // Step 6: Calculate duration
  const start = new Date(sessionData.startTime);
  const end = new Date(sessionData.endTime);
  const duration = (end - start) / 60000; // minutes

  // Step 7: Create session with status CONFIRMED (BR)
  const newSession = await TutorSessionRepository.create({
    tutorId,
    title: sessionData.title,
    subjectId: sessionData.subjectId,
    description: sessionData.description || '',
    startTime: sessionData.startTime,
    endTime: sessionData.endTime,
    duration,
    sessionType: sessionData.sessionType,
    meetingLink: sessionData.meetingLink || null,
    location: sessionData.location || null,
    maxParticipants: sessionData.maxParticipants || 10,
    currentParticipants: 0,
    participants: [],
    status: 'CONFIRMED', // BR: Instant confirmation
    hasReport: false
  });

  // Step 8: BR-008 - Send notifications (placeholder)
  // await NotificationService.sendNotification({
  //   recipientId: registeredStudents,
  //   type: 'SESSION_CREATED',
  //   title: 'Buổi học mới được tạo',
  //   message: `Tutor ${tutorUser.fullName} đã tạo buổi học: ${sessionData.title}`
  // });

  return newSession;
}

/**
 * Create session (alias for openTutorSession)
 */
async function createSession(sessionData) {
  return await openTutorSession(sessionData.tutorId, sessionData);
}

/**
 * Update session
 */
async function updateSession(sessionId, tutorId, updateData) {
  // Step 1: Find session
  const session = await TutorSessionRepository.findById(sessionId);
  if (!session) {
    throw new NotFoundError('Session không tồn tại');
  }

  // Step 2: Validate ownership
  if (session.tutorId.toString() !== tutorId.toString()) {
    throw new AuthorizationError('Bạn không phải chủ session này');
  }

  // Step 3: Only update SCHEDULED/CONFIRMED sessions
  if (session.status !== 'SCHEDULED' && session.status !== 'CONFIRMED') {
    throw new AuthorizationError('Chỉ có thể update session đang SCHEDULED/CONFIRMED');
  }

  // Step 4: If updating time, validate BR-001, BR-002 again
  if (updateData.startTime || updateData.endTime) {
    const newStartTime = updateData.startTime || session.startTime;
    const newEndTime = updateData.endTime || session.endTime;
    
    validateSessionTime(newStartTime, newEndTime);
    
    const conflicts = await checkSessionConflicts(tutorId, newStartTime, newEndTime, sessionId);
    if (conflicts.hasConflict) {
      throw new ConflictError('Thời gian mới bị trùng với session khác');
    }
  }

  // Step 5: If updating sessionType, validate BR-003, BR-004
  if (updateData.sessionType) {
    validateSessionType(
      updateData.sessionType,
      updateData.meetingLink || session.meetingLink,
      updateData.location || session.location
    );
  }

  // Step 6: Apply updates
  const updated = await TutorSessionRepository.update(sessionId, updateData);
  return updated;
}

/**
 * Cancel session (UC-15)
 */
async function cancelSession(sessionId, tutorId) {
  // Step 1: Find session
  const session = await TutorSessionRepository.findById(sessionId);
  if (!session) {
    throw new NotFoundError('Session không tồn tại');
  }

  // Step 2: Validate ownership
  if (session.tutorId.toString() !== tutorId.toString()) {
    throw new AuthorizationError('Bạn không phải chủ session này');
  }

  // Step 3: Only cancel SCHEDULED/CONFIRMED sessions
  if (session.status !== 'SCHEDULED' && session.status !== 'CONFIRMED') {
    throw new AuthorizationError('Chỉ có thể cancel session đang SCHEDULED/CONFIRMED');
  }

  // Step 4: Update status
  const updatedSession = await TutorSessionRepository.update(sessionId, {
    status: 'CANCELLED'
  });

  // Step 5: BR-008 - Notify participants (placeholder)
  // for (const participantId of session.participants) {
  //   await NotificationService.sendNotification({
  //     recipientId: participantId,
  //     type: 'SESSION_CANCELLED',
  //     title: 'Buổi học đã bị hủy',
  //     message: `Buổi học "${session.title}" đã bị hủy bởi Tutor`
  //   });
  // }

  return { success: true, session: updatedSession };
}

/**
 * Get sessions by tutor
 */
async function getSessionsByTutor(tutorId, filters = {}) {
  const query = { tutorId };

  if (filters.status) {
    query.status = filters.status;
  }

  if (filters.startDate || filters.endDate) {
    query.startTime = {};
    if (filters.startDate) {
      query.startTime.$gte = filters.startDate;
    }
    if (filters.endDate) {
      query.startTime.$lte = filters.endDate;
    }
  }

  const sessions = await TutorSessionRepository.findAll(query, {
    sort: { startTime: -1 }
  });

  return sessions;
}

export {
  validateSessionTime,
  validateSessionType,
  checkTutorAvailability,
  checkSessionConflicts,
  openTutorSession,
  createSession,
  updateSession,
  cancelSession,
  getSessionsByTutor
};
