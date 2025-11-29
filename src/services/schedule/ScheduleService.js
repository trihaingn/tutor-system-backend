/**
 * SERVICE: ScheduleService
 * FILE: ScheduleService.js
 * MỤC ĐÍCH: Xử lý logic tạo và quản lý Consultation Sessions (UC-11, UC-15)
 * 
 * BUSINESS RULES:
 * - BR-001: Thời gian bắt đầu và kết thúc phải là giờ chẵn (00 phút)
 * - BR-002: Thời lượng tối thiểu 60 phút (1 giờ)
 * - BR-003: Session ONLINE phải có meetingLink
 * - BR-004: Session OFFLINE phải có location
 * - BR-008: Tự động gửi notification khi tạo session
 * 
 * DEPENDENCIES:
 * - TutorSession Model
 * - Availability Model
 * - NotificationService
 * - ValidationError, ConflictError
 */

// ============================================================
// FUNCTION: validateSessionTime(startTime, endTime)
// ============================================================
// PURPOSE: Validate thời gian session theo BR-001, BR-002
// 
// INPUT:
// - startTime: Date | String ISO
// - endTime: Date | String ISO
// 
// PSEUDOCODE:
// Step 1: Convert startTime, endTime to Date objects
// Step 2: ⚠️ BR-001 - Kiểm tra giờ chẵn
//   - Extract minutes từ startTime: startTime.getMinutes()
//   - Extract minutes từ endTime: endTime.getMinutes()
//   - If startMinutes !== 0 OR endMinutes !== 0:
//     → Throw ValidationError("Thời gian phải là giờ chẵn (VD: 09:00, 10:00)")
// 
// Step 3: ⚠️ BR-002 - Kiểm tra thời lượng tối thiểu
//   - Calculate duration = (endTime - startTime) / 60000 (minutes)
//   - If duration < 60:
//     → Throw ValidationError("Thời lượng tối thiểu là 60 phút")
// 
// Step 4: Kiểm tra endTime > startTime
//   - If endTime <= startTime:
//     → Throw ValidationError("Thời gian kết thúc phải sau thời gian bắt đầu")
// 
// OUTPUT:
// - Return { isValid: true, duration: Number } nếu pass
// - Throw ValidationError nếu fail

// ============================================================
// FUNCTION: validateSessionType(sessionType, meetingLink, location)
// ============================================================
// PURPOSE: Validate session type theo BR-003, BR-004
// 
// INPUT:
// - sessionType: String ('ONLINE' | 'OFFLINE')
// - meetingLink: String | null
// - location: String | null
// 
// PSEUDOCODE:
// Step 1: ⚠️ BR-003 - Nếu ONLINE, phải có link
//   - If sessionType === 'ONLINE':
//     → If !meetingLink OR meetingLink.trim() === '':
//       → Throw ValidationError("Session ONLINE phải có meetingLink")
// 
// Step 2: ⚠️ BR-004 - Nếu OFFLINE, phải có địa điểm
//   - If sessionType === 'OFFLINE':
//     → If !location OR location.trim() === '':
//       → Throw ValidationError("Session OFFLINE phải có location")
// 
// Step 3: Validate link format (optional)
//   - If meetingLink exists:
//     → Check URL format (regex or URL constructor)
//     → If invalid → Throw ValidationError("meetingLink không hợp lệ")
// 
// OUTPUT:
// - Return { isValid: true } nếu pass
// - Throw ValidationError nếu fail

// ============================================================
// FUNCTION: checkTutorAvailability(tutorId, startTime, endTime)
// ============================================================
// PURPOSE: Kiểm tra Tutor có available trong time slot này không
// 
// INPUT:
// - tutorId: ObjectId
// - startTime: Date
// - endTime: Date
// 
// PSEUDOCODE:
// Step 1: Extract thông tin thời gian
//   - dayOfWeek = startTime.getDay() (0-6, Sunday=0)
//   - startHour = startTime.getHours()
//   - endHour = endTime.getHours()
//   - specificDate = startTime.toISOString().split('T')[0] (YYYY-MM-DD)
// 
// Step 2: Query Availability model
//   - Find availability slots where:
//     {
//       tutorId: tutorId,
//       isActive: true,
//       $or: [
//         // RECURRING slots matching dayOfWeek
//         {
//           type: 'RECURRING',
//           dayOfWeek: dayOfWeek
//         },
//         // SPECIFIC_DATE slots matching exact date
//         {
//           type: 'SPECIFIC_DATE',
//           specificDate: specificDate
//         }
//       ]
//     }
// 
// Step 3: Kiểm tra time range overlap
//   - For each availability slot:
//     → Convert slot.startTime, slot.endTime (String "HH:MM") to hours
//     → Check if [startHour, endHour] overlaps with [slotStartHour, slotEndHour]
//     → Overlap condition: startHour >= slotStartHour AND endHour <= slotEndHour
//   
// Step 4: Return kết quả
//   - If có ít nhất 1 slot overlap → Return { available: true, slot: availabilitySlot }
//   - If không có slot nào → Return { available: false }
// 
// NOTE: Không throw error, chỉ return boolean để caller quyết định

