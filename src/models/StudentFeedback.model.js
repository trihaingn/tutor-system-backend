import mongoose from 'mongoose';

const StudentFeedbackSchema = new mongoose.Schema({
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
    sessionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TutorSession',
        required: true,
        index: true
    },
    content: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
        validate: {
            validator: Number.isInteger,
            message: 'Rating must be an integer (1-5 stars)'
        }
    },
    evaluatedAt: {
        type: Date,
        default: Date.now,
        index: true
    }
}, {
    timestamps: true
});

// CRITICAL: Composite unique index - prevents duplicate evaluations
StudentFeedbackSchema.index(
    { studentId: 1, tutorId: 1, sessionId: 1 },
    { unique: true }
);

// Query optimization indexes
StudentFeedbackSchema.index({ tutorId: 1, rating: 1 });
StudentFeedbackSchema.index({ sessionId: 1 });

export default mongoose.model('StudentFeedback', StudentFeedbackSchema);
