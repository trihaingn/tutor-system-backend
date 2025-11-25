/**
 * SERVICE: UserService
 * FILE: UserService.js
 * MỤC ĐÍCH: Xử lý logic tạo/update User, Student, Tutor records
 * 
 * DEPENDENCIES:
 * - User Model, Student Model, Tutor Model
 */

// ============================================================
// FUNCTION: createOrUpdateUser(userData)
// ============================================================
// PURPOSE: Tạo hoặc update User record (called from AuthService)
// 
// INPUT:
// - userData: Object {
//     email: String (unique),
//     mssv?: String,
//     maCB?: String,
//     fullName: String,
//     faculty: String,
//     role: 'STUDENT' | 'TUTOR' | 'ADMIN',
//     status: 'ACTIVE',
//     lastSyncAt: Date,
//     syncSource: 'DATACORE'
//   }
// 
// PSEUDOCODE:
// Step 1: Tìm User theo email
//   - let user = await User.findOne({ email: userData.email })
// 
// Step 2: Nếu tồn tại → Update
//   - If user:
//     → Object.assign(user, userData)
//     → user.lastSyncAt = new Date()
//     → await user.save()
// 
// Step 3: Nếu chưa tồn tại → Create
//   - Else:
//     → user = await User.create(userData)
// 
// OUTPUT:
// - Return User object

// ============================================================
// FUNCTION: createOrUpdateStudent(userId, studentData)
// ============================================================
// PURPOSE: Tạo hoặc update Student profile
// 
// INPUT:
// - userId: ObjectId
// - studentData: Object {
//     mssv: String,
//     major: String,
//     enrollmentYear: Number,
//     currentYear: Number,
//     gpa?: Number,
//     totalCredits?: Number
//   }
// 
// PSEUDOCODE:
// Step 1: Tìm Student theo userId
//   - let student = await Student.findOne({ userId: userId })
// 
// Step 2: Nếu tồn tại → Update
//   - If student:
//     → Object.assign(student, studentData)
//     → await student.save()
// 
// Step 3: Nếu chưa tồn tại → Create
//   - Else:
//     → student = await Student.create({
//         userId: userId,
//         ...studentData,
//         registeredTutors: 0,
//         totalSessionsAttended: 0,
//         totalAppointments: 0,
//         completedAppointments: 0,
//         cancelledAppointments: 0,
//         averageRatingGiven: 0
//       })
// 
// OUTPUT:
// - Return Student object

// ============================================================
// FUNCTION: createOrUpdateTutor(userId, tutorData)
// ============================================================
// PURPOSE: Tạo hoặc update Tutor profile
// 
// INPUT:
// - userId: ObjectId
// - tutorData: Object {
//     maCB: String,
//     type: 'LECTURER' | 'RESEARCH_STUDENT' | 'SENIOR_STUDENT',
//     expertise: Array<Object>,
//     bio?: String
//   }
// 
// PSEUDOCODE:
// Step 1: Tìm Tutor theo userId
//   - let tutor = await Tutor.findOne({ userId: userId })
// 
// Step 2: Nếu tồn tại → Update
//   - If tutor:
//     → Object.assign(tutor, tutorData)
//     → await tutor.save()
// 
// Step 3: Nếu chưa tồn tại → Create
//   - Else:
//     → tutor = await Tutor.create({
//         userId: userId,
//         ...tutorData,
//         totalStudents: 0,
//         totalSessions: 0,
//         completedSessions: 0,
//         averageRating: 0,
//         totalReviews: 0,
//         isAcceptingStudents: true
//       })
// 
// OUTPUT:
// - Return Tutor object

// ============================================================
// FUNCTION: getUserById(userId)
// ============================================================
// PURPOSE: Lấy User với populated Student/Tutor
// 
// PSEUDOCODE:
// Step 1: Query User
//   - const user = await User.findById(userId)
//   - If !user → Throw NotFoundError("User không tồn tại")
// 
// Step 2: Populate based on role
//   - If user.role === 'STUDENT':
//     → await user.populate('student')
//   - Else if user.role === 'TUTOR' OR user.role === 'ADMIN':
//     → await user.populate('tutor')
// 
// OUTPUT:
// - Return User object (populated)

// TODO: Import User, Student, Tutor models
// TODO: Import error classes (NotFoundError)

// TODO: Implement createOrUpdateUser(userData)
// TODO: Implement createOrUpdateStudent(userId, studentData)
// TODO: Implement createOrUpdateTutor(userId, tutorData)
// TODO: Implement getUserById(userId)

// TODO: Export all functions
