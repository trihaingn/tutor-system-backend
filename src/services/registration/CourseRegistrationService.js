/**
 * SERVICE: CourseRegistrationService
 * FILE: CourseRegistrationService.js
 * MỤC ĐÍCH: Xử lý logic đăng ký môn học với Tutor (UC-08)
 * 
 * BUSINESS RULES:
 * - BR-005: ⚠️ INSTANT APPROVAL - Đăng ký được chấp nhận ngay lập tức (Version 2.0)
 * - BR-006: Student không thể đăng ký trùng (same Tutor + Subject)
 * - BR-008: Tự động gửi notification cho Tutor khi có student mới
 * 
 * DEPENDENCIES:
 * - CourseRegistration Model
 * - Student Model, Tutor Model
 * - NotificationService
 * - ValidationError, ConflictError, NotFoundError
 */

// ============================================================
// FUNCTION: validateRegistrationData(studentId, tutorId, subjectId)
// ============================================================
// PURPOSE: Validate dữ liệu trước khi đăng ký
// 
// INPUT:
// - studentId: ObjectId
// - tutorId: ObjectId
// - subjectId: String (e.g., "Math_101")
// 
// PSEUDOCODE:
// Step 1: Validate required fields
//   - If !studentId OR !tutorId OR !subjectId:
//     → Throw ValidationError("Thiếu thông tin bắt buộc")
// 
// Step 2: Validate Student exists và active
//   - const student = await Student.findById(studentId).populate('userId')
//   - If !student:
//     → Throw NotFoundError("Student không tồn tại")
//   - If student.userId.status !== 'ACTIVE':
//     → Throw ForbiddenError("Tài khoản Student không hoạt động")
// 
// Step 3: Validate Tutor exists và active
//   - const tutor = await Tutor.findById(tutorId).populate('userId')
//   - If !tutor:
//     → Throw NotFoundError("Tutor không tồn tại")
//   - If tutor.userId.status !== 'ACTIVE':
//     → Throw ForbiddenError("Tài khoản Tutor không hoạt động")
// 
// Step 4: Validate Tutor có expertise trong subject này
//   - const hasExpertise = tutor.expertise.some(exp => exp.subjectId === subjectId)
//   - If !hasExpertise:
//     → Throw ValidationError("Tutor không dạy môn học này")
// 
// Step 5: Validate Tutor đang nhận học sinh
//   - If tutor.isAcceptingStudents === false:
//     → Throw ForbiddenError("Tutor hiện không nhận học sinh mới")
// 
// OUTPUT:
// - Return { student, tutor } nếu pass

// ============================================================
// FUNCTION: checkDuplicateRegistration(studentId, tutorId, subjectId)
// ============================================================
// PURPOSE: Kiểm tra đã đăng ký trùng chưa (BR-006)
// 
// INPUT:
// - studentId: ObjectId
// - tutorId: ObjectId
// - subjectId: String
// 
// PSEUDOCODE:
// Step 1: Query CourseRegistration
//   - const existingRegistration = await CourseRegistration.findOne({
//       studentId: studentId,
//       tutorId: tutorId,
//       subjectId: subjectId,
//       status: { $in: ['ACTIVE', 'PENDING'] } // Không tính CANCELLED
//     })
// 
// Step 2: Check kết quả
//   - If existingRegistration:
//     → Return { isDuplicate: true, registration: existingRegistration }
//   - Else:
//     → Return { isDuplicate: false }
// 
// OUTPUT:
// - Return { isDuplicate: Boolean, registration?: Object }

// ============================================================
// FUNCTION: registerCourse(studentId, tutorId, subjectId)
// ============================================================
// PURPOSE: Student đăng ký môn học với Tutor (UC-08)
// 
// INPUT:
// - studentId: ObjectId
// - tutorId: ObjectId
// - subjectId: String
// 
// PSEUDOCODE:
// Step 1: Validate dữ liệu
//   - const { student, tutor } = await validateRegistrationData(studentId, tutorId, subjectId)
// 
// Step 2: ⚠️ BR-006 - Kiểm tra duplicate
//   - const duplicateCheck = await checkDuplicateRegistration(studentId, tutorId, subjectId)
//   - If duplicateCheck.isDuplicate:
//     → Throw ConflictError("Bạn đã đăng ký môn học này với Tutor này rồi")
// 
// Step 3: ⚠️ BR-005 - INSTANT APPROVAL (Version 2.0)
//   - const registration = await CourseRegistration.create({
//       studentId: studentId,
//       tutorId: tutorId,
//       subjectId: subjectId,
//       status: 'ACTIVE',              // ← INSTANT: Không cần approval workflow
//       registeredAt: new Date(),
//       approvedAt: new Date(),         // ← INSTANT: Approved ngay
//       approvedBy: 'SYSTEM'            // ← INSTANT: Không có Coordinator approve
//     })
// 
//   NOTE - Version Comparison:
//   | Aspect         | Version 1.0              | Version 2.0 (Current)   |
//   |----------------|--------------------------|-------------------------|
//   | Initial Status | PENDING                  | ACTIVE                  |
//   | Approval Flow  | Yes (Coordinator UC-07)  | No (Instant)            |
//   | approvedBy     | coordinatorId            | 'SYSTEM'                |
// 
// Step 4: Update Student statistics
//   - await Student.findByIdAndUpdate(
//       studentId,
//       { $inc: { registeredTutors: 1 } }
//     )
// 
// Step 5: Update Tutor statistics
//   - await Tutor.findByIdAndUpdate(
//       tutorId,
//       { $inc: { totalStudents: 1 } }
//     )
// 
// Step 6: ⚠️ BR-008 - Gửi notification cho Tutor
//   - await NotificationService.sendNotification({
//       recipientId: tutor.userId._id,
//       type: 'APPOINTMENT_CREATED',
//       title: 'Học sinh mới đăng ký',
//       message: `Học sinh ${student.userId.fullName} (${student.mssv}) đã đăng ký môn ${subjectId}`,
//       relatedId: registration._id,
//       relatedType: 'Registration'
//     })
// 
// Step 7: Populate và return
//   - await registration.populate([
//       { path: 'studentId', populate: { path: 'userId' } },
//       { path: 'tutorId', populate: { path: 'userId' } }
//     ])
//   - Return registration
// 
// OUTPUT:
// - Return CourseRegistration object (populated)

