import mongoose from 'mongoose';

const StudentSchema = new mongoose.Schema(
  {
    // Reference to User
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true
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
StudentSchema.index({ userId: 1 });
StudentSchema.index({ mssv: 1 });
StudentSchema.index({ major: 1, enrollmentYear: 1 });

export default mongoose.model('Student', StudentSchema);
