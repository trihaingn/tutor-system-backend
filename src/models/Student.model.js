import mongoose from 'mongoose';

const StudentSchema = new mongoose.Schema(
  {
    // Reference to User
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    
    // Student ID
    mssv: {
      type: String,
      trim: true
    },
    
    // Academic Info
    major: {
      type: String,
      trim: true
    },
    
    enrollmentYear: {
      type: Number
    },
    
    currentYear: {
      type: Number
    },
    
    gpa: {
      type: Number,
      min: 0,
      max: 4
    },
    
    totalCredits: {
      type: Number,
      default: 0
    },
    
    // Tutor Program Participation
    registeredTutors: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tutor'
      }
    ],
    
    // Statistics
    stats: {
      totalSessionAttended: { type: Number, default: 0 },
      completedSessionAttended: { type: Number, default: 0 },
      cancelledSessionAttended: { type: Number, default: 0 }
    }
  },
  {
    timestamps: true,
    collection: 'students'
  }
);

// Indexes
StudentSchema.index({ userId: 1 }, { unique: true });
StudentSchema.index({ mssv: 1 }, { unique: true, sparse: true });
StudentSchema.index({ major: 1, enrollmentYear: 1 });

export default mongoose.model('Student', StudentSchema);