// ============================================================
// FUNCTION: getStudentRegistrations(studentId, filters = {})
// ============================================================
// PURPOSE: Lấy danh sách registrations của Student
// 
// INPUT:
// - studentId: ObjectId
// - filters: Object { status?, subjectId? }
// 
// PSEUDOCODE:
// Step 1: Build query
//   query = { studentId: studentId }
//   
//   - If filters.status:
//     → query.status = filters.status
//   
//   - If filters.subjectId:
//     → query.subjectId = filters.subjectId
// 
// Step 2: Query và populate
//   - const registrations = await CourseRegistration.find(query)
//       .populate({
//         path: 'tutorId',
//         populate: { path: 'userId', select: 'fullName email' }
//       })
//       .sort({ registeredAt: -1 })
// 
// OUTPUT:
// - Return array of CourseRegistration objects

// ============================================================
// FUNCTION: getTutorRegistrations(tutorId, filters = {})
// ============================================================
// PURPOSE: Lấy danh sách students đã đăng ký với Tutor
// 
// INPUT:
// - tutorId: ObjectId
// - filters: Object { status?, subjectId? }
// 
// PSEUDOCODE:
// Step 1: Build query
//   query = { tutorId: tutorId }
//   
//   - If filters.status:
//     → query.status = filters.status
//   - Else:
//     → query.status = 'ACTIVE' (default: chỉ lấy active)
//   
//   - If filters.subjectId:
//     → query.subjectId = filters.subjectId
// 
// Step 2: Query và populate
//   - const registrations = await CourseRegistration.find(query)
//       .populate({
//         path: 'studentId',
//         populate: { path: 'userId', select: 'fullName email' }
//       })
//       .sort({ registeredAt: -1 })
// 
// OUTPUT:
// - Return array of CourseRegistration objects

// ============================================================
// FUNCTION: cancelRegistration(registrationId, studentId)
// ============================================================
// PURPOSE: Student hủy registration
// 
// INPUT:
// - registrationId: ObjectId
// - studentId: ObjectId (for ownership validation)
// 
// PSEUDOCODE:
// Step 1: Tìm registration
//   - const registration = await CourseRegistration.findById(registrationId)
//   - If !registration → Throw NotFoundError("Registration không tồn tại")
// 
// Step 2: Validate ownership
//   - If registration.studentId.toString() !== studentId.toString():
//     → Throw ForbiddenError("Bạn không phải chủ registration này")
// 
// Step 3: Kiểm tra status (chỉ cancel được ACTIVE registrations)
//   - If registration.status === 'CANCELLED':
//     → Throw ConflictError("Registration đã bị hủy rồi")
// 
// Step 4: Update status
//   - registration.status = 'CANCELLED'
//   - await registration.save()
// 
// Step 5: Update statistics
//   - await Student.findByIdAndUpdate(
//       studentId,
//       { $inc: { registeredTutors: -1 } }
//     )
//   - await Tutor.findByIdAndUpdate(
//       registration.tutorId,
//       { $inc: { totalStudents: -1 } }
//     )
// 
// OUTPUT:
// - Return { success: true, registration }

import CourseRegistration from '../../models/CourseRegistration.model.js';
import Student from '../../models/Student.model.js';
import Tutor from '../../models/Tutor.model.js';
import CourseRegistrationRepository from '../../repositories/CourseRegistrationRepository.js';
import { 
  ValidationError, 
  ConflictError, 
  NotFoundError, 
  AuthorizationError 
} from '../../middleware/errorMiddleware.js';

/**
 * Validate registration data
 */
