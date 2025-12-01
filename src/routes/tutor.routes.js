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
 * - GET /me/feedbacks      - Get my feedbacks (UC-22)
 */

import express from 'express';
const router = express.Router();
import tutorController from '../controllers/tutor.controller.js';
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
// ROUTE: GET /api/v1/tutors/me/feedbacks
// ============================================================
// PURPOSE: Tutor xem feedbacks received (UC-22)
// ACCESS: Protected - TUTOR or ADMIN only
// QUERY PARAMS: { page?, limit? }
// 
// PSEUDOCODE:
// router.get(
//   '/me/feedbacks',
//   authMiddleware,
//   roleMiddleware(['TUTOR', 'ADMIN']),
//   tutorController.getMyFeedbacks
// )

// ============================================================
// ROUTES IMPLEMENTATION
// ============================================================

/**
 * @swagger
 * /tutors/search:
 *   get:
 *     summary: Search tutors by subject (UC-07)
 *     tags: [Tutors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: subjectId
 *         schema:
 *           type: string
 *         description: Filter by subject identifier
 *         example: CNPM_NC
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [LECTURER, RESEARCH_STUDENT, SENIOR_STUDENT]
 *       - in: query
 *         name: minRating
 *         schema:
 *           type: number
 *           format: float
 *         description: Minimum average rating
 *       - in: query
 *         name: isAcceptingStudents
 *         schema:
 *           type: boolean
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
 *         description: List of tutors with pagination
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginationResponse'
 */
// GET /api/v1/tutors/search - Search tutors (UC-06)
router.get(
  '/search',
  authMiddleware,
  tutorController.searchTutors
);

/**
 * @swagger
 * /tutors/by-hcmut-id/{hcmutId}:
 *   get:
 *     summary: Get tutor by HCMUT ID (staff_id/maCB)
 *     tags: [Tutors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: hcmutId
 *         required: true
 *         schema:
 *           type: string
 *         description: HCMUT staff ID (e.g., "hungnq")
 *     responses:
 *       200:
 *         description: Tutor details
 *       404:
 *         description: Tutor not found
 */
// GET /api/v1/tutors/by-hcmut-id/:hcmutId - Get tutor by HCMUT ID (maCB/staff_id)
router.get(
  '/by-hcmut-id/:hcmutId',
  authMiddleware,
  tutorController.getTutorByHcmutId
);

/**
 * @swagger
 * /tutors/by-hcmut-id/{hcmutId}/availability:
 *   get:
 *     summary: Get tutor availability by HCMUT ID
 *     tags: [Tutors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: hcmutId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tutor availability slots
 *       404:
 *         description: Tutor not found
 */
// GET /api/v1/tutors/by-hcmut-id/:hcmutId/availability - Get tutor availability by HCMUT ID
router.get(
  '/by-hcmut-id/:hcmutId/availability',
  authMiddleware,
  tutorController.getTutorAvailabilityByHcmutId
);

/**
 * @swagger
 * /tutors/me:
 *   get:
 *     summary: Get my tutor profile (UC-20)
 *     tags: [Tutors]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: My tutor profile
 *       403:
 *         description: Only TUTOR/ADMIN allowed
 *       404:
 *         description: Tutor profile not found
 */
// GET /api/v1/tutors/me - Get my tutor profile
router.get(
  '/me',
  authMiddleware,
  roleMiddleware(['TUTOR', 'ADMIN']),
  tutorController.getMyProfile
);

/**
 * @swagger
 * /tutors/me/sessions:
 *   get:
 *     summary: Get my sessions (UC-21)
 *     tags: [Tutors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [SCHEDULED, IN_PROGRESS, COMPLETED, CANCELLED]
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
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
 *         description: List of sessions with pagination
 *       403:
 *         description: Only TUTOR/ADMIN allowed
 */
// GET /api/v1/tutors/me/sessions - Get my sessions
router.get(
  '/me/sessions',
  authMiddleware,
  roleMiddleware(['TUTOR', 'ADMIN']),
  tutorController.getMySessions
);

/**
 * @swagger
 * /tutors/me/feedbacks:
 *   get:
 *     summary: Get feedbacks received (UC-22)
 *     tags: [Tutors]
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
 *         description: Only TUTOR/ADMIN allowed
 */
// GET /api/v1/tutors/me/feedbacks - Get my feedbacks
router.get(
  '/me/feedbacks',
  authMiddleware,
  roleMiddleware(['TUTOR', 'ADMIN']),
  tutorController.getMyFeedbacks
);

/**
 * @swagger
 * /tutors/{tutorId}/availability:
 *   get:
 *     summary: Get tutor availability slots (public view)
 *     tags: [Tutors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tutorId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tutor availability slots
 *       404:
 *         description: Tutor not found
 */
// GET /api/v1/tutors/:tutorId/availability - Get tutor availability (public)
router.get(
  '/:tutorId/availability',
  authMiddleware,
  tutorController.getTutorAvailability
);

export default router;
