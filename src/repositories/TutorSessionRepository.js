import BaseRepository from './BaseRepository.js';
import TutorSession from '../models/TutorSession.model.js';

class TutorSessionRepository extends BaseRepository {
  constructor() {
    super(TutorSession);
  }

  // Find by tutor
  async findByTutor(tutorId, options = {}) {
    return await this.findAll(
      { tutorId },
      {
        ...options,
        sort: { startTime: -1, ...options.sort }
      }
    );
  }

  // Find by subject
  async findBySubject(subject, options = {}) {
    return await this.findAll(
      { subject },
      {
        ...options,
        sort: { startTime: -1, ...options.sort }
      }
    );
  }

  // Find by status
  async findByStatus(status, options = {}) {
    return await this.findAll(
      { status },
      {
        ...options,
        sort: { startTime: -1, ...options.sort }
      }
    );
  }

  // Find by tutor and status
  async findByTutorAndStatus(tutorId, status, options = {}) {
    return await this.findAll(
      { tutorId, status },
      {
        ...options,
        sort: { startTime: -1, ...options.sort }
      }
    );
  }

  // Find upcoming sessions
  async findUpcoming(criteria = {}, options = {}) {
    return await this.findAll(
      {
        ...criteria,
        startTime: { $gte: new Date() },
        status: { $in: ['SCHEDULED', 'IN_PROGRESS'] }
      },
      {
        ...options,
        sort: { startTime: 1, ...options.sort }
      }
    );
  }

  // Find past sessions
  async findPast(criteria = {}, options = {}) {
    return await this.findAll(
      {
        ...criteria,
        endTime: { $lt: new Date() }
      },
      {
        ...options,
        sort: { startTime: -1, ...options.sort }
      }
    );
  }

  // Find sessions by date range
  async findByDateRange(startDate, endDate, options = {}) {
    return await this.findAll(
      {
        startTime: { $gte: startDate, $lte: endDate }
      },
      options
    );
  }

  // Find sessions with participant
  async findByParticipant(studentId, options = {}) {
    return await this.findAll(
      { 'participants.studentId': studentId },
      options
    );
  }

  // Add participant to session
  async addParticipant(sessionId, studentId) {
    const session = await this.findById(sessionId);
    if (!session) return null;

    // Check if already participant
    const exists = session.participants.some(
      p => p.studentId.toString() === studentId.toString()
    );

    if (!exists) {
      session.participants.push({
        studentId,
        registeredAt: new Date(),
        attended: false
      });
      return await session.save();
    }

    return session;
  }

  // Remove participant from session
  async removeParticipant(sessionId, studentId) {
    const session = await this.findById(sessionId);
    if (!session) return null;

    session.participants = session.participants.filter(
      p => p.studentId.toString() !== studentId.toString()
    );

    return await session.save();
  }

  // Mark participant as attended
  async markAttended(sessionId, studentId) {
    const session = await this.findById(sessionId);
    if (!session) return null;

    const participant = session.participants.find(
      p => p.studentId.toString() === studentId.toString()
    );

    if (participant) {
      participant.attended = true;
      return await session.save();
    }

    return session;
  }

  // Update session status
  async updateStatus(sessionId, status) {
    return await this.update(sessionId, { status });
  }

  // Mark session as having report
  async markHasReport(sessionId) {
    return await this.update(sessionId, { hasReport: true });
  }

  // Count sessions by tutor
  async countByTutor(tutorId, criteria = {}) {
    return await this.count({ tutorId, ...criteria });
  }

  // Count sessions by status
  async countByStatus(status, criteria = {}) {
    return await this.count({ status, ...criteria });
  }

  // Find sessions without report
  async findWithoutReport(criteria = {}, options = {}) {
    return await this.findAll(
      {
        ...criteria,
        hasReport: false,
        status: 'COMPLETED'
      },
      options
    );
  }
}

export default new TutorSessionRepository();
