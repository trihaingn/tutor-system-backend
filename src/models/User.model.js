/**
 * MODEL: User
 * FILE: User.model.js
 * MỤC ĐÍCH: Lưu trữ thông tin cơ bản của TẤT CẢ người dùng (Student, Tutor, Admin)
 *           Đây là Base Model được đồng bộ từ HCMUT_DATACORE (READ-ONLY source)
 * 
 * QUAN HỆ:
 * - 1-1 với Student (nếu role = STUDENT)
 * - 1-1 với Tutor (nếu role = TUTOR hoặc ADMIN)
 * - 1-N với Notification (1 user có nhiều notifications)
 * 
 * CÁC TRƯỜNG (FIELDS):
 * 
 * 1. IDENTITY (Định danh):
 *    - mssv (String, unique, sparse, index): Mã số sinh viên (chỉ có với STUDENT)
 *    - maCB (String, unique, sparse, index): Mã cán bộ (chỉ có với TUTOR/ADMIN)
 *    - email (String, required, unique, lowercase, trim, index): Email chính (unique identifier)
 * 
 * 2. PROFILE (Thông tin cá nhân từ DATACORE):
 *    - fullName (String, required, trim): Họ và tên đầy đủ
 *    - faculty (String, enum, index): Khoa
 *      Enum: ['CSE', 'EE', 'ME', 'CE', 'CHE', 'BME', 'APPLIED_SCIENCE', 'MANAGEMENT']
 * 
 * 3. ROLE & STATUS:
 *    - role (String, enum, required, index): Vai trò trong hệ thống
 *      Enum: ['STUDENT', 'TUTOR', 'ADMIN']
 *    - status (String, enum, default: 'ACTIVE', index): Trạng thái tài khoản
 *      Enum: ['ACTIVE', 'SUSPENDED', 'GRADUATED', 'RESIGNED']
 * 
 * 4. SYNC METADATA (Metadata đồng bộ):
 *    - lastSyncAt (Date, default: null): Lần đồng bộ cuối cùng từ DATACORE
 *    - syncSource (String, enum, default: 'DATACORE'): Nguồn dữ liệu
 *      Enum: ['DATACORE', 'MANUAL']
 * 
 * 5. TIMESTAMPS (Tự động):
 *    - createdAt (Date): Ngày tạo (auto-generated bởi Mongoose)
 *    - updatedAt (Date): Ngày cập nhật cuối (auto-generated bởi Mongoose)
 * 
 * INDEXES:
 * - { email: 1 } - unique
 * - { email: 1, role: 1 } - composite
 * - { mssv: 1 } - unique, sparse
 * - { maCB: 1 } - unique, sparse
 * - { role: 1 }
 * - { status: 1 }
 * 
 * VIRTUAL FIELDS (populate):
 * - student: Populate từ Student model (localField: _id, foreignField: hcmutId)
 * - tutor: Populate từ Tutor model (localField: _id, foreignField: hcmutId)
 * 
 * BUSINESS RULES:
 * - BR-007: Mỗi lần login, phải sync data từ DATACORE (AuthService)
 * - Email là unique identifier chính (không thể trùng)
 * - mssv chỉ có với STUDENT, maCB chỉ có với TUTOR/ADMIN
 * - DATACORE là READ-ONLY source (hệ thống không sửa data trên DATACORE)
 */

import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    // Identity fields
    hcmutId: { // MSSV OR MSCB
      type: String,
      require: true,
      index: true,
      trim: true
    },

    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@hcmut\.edu\.vn$/,
        'Email must be a valid HCMUT email (@hcmut.edu.vn)'
      ]
    },
    
    // Profile fields
    fullName: {
      type: String,
      required: true,
    },
    faculty: {
      type: String,
      index: true
    },
    
    // Role & Status
    role: {
      type: String,
      enum: ['STUDENT', 'TUTOR', 'ADMIN'],
      required: true,
      index: true
    },

    status: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE'],
      default: 'ACTIVE',
      index: true
    },
    
    // Sync metadata
    lastSyncAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true,
    collection: 'users'
  }
);

// Composite indexes
UserSchema.index({ email: 1, role: 1 }, { unique: true});
UserSchema.index({ hcmutId: 1, role: 1 }, { unique: true})

// Virtual fields
UserSchema.virtual('student', {
  ref: 'Student',
  localField: '_id',
  foreignField: 'hcmutId',
  justOne: true
});

UserSchema.virtual('tutor', {
  ref: 'Tutor',
  localField: '_id',
  foreignField: 'hcmutId',
  justOne: true
});

// Instance methods
UserSchema.methods.isStudent = function() {
  return this.role === 'STUDENT';
};

UserSchema.methods.isTutor = function() {
  return this.role === 'TUTOR' || this.role === 'ADMIN';
};

UserSchema.methods.isActive = function() {
  return this.status === 'ACTIVE';
};

UserSchema.methods.getIdentifier = function() {
  return this.hcmutId;
};

// Static methods
UserSchema.statics.findByEmail = function(email) {
  return this.findOne({ email: email.toLowerCase() });
};

UserSchema.statics.findByUserIdAndRole = function(hcmutId, role) {
    return this.findOne({hcmutId: hcmutId, role: role})
}

// Enable virtuals in JSON
UserSchema.set('toJSON', { virtuals: true });
UserSchema.set('toObject', { virtuals: true });

export default mongoose.model('User', UserSchema);
