import BaseRepository from './BaseRepository.js';
import TutorFeedback from '../models/TutorFeedback.model.js';

class TutorFeedbackRepository extends BaseRepository {
  constructor() {
    super(TutorFeedback);
  }

  // Find by tutor
  async findByTutor(tutorId, options = {}) {
    return await this.findAll(
      { tutorId },
      {
        ...options,
        sort: { evaluatedAt: -1, ...options.sort }
      }
    );
  }

  // Find by student
  async findByStudent(studentId, options = {}) {
    return await this.findAll(
      { studentId },
      {
        ...options,
        sort: { evaluatedAt: -1, ...options.sort }
      }
    );
  }

  // Find by session
  async findBySession(sessionId, options = {}) {
    return await this.findAll({ sessionId }, options);
  }

  // Find specific feedback
  async findByTutorStudentSession(tutorId, studentId, sessionId) {
    return await this.findOne({ tutorId, studentId, sessionId });
  }

  // Check if feedback exists
  async feedbackExists(tutorId, studentId, sessionId) {
    return await this.exists({ tutorId, studentId, sessionId });
  }

  // Find recent feedback by tutor
  async findRecentByTutor(tutorId, limit = 10) {
    return await this.findAll(
      { tutorId },
      {
        sort: { evaluatedAt: -1 },
        limit
      }
    );
  }

  // Find recent feedback for student
  async findRecentForStudent(studentId, limit = 10) {
    return await this.findAll(
      { studentId },
      {
        sort: { evaluatedAt: -1 },
        limit
      }
    );
  }

  // Count by tutor
  async countByTutor(tutorId) {
    return await this.count({ tutorId });
  }

  // Count by student
  async countByStudent(studentId) {
    return await this.count({ studentId });
  }
}

export default new TutorFeedbackRepository();
