import BaseRepository from './BaseRepository.js';
import Record from '../models/Record.model.js';

class RecordRepository extends BaseRepository {
  constructor() {
    super(Record);
  }

  async findBySession(sessionId) {
    return await this.findOne({ sessionId });
  }

  async findByTutor(tutorId, options = {}) {
    return await this.findAll(
      { tutorId },
      {
        ...options,
        sort: { createdAt: -1, ...options.sort }
      }
    );
  }

  async existsBySession(sessionId) {
    return await this.exists({ sessionId });
  }

  async findRecentByTutor(tutorId, limit = 10) {
    return await this.findAll(
      { tutorId },
      {
        sort: { createdAt: -1 },
        limit
      }
    );
  }

  async updataRecordSummary(sessionId, tutorId, summary)    {
    return await this.updateOne(
        { 
            sessionId: sessionId, 
            tutorId: tutorId
        }, 
        { 
            summary : summary
        }
    )
  }
}

export default new RecordRepository();
