import BaseRepository from './BaseRepository.js';
import Tutor from '../models/Tutor.model.js';

class TutorRepository extends BaseRepository {
  constructor() {
    super(Tutor);
  }

  async findByUserId(userId) {
    return await this.findOne({ userId });
  }

  async findBySubject(subject, options = {}) {
    return await this.findAll({ subject: { $in: [subject] } }, options);
  }

  async findBySubjects(subjects, options = {}) {
    return await this.findAll({ subject: { $in: subjects } }, options);
  }

  async updateStats(tutorId, statsUpdate) {
    return await this.update(tutorId, { stats: statsUpdate });
  }

  async incrementStat(tutorId, statField, value = 1) {
    const tutor = await this.findById(tutorId);
    if (!tutor) return null;

    tutor.stats[statField] = (tutor.stats[statField] || 0) + value;
    return await tutor.save();
  }

  async incrementTotalStudents(tutorId) {
    return await this.incrementStat(tutorId, 'totalStudents');
  }

  async incrementTotalSessions(tutorId) {
    return await this.incrementStat(tutorId, 'totalSessions');
  }

  async incrementCompletedSessions(tutorId) {
    return await this.incrementStat(tutorId, 'completedSessions');
  }

  async incrementCancelledSessions(tutorId) {
    return await this.incrementStat(tutorId, 'cancelledSessions');
  }

  async updateRatingAfterReview(tutorId, newRating) {
    const tutor = await this.findById(tutorId);
    if (!tutor) return null;

    const currentAverage = tutor.stats.averageRating || 0;
    const currentTotal = tutor.stats.totalReviews || 0;

    const newTotal = currentTotal + 1;
    const newAverage = ((currentAverage * currentTotal) + newRating) / newTotal;

    tutor.stats.averageRating = newAverage;
    tutor.stats.totalReviews = newTotal;

    return await tutor.save();
  }

  async findTopRated(limit = 10, options = {}) {
    return await this.findAll(
      {},
      {
        ...options,
        sort: { 'stats.averageRating': -1 },
        limit
      }
    );
  }

  async findByMinRating(minRating, options = {}) {
    return await this.findAll(
      { 'stats.averageRating': { $gte: minRating } },
      options
    );
  }

  async canAcceptMoreStudents(tutorId) {
    const tutor = await this.findById(tutorId);
    if (!tutor) return false;

    return tutor.stats.totalStudents < tutor.maxStudents;
  }
}

export default new TutorRepository();
