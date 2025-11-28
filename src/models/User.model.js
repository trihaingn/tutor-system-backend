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
      match: /^[a-zA-Z0-9._%+-]+@hcmut\.edu\.vn$/,
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
