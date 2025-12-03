/**
 * ROUTES: Student Routes
 * FILE: student.routes.js
 * MỤC ĐÍCH: Định nghĩa API endpoints cho Student profile
 * 
 * BASE PATH: /api/v1/students
 * 
 * ENDPOINTS:
 * - GET /me                - Get my profile (UC-06)
 * - GET /me/appointments   - Get my appointment history (UC-28)
 * - GET /me/feedbacks    - Get my feedback history (UC-29)
 */

import express from 'express';
const router = express.Router();
import studentController from '../controllers/student.controller.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { roleMiddleware } from '../middleware/roleMiddleware.js';

// ============================================================
// ROUTE: GET /api/v1/students/me
// ============================================================
// PURPOSE: Student xem own profile (UC-06)
// ACCESS: Protected - STUDENT only
// CONTROLLER: studentController.getMyProfile
// 
// PSEUDOCODE:
// router.get(
//   '/me',
//   authMiddleware,
//   roleMiddleware(['STUDENT']),
//   studentController.getMyProfile
// )

// ============================================================
// ROUTE: GET /api/v1/students/me/appointments
// ============================================================
// PURPOSE: Student xem lịch sử appointments (UC-28)
// ACCESS: Protected - STUDENT only
// QUERY PARAMS: { status?, page?, limit? }
// 
// PSEUDOCODE:
// router.get(
//   '/me/appointments',
//   authMiddleware,
//   roleMiddleware(['STUDENT']),
//   studentController.getMyAppointments
// )

// ============================================================
// ROUTE: GET /api/v1/students/me/feedbacks
// ============================================================
// PURPOSE: Student xem feedbacks đã cho (UC-29)
// ACCESS: Protected - STUDENT only
// QUERY PARAMS: { page?, limit? }
// 
// PSEUDOCODE:
// router.get(
//   '/me/feedbacks',
//   authMiddleware,
//   roleMiddleware(['STUDENT']),
//   studentController.getMyFeedbacks
// )

// ============================================================
// ROUTES IMPLEMENTATION
// ============================================================

/**
 * @swagger
 * /students/me:
 *   get:
 *     summary: Get my student profile (UC-06)
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Student profile details
 *       403:
 *         description: Only STUDENT role allowed
 */
// GET /api/v1/students/me - Get my profile
router.get(
  '/me',
  authMiddleware,
  roleMiddleware(['STUDENT']),
  studentController.getMyProfile
);

/**
 * @swagger
 * /students/me/sessions:
 *   get:
 *     summary: Get my booked sessions (UC-STUDENT-LIST)
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [SCHEDULED, IN_PROGRESS, COMPLETED, CANCELLED]
 *         description: Filter by session status
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: List of booked sessions with pagination
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/TutorSession'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 *       403:
 *         description: Only STUDENT role allowed
 */
// GET /api/v1/students/me/sessions - Get my booked sessions
router.get(
  '/me/sessions',
  authMiddleware,
  roleMiddleware(['STUDENT']),
  studentController.getMySessions
);

/**
 * @swagger
 * /students/sessions/book:
 *   post:
 *     summary: Book a session (UC-STUDENT-BOOK)
 *     description: |
 *       Student books a session with a tutor.
 *       
 *       **Business Rules:**
 *       - BR-BOOK-001: Student must be registered with tutor for the subject
 *       - BR-BOOK-002: Tutor must have availability at requested time
 *       - BR-BOOK-004: No duplicate bookings allowed
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - sessionId
 *             properties:
 *               sessionId:
 *                 type: string
 *                 example: "6474a1b23c4d5e6f7a8b9c0d"
 *                 description: ID of the session to book
 *     responses:
 *       201:
 *         description: Session booked successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Đặt lịch session thành công"
 *                 data:
 *                   type: object
 *                   properties:
 *                     sessionId:
 *                       type: string
 *                     title:
 *                       type: string
 *                     subjectId:
 *                       type: string
 *                     startTime:
 *                       type: string
 *                       format: date-time
 *                     endTime:
 *                       type: string
 *                       format: date-time
 *                     location:
 *                       type: string
 *                     sessionType:
 *                       type: string
 *                       enum: [ONLINE, OFFLINE]
 *                     status:
 *                       type: string
 *                     bookedAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Bad Request - Missing sessionId
 *       403:
 *         description: Forbidden - Not registered with tutor (BR-BOOK-001)
 *       404:
 *         description: Session or Student not found
 *       409:
 *         description: Conflict - Already booked or no availability
 */
