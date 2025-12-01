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
 * /students/me/appointments:
 *   get:
 *     summary: Get my appointment history (UC-28)
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [SCHEDULED, COMPLETED, CANCELLED]
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
 *         description: List of appointments with pagination
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginationResponse'
 *       403:
 *         description: Only STUDENT role allowed
 */
// GET /api/v1/students/me/appointments - Get my appointment history
router.get(
  '/me/appointments',
  authMiddleware,
  roleMiddleware(['STUDENT']),
  studentController.getMyAppointments
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