// ============================================================
// FUNCTION: checkSessionConflicts(tutorId, startTime, endTime, excludeSessionId = null)
// ============================================================
// PURPOSE: Kiểm tra có session nào của Tutor bị conflict về thời gian không
// 
// INPUT:
// - tutorId: ObjectId
// - startTime: Date
// - endTime: Date
// - excludeSessionId: ObjectId (optional, dùng khi update session)
// 
// PSEUDOCODE:
// Step 1: Build query để tìm conflicting sessions
//   query = {
//     tutorId: tutorId,
//     status: { $in: ['SCHEDULED', 'IN_PROGRESS'] }, // Bỏ qua COMPLETED, CANCELLED
//     _id: { $ne: excludeSessionId }, // Bỏ qua chính session đang update
//     $or: [
//       // Case 1: New session bắt đầu trong existing session
//       {
//         startTime: { $lte: startTime },
//         endTime: { $gt: startTime }
//       },
//       // Case 2: New session kết thúc trong existing session
//       {
//         startTime: { $lt: endTime },
//         endTime: { $gte: endTime }
//       },
//       // Case 3: New session bao trùm existing session
//       {
//         startTime: { $gte: startTime },
//         endTime: { $lte: endTime }
//       }
//     ]
//   }
// 
// Step 2: Query TutorSession model
//   - const conflictingSessions = await TutorSession.find(query)
// 
// Step 3: Return kết quả
//   - If conflictingSessions.length > 0:
//     → Return { hasConflict: true, conflicts: conflictingSessions }
//   - Else:
//     → Return { hasConflict: false }

// ============================================================
// FUNCTION: createSession(sessionData)
// ============================================================
// PURPOSE: Tạo consultation session mới (UC-11)
// 
// INPUT:
// - sessionData: Object {
//     tutorId: ObjectId,
//     title: String,
//     subjectId: String,
//     description: String,
//     startTime: Date,
//     endTime: Date,
//     sessionType: 'ONLINE' | 'OFFLINE',
//     meetingLink?: String,
//     location?: String,
//     maxParticipants: Number
//   }
// 
// PSEUDOCODE:
// Step 1: Validate thời gian (BR-001, BR-002)
//   - Call validateSessionTime(sessionData.startTime, sessionData.endTime)
//   - If error → Throw ValidationError
// 
// Step 2: Validate session type (BR-003, BR-004)
//   - Call validateSessionType(sessionData.sessionType, sessionData.meetingLink, sessionData.location)
//   - If error → Throw ValidationError
// 
// Step 3: Kiểm tra Tutor availability
//   - const availability = await checkTutorAvailability(
//       sessionData.tutorId,
//       sessionData.startTime,
//       sessionData.endTime
//     )
//   - If !availability.available:
//     → Throw ConflictError("Tutor không có lịch rảnh trong khung giờ này")
// 
// Step 4: Kiểm tra session conflicts
//   - const conflicts = await checkSessionConflicts(
//       sessionData.tutorId,
//       sessionData.startTime,
//       sessionData.endTime
//     )
//   - If conflicts.hasConflict:
//     → Throw ConflictError("Tutor đã có session khác trong khung giờ này")
// 
// Step 5: Validate Tutor exists và active
//   - const tutor = await Tutor.findById(sessionData.tutorId).populate('userId')
//   - If !tutor:
//     → Throw NotFoundError("Tutor không tồn tại")
//   - If tutor.userId.status !== 'ACTIVE':
//     → Throw ForbiddenError("Tutor không hoạt động")
// 
// Step 6: Tạo session record
//   - Calculate duration = (endTime - startTime) / 60000 (minutes)
//   - const newSession = await TutorSession.create({
//       tutorId: sessionData.tutorId,
//       title: sessionData.title,
//       subjectId: sessionData.subjectId,
//       description: sessionData.description,
//       startTime: sessionData.startTime,
//       endTime: sessionData.endTime,
//       duration: duration,
//       sessionType: sessionData.sessionType,
//       meetingLink: sessionData.meetingLink || null,
//       location: sessionData.location || null,
//       maxParticipants: sessionData.maxParticipants,
//       currentParticipants: 0,
//       participants: [],
//       status: 'SCHEDULED',
//       hasReport: false
//     })
// 
// Step 7: ⚠️ BR-008 - Gửi notification đến students đã đăng ký với Tutor
//   - Query CourseRegistration để tìm students đã đăng ký:
//     const registrations = await CourseRegistration.find({
//       tutorId: sessionData.tutorId,
//       status: 'ACTIVE'
//     }).distinct('studentId')
//   
//   - For each studentId:
//     → Call NotificationService.sendNotification({
//         recipientId: studentId,
//         type: 'SESSION_CREATED',
//         title: 'Buổi học mới được tạo',
//         message: `Tutor ${tutor.userId.fullName} đã tạo buổi học mới: ${sessionData.title}`,
//         relatedId: newSession._id,
//         relatedType: 'Session'
//       })
// 
// Step 8: Return created session
//   - await newSession.populate('tutorId', 'userId fullName')
//   - Return newSession
// 
// OUTPUT:
// - Return TutorSession object (populated)

