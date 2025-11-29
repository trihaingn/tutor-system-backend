// REFACTORED: November 29, 2025 - Verified Architecture & Integration
// UC-12: Student request tutor session (PENDING status)
// UC-13: Tutor confirm/reject session (State transitions)
// BR: Validate tutor availability before creating session request
// Architecture: Services import Repositories ONLY

import TutorSessionRepository from '../../repositories/TutorSessionRepository.js';
import AppointmentRepository from '../../repositories/AppointmentRepository.js';
import CourseRegistrationRepository from '../../repositories/CourseRegistrationRepository.js';
import TutorRepository from '../../repositories/TutorRepository.js';
import StudentRepository from '../../repositories/StudentRepository.js';
import AvailabilityRepository from '../../repositories/AvailabilityRepository.js';
import { 
  ValidationError, 
  ConflictError, 
  NotFoundError,
  AuthorizationError
} from '../../utils/error.js';

/**
 * Validate session time constraints
 */
function validateSessionTime(startTime, endTime) {
  const start = new Date(startTime);
  const end = new Date(endTime);

  if (start.getMinutes() !== 0 || end.getMinutes() !== 0) {
    throw new ValidationError('Thời gian phải là giờ chẵn (VD: 09:00, 10:00)');
  }

  if (end <= start) {
    throw new ValidationError('Thời gian kết thúc phải sau thời gian bắt đầu');
  }

  const durationMinutes = (end - start) / 60000;
  if (durationMinutes < 60) {
    throw new ValidationError('Thời lượng tối thiểu là 60 phút');
  }

  return { isValid: true, duration: durationMinutes };
}

/**
 * Check if tutor is available at requested time
 */
async function checkTutorAvailability(tutorId, startTime, endTime) {
  const start = new Date(startTime);
  const dayOfWeek = start.getDay();
  const startHour = start.getHours();
  const endHour = new Date(endTime).getHours();
  const specificDate = start.toISOString().split('T')[0];

  const query = {
    tutorId,
    isActive: true,
    $or: [
      { type: 'RECURRING', dayOfWeek: dayOfWeek },
      { type: 'SPECIFIC_DATE', specificDate: specificDate }
    ]
  };

  const availabilitySlots = await AvailabilityRepository.findAll(query);

  for (const slot of availabilitySlots) {
    const [slotStartHour] = slot.startTime.split(':').map(Number);
    const [slotEndHour] = slot.endTime.split(':').map(Number);

    if (startHour >= slotStartHour && endHour <= slotEndHour) {
      return { available: true, slot };
    }
  }

  return { available: false };
}

/**
 * Request tutor session (UC-12)
 * Student creates a session request with PENDING status
 */
async function requestTutorSession(studentId, sessionData) {
  // Step 1: Validate student exists
  const student = await StudentRepository.findById(studentId);
  if (!student) {
    throw new NotFoundError('Student không tồn tại');
  }

  // Step 2: Validate tutor exists
  const tutor = await TutorRepository.findById(sessionData.tutorId);
  if (!tutor) {
    throw new NotFoundError('Tutor không tồn tại');
  }

  // Step 3: Validate time constraints
  validateSessionTime(sessionData.startTime, sessionData.endTime);

  // Step 4: BR - Check tutor availability
  const availability = await checkTutorAvailability(
    sessionData.tutorId,
    sessionData.startTime,
    sessionData.endTime
  );

  if (!availability.available) {
    throw new ConflictError('Tutor không có lịch rảnh trong khung giờ này');
  }

  // Step 5: Check for conflicting sessions (tutor already has session at this time)
  const conflictQuery = {
    tutorId: sessionData.tutorId,
    status: { $in: ['PENDING', 'CONFIRMED', 'SCHEDULED', 'IN_PROGRESS'] },
    $or: [
      {
        startTime: { $lte: sessionData.startTime },
        endTime: { $gt: sessionData.startTime }
      },
      {
        startTime: { $lt: sessionData.endTime },
        endTime: { $gte: sessionData.endTime }
      },
      {
        startTime: { $gte: sessionData.startTime },
        endTime: { $lte: sessionData.endTime }
      }
    ]
  };

  const conflictingSessions = await TutorSessionRepository.findAll(conflictQuery);
  if (conflictingSessions.length > 0) {
    throw new ConflictError('Tutor đã có session khác trong khung giờ này');
  }

  // Step 6: Calculate duration
  const start = new Date(sessionData.startTime);
  const end = new Date(sessionData.endTime);
  const duration = (end - start) / 60000;

  // Step 7: Create session with PENDING status (waiting for tutor confirmation)
  const newSession = await TutorSessionRepository.create({
    tutorId: sessionData.tutorId,
    requestedBy: studentId,
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
    status: 'PENDING', // UC-12: Waiting for tutor confirmation
    hasReport: false
  });

  // Step 8: BR-008 - Send notification to tutor (placeholder)
  // await NotificationService.create({
  //   userId: sessionData.tutorId,
  //   type: 'SESSION_REQUEST',
  //   title: 'Yêu cầu buổi học mới',
  //   message: `Student đã yêu cầu buổi học: ${sessionData.title}`
  // });

  return newSession;
}

