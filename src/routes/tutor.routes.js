/**
 * ROUTES: Tutor Routes
 * FILE: tutor.routes.js
 * MỤC ĐÍCH: Định nghĩa API endpoints cho Tutor profile và search
 * 
 * BASE PATH: /api/v1/tutors
 * 
 * ENDPOINTS:
 * - GET /search            - Search tutors by subject (UC-07)
 * - GET /:id               - Get tutor details (public)
 * - GET /me                - Get my profile (UC-20)
 * - GET /me/sessions       - Get my sessions (UC-21)
 * - GET /me/evaluations    - Get my evaluations (UC-22)
 */

import express from 'express';
const router = express.Router();
import * as tutorController from '../controllers/tutor.controller.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { roleMiddleware } from '../middleware/roleMiddleware.js';

// ============================================================
// ROUTE: GET /api/v1/tutors/search
// ============================================================
// PURPOSE: Student search tutors (UC-07)
// ACCESS: Protected - ALL authenticated users
// CONTROLLER: tutorController.searchTutors
// QUERY PARAMS: {
//   subjectId?,
//   type?,
//   minRating?,
//   isAcceptingStudents?,
//   page?,
//   limit?
// }
// 
// PSEUDOCODE:
// router.get(
//   '/search',
//   authMiddleware,
//   tutorController.searchTutors
// )

// ============================================================
// ROUTE: GET /api/v1/tutors/:id
// ============================================================
// PURPOSE: Xem chi tiết tutor profile (public view)
// ACCESS: Protected - ALL authenticated users
// CONTROLLER: tutorController.getTutorDetails
// 
// PSEUDOCODE:
// router.get(
//   '/:id',
//   authMiddleware,
//   tutorController.getTutorDetails
// )

// ============================================================
// ROUTE: GET /api/v1/tutors/me
// ============================================================
// PURPOSE: Tutor xem own profile (UC-20)
// ACCESS: Protected - TUTOR or ADMIN only
// CONTROLLER: tutorController.getMyProfile
// 
// PSEUDOCODE:
// router.get(
//   '/me',
//   authMiddleware,
//   roleMiddleware(['TUTOR', 'ADMIN']),
//   tutorController.getMyProfile
// )

// ============================================================
// ROUTE: GET /api/v1/tutors/me/sessions
// ============================================================
// PURPOSE: Tutor xem own sessions (UC-21)
// ACCESS: Protected - TUTOR or ADMIN only
// QUERY PARAMS: { status?, startDate?, endDate?, page?, limit? }
// 
// PSEUDOCODE:
// router.get(
//   '/me/sessions',
//   authMiddleware,
//   roleMiddleware(['TUTOR', 'ADMIN']),
//   tutorController.getMySessions
// )

// ============================================================
// ROUTE: GET /api/v1/tutors/me/evaluations
// ============================================================
// PURPOSE: Tutor xem evaluations received (UC-22)
// ACCESS: Protected - TUTOR or ADMIN only
// QUERY PARAMS: { page?, limit? }
// 
// PSEUDOCODE:
// router.get(
//   '/me/evaluations',
//   authMiddleware,
//   roleMiddleware(['TUTOR', 'ADMIN']),
//   tutorController.getMyFeedbacks
// )

// ============================================================
// ROUTES IMPLEMENTATION
// ============================================================

// GET /api/v1/tutors/search - Search tutors (UC-06)
router.get(
  '/search',
  authMiddleware,
  tutorController.searchTutors
);

// GET /api/v1/tutors/me - Get my tutor profile
router.get(
  '/me',
  authMiddleware,
  roleMiddleware(['TUTOR', 'ADMIN']),
  tutorController.getMyProfile
);

// GET /api/v1/tutors/me/sessions - Get my sessions
router.get(
  '/me/sessions',
  authMiddleware,
  roleMiddleware(['TUTOR', 'ADMIN']),
  tutorController.getMySessions
);

// GET /api/v1/tutors/me/evaluations - Get my evaluations
router.get(
  '/me/evaluations',
  authMiddleware,
  roleMiddleware(['TUTOR', 'ADMIN']),
  tutorController.getMyEvaluations
);

// GET /api/v1/tutors/:tutorId/availability - Get tutor availability (public)
router.get(
  '/:tutorId/availability',
  authMiddleware,
  tutorController.getTutorAvailability
);

// GET /api/v1/tutors/:id - Get tutor details (UC-06)
// Note: This must be LAST to avoid conflicting with /search, /me routes
router.get(
  '/:id',
  authMiddleware,
  tutorController.getTutorDetails
);

export default router;
