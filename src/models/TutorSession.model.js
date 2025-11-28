import mongoose from 'mongoose';

const TutorSessionSchema = new mongoose.Schema({
    tutorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tutor',
        required: true,
        index: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    subject: {
        type: String,
        required: true,
        index: true
    },
    description: {
        type: String,
        maxlength: 2000
    },
    startTime: {
        type: Date,
        required: true,
        index: true
    },
    endTime: {
        type: Date,
        required: true
    },
    duration: {
        type: Number,
        required: true,
        min: 60 // BR-002: minimum 60 minutes
    },
    sessionType: {
        type: String,
        enum: ['ONLINE', 'OFFLINE'],
        required: true
    },
    location: {
        type: String,
        required: true,
    },  
    participants: [{
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Student',
            required: true
        },
        registeredAt: {
            type: Date,
            default: Date.now
        },
        attended: {
            type: Boolean,
            default: false
        }
    }],
    status: {
        type: String,
        enum: ['SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'],
        default: 'SCHEDULED',
        index: true
    },
    hasReport: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Indexes for query optimization
TutorSessionSchema.index({ tutorId: 1, startTime: 1 });
TutorSessionSchema.index({ subjectId: 1, status: 1 });
TutorSessionSchema.index({ status: 1, startTime: 1 });

// Virtual field for session report
TutorSessionSchema.virtual('report', {
    ref: 'Record',
    localField: '_id',
    foreignField: 'sessionId',
    justOne: true
});

export default mongoose.model('TutorSession', TutorSessionSchema);
