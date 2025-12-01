/**
 * ROUTES: Record Routes
 * FILE: record.routes.js
 * MỤC ĐÍCH: Định nghĩa API endpoints cho Session Record/Reports
 * 
 * BASE PATH: /api/v1/records
 * 
 * ENDPOINTS:
 * - POST   /sessions/:sessionId  - Tutor creates report (UC-21)
 * - GET    /sessions/:sessionId  - Get session report (UC-22)
 * - PUT    /:recordId          - Update report
 */

import express from 'express';
const router = express.Router();
import recordController from '../controllers/record.controller.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { roleMiddleware } from '../middleware/roleMiddleware.js';

// ============================================================
// ROUTE: POST /api/v1/records/sessions/:sessionId
// ============================================================
// PURPOSE: Tutor tạo session report (UC-18)
// ACCESS: Protected - TUTOR or ADMIN only
// CONTROLLER: recordController.createSessionReport
// 
// REQUEST BODY:
// {
//   "content": "Buổi học diễn ra tốt...",
//   "studentsPresent": ["studentId1", "studentId2"],
//   "studentsAbsent": ["studentId3"]
// }
// 
// VALIDATION:
// - Session must be COMPLETED status
// - tutorId must own session
// - Unique constraint: 1 session = 1 report
// 
// PSEUDOCODE:
// router.post(
//   '/sessions/:sessionId',
//   authMiddleware,
//   roleMiddleware(['TUTOR', 'ADMIN']),
//   recordController.createSessionReport
// )

// ============================================================
// ROUTE: GET /api/v1/records/sessions/:sessionId
// ============================================================
// PURPOSE: Xem session report
// ACCESS: Protected - TUTOR (owner) or participating STUDENTS or ADMIN
// CONTROLLER: recordController.getSessionReport
// 
// ACCESS CONTROL:
// - ADMIN: Always allowed
// - TUTOR: If session.tutorId === userId
// - STUDENT: If studentId in session.participants
// 
// PSEUDOCODE:
// router.get(
//   '/sessions/:sessionId',
//   authMiddleware,
//   recordController.getSessionReport
// )

// ============================================================
// ROUTE: PUT /api/v1/records/:recordId
// ============================================================
// PURPOSE: Tutor update session report
// ACCESS: Protected - TUTOR (owner) or ADMIN
// CONTROLLER: recordController.updateSessionReport
// 
// VALIDATION:
// - Check record.tutorId === userId or ADMIN
// 
// PSEUDOCODE:
// router.put(
//   '/:recordId',
//   authMiddleware,
//   roleMiddleware(['TUTOR', 'ADMIN']),
//   recordController.updateSessionReport
// )

// ============================================================
// ROUTES IMPLEMENTATION
// ============================================================

/**
 * @swagger
 * /records/sessions/{sessionId}:
 *   post:
 *     summary: Tutor creates session report (UC-18)
 *     tags: [Records]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         required: true
 *         schema:
 *           type: string
 *         description: Session ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [summary]
 *             properties:
 *               summary:
 *                 type: string
 *                 example: "Buổi học diễn ra tốt, sinh viên tích cực tham gia"
 *           example:
 *             summary: "Đã hướng dẫn về design patterns. Sinh viên hiểu rõ singleton và factory patterns."
 *     responses:
 *       201:
 *         description: Report created successfully
 *       400:
 *         description: Session not COMPLETED or report already exists
 *       403:
 *         description: Not session owner or not TUTOR/ADMIN
 *       404:
 *         description: Session not found
 */
// POST /api/v1/records/sessions/:sessionId - Create session report (UC-21)
router.post(
  '/sessions/:sessionId',
  authMiddleware,
  roleMiddleware(['TUTOR', 'ADMIN']),
  recordController.createSessionReport
);

/**
 * @swagger
 * /records/sessions/{sessionId}:
 *   get:
 *     summary: Get session report (UC-22)
 *     tags: [Records]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         required: true
 *         schema:
 *           type: string
 *         description: Session ID
 *     responses:
 *       200:
 *         description: Session report details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     sessionId:
 *                       type: string
 *                     tutorId:
 *                       type: object
 *                     summary:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *       403:
 *         description: Not authorized to view this report
 *       404:
 *         description: Report not found
 */
// GET /api/v1/records/sessions/:sessionId - Get session report (UC-22)
router.get(
  '/sessions/:sessionId',
  authMiddleware,
  recordController.getSessionReport
);

/**
 * @swagger
 * /records/{recordId}:
 *   put:
 *     summary: Update session report
 *     tags: [Records]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: recordId
 *         required: true
 *         schema:
 *           type: string
 *         description: Record ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               summary:
 *                 type: string
 *     responses:
 *       200:
 *         description: Report updated successfully
 *       403:
 *         description: Not report owner
 *       404:
 *         description: Report not found
 */
// PUT /api/v1/records/:recordId - Update session report
router.put(
  '/:recordId',
  authMiddleware,
  roleMiddleware(['TUTOR', 'ADMIN']),
  recordController.updateSessionReport
);

export default router;
