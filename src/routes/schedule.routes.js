/**
 * ROUTES: Schedule Routes
 * FILE: schedule.routes.js
 * MỤC ĐÍCH: Định nghĩa API endpoints cho Tutor Availability
 * 
 * BASE PATH: /api/v1/schedules
 * 
 * ENDPOINTS:
 * - POST   /availability       - Tutor sets availability (UC-10)
 * - GET    /availability/me    - Tutor gets own availability
 * - PUT    /availability/:id   - Tutor updates availability
 * - DELETE /availability/:id   - Tutor deletes availability
 */

import express from 'express';
const router = express.Router();
import scheduleController from '../controllers/schedule.controller.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { roleMiddleware } from '../middleware/roleMiddleware.js';

// ============================================================
// ROUTE: POST /api/v1/schedules/availability
// ============================================================
// PURPOSE: Tutor set availability slot (UC-10)
// ACCESS: Protected - TUTOR or ADMIN only
// CONTROLLER: scheduleController.setAvailability
// 
// REQUEST BODY (RECURRING):
// {
//   "type": "RECURRING",
//   "dayOfWeek": 1,
//   "startTime": "09:00",
//   "endTime": "11:00",
//   "maxSlots": 3
// }
// 
// REQUEST BODY (SPECIFIC_DATE):
// {
//   "type": "SPECIFIC_DATE",
//   "specificDate": "2025-01-20",
//   "startTime": "14:00",
//   "endTime": "16:00",
//   "maxSlots": 2
// }
// 
// PSEUDOCODE:
// router.post(
//   '/availability',
//   authMiddleware,
//   roleMiddleware(['TUTOR', 'ADMIN']),
//   scheduleController.setAvailability
// )

// ============================================================
// ROUTE: GET /api/v1/schedules/availability/me
// ============================================================
// PURPOSE: Tutor xem own availability slots
// ACCESS: Protected - TUTOR or ADMIN only
// CONTROLLER: scheduleController.getMyAvailability
// QUERY PARAMS: { type?, isActive? }
// 
// PSEUDOCODE:
// router.get(
//   '/availability/me',
//   authMiddleware,
//   roleMiddleware(['TUTOR', 'ADMIN']),
//   scheduleController.getMyAvailability
// )

// ============================================================
// ROUTE: PUT /api/v1/schedules/availability/:id
// ============================================================
// PURPOSE: Tutor update availability slot
// ACCESS: Protected - TUTOR or ADMIN only
// CONTROLLER: scheduleController.updateAvailability
// 
// PSEUDOCODE:
// router.put(
//   '/availability/:id',
//   authMiddleware,
//   roleMiddleware(['TUTOR', 'ADMIN']),
//   scheduleController.updateAvailability
// )

// ============================================================
// ROUTE: DELETE /api/v1/schedules/availability/:id
// ============================================================
// PURPOSE: Tutor delete availability slot
// ACCESS: Protected - TUTOR or ADMIN only
// CONTROLLER: scheduleController.deleteAvailability
// 
// PSEUDOCODE:
// router.delete(
//   '/availability/:id',
//   authMiddleware,
//   roleMiddleware(['TUTOR', 'ADMIN']),
//   scheduleController.deleteAvailability
// )

// ============================================================
// ROUTES IMPLEMENTATION
// ============================================================

/**
 * @swagger
 * /schedules/availability:
 *   post:
 *     summary: Tutor sets availability slot (UC-10)
 *     tags: [Schedule]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [dayOfWeek, startTime, endTime]
 *             properties:
 *               dayOfWeek:
 *                 type: integer
 *                 minimum: 0
 *                 maximum: 6
 *                 description: Day of week (0=Sunday, 1=Monday, ..., 6=Saturday)
 *                 example: 5
 *               startTime:
 *                 type: string
 *                 pattern: '^([01]\d|2[0-3]):00$'
 *                 description: Start time in HH:00 format (hourly)
 *                 example: "09:00"
 *               endTime:
 *                 type: string
 *                 pattern: '^([01]\d|2[0-3]):00$'
 *                 description: End time in HH:00 format (hourly)
 *                 example: "11:00"
 *           example:
 *             dayOfWeek: 5
 *             startTime: "09:00"
 *             endTime: "11:00"
 *     responses:
 *       201:
 *         description: Availability created successfully
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
 *                     tutorId:
 *                       type: string
 *                     dayOfWeek:
 *                       type: integer
 *                     startTime:
 *                       type: string
 *                     endTime:
 *                       type: string
 *                     isActive:
 *                       type: boolean
 *       400:
 *         description: Validation error (non-hourly times, invalid dayOfWeek)
 *       409:
 *         description: Time slot overlaps with existing availability
 *       403:
 *         description: Only TUTOR/ADMIN allowed
 */
// POST /api/v1/schedules/availability - Tutor sets availability (UC-10)
router.post(
  '/availability',
  authMiddleware,
  roleMiddleware(['TUTOR', 'ADMIN']),
  scheduleController.setAvailability
);

/**
 * @swagger
 * /schedules/availability/me:
 *   get:
 *     summary: Get my availability slots
 *     tags: [Schedule]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [RECURRING, SPECIFIC_DATE]
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: List of availability slots
 *       403:
 *         description: Only TUTOR/ADMIN allowed
 */
// GET /api/v1/schedules/availability/me - Get my availability
router.get(
  '/availability/me',
  authMiddleware,
  roleMiddleware(['TUTOR', 'ADMIN']),
  scheduleController.getMyAvailability
);

/**
 * @swagger
 * /schedules/availability/{id}:
 *   put:
 *     summary: Update availability slot
 *     tags: [Schedule]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               startTime:
 *                 type: string
 *                 pattern: '^([01]\d|2[0-3]):00$'
 *                 example: "10:00"
 *               endTime:
 *                 type: string
 *                 pattern: '^([01]\d|2[0-3]):00$'
 *                 example: "12:00"
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Availability updated
 *       403:
 *         description: Not owner or not TUTOR/ADMIN
 *       404:
 *         description: Availability not found
 *       409:
 *         description: Updated slot overlaps with existing availability
 */
// PUT /api/v1/schedules/availability/:id - Update availability
router.put(
  '/availability/:id',
  authMiddleware,
  roleMiddleware(['TUTOR', 'ADMIN']),
  scheduleController.updateAvailability
);

/**
 * @swagger
 * /schedules/availability/{id}:
 *   delete:
 *     summary: Delete availability slot
 *     tags: [Schedule]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Availability deleted
 *       403:
 *         description: Not owner or not TUTOR/ADMIN
 *       404:
 *         description: Availability not found
 */
// DELETE /api/v1/schedules/availability/:id - Delete availability
router.delete(
  '/availability/:id',
  authMiddleware,
  roleMiddleware(['TUTOR', 'ADMIN']),
  scheduleController.deleteAvailability
);

export default router;
// TODO: Define routes
// TODO: Export router
