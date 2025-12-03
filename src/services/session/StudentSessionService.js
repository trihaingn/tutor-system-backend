/**
 * STUDENT SESSION SERVICE
 * FILE: StudentSessionService.js
 * PURPOSE: Business logic for student session booking and management
 * 
 * BUSINESS RULES:
 * - BR-BOOK-001: Student must be registered with tutor before booking
 * - BR-BOOK-002: Check tutor availability slot before booking
 * - BR-BOOK-003: Validate session capacity
 * - BR-BOOK-004: No duplicate bookings
 */

import TutorSessionRepository from '../../repositories/TutorSessionRepository.js';
import CourseRegistrationRepository from '../../repositories/CourseRegistrationRepository.js';
import StudentRepository from '../../repositories/StudentRepository.js';
import TutorRepository from '../../repositories/TutorRepository.js';
import AvailabilityRepository from '../../repositories/AvailabilityRepository.js';
import { 
  ValidationError, 
  ConflictError, 
  NotFoundError,
  ForbiddenError
} from '../../utils/error.js';

/**
 * Check if student is registered with tutor for subject (BR-BOOK-001)
 */
async function validateStudentRegistration(studentId, tutorId, subjectId) {
  const registration = await CourseRegistrationRepository.findOne({
    studentId,
    tutorId,
    subjectId,
    status: 'ACTIVE'
  });

  if (!registration) {
    throw new ForbiddenError(
      'Bạn phải đăng ký với Tutor này trước khi đặt lịch session. ' +
      'Vui lòng đăng ký qua endpoint /api/v1/registrations'
    );
  }

  return registration;
}

/**
 * Check tutor availability at requested time (BR-BOOK-002)
 */
async function validateTutorAvailability(tutorId, startTime, endTime) {
  const start = new Date(startTime);
  const end = new Date(endTime);
  const dayOfWeek = start.getDay();
  const startHour = start.getHours();
  const endHour = end.getHours();
  const specificDate = start.toISOString().split('T')[0];

  // Find matching availability slots
  const availabilitySlots = await AvailabilityRepository.findAll({
    tutorId,
    isActive: true,
    $or: [
      { type: 'RECURRING', dayOfWeek },
      { type: 'SPECIFIC_DATE', specificDate }
    ]
  });

  // Check if requested time falls within any availability slot
  for (const slot of availabilitySlots) {
    const [slotStartHour] = slot.startTime.split(':').map(Number);
    const [slotEndHour] = slot.endTime.split(':').map(Number);

    if (startHour >= slotStartHour && endHour <= slotEndHour) {
      return { available: true, slot };
    }
  }

  throw new ConflictError(
    'Tutor không có lịch rảnh vào thời gian này. ' +
    `Vui lòng chọn khung giờ khác hoặc kiểm tra lịch rảnh qua endpoint /api/v1/schedules/availability/tutor/${tutorId}`
  );
}

/**
 * Check for overlapping sessions (prevent double booking)
 */
async function checkSessionOverlap(tutorId, startTime, endTime, excludeSessionId = null) {
  const start = new Date(startTime);
  const end = new Date(endTime);

  const query = {
    tutorId,
    status: { $in: ['SCHEDULED', 'IN_PROGRESS'] },
    $or: [
      { startTime: { $lt: end, $gte: start } },
      { endTime: { $gt: start, $lte: end } },
      { startTime: { $lte: start }, endTime: { $gte: end } }
    ]
  };

  if (excludeSessionId) {
    query._id = { $ne: excludeSessionId };
  }

  const overlappingSessions = await TutorSessionRepository.findAll(query);

  if (overlappingSessions.length > 0) {
    throw new ConflictError(
      'Khung giờ này đã có session khác. Tutor không thể dạy 2 session cùng lúc.'
    );
  }
}

/**
 * Book session for student (UC-STUDENT-BOOK)
 * 
 * WORKFLOW:
 * 1. Validate student exists
 * 2. Find and validate session exists + is bookable
 * 3. BR-BOOK-001: Check student registered with tutor
 * 4. BR-BOOK-004: Check not already booked
 * 5. BR-BOOK-003: Check capacity
 * 6. Add student to participants
 * 7. Return updated session
 */
