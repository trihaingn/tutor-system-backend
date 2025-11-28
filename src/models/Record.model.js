import mongoose from 'mongoose';

const RecordSchema = new mongoose.Schema({
    sessionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TutorSession',
        required: true,
        unique: true, // 1 session = 1 report
        index: true
    },
    tutorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tutor',
        required: true,
        index: true
    },
    summary: {
        type: String,
        required: true,
        maxlength: 2000
    }
}, {
    timestamps: true
});

// Index for querying reports by tutor
RecordSchema.index({ tutorId: 1, createdAt: -1 });

export default mongoose.model('Record', RecordSchema);
