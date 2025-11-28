import BaseRepository from './BaseRepository.js';
import Availability from '../models/Availability.model.js';

class AvailabilityRepository extends BaseRepository {
  constructor() {
    super(Availability);
  }

  async findByTutor(tutorId, options = {}) {
    return await this.findAll({ tutorId }, options);
  }

  async findByTutorAndDay(tutorId, dayOfWeek, options = {}) {
    return await this.findAll({ tutorId, dayOfWeek }, options);
  }

  async findActiveByTutor(tutorId, options = {}) {
    return await this.findAll({ tutorId }, options);
  }

  async findByDayOfWeek(dayOfWeek, options = {}) {
    return await this.findAll({ dayOfWeek }, options);
  }

  async findByTimeRange(startTime, endTime, options = {}) {
    return await this.findAll(
      {
        startTime: { $lte: endTime },
        endTime: { $gte: startTime }
      },
      options
    );
  }

  async findOverlapping(tutorId, dayOfWeek, startTime, endTime) {
    return await this.findAll({
      tutorId,
      dayOfWeek,
      $or: [
        { startTime: { $lt: endTime, $gte: startTime } },
        { endTime: { $gt: startTime, $lte: endTime } },
        { startTime: { $lte: startTime }, endTime: { $gte: endTime } }
      ]
    });
  }
}

export default new AvailabilityRepository();