async function bookSession(studentId, sessionId) {
  // Step 1: Validate student
  const student = await StudentRepository.findById(studentId);
  if (!student) {
    throw new NotFoundError('Student profile không tồn tại');
  }

  // Step 2: Validate session
  const session = await TutorSessionRepository.findById(sessionId);
  if (!session) {
    throw new NotFoundError('Session không tồn tại');
  }

  if (session.status !== 'SCHEDULED') {
    throw new ConflictError(`Session không thể đặt lịch. Trạng thái hiện tại: ${session.status}`);
  }

  // Step 3: BR-BOOK-001 - Check registration
  await validateStudentRegistration(
    student._id,
    session.tutorId,
    session.subjectId
  );

  // Step 4: BR-BOOK-004 - Check duplicate
  const alreadyBooked = session.participants.some(
    p => p.studentId.toString() === student._id.toString()
  );

  if (alreadyBooked) {
    throw new ConflictError('Bạn đã đặt lịch session này rồi');
  }

  // Step 5: BR-BOOK-003 - Check capacity (optional, uncomment if needed)
  // if (session.maxParticipants && session.participants.length >= session.maxParticipants) {
  //   throw new ConflictError('Session đã đầy. Không thể đặt thêm');
  // }

  // Step 6: Add participant
  session.participants.push({
    studentId: student._id,
    registeredAt: new Date(),
    attended: false
  });

  const updatedSession = await session.save();

  // Step 7: Return compact booking confirmation
  const sessionObj = updatedSession.toObject ? updatedSession.toObject() : updatedSession;
  
  return {
    sessionId: sessionObj._id,
    title: sessionObj.title,
    subjectId: sessionObj.subjectId,
    startTime: sessionObj.startTime,
    endTime: sessionObj.endTime,
    location: sessionObj.location,
    sessionType: sessionObj.sessionType,
    status: sessionObj.status,
    bookedAt: new Date()
  };
}

/**
 * Get all sessions booked by student
 * 
 * @param {ObjectId} studentId - Student document ID
 * @param {Object} options - Query options
 * @param {String} options.status - Filter by status
 * @param {Number} options.page - Page number
 * @param {Number} options.limit - Items per page
 * @returns {Object} { sessions: [], total, page, totalPages }
 */
async function getStudentSessions(studentId, options = {}) {
  const student = await StudentRepository.findById(studentId);
  if (!student) {
    throw new NotFoundError('Student profile không tồn tại');
  }

  const page = parseInt(options.page) || 1;
  const limit = parseInt(options.limit) || 20;
  const skip = (page - 1) * limit;

  // Build filter
  const filter = {
    'participants.studentId': student._id
  };

  if (options.status) {
    filter.status = options.status;
  }

  // Get sessions with pagination (without populate to avoid nested data)
  const [sessions, total] = await Promise.all([
    TutorSessionRepository.findAll(filter, {
      sort: { startTime: -1 }, // Most recent first
      skip,
      limit
    }),
    TutorSessionRepository.count(filter)
  ]);

  // Transform to compact format
  const compactSessions = sessions.map(session => {
    const sessionObj = session.toObject ? session.toObject() : session;
    
    // Find student's booking info
    const myBooking = sessionObj.participants.find(
      p => p.studentId.toString() === student._id.toString()
    );

    return {
      _id: sessionObj._id,
      title: sessionObj.title,
      subjectId: sessionObj.subjectId,
      description: sessionObj.description,
      startTime: sessionObj.startTime,
      endTime: sessionObj.endTime,
      duration: sessionObj.duration,
      sessionType: sessionObj.sessionType,
      location: sessionObj.location,
      status: sessionObj.status,
      tutorId: sessionObj.tutorId, // Just the ID, not full object
      bookedAt: myBooking?.registeredAt,
      attended: myBooking?.attended
    };
  });

  return {
    sessions: compactSessions,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  };
}

