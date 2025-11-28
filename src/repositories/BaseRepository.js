class BaseRepository {
  constructor(model) {
    this.model = model;
  }

  async create(data) {
    const document = new this.model(data);
    return await document.save();
  }

  async findById(id, populate = null) {
    const query = this.model.findById(id);
    if (populate) {
      query.populate(populate);
    }
    return await query.exec();
  }

  async findOne(criteria, populate = null) {
    const query = this.model.findOne(criteria);
    if (populate) {
      query.populate(populate);
    }
    return await query.exec();
  }

  async findAll(criteria = {}, options = {}) {
    const {
      populate = null,
      sort = {},
      limit = 0,
      skip = 0,
      select = null
    } = options;

    const query = this.model.find(criteria);
    
    if (populate) query.populate(populate);
    if (Object.keys(sort).length > 0) query.sort(sort);
    if (select) query.select(select);
    if (skip > 0) query.skip(skip);
    if (limit > 0) query.limit(limit);

    return await query.exec();
  }

  async update(id, data) {
    return await this.model.findByIdAndUpdate(
      id,
      data,
      { new: true, runValidators: true }
    );
  }

  async updateOne(criteria, data) {
    return await this.model.findOneAndUpdate(
      criteria,
      data,
      { new: true, runValidators: true }
    );
  }

  async delete(id) {
    return await this.model.findByIdAndDelete(id);
  }

  async deleteOne(criteria) {
    return await this.model.findOneAndDelete(criteria);
  }

  async deleteMany(criteria) {
    return await this.model.deleteMany(criteria);
  }

  async count(criteria = {}) {
    return await this.model.countDocuments(criteria);
  }

  async exists(criteria) {
    return await this.model.exists(criteria);
  }
}

export default BaseRepository;