async function validateRegistrationData(studentId, tutorId, subjectId) {
  if (!studentId || !tutorId || !subjectId) {
    throw new ValidationError('Thiếu thông tin bắt buộc');
  }

  // Validate Student exists and active
  const student = await Student.findById(studentId).populate('userId');
  if (!student) {
    throw new NotFoundError('Student không tồn tại');
  }
  if (student.userId.status !== 'ACTIVE') {
    throw new AuthorizationError('Tài khoản Student không hoạt động');
  }

  // Validate Tutor exists and active
  const tutor = await Tutor.findById(tutorId).populate('userId');
  if (!tutor) {
    throw new NotFoundError('Tutor không tồn tại');
  }
  if (tutor.userId.status !== 'ACTIVE') {
    throw new AuthorizationError('Tài khoản Tutor không hoạt động');
  }

  // Validate Tutor has expertise in this subject
  const hasExpertise = tutor.expertise.some(exp => exp.subjectId === subjectId);
  if (!hasExpertise) {
    throw new ValidationError('Tutor không dạy môn học này');
  }

  // Validate Tutor is accepting students
  if (tutor.isAcceptingStudents === false) {
    throw new AuthorizationError('Tutor hiện không nhận học sinh mới');
  }

  return { student, tutor };
}

/**
 * Check duplicate registration (BR-006)
 */
async function checkDuplicateRegistration(studentId, tutorId, subjectId) {
  const isDuplicate = await CourseRegistrationRepository.checkDuplicate(
    studentId,
    tutorId,
    subjectId
  );

  return isDuplicate;
}

/**
 * Register course with tutor (UC-08)
 * BR-005: INSTANT APPROVAL
 * BR-006: No duplicates
 * BR-008: Send notification to tutor
 */
async function registerCourse(studentId, tutorId, subjectId) {
  // Step 1: Validate data
  const { student, tutor } = await validateRegistrationData(studentId, tutorId, subjectId);

  // Step 2: BR-006 - Check duplicate
  const isDuplicate = await checkDuplicateRegistration(studentId, tutorId, subjectId);
  if (isDuplicate) {
    throw new ConflictError('Bạn đã đăng ký môn học này với Tutor này rồi');
  }

  // Step 3: BR-005 - INSTANT APPROVAL (Version 2.0)
  const registration = await CourseRegistration.create({
    studentId,
    tutorId,
    subjectId,
    status: 'ACTIVE',              // INSTANT: No approval workflow
    registeredAt: new Date(),
    approvedAt: new Date(),         // INSTANT: Approved immediately
    approvedBy: 'SYSTEM'            // INSTANT: System approval
  });

  // Step 4: Update Student statistics
  await Student.findByIdAndUpdate(
    studentId,
    { $inc: { registeredTutors: 1 } }
  );

  // Step 5: Update Tutor statistics
  await Tutor.findByIdAndUpdate(
    tutorId,
    { $inc: { totalStudents: 1 } }
  );

  // Step 6: BR-008 - Send notification to Tutor
  // Note: NotificationService would be called here in full implementation
  // await NotificationService.sendNotification({...})

  // Step 7: Populate and return
  await registration.populate([
    { path: 'studentId', populate: { path: 'userId' } },
    { path: 'tutorId', populate: { path: 'userId' } }
  ]);

  return registration;
}

/**
 * Get student's registrations
 */
async function getStudentRegistrations(studentId, filters = {}) {
  const query = { studentId };

  if (filters.status) {
    query.status = filters.status;
  }

  if (filters.subjectId) {
    query.subjectId = filters.subjectId;
  }

  const registrations = await CourseRegistration.find(query)
    .populate({
      path: 'tutorId',
      populate: { path: 'userId', select: 'fullName email' }
    })
    .sort({ registeredAt: -1 });

  return registrations;
}

/**
 * Get tutor's registrations
 */
async function getTutorRegistrations(tutorId, filters = {}) {
  const query = { tutorId };

  if (filters.status) {
    query.status = filters.status;
  } else {
    query.status = 'ACTIVE'; // Default: only active
  }

  if (filters.subjectId) {
    query.subjectId = filters.subjectId;
  }

  const registrations = await CourseRegistration.find(query)
    .populate({
      path: 'studentId',
      populate: { path: 'userId', select: 'fullName email' }
    })
    .sort({ registeredAt: -1 });

  return registrations;
}

/**
 * Cancel registration
 */
async function cancelRegistration(registrationId, studentId) {
  const registration = await CourseRegistration.findById(registrationId);

  if (!registration) {
    throw new NotFoundError('Registration không tồn tại');
  }

  // Validate ownership
  if (registration.studentId.toString() !== studentId.toString()) {
    throw new AuthorizationError('Bạn không phải chủ registration này');
  }

  // Check if already cancelled
  if (registration.status === 'CANCELLED') {
    throw new ConflictError('Registration đã bị hủy rồi');
  }

  // Update status
  registration.status = 'CANCELLED';
  await registration.save();

  // Update statistics
  await Student.findByIdAndUpdate(
    studentId,
    { $inc: { registeredTutors: -1 } }
  );

  await Tutor.findByIdAndUpdate(
    registration.tutorId,
    { $inc: { totalStudents: -1 } }
  );

  return { success: true, registration };
}

export {
  validateRegistrationData,
  checkDuplicateRegistration,
  registerCourse,
  getStudentRegistrations,
  getTutorRegistrations,
  cancelRegistration
};
