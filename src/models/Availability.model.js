/**
 * MODEL: Availability
 * FILE: Availability.model.js
 * MỤC ĐÍCH: Lưu trữ lịch rảnh của Tutor (UC-10: Set availability)
 *           Hỗ trợ 2 loại: RECURRING (hàng tuần) và SPECIFIC_DATE (ngày cụ thể)
 * 
 * QUAN HỆ:
 * - N-1 với Tutor (1 tutor có nhiều availability slots)
 * 
 * CÁC TRƯỜNG (FIELDS):
 * 
 * 1. TUTOR REFERENCE:
 *    - tutorId (ObjectId, ref: 'Tutor', required, index): Tutor sở hữu slot
 * 
 * 2. AVAILABILITY TYPE:
 *    - type (String, enum, required): Loại availability
 *      Enum: ['RECURRING', 'SPECIFIC_DATE']
 *      RECURRING: Lặp lại hàng tuần (vd: Every Monday 9-11)
 *      SPECIFIC_DATE: Một ngày cụ thể (vd: 2025-01-20 14-16)
 * 
 * 3. RECURRING SLOTS (when type = RECURRING):
 *    - dayOfWeek (Number, min: 0, max: 6, default: null): Thứ trong tuần
 *      0=Sunday, 1=Monday, ..., 6=Saturday
 *      Required if type=RECURRING, null if SPECIFIC_DATE
 * 
 * 4. SPECIFIC DATE SLOTS (when type = SPECIFIC_DATE):
 *    - specificDate (Date, default: null): Ngày cụ thể
 *      Required if type=SPECIFIC_DATE, null if RECURRING
 * 
 * 5. TIME RANGE:
 *    - startTime (String, required): Giờ bắt đầu (format: "HH:MM", vd: "09:00")
 *      ⚠️ BR-001: Phải là giờ tròn (09:00, 10:00, ...)
 *    - endTime (String, required): Giờ kết thúc (format: "HH:MM", vd: "11:00")
 *      ⚠️ BR-001: Phải là giờ tròn
 * 
 * 6. CAPACITY:
 *    - maxSlots (Number, required, min: 1): Số slot tối đa có thể book
 *      vd: maxSlots=3 => 3 students có thể book cùng time slot
 * 
 * 7. STATUS:
 *    - isActive (Boolean, default: true): Active hay không (Tutor có thể disable)
 * 
 * 8. TIMESTAMPS:
 *    - createdAt, updatedAt (auto-generated)
 * 
 * INDEXES:
 * - { tutorId: 1, type: 1 } - Query by tutor and type
 * - { tutorId: 1, dayOfWeek: 1, isActive: 1 } - Recurring slots
 * - { tutorId: 1, specificDate: 1, isActive: 1 } - Specific date slots
 * 
 * BUSINESS RULES:
 * - BR-001: startTime và endTime phải là giờ tròn (HH:00)
 * - Validation: endTime > startTime
 * - Validation: Không được overlap với availability slots khác của same tutor
 * - UC-10: Tutor có thể set/update/delete availability
 * - UC-12: Students xem available slots để book appointment
 * 
 * VÍ DỤ:
 * 1. RECURRING:
 *    {
 *      tutorId: ...,
 *      type: 'RECURRING',
 *      dayOfWeek: 1,          // Every Monday
 *      startTime: '09:00',
 *      endTime: '11:00',
 *      maxSlots: 3
 *    }
 * 
 * 2. SPECIFIC_DATE:
 *    {
 *      tutorId: ...,
 *      type: 'SPECIFIC_DATE',
 *      specificDate: 2025-01-20,
 *      startTime: '14:00',
 *      endTime: '16:00',
 *      maxSlots: 2
 *    }
 */

// TODO: Import mongoose

// TODO: Định nghĩa AvailabilitySchema với các trường trên

// TODO: ⚠️ Thêm custom validation:
// - If type=RECURRING => dayOfWeek required, specificDate must be null
// - If type=SPECIFIC_DATE => specificDate required, dayOfWeek must be null
// - startTime/endTime phải là giờ tròn (HH:00)
// - endTime > startTime

// TODO: Thêm indexes
// AvailabilitySchema.index({ tutorId: 1, type: 1 });
// AvailabilitySchema.index({ tutorId: 1, dayOfWeek: 1, isActive: 1 });
// AvailabilitySchema.index({ tutorId: 1, specificDate: 1, isActive: 1 });

// TODO: Export model
import mongoose from 'mongoose'
import { collection } from './User.model'

const AvailabilitySchema = mongoose.Schema({
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
        match: /^([01]\d|2[0-3]):[0-5]\d$/
    },
    endTime:    {
        type: String,
        match: /^([01]\d|2[0-3]):[0-5]\d$/
    },
    isActive:   {
        type: Boolean,
        default: true,
    }
}, {
    timestamps: true,
    collection: 'availabilities'
})

export default mongoose.model('Availability', AvailabilitySchema)