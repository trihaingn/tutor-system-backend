/**
 * SERVICE: SessionService
 * FILE: SessionService.js
 * MỤC ĐÍCH: Xử lý logic booking appointments cho sessions (UC-12, UC-13, UC-14)
 * 
 * BUSINESS RULES:
 * - Student phải có registration với Tutor mới được book appointment
 * - Session phải SCHEDULED và chưa đầy (currentParticipants < maxParticipants)
 * - BR-008: Tự động gửi notification
 * 
 * DEPENDENCIES:
 * - TutorSession Model, Appointment Model, CourseRegistration Model
 * - NotificationService
 */

// ============================================================
// FUNCTION: bookAppointment(studentId, sessionId, notes)
// ============================================================
// PURPOSE: Student book appointment cho session (UC-12)
// 
// INPUT:
// - studentId: ObjectId
// - sessionId: ObjectId
// - notes: String (optional)
// 
// PSEUDOCODE:
// Step 1: Validate session exists và status
//   - const session = await TutorSession.findById(sessionId).populate('tutorId')
//   - If !session → Throw NotFoundError("Session không tồn tại")
//   - If session.status !== 'SCHEDULED':
//     → Throw ForbiddenError("Session không trong trạng thái SCHEDULED")
// 
// Step 2: Kiểm tra session chưa đầy
//   - If session.currentParticipants >= session.maxParticipants:
//     → Throw ConflictError("Session đã đầy")
// 
// Step 3: Kiểm tra registration exists (BR)
//   - const registration = await CourseRegistration.findOne({
//       studentId: studentId,
//       tutorId: session.tutorId._id,
//       status: 'ACTIVE'
//     })
//   - If !registration:
//     → Throw ForbiddenError("Bạn phải đăng ký với Tutor trước khi book appointment")
// 
// Step 4: Kiểm tra duplicate booking
//   - const existingAppointment = await Appointment.findOne({
//       studentId: studentId,
//       sessionId: sessionId,
//       status: { $in: ['PENDING', 'CONFIRMED'] }
//     })
//   - If existingAppointment:
//     → Throw ConflictError("Bạn đã book session này rồi")
// 
// Step 5: Tạo appointment
//   - const appointment = await Appointment.create({
//       studentId: studentId,
//       sessionId: sessionId,
//       tutorId: session.tutorId._id,
//       status: 'PENDING',
//       bookedAt: new Date(),
//       notes: notes || ''
//     })
// 
// Step 4: Update session participants
//   - await TutorSession.findByIdAndUpdate(
//       sessionId,
//       {
//         $inc: { currentParticipants: 1 },
//         $push: { participants: studentId }
//       }
//     )
// 
// Step 7: Update Student statistics
//   - await Student.findByIdAndUpdate(
//       studentId,
//       { $inc: { totalAppointments: 1 } }
//     )
// 
// Step 8: BR-008 - Gửi notification cho Tutor
//   - await NotificationService.sendNotification({
//       recipientId: session.tutorId.userId,
//       type: 'APPOINTMENT_CREATED',
//       title: 'Appointment mới',
//       message: `Student đã đặt appointment cho buổi ${session.title}`,
//       relatedId: appointment._id,
//       relatedType: 'Appointment'
//     })
// 
// OUTPUT:
// - Return Appointment object

// ============================================================
// FUNCTION: confirmAppointment(appointmentId, tutorId)
// ============================================================
// PURPOSE: Tutor confirm appointment (UC-13)
// 
// PSEUDOCODE:
// Step 1: Tìm appointment
//   - const appointment = await Appointment.findById(appointmentId).populate('sessionId')
//   - If !appointment → Throw NotFoundError
// 
// Step 2: Validate ownership (appointment.tutorId === tutorId)
//   - If appointment.tutorId.toString() !== tutorId.toString():
//     → Throw ForbiddenError
// 
// Step 3: Validate status (chỉ confirm được PENDING)
//   - If appointment.status !== 'PENDING':
//     → Throw ConflictError("Appointment không ở trạng thái PENDING")
// 
// Step 4: Update status
//   - appointment.status = 'CONFIRMED'
//   - appointment.confirmedAt = new Date()
//   - await appointment.save()
// 
// Step 5: Gửi notification cho Student
//   - await NotificationService.sendNotification({
//       recipientId: appointment.studentId,
//       type: 'APPOINTMENT_CONFIRMED',
//       title: 'Appointment đã được xác nhận',
//       message: 'Tutor đã xác nhận appointment của bạn'
//     })
// 
// OUTPUT:
// - Return updated appointment

// ============================================================
// FUNCTION: rejectAppointment(appointmentId, tutorId, reason)
// ============================================================
// PURPOSE: Tutor reject appointment (UC-14)
// 
// PSEUDOCODE:
// Step 1-3: Tương tự confirmAppointment (validate)
// 
// Step 4: Update status
//   - appointment.status = 'REJECTED'
//   - appointment.rejectionReason = reason
//   - await appointment.save()
// 
// Step 5: Update session participants (giảm)
//   - await TutorSession.findByIdAndUpdate(
//       appointment.sessionId,
//       {
//         $inc: { currentParticipants: -1 },
//         $pull: { participants: appointment.studentId }
//       }
//     )
// 
// Step 6: Gửi notification
//   - await NotificationService.sendNotification({
//       recipientId: appointment.studentId,
//       type: 'APPOINTMENT_REJECTED',
//       title: 'Appointment bị từ chối',
//       message: `Lý do: ${reason}`
//     })
// 
// OUTPUT:
// - Return updated appointment

// TODO: Import models (Appointment, TutorSession, CourseRegistration, Student)
// TODO: Import NotificationService
// TODO: Import error classes

// TODO: Implement bookAppointment(studentId, sessionId, notes)
// TODO: Implement confirmAppointment(appointmentId, tutorId)
// TODO: Implement rejectAppointment(appointmentId, tutorId, reason)
// TODO: Implement cancelAppointment(appointmentId, userId) - for both Student/Tutor cancel

// TODO: Export all functions
