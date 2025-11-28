import mongoose from 'mongoose';

const AvailabilitySchema = new mongoose.Schema({
    tutorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tutor',
        required: true,
        index: true
    },
    dayOfWeek: {
        type: Number,
        min: 0 ,// Sunday
        max: 6 ,// Saturday
    },
    startTime:    {
        type: String,
        match: /^([01]\d|2[0-3]):00$/
    },
    endTime: {
        type: String,
        required: true,
        match: /^([01]\d|2[0-3]):00$/,
        validate: {
            validator: function(value) {
                return value > this.startTime;
            },
            message: 'endTime must be greater than startTime'
        }
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    collection: 'availabilities'
});

// Indexes for query optimization
AvailabilitySchema.index({ tutorId: 1, type: 1 });
AvailabilitySchema.index({ tutorId: 1, dayOfWeek: 1, isActive: 1 });
AvailabilitySchema.index({ tutorId: 1, specificDate: 1, isActive: 1 });

export default mongoose.model('Availability', AvailabilitySchema);