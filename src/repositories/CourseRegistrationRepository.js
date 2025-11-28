import BaseRepository from './BaseRepository.js';
import CourseRegistration from '../models/CourseRegistration.model.js';

class CourseRegistrationRepository extends BaseRepository {
  constructor() {
    super(CourseRegistration);
  }

  async findByStudent(studentId, options = {}) {
    return await this.findAll({ studentId }, options);
  }

  async findByTutor(tutorId, options = {}) {
    return await this.findAll({ tutorId }, options);
  }

  async findBySubject(subjectId, options = {}) {
    return await this.findAll({ subjectId }, options);
  }

  async findByStudentAndTutor(studentId, tutorId, options = {}) {
    return await this.findAll({ studentId, tutorId }, options);
  }

  async findByStudentAndSubject(studentId, subjectId, options = {}) {
    return await this.findAll({ studentId, subjectId }, options);
  }

  async findByTutorAndSubject(tutorId, subjectId, options = {}) {
    return await this.findAll({ tutorId, subjectId }, options);
  }

  async findByStudentTutorSubject(studentId, tutorId, subjectId) {
    return await this.findOne({ studentId, tutorId, subjectId });
  }

  async findActiveRegistrations(criteria = {}, options = {}) {
    return await this.findAll({ ...criteria, status: 'ACTIVE' }, options);
  }

  async findByStatus(status, options = {}) {
    return await this.findAll({ status }, options);
  }

  async cancelRegistration(registrationId) {
    return await this.update(registrationId, { status: 'CANCELLED' });
  }

  async activateRegistration(registrationId) {
    return await this.update(registrationId, { status: 'ACTIVE' });
  }

  async deactivateRegistration(registrationId) {
    return await this.update(registrationId, { status: 'INACTIVE' });
  }

  async registrationExists(studentId, tutorId, subjectId) {
    return await this.exists({ studentId, tutorId, subjectId });
  }

  async countByStudent(studentId, status = null) {
    const criteria = { studentId };
    if (status) criteria.status = status;
    return await this.count(criteria);
  }

  async countByTutor(tutorId, status = null) {
    const criteria = { tutorId };
    if (status) criteria.status = status;
    return await this.count(criteria);
  }
}

export default new CourseRegistrationRepository();