/**
 * Confirm session request (UC-13)
 * Tutor accepts a PENDING session → Changes to CONFIRMED
 */
async function confirmSession(tutorId, sessionId) {
  // Step 1: Find session
  const session = await TutorSessionRepository.findById(sessionId);
  if (!session) {
    throw new NotFoundError('Session không tồn tại');
  }

  // Step 2: Validate ownership
  if (session.tutorId.toString() !== tutorId.toString()) {
    throw new AuthorizationError('Bạn không phải chủ session này');
  }

  // Step 3: Validate state transition (only PENDING can be confirmed)
  if (session.status !== 'PENDING') {
    throw new ValidationError(`Không thể confirm session ở trạng thái ${session.status}`);
  }

  // Step 4: Check for conflicts again (safety check)
  const conflictQuery = {
    tutorId: tutorId,
    _id: { $ne: sessionId },
    status: { $in: ['CONFIRMED', 'SCHEDULED', 'IN_PROGRESS'] },
    $or: [
      {
        startTime: { $lte: session.startTime },
        endTime: { $gt: session.startTime }
      },
      {
        startTime: { $lt: session.endTime },
        endTime: { $gte: session.endTime }
      }
    ]
  };

  const conflicts = await TutorSessionRepository.findAll(conflictQuery);
  if (conflicts.length > 0) {
    throw new ConflictError('Đã có session khác được confirm trong khung giờ này');
  }

  // Step 5: Update status to CONFIRMED
  const updatedSession = await TutorSessionRepository.update(sessionId, {
    status: 'CONFIRMED',
    confirmedAt: new Date()
  });

  // Step 6: BR-008 - Notify student (placeholder)
  // await NotificationService.create({
  //   userId: session.requestedBy,
  //   type: 'SESSION_CONFIRMED',
  //   title: 'Buổi học đã được xác nhận',
  //   message: `Tutor đã xác nhận buổi học: ${session.title}`
  // });

  return updatedSession;
}

/**
 * Reject session request (UC-13)
 * Tutor rejects a PENDING session → Changes to REJECTED
 */
async function rejectSession(tutorId, sessionId, reason = '') {
  // Step 1: Find session
  const session = await TutorSessionRepository.findById(sessionId);
  if (!session) {
    throw new NotFoundError('Session không tồn tại');
  }

  // Step 2: Validate ownership
  if (session.tutorId.toString() !== tutorId.toString()) {
    throw new AuthorizationError('Bạn không phải chủ session này');
  }

  // Step 3: Validate state transition (only PENDING can be rejected)
  if (session.status !== 'PENDING') {
    throw new ValidationError(`Không thể reject session ở trạng thái ${session.status}`);
  }

  // Step 4: Update status to REJECTED
  const updatedSession = await TutorSessionRepository.update(sessionId, {
    status: 'REJECTED',
    rejectedAt: new Date(),
    rejectionReason: reason
  });

  // Step 5: BR-008 - Notify student (placeholder)
  // await NotificationService.create({
  //   userId: session.requestedBy,
  //   type: 'SESSION_REJECTED',
  //   title: 'Yêu cầu buổi học bị từ chối',
  //   message: `Tutor đã từ chối buổi học: ${session.title}. Lý do: ${reason}`
  // });

  return updatedSession;
}

