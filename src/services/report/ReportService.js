// REFACTORED: November 29, 2025 - Verified Architecture & Integration
// UC-26, UC-27: Feedback management (Module 7)
// Purpose: Handle feedback submission and admin statistics
// Architecture: Services import Repositories ONLY

import TutorFeedbackRepository from '../../repositories/TutorFeedbackRepository.js';
import StudentFeedbackRepository from '../../repositories/StudentFeedbackRepository.js';
import TutorSessionRepository from '../../repositories/TutorSessionRepository.js';
import AppointmentRepository from '../../repositories/AppointmentRepository.js';
import CourseRegistrationRepository from '../../repositories/CourseRegistrationRepository.js';
import TutorRepository from '../../repositories/TutorRepository.js';
import StudentRepository from '../../repositories/StudentRepository.js';
import UserRepository from '../../repositories/UserRepository.js';
import { 
  ValidationError, 
  ConflictError, 
  NotFoundError,
  AuthorizationError
} from '../../utils/error.js';

/**
 * Submit feedback (UC-26, UC-27)
 * Can be TutorFeedback (Student → Tutor) or StudentFeedback (Tutor → Student)
 */
async function submitFeedback(fromId, sessionId, feedbackData) {
  // Step 1: Validate session exists
  const session = await TutorSessionRepository.findById(sessionId);
  if (!session) {
    throw new NotFoundError('Session không tồn tại');
  }

  // Step 2: Only allow feedback for COMPLETED sessions
  if (session.status !== 'COMPLETED') {
    throw new ValidationError('Chỉ có thể gửi feedback cho session COMPLETED');
  }

  // Step 3: Validate rating (1-5)
  if (feedbackData.rating < 1 || feedbackData.rating > 5) {
    throw new ValidationError('Rating phải từ 1-5');
  }

  // Step 4: Determine feedback type based on fromId role
  const fromUser = await UserRepository.findById(fromId);
  if (!fromUser) {
    throw new NotFoundError('User không tồn tại');
  }

  let feedback;

  if (fromUser.role === 'STUDENT') {
    // Student giving feedback to Tutor (UC-26)
    
    // Validate student participated in session
    const participated = session.participants.some(
      p => p.toString() === fromId.toString()
    );
    
    if (!participated) {
      throw new AuthorizationError('Bạn không tham gia session này');
    }

    // Check duplicate feedback
    const existingFeedback = await TutorFeedbackRepository.findOne({
      studentId: fromId,
      sessionId: sessionId
    });

    if (existingFeedback) {
      throw new ConflictError('Bạn đã gửi feedback cho session này rồi');
    }

    // Create TutorFeedback
    feedback = await TutorFeedbackRepository.create({
      tutorId: session.tutorId,
      studentId: fromId,
      sessionId: sessionId,
      rating: feedbackData.rating,
      comment: feedbackData.comment || '',
      aspects: feedbackData.aspects || {
        teaching: 0,
        communication: 0,
        preparation: 0,
        helpfulness: 0
      },
      createdAt: new Date()
    });

    // Update tutor's average rating
    await updateTutorRating(session.tutorId);

  } else if (fromUser.role === 'TUTOR') {
    // Tutor giving feedback to Student (UC-27)
    
    // Validate tutor owns session
    if (session.tutorId.toString() !== fromId.toString()) {
      throw new AuthorizationError('Bạn không phải chủ session này');
    }

    // Validate targetStudentId provided
    if (!feedbackData.targetStudentId) {
      throw new ValidationError('targetStudentId là bắt buộc khi Tutor gửi feedback');
    }

    // Validate student participated in session
    const participated = session.participants.some(
      p => p.toString() === feedbackData.targetStudentId.toString()
    );

    if (!participated) {
      throw new ValidationError('Student này không tham gia session');
    }

    // Check duplicate feedback
    const existingFeedback = await StudentFeedbackRepository.findOne({
      tutorId: fromId,
      studentId: feedbackData.targetStudentId,
      sessionId: sessionId
    });

    if (existingFeedback) {
      throw new ConflictError('Bạn đã gửi feedback cho student này trong session này rồi');
    }

    // Create StudentFeedback
    feedback = await StudentFeedbackRepository.create({
      tutorId: fromId,
      studentId: feedbackData.targetStudentId,
      sessionId: sessionId,
      rating: feedbackData.rating,
      comment: feedbackData.comment || '',
      aspects: feedbackData.aspects || {
        participation: 0,
        preparation: 0,
        engagement: 0,
        progress: 0
      },
      createdAt: new Date()
    });

  } else {
    throw new AuthorizationError('Chỉ STUDENT và TUTOR mới có thể gửi feedback');
  }

  // Step 5: BR-008 - Send notification (placeholder)
  // await NotificationService.create({...});

  return feedback;
}

