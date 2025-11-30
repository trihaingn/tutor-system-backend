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
// ROUTE: POST /api/v1/record/sessions/:sessionId
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
// ROUTE: GET /api/v1/record/sessions/:sessionId
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

// POST /api/v1/records/sessions/:sessionId - Create session report (UC-21)
router.post(
  '/sessions/:sessionId',
  authMiddleware,
  roleMiddleware(['TUTOR', 'ADMIN']),
  recordController.createSessionReport
);

// GET /api/v1/records/sessions/:sessionId - Get session report (UC-22)
router.get(
  '/sessions/:sessionId',
  authMiddleware,
  recordController.getSessionReport
);

// PUT /api/v1/records/:recordId - Update session report
router.put(
  '/:recordId',
  authMiddleware,
  roleMiddleware(['TUTOR', 'ADMIN']),
  recordController.updateSessionReport
);

export default router;
