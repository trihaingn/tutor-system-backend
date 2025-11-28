import BaseRepository from './BaseRepository.js';
import User from '../models/User.model.js';

class UserRepository extends BaseRepository {
  constructor() {
    super(User);
  }

  async findByEmail(email) {
    return await this.findOne({ email: email.toLowerCase() });
  }

  async findByHcmutId(hcmutId) {
    return await this.findOne({ hcmutId });
  }

  async findByHcmutIdAndRole(hcmutId, role) {
    return await this.findOne({ hcmutId, role });
  }

  async findByRole(role, options = {}) {
    return await this.findAll({ role }, options);
  }

  async findActiveUsers(criteria = {}, options = {}) {
    return await this.findAll({ ...criteria, status: 'ACTIVE' }, options);
  }

  async findByStatus(status, options = {}) {
    return await this.findAll({ status }, options);
  }

  async findByFaculty(faculty, options = {}) {
    return await this.findAll({ faculty }, options);
  }

  async updateLastSync(id) {
    return await this.update(id, { lastSyncAt: new Date() });
  }

  async deactivateUser(id) {
    return await this.update(id, { status: 'INACTIVE' });
  }

  async activateUser(id) {
    return await this.update(id, { status: 'ACTIVE' });
  }

  async emailExists(email) {
    return await this.exists({ email: email.toLowerCase() });
  }

  async hcmutIdExistsForRole(hcmutId, role) {
    return await this.exists({ hcmutId, role });
  }
}

export default new UserRepository();
