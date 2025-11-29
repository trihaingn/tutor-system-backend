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
import * as studentController from '../controllers/student.controller.js';
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
// ROUTE: GET /api/v1/students/me/evaluations
// ============================================================
// PURPOSE: Student xem evaluations đã cho (UC-29)
// ACCESS: Protected - STUDENT only
// QUERY PARAMS: { page?, limit? }
// 
// PSEUDOCODE:
// router.get(
//   '/me/evaluations',
//   authMiddleware,
//   roleMiddleware(['STUDENT']),
//   studentController.getMyFeedbacks
// )

// ============================================================
// ROUTES IMPLEMENTATION
// ============================================================

// GET /api/v1/students/me - Get my profile
router.get(
  '/me',
  authMiddleware,
  roleMiddleware(['STUDENT']),
  studentController.getMyProfile
);

// GET /api/v1/students/me/appointments - Get my appointment history
router.get(
  '/me/appointments',
  authMiddleware,
  roleMiddleware(['STUDENT']),
  studentController.getMyAppointments
);

// GET /api/v1/students/me/evaluations - Get my evaluation history
router.get(
  '/me/evaluations',
  authMiddleware,
  roleMiddleware(['STUDENT']),
  studentController.getMyEvaluations
);

export default router;