// ============================================================
// FUNCTION: updateSession(sessionId, updateData)
// ============================================================
// PURPOSE: Update session (thay đổi thời gian, địa điểm, etc.)
// 
// INPUT:
// - sessionId: ObjectId
// - updateData: Object (các fields cần update)
// 
// PSEUDOCODE:
// Step 1: Tìm session
//   - const session = await TutorSession.findById(sessionId)
//   - If !session → Throw NotFoundError("Session không tồn tại")
// 
// Step 2: Kiểm tra status (chỉ update được SCHEDULED sessions)
//   - If session.status !== 'SCHEDULED':
//     → Throw ForbiddenError("Chỉ có thể update session đang SCHEDULED")
// 
// Step 3: Nếu update thời gian → Validate lại
//   - If updateData.startTime OR updateData.endTime:
//     → newStartTime = updateData.startTime || session.startTime
//     → newEndTime = updateData.endTime || session.endTime
//     → Call validateSessionTime(newStartTime, newEndTime)
//     → Call checkSessionConflicts(session.tutorId, newStartTime, newEndTime, sessionId)
// 
// Step 4: Nếu update sessionType → Validate lại
//   - If updateData.sessionType:
//     → Call validateSessionType(
//         updateData.sessionType,
//         updateData.meetingLink || session.meetingLink,
//         updateData.location || session.location
//       )
// 
// Step 5: Apply updates
//   - Object.assign(session, updateData)
//   - await session.save()
// 
// Step 6: Gửi notification đến participants (nếu có thay đổi quan trọng)
//   - If có thay đổi về time/location/link:
//     → For each participantId in session.participants:
//       → NotificationService.sendNotification({
//           recipientId: participantId,
//           type: 'SESSION_UPDATED',
//           title: 'Buổi học đã thay đổi',
//           message: 'Thông tin buổi học đã được cập nhật...'
//         })
// 
// OUTPUT:
// - Return updated session

// ============================================================
// FUNCTION: cancelSession(sessionId, tutorId)
// ============================================================
// PURPOSE: Tutor hủy session (UC-15)
// 
// INPUT:
// - sessionId: ObjectId
// - tutorId: ObjectId (for ownership validation)
// 
// PSEUDOCODE:
// Step 1: Tìm session
//   - const session = await TutorSession.findById(sessionId)
//   - If !session → Throw NotFoundError("Session không tồn tại")
// 
// Step 2: Validate ownership
//   - If session.tutorId.toString() !== tutorId.toString():
//     → Throw ForbiddenError("Bạn không phải chủ session này")
// 
// Step 3: Kiểm tra status (chỉ cancel được SCHEDULED sessions)
//   - If session.status !== 'SCHEDULED':
//     → Throw ForbiddenError("Chỉ có thể cancel session đang SCHEDULED")
// 
// Step 4: Update session status
//   - session.status = 'CANCELLED'
//   - await session.save()
// 
// Step 5: ⚠️ BR-008 - Gửi notification đến TẤT CẢ participants
//   - For each participantId in session.participants:
//     → NotificationService.sendNotification({
//         recipientId: participantId,
//         type: 'SESSION_CANCELLED',
//         title: 'Buổi học đã bị hủy',
//         message: `Buổi học "${session.title}" đã bị hủy bởi Tutor`,
//         relatedId: sessionId,
//         relatedType: 'Session'
//       })
// 
// Step 6: (Optional) Update related appointments status
//   - await Appointment.updateMany(
//       { sessionId: sessionId },
//       { status: 'CANCELLED' }
//     )
// 
// OUTPUT:
// - Return { success: true, session: updatedSession }

// TODO: Import models (TutorSession, Availability, Tutor, CourseRegistration, Appointment)
// TODO: Import NotificationService
// TODO: Import error classes (ValidationError, ConflictError, NotFoundError, ForbiddenError)

// TODO: Implement validateSessionTime(startTime, endTime)

// TODO: Implement validateSessionType(sessionType, meetingLink, location)

// TODO: Implement checkTutorAvailability(tutorId, startTime, endTime)

// TODO: Implement checkSessionConflicts(tutorId, startTime, endTime, excludeSessionId)

// TODO: Implement createSession(sessionData)

// TODO: Implement updateSession(sessionId, updateData)

// TODO: Implement cancelSession(sessionId, tutorId)

// TODO: Export all functions
