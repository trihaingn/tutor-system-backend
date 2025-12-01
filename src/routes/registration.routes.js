/**
 * ROUTES: Registration Routes
 * FILE: registration.routes.js
 * MỤC ĐÍCH: Định nghĩa API endpoints cho Course Registration
 * 
 * BASE PATH: /api/v1/registrations
 * 
 * ENDPOINTS:
 * - POST   /              - Student registers with Tutor (UC-08)
 * - GET    /me            - Get my registrations (Student)
 * - DELETE /:id           - Cancel registration
 */

// ============================================================
// ROUTE: POST /api/v1/registrations
// ============================================================
// PURPOSE: Student đăng ký môn học với Tutor (UC-08)
// ACCESS: Protected - STUDENT only
// CONTROLLER: registrationController.registerCourse
// MIDDLEWARE: authMiddleware, roleMiddleware(['STUDENT'])
// 
// REQUEST BODY:
// {
//   "tutorId": "ObjectId",
//   "subjectId": "Math_101"
// }
// 
// PSEUDOCODE:
// router.post(
//   '/',
//   authMiddleware,
//   roleMiddleware(['STUDENT']),
//   registrationController.registerCourse
// )

// ============================================================
// ROUTE: GET /api/v1/registrations/me
// ============================================================
// PURPOSE: Student xem danh sách registrations của mình
// ACCESS: Protected - STUDENT only
// CONTROLLER: registrationController.getMyRegistrations
// QUERY PARAMS: { status?: 'ACTIVE' | 'CANCELLED' }
// 
// PSEUDOCODE:
// router.get(
//   '/me',
//   authMiddleware,
//   roleMiddleware(['STUDENT']),
//   registrationController.getMyRegistrations
// )

// ============================================================
// ROUTE: DELETE /api/v1/registrations/:id
// ============================================================
// PURPOSE: Student hủy registration
// ACCESS: Protected - STUDENT only
// CONTROLLER: registrationController.cancelRegistration
// 
// PSEUDOCODE:
// router.delete(
//   '/:id',
//   authMiddleware,
//   roleMiddleware(['STUDENT']),
//   registrationController.cancelRegistration
// )

import express from 'express';
const router = express.Router();
import registrationController from '../controllers/registration.controller.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { roleMiddleware } from '../middleware/roleMiddleware.js';

/**
 * @swagger
 * /registrations:
 *   post:
 *     summary: Student registers with Tutor for subject (UC-08)
 *     tags: [Registration]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [tutorId, subjectId]
 *             properties:
 *               tutorId:
 *                 type: string
 *                 example: "507f1f77bcf86cd799439011"
 *               subjectId:
 *                 type: string
 *                 example: "CNPM_NC"
 *     responses:
 *       201:
 *         description: Registration created successfully
 *       400:
 *         description: Missing required fields
 *       403:
 *         description: Only STUDENT role allowed
 *       404:
 *         description: Tutor not found
 *       409:
 *         description: Duplicate registration (BR-006)
 */
// POST /api/v1/registrations - Register course
router.post(
  '/',
  authMiddleware,
  roleMiddleware(['STUDENT']),
  registrationController.registerCourse
);

/**
 * @swagger
 * /registrations/me:
 *   get:
 *     summary: Get my course registrations
 *     tags: [Registration]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [ACTIVE, INACTIVE, CANCELLED]
 *       - in: query
 *         name: subjectId
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of registrations
 *       403:
 *         description: Only STUDENT role allowed
 */
// GET /api/v1/registrations/me - Get my registrations
router.get(
  '/me',
  authMiddleware,
  roleMiddleware(['STUDENT']),
  registrationController.getMyRegistrations
);

/**
 * @swagger
 * /registrations/{id}:
 *   delete:
 *     summary: Cancel course registration
 *     tags: [Registration]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Registration ID
 *     responses:
 *       200:
 *         description: Registration cancelled
 *       403:
 *         description: Not registration owner or not STUDENT
 *       404:
 *         description: Registration not found
 */
// DELETE /api/v1/registrations/:id - Cancel registration
router.delete(
  '/:id',
  authMiddleware,
  roleMiddleware(['STUDENT']),
  registrationController.cancelRegistration
);

export default router;
