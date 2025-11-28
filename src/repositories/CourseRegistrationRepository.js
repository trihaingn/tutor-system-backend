import BaseRepository from './BaseRepository.js';
import CourseRegistration from '../models/CourseRegistration.model.js';

class CourseRegistrationRepository extends BaseRepository {
  constructor() {
    super(CourseRegistration);
  }

  /**
   * Check if duplicate registration exists
   * BR-006: Prevent duplicate (studentId + tutorId + subjectId)
   */
  async checkDuplicate(studentId, tutorId, subjectId) {
    return await this.model.findOne({
      studentId,
      tutorId,
      subjectId,
      status: { $in: ['ACTIVE', 'PENDING'] }
    });
  }

  /**
   * Get all registrations by student
   */
  async findByStudent(studentId, options = {}) {
    const filter = { studentId };
    if (options.status) {
      filter.status = options.status;
    }

    return await this.model
      .find(filter)
      .populate('tutorId')
      .sort({ registeredAt: -1 });
  }

  /**
   * Get all registrations by tutor
   */
  async findByTutor(tutorId, options = {}) {
    const filter = { tutorId };
    if (options.status) {
      filter.status = options.status;
    }

    return await this.model
      .find(filter)
      .populate('studentId')
      .sort({ registeredAt: -1 });
  }

  /**
   * Get all registrations for a subject
   */
  async findBySubject(subjectId) {
    return await this.model
      .find({ subjectId, status: 'ACTIVE' })
      .populate('studentId')
      .populate('tutorId');
  }

  /**
   * Count active registrations for a tutor
   */
  async countActiveByTutor(tutorId) {
    return await this.model.countDocuments({
      tutorId,
      status: 'ACTIVE'
    });
  }
}

export default new CourseRegistrationRepository();
