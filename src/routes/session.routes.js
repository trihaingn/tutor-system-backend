/**
 * ROUTES: Session Routes
 * FILE: session.routes.js
 * MỤC ĐÍCH: Định nghĩa API endpoints cho Consultation Sessions
 * 
 * BASE PATH: /api/v1/sessions
 * 
 * ENDPOINTS:
 * - POST   /                      - Tutor creates session (UC-11)
 * - GET    /upcoming              - Get upcoming sessions (UC-16, UC-17)
 * - DELETE /:id                   - Tutor cancels session (UC-15)
 * - POST   /:sessionId/appointments - Student books appointment (UC-12)
 */

import express from 'express';
const router = express.Router();
import sessionController from '../controllers/session.controller.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { roleMiddleware } from '../middleware/roleMiddleware.js';

// ============================================================
// ROUTE: POST /api/v1/sessions
// ============================================================
// PURPOSE: Tutor tạo consultation session (UC-11)
// ACCESS: Protected - TUTOR or ADMIN only
// CONTROLLER: sessionController.createSession
// MIDDLEWARE: authMiddleware, roleMiddleware(['TUTOR', 'ADMIN'])
// 
// REQUEST BODY:
// {
//   "title": "Math 101 - Derivatives",
//   "subjectId": "Math_101",
//   "description": "Advanced calculus concepts",
//   "startTime": "2025-01-20T09:00:00Z",
//   "endTime": "2025-01-20T11:00:00Z",
//   "sessionType": "ONLINE",
//   "location": "https://meet.google.com/xxx"
// }
// 
// VALIDATION:
// - BR-001: startTime, endTime must be hourly
// - BR-002: Duration >= 60 minutes
// - BR-003: ONLINE needs meetingLink
// - BR-004: OFFLINE needs location
// 
// PSEUDOCODE:
// router.post(
//   '/',
//   authMiddleware,
//   roleMiddleware(['TUTOR', 'ADMIN']),
//   sessionController.createSession
// )

// ============================================================
// ROUTE: GET /api/v1/sessions/upcoming
// ============================================================
// PURPOSE: Get upcoming sessions (Student/Tutor view)
// ACCESS: Protected - ALL authenticated users
// CONTROLLER: sessionController.getUpcomingSessions
// QUERY PARAMS: { role?: 'student' | 'tutor', startDate?, endDate? }
// 
// PSEUDOCODE:
// router.get(
//   '/upcoming',
//   authMiddleware,
//   sessionController.getUpcomingSessions
// )

// ============================================================
// ROUTE: DELETE /api/v1/sessions/:id
// ============================================================
// PURPOSE: Tutor cancels session (UC-15)
// ACCESS: Protected - TUTOR or ADMIN only
// CONTROLLER: sessionController.cancelSession
// 
// PSEUDOCODE:
// router.delete(
//   '/:id',
//   authMiddleware,
//   roleMiddleware(['TUTOR', 'ADMIN']),
//   sessionController.cancelSession
// )

// ============================================================
// ROUTE: POST /api/v1/sessions/:sessionId/appointments
// ============================================================
// PURPOSE: Student book appointment (UC-12)
// ACCESS: Protected - STUDENT only
// CONTROLLER: sessionController.bookAppointment
// 
// REQUEST BODY:
// {
//   "notes": "Optional notes"
// }
// 
// PSEUDOCODE:
// router.post(
//   '/:sessionId/appointments',
//   authMiddleware,
//   roleMiddleware(['STUDENT']),
//   sessionController.bookAppointment
// )

// ============================================================
// ROUTES IMPLEMENTATION
// ============================================================

/**
 * @swagger
 * /sessions:
 *   post:
 *     summary: Tutor creates a new available session slot (UC-10)
 *     tags: [Sessions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateSessionRequest'
 *           example:
 *             title: "Hướng dẫn Công nghệ phần mềm"
 *             subjectId: "CNPM_NC"
 *             description: "Tư vấn về design patterns và testing"
 *             startTime: "2024-01-15T14:00:00Z"
 *             endTime: "2024-01-15T16:00:00Z"
 *             sessionType: "OFFLINE"
 *             location: "H6-201"
 *     responses:
 *       201:
 *         description: Session created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/TutorSession'
 *       400:
 *         description: Validation error (BR-001, BR-002, BR-003, BR-004)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: Time slot conflict with existing session
 *       401:
 *         description: Unauthorized - Invalid or missing JWT token
 *       403:
 *         description: Forbidden - Only TUTOR or ADMIN roles allowed
 */
// POST /api/v1/sessions - Tutor creates session (UC-11)
router.post(
  '/',
  authMiddleware,
  roleMiddleware(['TUTOR', 'ADMIN']),
  sessionController.createSession
);

/**
 * @swagger
 * /sessions/upcoming:
 *   get:
 *     summary: Get upcoming sessions (Student/Tutor view)
 *     tags: [Sessions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Filter sessions from this date (default now)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Filter sessions until this date (default now + 30 days)
 *     responses:
 *       200:
 *         description: List of upcoming sessions
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
 *       401:
 *         description: Unauthorized
 */
// GET /api/v1/sessions/upcoming - Get upcoming sessions (UC-16, UC-17)
router.get(
  '/upcoming',
  authMiddleware,
  sessionController.getUpcomingSessions
);

/**
 * @swagger
 * /sessions/{id}:
 *   delete:
 *     summary: Tutor cancels session (UC-15)
 *     tags: [Sessions]
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
 *         description: Session cancelled successfully
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
 *                   example: "Session cancelled successfully"
 *       404:
 *         description: Session not found
 *       403:
 *         description: Forbidden - Not session owner or not TUTOR/ADMIN role
 */
// DELETE /api/v1/sessions/:id - Tutor cancels session (UC-14)
router.delete(
  '/:id',
  authMiddleware,
  roleMiddleware(['TUTOR', 'ADMIN']),
  sessionController.cancelSession
);

export default router;
