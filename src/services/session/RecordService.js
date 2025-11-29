// REFACTORED: November 29, 2025 - Verified Architecture & Integration
// UC-21: Create session record/report
// BR: Only COMPLETED/CONFIRMED sessions can have reports
// BR: One session can only have one report (unique sessionId)
// Architecture: Services import Repositories ONLY

import RecordRepository from '../../repositories/RecordRepository.js';
import TutorSessionRepository from '../../repositories/TutorSessionRepository.js';
import { 
  ValidationError, 
  ConflictError, 
  NotFoundError,
  AuthorizationError
} from '../../utils/error.js';

/**
 * Create session record/report (UC-21)
 * Tutor creates a report for a completed session
 */
async function createSessionRecord(tutorId, sessionId, recordData) {
  // Step 1: Validate session exists
  const session = await TutorSessionRepository.findById(sessionId);
  if (!session) {
    throw new NotFoundError('Session không tồn tại');
  }

  // Step 2: Validate ownership
  if (session.tutorId.toString() !== tutorId.toString()) {
    throw new AuthorizationError('Bạn không phải chủ session này');
  }

  // Step 3: BR - Validate session status (must be COMPLETED or CONFIRMED)
  if (session.status !== 'COMPLETED' && session.status !== 'CONFIRMED') {
    throw new ValidationError('Chỉ có thể tạo report cho session COMPLETED hoặc CONFIRMED');
  }

  // Step 4: BR - Check for duplicate report (unique sessionId)
  const existingRecord = await RecordRepository.findOne({ sessionId: sessionId });
  if (existingRecord) {
    throw new ConflictError('Session này đã có report rồi');
  }

  // Step 5: Validate required fields
  if (!recordData.summary || recordData.summary.trim() === '') {
    throw new ValidationError('Summary là bắt buộc');
  }

  // Step 6: Create record
  const record = await RecordRepository.create({
    sessionId: sessionId,
    tutorId: tutorId,
    summary: recordData.summary,
    topicsCovered: recordData.topicsCovered || [],
    studentProgress: recordData.studentProgress || [],
    nextSteps: recordData.nextSteps || [],
    attachments: recordData.attachments || [],
    createdAt: new Date()
  });

  // Step 7: Update session hasReport flag
  await TutorSessionRepository.update(sessionId, {
    hasReport: true
  });

  // Step 8: BR-008 - Notify participants (placeholder)
  // for (const participantId of session.participants) {
  //   await NotificationService.create({
  //     userId: participantId,
  //     type: 'SESSION_REPORT_CREATED',
  //     title: 'Biên bản buổi học đã sẵn sàng',
  //     message: `Tutor đã tạo biên bản cho buổi học: ${session.title}`
  //   });
  // }

  return record;
}

/**
 * Get record by session ID
 */
async function getRecordBySession(sessionId) {
  const record = await RecordRepository.findOne({ sessionId: sessionId });
  if (!record) {
    throw new NotFoundError('Record không tồn tại cho session này');
  }

  return record;
}

/**
 * Update session record
 */
async function updateSessionRecord(tutorId, recordId, updateData) {
  // Step 1: Find record
  const record = await RecordRepository.findById(recordId);
  if (!record) {
    throw new NotFoundError('Record không tồn tại');
  }

  // Step 2: Validate ownership
  if (record.tutorId.toString() !== tutorId.toString()) {
    throw new AuthorizationError('Bạn không phải chủ record này');
  }

  // Step 3: Validate session still allows updates
  const session = await TutorSessionRepository.findById(record.sessionId);
  if (!session) {
    throw new NotFoundError('Session không tồn tại');
  }

  if (session.status === 'CANCELLED') {
    throw new ValidationError('Không thể update report của session đã cancelled');
  }

  // Step 4: Apply updates
  const allowedFields = ['summary', 'topicsCovered', 'studentProgress', 'nextSteps', 'attachments'];
  const updates = {};

  for (const field of allowedFields) {
    if (updateData[field] !== undefined) {
      updates[field] = updateData[field];
    }
  }

  if (Object.keys(updates).length === 0) {
    throw new ValidationError('Không có dữ liệu để update');
  }

  updates.updatedAt = new Date();

  const updatedRecord = await RecordRepository.update(recordId, updates);
  return updatedRecord;
}

/**
 * Delete session record (soft delete)
 */
async function deleteSessionRecord(tutorId, recordId) {
  // Step 1: Find record
  const record = await RecordRepository.findById(recordId);
  if (!record) {
    throw new NotFoundError('Record không tồn tại');
  }

  // Step 2: Validate ownership
  if (record.tutorId.toString() !== tutorId.toString()) {
    throw new AuthorizationError('Bạn không phải chủ record này');
  }

  // Step 3: Delete record
  await RecordRepository.delete(recordId);

  // Step 4: Update session hasReport flag
  await TutorSessionRepository.update(record.sessionId, {
    hasReport: false
  });

  return { success: true };
}

/**
 * Get all records by tutor
 */
async function getRecordsByTutor(tutorId, filters = {}) {
  const query = { tutorId: tutorId };

  if (filters.startDate || filters.endDate) {
    query.createdAt = {};
    if (filters.startDate) {
      query.createdAt.$gte = filters.startDate;
    }
    if (filters.endDate) {
      query.createdAt.$lte = filters.endDate;
    }
  }

  const records = await RecordRepository.findAll(query, {
    sort: { createdAt: -1 }
  });

  return records;
}

export {
  createSessionRecord,
  getRecordBySession,
  updateSessionRecord,
  deleteSessionRecord,
  getRecordsByTutor
};
