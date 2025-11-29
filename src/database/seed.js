/**
 * DATABASE: Seed Data
 * FILE: seed.js
 * MỤC ĐÍCH: Nạp dữ liệu mẫu vào database cho development/testing
 * 
 * USE CASES:
 * - Development: Tạo sample data để test UI/features
 * - Testing: Tạo test fixtures
 * - Demo: Tạo data cho demo presentation
 * 
 * USAGE:
 * node src/database/seed.js
 */

// TODO: Import mongoose, models, connectDB
// const { connectDB, disconnectDB } = require('./connection')
// const User = require('../models/User')
// const Student = require('../models/Student')
// const Tutor = require('../models/Tutor')
// const TutorSession = require('../models/TutorSession')
// const CourseRegistration = require('../models/CourseRegistration')

// ============================================================
// SEED DATA DEFINITIONS
// ============================================================
// PURPOSE: Define sample data

// SAMPLE USERS
// const sampleUsers = [
//   {
//     email: 'student1@hcmut.edu.vn',
//     fullName: 'Nguyễn Văn A',
//     role: 'STUDENT',
//     status: 'ACTIVE'
//   },
//   {
//     email: 'tutor1@hcmut.edu.vn',
//     fullName: 'TS. Trần Thị B',
//     role: 'TUTOR',
//     status: 'ACTIVE'
//   },
//   {
//     email: 'admin@hcmut.edu.vn',
//     fullName: 'Admin User',
//     role: 'ADMIN',
//     status: 'ACTIVE'
//   }
// ]

// SAMPLE STUDENTS
// const sampleStudents = [
//   {
//     mssv: '2011234',
//     faculty: 'Computer Science',
//     major: 'Software Engineering',
//     year: 3,
//     statistics: {
//       registeredTutors: 2,
//       totalAppointments: 5,
//       totalFeedbacks: 3
//     }
//   }
// ]

// SAMPLE TUTORS
// const sampleTutors = [
//   {
//     maCB: 'CB001',
//     type: 'LECTURER',
//     faculty: 'Computer Science',
//     position: 'Lecturer',
//     expertise: [
//       {
//         subjectId: 'Math_101',
//         subjectName: 'Calculus I',
//         level: 'ADVANCED'
//       },
//       {
//         subjectId: 'CS_201',
//         subjectName: 'Data Structures',
//         level: 'ADVANCED'
//       }
//     ],
//     isAcceptingStudents: true,
//     statistics: {
//       totalStudents: 15,
//       totalSessions: 20,
//       completedSessions: 18,
//       cancelledSessions: 2,
//       averageRating: 4.5,
//       totalReviews: 12
//     }
//   }
// ]

// SAMPLE SESSIONS
// const sampleSessions = [
//   {
//     title: 'Math 101 - Derivatives',
//     subjectId: 'Math_101',
//     description: 'Review derivatives concepts',
//     startTime: new Date('2025-01-20T09:00:00'),
//     endTime: new Date('2025-01-20T11:00:00'),
//     sessionType: 'ONLINE',
//     meetingLink: 'https://meet.google.com/xxx-xxxx-xxx',
//     maxParticipants: 10,
//     currentParticipants: 3,
//     status: 'SCHEDULED'
//   }
// ]

// ============================================================
// SEED FUNCTIONS
// ============================================================

// FUNCTION: seedUsers
// PSEUDOCODE:
// const seedUsers = async () => {
//   console.log('[SEED] Seeding users...')
//   
//   // Clear existing users
//   await User.deleteMany({})
//   
//   // Insert sample users
//   const users = await User.insertMany(sampleUsers)
//   
//   console.log(`[SEED] Created ${users.length} users`)
//   return users
// }

// FUNCTION: seedStudents
// PSEUDOCODE:
// const seedStudents = async (users) => {
//   console.log('[SEED] Seeding students...')
//   
//   await Student.deleteMany({})
//   
//   // Link students to users
//   const studentUser = users.find(u => u.role === 'STUDENT')
//   
//   const studentsData = sampleStudents.map(s => ({
//     ...s,
//     userId: studentUser._id
//   }))
//   
//   const students = await Student.insertMany(studentsData)
//   
//   console.log(`[SEED] Created ${students.length} students`)
//   return students
// }