/**
 * Cancel student's booking (student removes themselves from session)
 */
async function cancelBooking(studentId, sessionId) {
  const student = await StudentRepository.findById(studentId);
  if (!student) {
    throw new NotFoundError('Student profile không tồn tại');
  }

  const session = await TutorSessionRepository.findById(sessionId);
  if (!session) {
    throw new NotFoundError('Session không tồn tại');
  }

  // Check if student is participant
  const participantIndex = session.participants.findIndex(
    p => p.studentId.toString() === student._id.toString()
  );

  if (participantIndex === -1) {
    throw new NotFoundError('Bạn chưa đặt lịch session này');
  }

  // Cannot cancel if session already started or completed
  if (session.status === 'IN_PROGRESS' || session.status === 'COMPLETED') {
    throw new ConflictError(`Không thể hủy session đang ${session.status === 'IN_PROGRESS' ? 'diễn ra' : 'đã hoàn thành'}`);
  }

  // Remove student from participants
  session.participants.splice(participantIndex, 1);
  await session.save();

  return {
    success: true,
    message: 'Đã hủy đặt lịch session thành công',
    sessionId: session._id
  };
}

/**
 * Get all sessions created by a specific tutor
 * Students can browse tutor's sessions before booking
 * 
 * @param {ObjectId} tutorId - Tutor document ID
 * @param {Object} options - Query options
 * @param {String} options.status - Filter by status (SCHEDULED, COMPLETED, etc.)
 * @param {String} options.subjectId - Filter by subject
 * @param {Date} options.startDate - Filter sessions from this date
 * @param {Date} options.endDate - Filter sessions until this date
 * @param {Number} options.page - Page number
 * @param {Number} options.limit - Items per page
 * @returns {Object} { sessions: [], total, page, totalPages }
 */
async function getTutorSessions(tutorId, options = {}) {
  // Validate tutor exists
  const tutor = await TutorRepository.findById(tutorId);
  if (!tutor) {
    throw new NotFoundError('Tutor không tồn tại');
  }

  const page = parseInt(options.page) || 1;
  const limit = parseInt(options.limit) || 20;
  const skip = (page - 1) * limit;

  // Build filter
  const filter = {
    tutorId: tutor._id
  };

  // Filter by status (default: only show SCHEDULED sessions)
  if (options.status) {
    filter.status = options.status;
  } else {
    // Default: show bookable sessions only
    filter.status = 'SCHEDULED';
  }

  // Filter by subject
  if (options.subjectId) {
    filter.subjectId = options.subjectId;
  }

  // Filter by date range
  if (options.startDate || options.endDate) {
    filter.startTime = {};
    if (options.startDate) {
      filter.startTime.$gte = new Date(options.startDate);
    }
    if (options.endDate) {
      filter.startTime.$lte = new Date(options.endDate);
    }
  }

  // Get sessions with pagination
  const [sessions, total] = await Promise.all([
    TutorSessionRepository.findAll(filter, {
      sort: { startTime: 1 }, // Upcoming first
      skip,
      limit
    }),
    TutorSessionRepository.count(filter)
  ]);

  // Transform to compact format with only essential info
  const compactSessions = sessions.map(session => {
    const sessionObj = session.toObject ? session.toObject() : session;
    const availableSlots = session.maxParticipants 
      ? session.maxParticipants - session.participants.length
      : null; // null = unlimited

    return {
      _id: sessionObj._id,
      title: sessionObj.title,
      subjectId: sessionObj.subjectId,
      description: sessionObj.description,
      startTime: sessionObj.startTime,
      endTime: sessionObj.endTime,
      duration: sessionObj.duration,
      sessionType: sessionObj.sessionType,
      location: sessionObj.location,
      status: sessionObj.status,
      availableSlots,
      currentParticipants: session.participants.length,
      maxParticipants: session.maxParticipants || null
    };
  });

  return {
    sessions: compactSessions,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  };
}

export default {
  bookSession,
  getStudentSessions,
  getTutorSessions,
  cancelBooking,
  validateStudentRegistration,
  validateTutorAvailability
};