// POST /api/v1/students/sessions/book - Book a session
router.post(
  '/sessions/book',
  authMiddleware,
  roleMiddleware(['STUDENT']),
  studentController.bookSession
);

/**
 * @swagger
 * /students/tutors/{tutorId}/sessions:
 *   get:
 *     summary: Get all sessions created by a tutor
 *     description: |
 *       Browse all sessions that a specific tutor has created.
 *       Useful for students to see what sessions are available before booking.
 *       
 *       By default, only returns SCHEDULED sessions (bookable).
 *       Use status parameter to see other session types.
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tutorId
 *         required: true
 *         schema:
 *           type: string
 *         description: Tutor document ID
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [SCHEDULED, IN_PROGRESS, COMPLETED, CANCELLED]
 *         description: Filter by session status (default SCHEDULED)
 *       - in: query
 *         name: subjectId
 *         schema:
 *           type: string
 *         description: Filter by subject
 *         example: "CNPM"
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Filter sessions from this date
 *         example: "2025-12-01T00:00:00Z"
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Filter sessions until this date
 *         example: "2025-12-31T23:59:59Z"
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: List of tutor's sessions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       title:
 *                         type: string
 *                       subjectId:
 *                         type: string
 *                       startTime:
 *                         type: string
 *                         format: date-time
 *                       endTime:
 *                         type: string
 *                         format: date-time
 *                       location:
 *                         type: string
 *                       sessionType:
 *                         type: string
 *                       status:
 *                         type: string
 *                       participants:
 *                         type: array
 *                       availableSlots:
 *                         type: number
 *                         description: Number of available booking slots
 *                       isFull:
 *                         type: boolean
 *                         description: Whether session is full
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 *                 tutor:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     bio:
 *                       type: string
 *                     subjectIds:
 *                       type: array
 *                       items:
 *                         type: string
 *                     stats:
 *                       type: object
 *       404:
 *         description: Tutor not found
 */
// GET /api/v1/students/tutors/:tutorId/sessions - Browse tutor's sessions
router.get(
  '/tutors/:tutorId/sessions',
  authMiddleware,
  roleMiddleware(['STUDENT']),
  studentController.getTutorSessions
);

/**
 * @swagger
 * /students/sessions/{id}/book:
 *   delete:
 *     summary: Cancel session booking (UC-STUDENT-CANCEL)
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Session ID
 *     responses:
 *       200:
 *         description: Booking cancelled successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Đã hủy đặt lịch session thành công"
 *                 sessionId:
 *                   type: string
 *       404:
 *         description: Session not found or not booked
 *       409:
 *         description: Cannot cancel - Session in progress or completed
 */
// DELETE /api/v1/students/sessions/:id/book - Cancel booking
router.delete(
  '/sessions/:id/book',
  authMiddleware,
  roleMiddleware(['STUDENT']),
  studentController.cancelBooking
);

/**
 * @swagger
 * /students/me/feedbacks:
 *   get:
 *     summary: Get my feedback history (UC-29)
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: List of feedbacks with pagination
 *       403:
 *         description: Only STUDENT role allowed
 */
// GET /api/v1/students/me/feedbacks - Get my feedback history
router.get(
  '/me/feedbacks',
  authMiddleware,
  roleMiddleware(['STUDENT']),
  studentController.getMyFeedbacks
);

export default router;