/**
 * Update tutor's average rating after new feedback
 */
async function updateTutorRating(tutorId) {
  const allFeedbacks = await TutorFeedbackRepository.findAll({ tutorId: tutorId });
  
  if (allFeedbacks.length === 0) {
    return;
  }

  const totalRating = allFeedbacks.reduce((sum, fb) => sum + fb.rating, 0);
  const averageRating = totalRating / allFeedbacks.length;

  await TutorRepository.update(tutorId, {
    rating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
    totalRatings: allFeedbacks.length
  });
}

/**
 * Get feedback for a tutor
 */
async function getFeedbackForTutor(tutorId, filters = {}) {
  const query = { tutorId: tutorId };

  if (filters.minRating) {
    query.rating = { $gte: filters.minRating };
  }

  if (filters.startDate || filters.endDate) {
    query.createdAt = {};
    if (filters.startDate) {
      query.createdAt.$gte = filters.startDate;
    }
    if (filters.endDate) {
      query.createdAt.$lte = filters.endDate;
    }
  }

  const feedbacks = await TutorFeedbackRepository.findAll(query, {
    sort: { createdAt: -1 }
  });

  return feedbacks;
}

/**
 * Get feedback for a student
 */
async function getFeedbackForStudent(studentId, filters = {}) {
  const query = { studentId: studentId };

  if (filters.tutorId) {
    query.tutorId = filters.tutorId;
  }

  const feedbacks = await StudentFeedbackRepository.findAll(query, {
    sort: { createdAt: -1 }
  });

  return feedbacks;
}

/**
 * Get admin statistics (Module 7)
 */
