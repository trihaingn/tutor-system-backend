import mongoose from 'mongoose';

const TutorSchema = new mongoose.Schema(
  {
    // Reference to User
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    
    // Subjects taught (identifiers)
    subjectIds: {
      type: [String],
      default: []
    },
    
    // Tutor info
    bio: {
      type: String,
      default: ''
    },
    
    maxStudents: {
      type: Number,
      default: 200
    },
    
    isAcceptingStudents: {
      type: Boolean,
      default: true
    },
    
    stats: {
      totalStudents: { type: Number, default: 0 },
      totalSessions: { type: Number, default: 0 },
      completedSessions: { type: Number, default: 0 },
      cancelledSessions: { type: Number, default: 0 },
      averageRating: { type: Number, default: 0 },
      totalReviews: { type: Number, default: 0 }
    }
  },
  {
    timestamps: true,
    collection: 'tutors'
  }
);

// Indexes
TutorSchema.index({ userId: 1 }, { unique: true });
TutorSchema.index({ subjectIds: 1 });
TutorSchema.index({ 'stats.averageRating': -1 });
TutorSchema.index({ isAcceptingStudents: 1, 'stats.averageRating': -1 });

export default mongoose.model('Tutor', TutorSchema);
