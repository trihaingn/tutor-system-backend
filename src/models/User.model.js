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
 * - student: Populate từ Student model (localField: _id, foreignField: userId)
 * - tutor: Populate từ Tutor model (localField: _id, foreignField: userId)
 * 
 * BUSINESS RULES:
 * - BR-007: Mỗi lần login, phải sync data từ DATACORE (AuthService)
 * - Email là unique identifier chính (không thể trùng)
 * - mssv chỉ có với STUDENT, maCB chỉ có với TUTOR/ADMIN
 * - DATACORE là READ-ONLY source (hệ thống không sửa data trên DATACORE)
 */

const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    // Identity fields
    mssv: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
      trim: true
    },
    maCB: {
      type: String,
      unique: true,
      sparse: true,
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
      required: [true, 'Full name is required'],
      trim: true,
      minlength: [2, 'Full name must be at least 2 characters'],
      maxlength: [100, 'Full name cannot exceed 100 characters']
    },
    faculty: {
      type: String,
      enum: ['CSE', 'EE', 'ME', 'CE', 'CHE', 'BME', 'APPLIED_SCIENCE', 'MANAGEMENT'],
      index: true
    },
    
    // Role & Status
    role: {
      type: String,
      enum: ['STUDENT', 'TUTOR', 'ADMIN'],
      required: [true, 'Role is required'],
      index: true
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'SUSPENDED', 'GRADUATED', 'RESIGNED'],
      default: 'ACTIVE',
      index: true
    },
    
    // Sync metadata
    lastSyncAt: {
      type: Date,
      default: null
    },
    syncSource: {
      type: String,
      enum: ['DATACORE', 'MANUAL'],
      default: 'DATACORE'
    }
  },
  {
    timestamps: true,
    collection: 'users'
  }
);

// Composite indexes
UserSchema.index({ email: 1, role: 1 });
UserSchema.index({ status: 1, role: 1 });

// Virtual fields
UserSchema.virtual('student', {
  ref: 'Student',
  localField: '_id',
  foreignField: 'userId',
  justOne: true
});

UserSchema.virtual('tutor', {
  ref: 'Tutor',
  localField: '_id',
  foreignField: 'userId',
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
  return this.isStudent() ? this.mssv : this.maCB;
};

// Static methods
UserSchema.statics.findByEmail = function(email) {
  return this.findOne({ email: email.toLowerCase() });
};

UserSchema.statics.findByMSSV = function(mssv) {
  return this.findOne({ mssv, role: 'STUDENT' });
};

UserSchema.statics.findByMaCB = function(maCB) {
  return this.findOne({ maCB, role: { $in: ['TUTOR', 'ADMIN'] } });
};

// Pre-save validation
UserSchema.pre('save', async function() {
  if (this.role === 'STUDENT' && !this.mssv) {
    throw new Error('MSSV is required for students');
  }
  if ((this.role === 'TUTOR' || this.role === 'ADMIN') && !this.maCB) {
    throw new Error('Mã CB is required for tutors and admins');
  }
});

// Enable virtuals in JSON
UserSchema.set('toJSON', { virtuals: true });
UserSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('User', UserSchema);