async function getAdminStats(startDate, endDate) {
  const dateFilter = {};
  if (startDate || endDate) {
    dateFilter.createdAt = {};
    if (startDate) {
      dateFilter.createdAt.$gte = startDate;
    }
    if (endDate) {
      dateFilter.createdAt.$lte = endDate;
    }
  }

  // Count sessions by status
  const allSessions = await TutorSessionRepository.findAll(dateFilter);
  const sessionStats = {
    total: allSessions.length,
    pending: allSessions.filter(s => s.status === 'PENDING').length,
    confirmed: allSessions.filter(s => s.status === 'CONFIRMED').length,
    scheduled: allSessions.filter(s => s.status === 'SCHEDULED').length,
    completed: allSessions.filter(s => s.status === 'COMPLETED').length,
    cancelled: allSessions.filter(s => s.status === 'CANCELLED').length,
    rejected: allSessions.filter(s => s.status === 'REJECTED').length
  };

  // Count appointments
  const allAppointments = await AppointmentRepository.findAll(dateFilter);
  const appointmentStats = {
    total: allAppointments.length,
    confirmed: allAppointments.filter(a => a.status === 'CONFIRMED').length,
    cancelled: allAppointments.filter(a => a.status === 'CANCELLED').length
  };

  // Count registrations
  const allRegistrations = await CourseRegistrationRepository.findAll(dateFilter);
  const registrationStats = {
    total: allRegistrations.length,
    active: allRegistrations.filter(r => r.status === 'ACTIVE').length,
    inactive: allRegistrations.filter(r => r.status === 'INACTIVE').length
  };

  // Count feedbacks
  const tutorFeedbacks = await TutorFeedbackRepository.findAll(dateFilter);
  const studentFeedbacks = await StudentFeedbackRepository.findAll(dateFilter);
  
  const feedbackStats = {
    tutorFeedbacks: tutorFeedbacks.length,
    studentFeedbacks: studentFeedbacks.length,
    totalFeedbacks: tutorFeedbacks.length + studentFeedbacks.length,
    averageTutorRating: tutorFeedbacks.length > 0
      ? tutorFeedbacks.reduce((sum, f) => sum + f.rating, 0) / tutorFeedbacks.length
      : 0,
    averageStudentRating: studentFeedbacks.length > 0
      ? studentFeedbacks.reduce((sum, f) => sum + f.rating, 0) / studentFeedbacks.length
      : 0
  };

  // Count users
  const allUsers = await UserRepository.findAll({});
  const allStudents = await StudentRepository.findAll({});
  const allTutors = await TutorRepository.findAll({});

  const userStats = {
    totalUsers: allUsers.length,
    activeUsers: allUsers.filter(u => u.status === 'ACTIVE').length,
    totalStudents: allStudents.length,
    totalTutors: allTutors.length
  };

  return {
    period: {
      startDate: startDate || 'All time',
      endDate: endDate || 'Now'
    },
    sessions: sessionStats,
    appointments: appointmentStats,
    registrations: registrationStats,
    feedbacks: feedbackStats,
    users: userStats,
    generatedAt: new Date()
  };
}

/**
 * Get tutor performance report
 */
async function getTutorReport(tutorId, startDate, endDate) {
  const dateFilter = {};
  if (startDate || endDate) {
    dateFilter.startTime = {};
    if (startDate) {
      dateFilter.startTime.$gte = startDate;
    }
    if (endDate) {
      dateFilter.startTime.$lte = endDate;
    }
  }

  // Get sessions
  const sessions = await TutorSessionRepository.findAll({
    tutorId: tutorId,
    ...dateFilter
  });

  // Get registrations
  const registrations = await CourseRegistrationRepository.findAll({
    tutorId: tutorId,
    status: 'ACTIVE'
  });

  // Get feedbacks
  const feedbacks = await TutorFeedbackRepository.findAll({
    tutorId: tutorId
  });

  const sessionStats = {
    total: sessions.length,
    completed: sessions.filter(s => s.status === 'COMPLETED').length,
    cancelled: sessions.filter(s => s.status === 'CANCELLED').length,
    totalParticipants: sessions.reduce((sum, s) => s.currentParticipants, 0),
    averageParticipants: sessions.length > 0
      ? sessions.reduce((sum, s) => s.currentParticipants, 0) / sessions.length
      : 0
  };

  const feedbackStats = {
    total: feedbacks.length,
    averageRating: feedbacks.length > 0
      ? feedbacks.reduce((sum, f) => f.rating, 0) / feedbacks.length
      : 0,
    ratingDistribution: {
      5: feedbacks.filter(f => f.rating === 5).length,
      4: feedbacks.filter(f => f.rating === 4).length,
      3: feedbacks.filter(f => f.rating === 3).length,
      2: feedbacks.filter(f => f.rating === 2).length,
      1: feedbacks.filter(f => f.rating === 1).length
    }
  };

  return {
    tutorId,
    period: {
      startDate: startDate || 'All time',
      endDate: endDate || 'Now'
    },
    sessions: sessionStats,
    registrations: {
      total: registrations.length
    },
    feedbacks: feedbackStats,
    generatedAt: new Date()
  };
}

export {
  submitFeedback,
  getFeedbackForTutor,
  getFeedbackForStudent,
  getAdminStats,
  getTutorReport,
  updateTutorRating
};