/**
 * Book appointment for an existing session (UC-12 variant)
 * Student joins an already CONFIRMED/SCHEDULED session
 */
async function bookAppointment(studentId, sessionId, notes = '') {
  // Step 1: Validate session exists
  const session = await TutorSessionRepository.findById(sessionId);
  if (!session) {
    throw new NotFoundError('Session không tồn tại');
  }

  // Step 2: Validate session status
  if (session.status !== 'SCHEDULED' && session.status !== 'CONFIRMED') {
    throw new ValidationError('Session không trong trạng thái mở đăng ký');
  }

  // Step 3: Check session capacity
  if (session.currentParticipants >= session.maxParticipants) {
    throw new ConflictError('Session đã đầy');
  }

  // Step 4: BR - Check registration exists
  const registration = await CourseRegistrationRepository.findOne({
    studentId: studentId,
    tutorId: session.tutorId,
    status: 'ACTIVE'
  });

  if (!registration) {
    throw new AuthorizationError('Bạn phải đăng ký với Tutor trước khi book appointment');
  }

  // Step 5: Check duplicate booking
  const existingAppointment = await AppointmentRepository.findOne({
    studentId: studentId,
    sessionId: sessionId,
    status: { $in: ['PENDING', 'CONFIRMED'] }
  });

  if (existingAppointment) {
    throw new ConflictError('Bạn đã book appointment này rồi');
  }

  // Step 6: Create appointment
  const appointment = await AppointmentRepository.create({
    studentId: studentId,
    sessionId: sessionId,
    tutorId: session.tutorId,
    notes: notes,
    status: 'CONFIRMED', // BR: Instant confirmation
    bookedAt: new Date()
  });

  // Step 7: Update session participants count
  await TutorSessionRepository.update(sessionId, {
    $inc: { currentParticipants: 1 },
    $push: { participants: studentId }
  });

  // Step 8: BR-008 - Notify tutor (placeholder)
  // await NotificationService.create({
  //   userId: session.tutorId,
  //   type: 'NEW_APPOINTMENT',
  //   title: 'Có học sinh đăng ký buổi học',
  //   message: `Học sinh đã đăng ký buổi học: ${session.title}`
  // });

  return appointment;
}

/**
 * Cancel appointment (UC-14)
 */
async function cancelAppointment(studentId, appointmentId) {
  // Step 1: Find appointment
  const appointment = await AppointmentRepository.findById(appointmentId);
  if (!appointment) {
    throw new NotFoundError('Appointment không tồn tại');
  }

  // Step 2: Validate ownership
  if (appointment.studentId.toString() !== studentId.toString()) {
    throw new AuthorizationError('Bạn không phải chủ appointment này');
  }

  // Step 3: Only cancel PENDING/CONFIRMED appointments
  if (appointment.status !== 'PENDING' && appointment.status !== 'CONFIRMED') {
    throw new ValidationError('Không thể cancel appointment ở trạng thái này');
  }

  // Step 4: Update appointment status
  await AppointmentRepository.update(appointmentId, {
    status: 'CANCELLED',
    cancelledAt: new Date()
  });

  // Step 5: Decrease session participants count
  await TutorSessionRepository.update(appointment.sessionId, {
    $inc: { currentParticipants: -1 },
    $pull: { participants: studentId }
  });

  return { success: true };
}

/**
 * Get sessions by status and filters
 */
async function getSessions(filters = {}) {
  const query = {};

  if (filters.tutorId) {
    query.tutorId = filters.tutorId;
  }

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
  requestTutorSession,
  confirmSession,
  rejectSession,
  bookAppointment,
  cancelAppointment,
  getSessions,
  validateSessionTime,
  checkTutorAvailability
};
