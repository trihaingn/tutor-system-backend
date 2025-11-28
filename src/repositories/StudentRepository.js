import BaseRepository from './BaseRepository.js';
import Student from '../models/Student.model.js';

class StudentRepository extends BaseRepository {
  constructor() {
    super(Student);
  }

  async findByUserId(userId) {
    return await this.findOne({ userId });
  }

  async addRegisteredTutor(studentId, tutorId) {
    const student = await this.findById(studentId);
    if (!student) return null;

    if (!student.registeredTutors.includes(tutorId)) {
      student.registeredTutors.push(tutorId);
      return await student.save();
    }
    return student;
  }

  async removeRegisteredTutor(studentId, tutorId) {
    const student = await this.findById(studentId);
    if (!student) return null;

    student.registeredTutors = student.registeredTutors.filter(
      id => id.toString() !== tutorId.toString()
    );
    return await student.save();
  }

  async incrementSessionsAttended(studentId) {
    const student = await this.findById(studentId);
    if (!student) return null;

    student.totalSessionsAttended += 1;
    return await student.save();
  }

  async updateStats(studentId, statsUpdate) {
    return await this.update(studentId, { stats: statsUpdate });
  }

  async incrementStat(studentId, statField, value = 1) {
    const student = await this.findById(studentId);
    if (!student) return null;

    student.stats[statField] = (student.stats[statField] || 0) + value;
    return await student.save();
  }

  async findByRegisteredTutor(tutorId, options = {}) {
    return await this.findAll({ registeredTutors: tutorId }, options);
  }
}

export default new StudentRepository();
