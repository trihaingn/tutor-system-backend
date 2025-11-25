/**
 * SERVICE: FeedbackService
 * FILE: FeedbackService.js
 * MỤC ĐÍCH: Xử lý logic tạo session reports/feedback (UC-18)
 * 
 * BUSINESS RULES:
 * - Chỉ tạo report được khi session COMPLETED
 * - 1 session chỉ có 1 report (unique sessionId)
 * - Chỉ Tutor owner mới được tạo/update report
 * 
 * DEPENDENCIES:
 * - Feedback Model, ConsultationSession Model
 */

// ============================================================
// FUNCTION: createSessionReport(reportData)
// ============================================================
// PURPOSE: Tutor tạo session report (UC-18)
// 
// INPUT:
// - reportData: Object {
//     sessionId: ObjectId,
//     tutorId: ObjectId,
//     summary: String,
//     topicsCovered: Array<String>,
//     studentProgress: Array<Object>,
//     nextSteps: Array<String>,
//     attachments: Array<Object>
//   }
// 
// PSEUDOCODE:
// Step 1: Validate session exists và status
//   - const session = await ConsultationSession.findById(reportData.sessionId)
//   - If !session → Throw NotFoundError("Session không tồn tại")
//   - If session.status !== 'COMPLETED':
//     → Throw ForbiddenError("Chỉ có thể tạo report cho session COMPLETED")
// 
// Step 2: Validate ownership
//   - If session.tutorId.toString() !== reportData.tutorId.toString():
//     → Throw ForbiddenError("Bạn không phải chủ session này")
// 
// Step 3: Kiểm tra duplicate report (unique sessionId)
//   - const existingReport = await Feedback.findOne({ sessionId: reportData.sessionId })
//   - If existingReport:
//     → Throw ConflictError("Session này đã có report rồi")
// 
// Step 4: Tạo feedback record
//   - const feedback = await Feedback.create({
//       sessionId: reportData.sessionId,
//       tutorId: reportData.tutorId,
//       summary: reportData.summary,
//       topicsCovered: reportData.topicsCovered,
//       studentProgress: reportData.studentProgress,
//       nextSteps: reportData.nextSteps,
//       attachments: reportData.attachments || []
//     })
// 
// Step 5: Update session hasReport flag
//   - await ConsultationSession.findByIdAndUpdate(
//       reportData.sessionId,
//       { hasReport: true }
//     )
// 
// Step 6: (Optional) Gửi notification cho participants
//   - For each participantId in session.participants:
//     → NotificationService.sendNotification({
//         recipientId: participantId,
//         type: 'SYSTEM_ANNOUNCEMENT',
//         title: 'Báo cáo buổi học đã sẵn sàng',
//         message: 'Tutor đã đăng báo cáo cho buổi học'
//       })
// 
// OUTPUT:
// - Return Feedback object

// ============================================================
// FUNCTION: getSessionReport(sessionId, userId, userRole)
// ============================================================
// PURPOSE: Lấy session report (có access control)
// 
// INPUT:
// - sessionId: ObjectId
// - userId: ObjectId
// - userRole: String (STUDENT, TUTOR, ADMIN)
// 
// PSEUDOCODE:
// Step 1: Tìm session
//   - const session = await ConsultationSession.findById(sessionId)
//   - If !session → Throw NotFoundError
// 
// Step 2: Validate access (AuthorizationService logic)
//   - If userRole === 'ADMIN' → Allow
//   - If userRole === 'TUTOR' AND session.tutorId === userId → Allow
//   - If userRole === 'STUDENT':
//     → Check if userId in session.participants
//     → If not → Throw ForbiddenError("Bạn không tham gia session này")
// 
// Step 3: Tìm report
//   - const report = await Feedback.findOne({ sessionId: sessionId })
//       .populate('tutorId', 'userId fullName')
//       .populate('studentProgress.studentId', 'userId fullName')
//   - If !report → Throw NotFoundError("Session chưa có report")
// 
// OUTPUT:
// - Return Feedback object

// ============================================================
// FUNCTION: updateSessionReport(feedbackId, tutorId, updateData)
// ============================================================
// PURPOSE: Tutor update report
// 
// PSEUDOCODE:
// Step 1: Tìm feedback
//   - const feedback = await Feedback.findById(feedbackId)
//   - If !feedback → Throw NotFoundError
// 
// Step 2: Validate ownership
//   - If feedback.tutorId.toString() !== tutorId.toString():
//     → Throw ForbiddenError
// 
// Step 3: Apply updates
//   - Object.assign(feedback, updateData)
//   - await feedback.save()
// 
// OUTPUT:
// - Return updated Feedback

// TODO: Import Feedback, ConsultationSession models
// TODO: Import NotificationService
// TODO: Import error classes

// TODO: Implement createSessionReport(reportData)
// TODO: Implement getSessionReport(sessionId, userId, userRole)
// TODO: Implement updateSessionReport(feedbackId, tutorId, updateData)

// TODO: Export all functions
