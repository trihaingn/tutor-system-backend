import mongoose from 'mongoose';

const CourseRegistrationSchema = new mongoose.Schema(
  {
    // Core Relationship (M-N-M)
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
      index: true
    },
    tutorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tutor',
      required: true,
      index: true
    },
    subjectId: {
      type: String,
      required: true,
      index: true
    },
    
    // Registration Metadata
    status: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE', 'CANCELLED'],
      default: 'ACTIVE',
      index: true
    },
    registeredAt: {
      type: Date,
      default: Date.now,
      index: true
    },
  },
  {
    timestamps: true,
    collection: 'course_registrations'
  }
);

// ⚠️ CRITICAL: Composite unique index (BR-006)
// Prevents duplicate: same Student + Tutor + Subject
CourseRegistrationSchema.index(
  { studentId: 1, tutorId: 1, subjectId: 1 },
  { unique: true }
);

// Query optimization indexes
CourseRegistrationSchema.index({ studentId: 1, status: 1 });
CourseRegistrationSchema.index({ tutorId: 1, status: 1 });
CourseRegistrationSchema.index({ subjectId: 1, status: 1 });

export default mongoose.model('CourseRegistration', CourseRegistrationSchema);