// FUNCTION: seedTutors
// PSEUDOCODE:
// const seedTutors = async (users) => {
//   console.log('[SEED] Seeding tutors...')
//   
//   await Tutor.deleteMany({})
//   
//   // Link tutors to users
//   const tutorUser = users.find(u => u.role === 'TUTOR')
//   
//   const tutorsData = sampleTutors.map(t => ({
//     ...t,
//     userId: tutorUser._id
//   }))
//   
//   const tutors = await Tutor.insertMany(tutorsData)
//   
//   console.log(`[SEED] Created ${tutors.length} tutors`)
//   return tutors
// }

// FUNCTION: seedSessions
// PSEUDOCODE:
// const seedSessions = async (tutors) => {
//   console.log('[SEED] Seeding sessions...')
//   
//   await TutorSession.deleteMany({})
//   
//   const sessionsData = sampleSessions.map(s => ({
//     ...s,
//     tutorId: tutors[0]._id
//   }))
//   
//   const sessions = await TutorSession.insertMany(sessionsData)
//   
//   console.log(`[SEED] Created ${sessions.length} sessions`)
//   return sessions
// }

// FUNCTION: seedRegistrations
// PSEUDOCODE:
// const seedRegistrations = async (students, tutors) => {
//   console.log('[SEED] Seeding registrations...')
//   
//   await CourseRegistration.deleteMany({})
//   
//   const registrations = await CourseRegistration.create({
//     studentId: students[0]._id,
//     tutorId: tutors[0]._id,
//     subjectId: 'Math_101',
//     status: 'ACTIVE',
//     approvedBy: 'SYSTEM'
//   })
//   
//   console.log('[SEED] Created registrations')
//   return registrations
// }

// ============================================================
// MAIN SEED FUNCTION
// ============================================================
// PURPOSE: Orchestrate seeding process
// 
// PSEUDOCODE:
// const seedDatabase = async () => {
//   try {
//     console.log('[SEED] Starting database seeding...')
//     
//     // Connect to database
//     await connectDB()
//     
//     // Seed in order (due to dependencies)
//     const users = await seedUsers()
//     const students = await seedStudents(users)
//     const tutors = await seedTutors(users)
//     const sessions = await seedSessions(tutors)
//     await seedRegistrations(students, tutors)
//     
//     console.log('[SEED] Database seeding completed successfully!')
//     
//   } catch (error) {
//     console.error('[SEED] Error seeding database:', error)
//   } finally {
//     // Disconnect
//     await disconnectDB()
//     process.exit(0)
//   }
// }

// ============================================================
// CLEAR DATABASE
// ============================================================
// PURPOSE: Xóa tất cả data (cleanup)
// 
// PSEUDOCODE:
// const clearDatabase = async () => {
//   try {
//     console.log('[SEED] Clearing database...')
//     
//     await connectDB()
//     
//     // Drop all collections
//     await User.deleteMany({})
//     await Student.deleteMany({})
//     await Tutor.deleteMany({})
//     await TutorSession.deleteMany({})
//     await CourseRegistration.deleteMany({})
//     // ... other models
//     
//     console.log('[SEED] Database cleared')
//     
//   } catch (error) {
//     console.error('[SEED] Error clearing database:', error)
//   } finally {
//     await disconnectDB()
//     process.exit(0)
//   }
// }

// ============================================================
// CLI EXECUTION
// ============================================================
// PURPOSE: Run from command line
// 
// PSEUDOCODE:
// if (require.main === module) {
//   const command = process.argv[2]
//   
//   if (command === 'clear') {
//     clearDatabase()
//   } else {
//     seedDatabase()
//   }
// }

// TODO: Export functions
// module.exports = {
//   seedDatabase,
//   clearDatabase
// }
