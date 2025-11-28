/**
 * REPOSITORY: Base Repository (Generic CRUD)
 * FILE: BaseRepository.js
 * MỤC ĐÍCH: Lớp Repository cơ bản cung cấp các thao tác CRUD chung
 * 
 * DESIGN PATTERN: Repository Pattern
 * - Tách biệt logic truy vấn database khỏi business logic (Services)
 * - Dễ dàng test và mock
 * - Dễ dàng thay đổi database layer (Mongoose → TypeORM, etc.)
 * 
 * USAGE:
 * class UserRepository extends BaseRepository {
 *   constructor() {
 *     super(User) // Pass Model
 *   }
 * }
 */

// TODO: Import Mongoose Model type

// ============================================================
// CLASS: BaseRepository
// ============================================================
// PURPOSE: Generic repository với CRUD operations
// 
// CONSTRUCTOR:
// constructor(model) {
//   this.model = model // Mongoose Model
// }

// ============================================================
// METHOD: create(data)
// ============================================================
// PURPOSE: Tạo document mới
// 
// INPUT:
// - data: Object chứa dữ liệu cần tạo
// 
// PSEUDOCODE:
// Step 1: Create new document
//   const document = new this.model(data)
// 
// Step 2: Save to database
//   const savedDocument = await document.save()
// 
// Step 3: Return saved document
//   return savedDocument
// 
// OUTPUT:
// - Document đã được lưu với _id

// ============================================================
// METHOD: findById(id, populate = '')
// ============================================================
// PURPOSE: Tìm document theo ID
// 
// INPUT:
// - id: String | ObjectId
// - populate: String (optional) - các field cần populate
// 
// PSEUDOCODE:
// Step 1: Build query
//   let query = this.model.findById(id)
// 
// Step 2: Apply populate if provided
//   if (populate) {
//     query = query.populate(populate)
//   }
// 
// Step 3: Execute query
//   const document = await query.exec()
// 
// Step 4: Return document or null
//   return document
// 
// OUTPUT:
// - Document hoặc null nếu không tìm thấy

// ============================================================
// METHOD: findOne(filter, populate = '')
// ============================================================
// PURPOSE: Tìm 1 document theo filter
// 
// INPUT:
// - filter: Object chứa điều kiện tìm kiếm
// - populate: String (optional)
// 
// PSEUDOCODE:
// Step 1: Build query
//   let query = this.model.findOne(filter)
// 
// Step 2: Apply populate
//   if (populate) {
//     query = query.populate(populate)
//   }
// 
// Step 3: Execute and return
//   return await query.exec()
// 
// OUTPUT:
// - Document đầu tiên match filter hoặc null

// ============================================================
// METHOD: findAll(filter = {}, options = {})
// ============================================================
// PURPOSE: Tìm nhiều documents với pagination
// 
// INPUT:
// - filter: Object điều kiện lọc
// - options: { sort, populate, skip, limit, select }
// 
// PSEUDOCODE:
// Step 1: Build query
//   let query = this.model.find(filter)
// 
// Step 2: Apply options
//   if (options.select) {
//     query = query.select(options.select)
//   }
//   
//   if (options.populate) {
//     query = query.populate(options.populate)
//   }
//   
//   if (options.sort) {
//     query = query.sort(options.sort)
//   }
//   
//   if (options.skip) {
//     query = query.skip(options.skip)
//   }
//   
//   if (options.limit) {
//     query = query.limit(options.limit)
//   }
// 
// Step 3: Execute query
//   const documents = await query.exec()
// 
// Step 4: Return documents
//   return documents
// 
// OUTPUT:
// - Array of documents

// ============================================================
// METHOD: update(id, data)
// ============================================================
// PURPOSE: Cập nhật document theo ID
// 
// INPUT:
// - id: String | ObjectId
// - data: Object chứa fields cần update
// 
// PSEUDOCODE:
// Step 1: Update document
//   const updatedDocument = await this.model.findByIdAndUpdate(
//     id,
//     data,
//     { new: true, runValidators: true }
//   )
//   // new: true -> return updated document
//   // runValidators: true -> chạy schema validation
// 
// Step 2: Return updated document
//   return updatedDocument
// 
// OUTPUT:
// - Document sau khi update hoặc null

// ============================================================
// METHOD: delete(id)
// ============================================================
// PURPOSE: Xóa document theo ID
// 
// INPUT:
// - id: String | ObjectId
// 
// PSEUDOCODE:
// Step 1: Delete document
//   const deletedDocument = await this.model.findByIdAndDelete(id)
// 
// Step 2: Return deleted document
//   return deletedDocument
// 
// OUTPUT:
// - Document đã xóa hoặc null

// ============================================================
// METHOD: count(filter = {})
// ============================================================
// PURPOSE: Đếm số lượng documents
// 
// INPUT:
// - filter: Object điều kiện lọc
// 
// PSEUDOCODE:
// Step 1: Count documents
//   const count = await this.model.countDocuments(filter)
// 
// Step 2: Return count
//   return count
// 
// OUTPUT:
// - Number (số lượng documents)

// ============================================================
// METHOD: exists(filter)
// ============================================================
// PURPOSE: Kiểm tra document có tồn tại không
// 
// INPUT:
// - filter: Object điều kiện
// 
// PSEUDOCODE:
// Step 1: Check existence
//   const exists = await this.model.exists(filter)
// 
// Step 2: Return boolean
//   return !!exists
// 
// OUTPUT:
// - Boolean (true/false)

/**
 * Base Repository - Generic CRUD operations
 * Repository Pattern for database access
 */

class BaseRepository {
  constructor(model) {
    this.model = model;
  }

  async create(data) {
    const document = new this.model(data);
    return await document.save();
  }

  async findById(id, populate = '') {
    let query = this.model.findById(id);
    if (populate) {
      query = query.populate(populate);
    }
    return await query.exec();
  }

  async findOne(filter, populate = '') {
    let query = this.model.findOne(filter);
    if (populate) {
      query = query.populate(populate);
    }
    return await query.exec();
  }

  async findAll(filter = {}, options = {}) {
    let query = this.model.find(filter);

    if (options.select) {
      query = query.select(options.select);
    }
    if (options.populate) {
      query = query.populate(options.populate);
    }
    if (options.sort) {
      query = query.sort(options.sort);
    }
    if (options.skip) {
      query = query.skip(options.skip);
    }
    if (options.limit) {
      query = query.limit(options.limit);
    }

    return await query.exec();
  }

  async update(id, data) {
    return await this.model.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true
    });
  }

  async delete(id) {
    return await this.model.findByIdAndDelete(id);
  }

  async count(filter = {}) {
    return await this.model.countDocuments(filter);
  }

  async exists(filter) {
    const result = await this.model.exists(filter);
    return !!result;
  }
}

export default BaseRepository;
