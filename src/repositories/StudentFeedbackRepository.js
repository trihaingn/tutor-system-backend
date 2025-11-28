import BaseRepository from './BaseRepository.js';
import StudentFeedback from '../models/StudentFeedback.model.js';

class StudentFeedbackRepository extends BaseRepository {
  constructor() {
    super(StudentFeedback);
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

  // Find by session
  async findBySession(sessionId, options = {}) {
    return await this.findAll({ sessionId }, options);
  }

  // Find specific feedback
  async findByStudentTutorSession(studentId, tutorId, sessionId) {
    return await this.findOne({ studentId, tutorId, sessionId });
  }

  // Check if feedback exists
  async feedbackExists(studentId, tutorId, sessionId) {
    return await this.exists({ studentId, tutorId, sessionId });
  }

  // Calculate average rating for tutor
  async calculateAverageRating(tutorId) {
    const feedbacks = await this.findAll({ tutorId });
    
    if (feedbacks.length === 0) {
      return { average: 0, total: 0 };
    }

    const sum = feedbacks.reduce((acc, feedback) => acc + feedback.rating, 0);
    const average = sum / feedbacks.length;

    return {
      average: Math.round(average * 10) / 10, // Round to 1 decimal
      total: feedbacks.length
    };
  }

  // Find by rating range
  async findByRatingRange(minRating, maxRating, options = {}) {
    return await this.findAll(
      {
        rating: { $gte: minRating, $lte: maxRating }
      },
      options
    );
  }

  // Find high ratings for tutor
  async findHighRatings(tutorId, minRating = 4, options = {}) {
    return await this.findAll(
      {
        tutorId,
        rating: { $gte: minRating }
      },
      options
    );
  }

  // Count by tutor
  async countByTutor(tutorId) {
    return await this.count({ tutorId });
  }

  // Count by rating for tutor
  async countByRating(tutorId, rating) {
    return await this.count({ tutorId, rating });
  }

  // Get rating distribution for tutor
  async getRatingDistribution(tutorId) {
    const distribution = {};
    
    for (let rating = 1; rating <= 5; rating++) {
      const count = await this.countByRating(tutorId, rating);
      distribution[rating] = count;
    }

    return distribution;
  }
}

export default new StudentFeedbackRepository();
