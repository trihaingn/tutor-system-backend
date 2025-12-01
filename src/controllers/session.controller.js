/**
 * CONTROLLER: SessionController
 * FILE: session.controller.js
 * MỤC ĐÍCH: Xử lý HTTP requests liên quan đến Consultation Sessions (UC-11, UC-12, UC-15)
 * 
 * USE CASES:
 * - UC-11: Tutor creates consultation session
 * - UC-12: Student books appointment for session
 * - UC-15: Tutor cancels session
 * - UC-16: Student views upcoming sessions
 * - UC-17: Tutor views scheduled sessions
 * 
 * DEPENDENCIES:
 * - ScheduleService: Handle session creation and validation
 * - AppointmentService: Handle appointment booking
 * - ValidationError, NotFoundError, ConflictError
 */

// ============================================================
// FUNCTION: createSession()
// ============================================================
// METHOD: POST /api/v1/sessions
// PURPOSE: Tutor tạo consultation session (UC-11)
// 
// REQUEST:
// {
//   "title": "Math 101 - Derivatives",
//   "subjectId": "Math_101",
//   "description": "Advanced derivative techniques",
//   "startTime": "2025-01-20T09:00:00Z",
//   "endTime": "2025-01-20T11:00:00Z",
//   "sessionType": "ONLINE",
//   "location": "https://meet.google.com/xxx"
// }
// Headers: { Authorization: 'Bearer <JWT>' }
// Role: TUTOR or ADMIN only
// 
// VALIDATION:
// - ⚠️ BR-001: startTime và endTime phải là giờ tròn (HH:00)
// - ⚠️ BR-002: Duration >= 60 minutes
// - ⚠️ BR-003: If sessionType = ONLINE → meetingLink required
// - ⚠️ BR-004: If sessionType = OFFLINE → location required
// 
// PROCESS:
// 1. Extract tutorId from JWT (req.user.userId)
// 2. Call ScheduleService.createSession()
//    - Validate hourly start/end (BR-001, BR-002)
//    - Validate location/link (BR-003, BR-004)
//    - Check Tutor availability (Availability model)
//    - Check for conflicts (existing sessions)
// 3. Return created session
// 
// RESPONSE:
// {
//   "success": true,
//   "data": {
//     "sessionId": "...",
//     "title": "Math 101 - Derivatives",
//     "tutorId": "...",
//     "startTime": "2025-01-20T09:00:00Z",
//     "endTime": "2025-01-20T11:00:00Z",
//     "status": "SCHEDULED",
//     "currentParticipants": 0,
//     "maxParticipants": 10
//   }
// }
// 
// ERROR HANDLING:
// - Invalid time format → 400 ValidationError
// - Not hourly → 400 ValidationError ("Start time must be on the hour")
// - Duration < 60min → 400 ValidationError ("Minimum 1 hour duration")
// - Missing link/location → 400 ValidationError
// - Availability conflict → 409 ConflictError

// ============================================================
// FUNCTION: bookAppointment()
// ============================================================
// METHOD: POST /api/v1/sessions/:sessionId/appointments
// PURPOSE: Student book appointment cho session (UC-12)
// 
// REQUEST:
// - Params: { sessionId: 'ObjectId' }
// - Body: { notes?: 'Optional notes' }
// - Headers: { Authorization: 'Bearer <JWT>' }
// Role: STUDENT only
// 
// VALIDATION:
// - Session must exist and status = SCHEDULED
// - Student must have active registration with Tutor (BR-006)
// - Session must not be full (currentParticipants < maxParticipants)
// - Student cannot book same session twice
// 
// PROCESS:
// 1. Extract studentId from JWT
// 2. Call AppointmentService.bookAppointment(studentId, sessionId)
//    - Check registration exists (CourseRegistration)
//    - Check session capacity
//    - Create appointment
//    - Increment session.currentParticipants
//    - Trigger notification to Tutor (BR-008)
// 3. Return appointment data
// 
// RESPONSE:
// {
//   "success": true,
//   "data": {
//     "appointmentId": "...",
//     "sessionId": "...",
//     "studentId": "...",
//     "status": "PENDING",
//     "bookedAt": "2025-01-15T10:00:00Z"
//   }
// }
// 
// ERROR HANDLING:
// - Session not found → 404 NotFoundError
// - No registration → 403 ForbiddenError ("You must register with Tutor first")
// - Session full → 409 ConflictError ("Session is full")
// - Already booked → 409 ConflictError ("Already booked")

