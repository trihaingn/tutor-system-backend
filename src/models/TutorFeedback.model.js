import mongoose from 'mongoose';

const TutorFeedbackSchema = new mongoose.Schema({
    tutorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tutor',
        required: true,
        index: true
    },
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
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
        required: true
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
TutorFeedbackSchema.index(
    { tutorId: 1, studentId: 1, sessionId: 1 },
    { unique: true }
);

// Query optimization indexes
TutorFeedbackSchema.index({ studentId: 1, progressScore: 1 });
TutorFeedbackSchema.index({ sessionId: 1 });

export default mongoose.model('TutorFeedback', TutorFeedbackSchema);
