import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema({
    recipientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    type: {
        type: String,
        enum: [
            'APPOINTMENT_CREATED',
            'APPOINTMENT_CONFIRMED',
            'APPOINTMENT_REJECTED',
            'APPOINTMENT_CANCELLED',
            'SESSION_CREATED',
            'SESSION_UPDATED',
            'SESSION_CANCELLED',
            'EVALUATION_RECEIVED',
            'SCHEDULE_REMINDER',
            'SYSTEM_ANNOUNCEMENT'
        ],
        required: true,
        index: true
    },
    title: {
        type: String,
        required: true,
        maxlength: 200
    },
    message: {
        type: String,
        required: true,
        maxlength: 1000
    },
    relatedId: {
        type: mongoose.Schema.Types.ObjectId,
        default: null,
        index: true
    },
    relatedType: {
        type: String,
        enum: ['Session', 'Appointment', 'Feedback', null],
        default: null
    },
    isRead: {
        type: Boolean,
        default: false,
        index: true
    },
    readAt: {
        type: Date,
        default: null
    }
}, {
    timestamps: true
});

// Composite indexes for query optimization
NotificationSchema.index({ recipientId: 1, createdAt: -1 });
NotificationSchema.index({ recipientId: 1, isRead: 1 });
NotificationSchema.index({ recipientId: 1, type: 1 });

export default mongoose.model('Notification', NotificationSchema);