// ============================================================
// FUNCTION: getUpcomingSessions()
// ============================================================
// METHOD: GET /api/v1/sessions/upcoming
// PURPOSE: Student/Tutor xem upcoming sessions (UC-16, UC-17)
// 
// REQUEST:
// - Query: { role?: 'student' | 'tutor', startDate?: ISO, endDate?: ISO }
// - Headers: { Authorization: 'Bearer <JWT>' }
// 
// PROCESS:
// 1. Extract userId and role from JWT
// 2. If role=STUDENT: Filter sessions where student has appointment
// 3. If role=TUTOR: Filter sessions where tutorId = userId
// 4. Filter by date range (default: next 30 days)
// 5. Return sorted by startTime ASC
// 
// RESPONSE:
// {
//   "success": true,
//   "data": [
//     {
//       "sessionId": "...",
//       "title": "Math 101",
//       "startTime": "2025-01-20T09:00:00Z",
//       "status": "SCHEDULED",
//       "tutor": {
//         "fullName": "Prof. A",
//         "email": "..."
//       },
//       "currentParticipants": 5,
//       "maxParticipants": 10
//     }
//   ]
// }

// ============================================================
// FUNCTION: cancelSession()
// ============================================================
// METHOD: DELETE /api/v1/sessions/:sessionId
// PURPOSE: Tutor hủy session (UC-15)
// 
// REQUEST:
// - Params: { sessionId: 'ObjectId' }
// - Headers: { Authorization: 'Bearer <JWT>' }
// Role: TUTOR or ADMIN only
// 
// PROCESS:
// 1. Extract tutorId from JWT
// 2. Find session by id
// 3. ⚠️ Validate ownership: session.tutorId === tutorId
// 4. Update status to 'CANCELLED'
// 5. Trigger notifications to all participants (BR-008)
// 6. Return success response
// 
// RESPONSE:
// {
//   "success": true,
//   "message": "Session cancelled successfully"
// }
// 
// ERROR HANDLING:
// - Session not found → 404 NotFoundError
// - Not owned by user → 403 ForbiddenError

// TODO: Import dependencies (ScheduleService, AppointmentService, error classes)

// TODO: Implement createSession() - POST /api/v1/sessions
// - Validate BR-001, BR-002, BR-003, BR-004
// - Call ScheduleService

// TODO: Implement bookAppointment() - POST /api/v1/sessions/:sessionId/appointments
// - Check registration
// - Check capacity
// - Call AppointmentService

// TODO: Implement getUpcomingSessions() - GET /api/v1/sessions/upcoming
// - Filter by role (student/tutor)
// - Filter by date range
// - Populate related data

// TODO: Implement cancelSession() - DELETE /api/v1/sessions/:sessionId
// - Validate ownership
// - Update status
// - Trigger notifications

import { asyncHandler, ValidationError, NotFoundError } from '../middleware/errorMiddleware.js';

class SessionController {
  /**
   * POST /api/v1/sessions
   * Tutor creates consultation session (UC-11)
   */
  createSession = asyncHandler(async (req, res) => {
    const userId = req.userId;
    const { ConflictError } = await import('../middleware/errorMiddleware.js');
    
    // Find tutor profile
    const Tutor = (await import('../models/Tutor.model.js')).default;
    const tutor = await Tutor.findOne({ userId });
    
    if (!tutor) {
      throw new NotFoundError('Tutor profile not found');
    }

    const {
      title,
      subjectId,
      description,
      startTime,
      endTime,
      sessionType,
      location
    } = req.body;

    // BR-001: Validate hourly times
    const start = new Date(startTime);
    const end = new Date(endTime);
    
    if (start.getMinutes() !== 0 || start.getSeconds() !== 0) {
      throw new ValidationError('Start time must be on the hour (HH:00:00)');
    }
    
    if (end.getMinutes() !== 0 || end.getSeconds() !== 0) {
      throw new ValidationError('End time must be on the hour (HH:00:00)');
    }

    // BR-002: Validate minimum duration (60 minutes)
    const durationMs = end - start;
    const durationMinutes = durationMs / (1000 * 60);
    
    if (durationMinutes < 60) {
      throw new ValidationError('Session duration must be at least 60 minutes');
    }

    // BR-003 & BR-004: Validate location based on type
    if (sessionType === 'ONLINE' && !location) {
      throw new ValidationError('Meeting link is required for ONLINE sessions');
    }
    
    if (sessionType === 'OFFLINE' && !location) {
      throw new ValidationError('Physical location is required for OFFLINE sessions');
    }

    // Check for scheduling conflicts
    const TutorSession = (await import('../models/TutorSession.model.js')).default;
    const conflictingSession = await TutorSession.findOne({
      tutorId: tutor._id,
      status: { $in: ['SCHEDULED', 'IN_PROGRESS'] },
      $or: [
        { startTime: { $lt: end }, endTime: { $gt: start } }
      ]
    });

    if (conflictingSession) {
      throw new ConflictError('Time slot conflicts with existing session');
    }

    // Create session
    const session = await TutorSession.create({
      tutorId: tutor._id,
      title,
      subjectId,
      description: description || '',
      startTime: start,
      endTime: end,
      duration: durationMinutes,
      sessionType,
      location,
      participants: [],
      status: 'SCHEDULED',
      hasReport: false
    });

    res.status(201).json({
      success: true,
      data: session
    });
  });

  /**
   * GET /api/v1/sessions/upcoming
   * Get upcoming sessions (UC-16, UC-17)
   */
  getUpcomingSessions = asyncHandler(async (req, res) => {
    const userId = req.userId;
    const userRole = req.userRole;
    
    const TutorSession = (await import('../models/TutorSession.model.js')).default;
    const Student = (await import('../models/Student.model.js')).default;
    const Tutor = (await import('../models/Tutor.model.js')).default;
    
    // Parse date filters
    const now = new Date();
    const startDate = req.query.startDate ? new Date(req.query.startDate) : now;
    const endDate = req.query.endDate ? new Date(req.query.endDate) : new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days
    
    let filter = {
      startTime: { $gte: startDate, $lte: endDate },
      status: { $in: ['SCHEDULED', 'IN_PROGRESS'] }
    };

    // Filter based on role
    if (userRole === 'STUDENT') {
      const student = await Student.findOne({ userId });
      if (student) {
        filter['participants.studentId'] = student._id;
      }
    } else if (userRole === 'TUTOR' || userRole === 'ADMIN') {
      const tutor = await Tutor.findOne({ userId });
      if (tutor) {
        filter.tutorId = tutor._id;
      }
    }

    const sessions = await TutorSession.find(filter)
      .populate('tutorId', 'userId subjectIds')
      .populate({
        path: 'tutorId',
        populate: {
          path: 'userId',
          select: 'fullName email'
        }
      })
      .populate('participants.studentId', 'userId')
      .sort({ startTime: 1 })
      .lean();

    res.status(200).json({
      success: true,
      data: sessions
    });
  });

  /**
   * POST /api/v1/sessions/:sessionId/appointments
   * Student books appointment (UC-12)
   */
  bookAppointment = asyncHandler(async (req, res) => {
    const userId = req.userId;
    const { sessionId } = req.params;
    const { notes } = req.body;
    const { ConflictError, ForbiddenError } = await import('../middleware/errorMiddleware.js');

    // Find student profile
    const Student = (await import('../models/Student.model.js')).default;
    const student = await Student.findOne({ userId });
    
    if (!student) {
      throw new NotFoundError('Student profile not found');
    }

    // Find session
    const TutorSession = (await import('../models/TutorSession.model.js')).default;
    const session = await TutorSession.findById(sessionId);
    
    if (!session) {
      throw new NotFoundError('Session not found');
    }

    // Validate session status
    if (session.status !== 'SCHEDULED') {
      throw new ConflictError('Session is not available for booking');
    }

    // Check if already booked
    const alreadyBooked = session.participants.some(
      p => p.studentId.toString() === student._id.toString()
    );
    
    if (alreadyBooked) {
      throw new ConflictError('You have already booked this session');
    }

    // Check capacity (assuming default max is unlimited unless specified)
    // If you have maxParticipants field, add validation here
    
    // Add participant
    session.participants.push({
      studentId: student._id,
      registeredAt: new Date(),
      attended: false
    });

    await session.save();

    res.status(201).json({
      success: true,
      data: {
        sessionId: session._id,
        studentId: student._id,
        status: 'CONFIRMED',
        bookedAt: new Date(),
        notes: notes || null
      }
    });
  });

  /**
   * DELETE /api/v1/sessions/:id
   * Tutor cancels session (UC-15)
   */
  cancelSession = asyncHandler(async (req, res) => {
    const userId = req.userId;
    const { id } = req.params;
    const { ForbiddenError } = await import('../middleware/errorMiddleware.js');

    // Find tutor profile
    const Tutor = (await import('../models/Tutor.model.js')).default;
    const tutor = await Tutor.findOne({ userId });
    
    if (!tutor) {
      throw new NotFoundError('Tutor profile not found');
    }

    // Find session
    const TutorSession = (await import('../models/TutorSession.model.js')).default;
    const session = await TutorSession.findById(id);
    
    if (!session) {
      throw new NotFoundError('Session not found');
    }

    // Validate ownership
    if (session.tutorId.toString() !== tutor._id.toString()) {
      throw new ForbiddenError('You can only cancel your own sessions');
    }

    // Update status
    session.status = 'CANCELLED';
    await session.save();

    // TODO: Trigger notifications to participants (BR-008)

    res.status(200).json({
      success: true,
      message: 'Session cancelled successfully',
      data: {
        sessionId: session._id,
        status: session.status
      }
    });
  });
}

export default new SessionController();
