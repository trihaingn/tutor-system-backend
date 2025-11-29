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
import * as scheduleController from '../controllers/schedule.controller.js';
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

// POST /api/v1/schedules/availability - Tutor sets availability (UC-10)
router.post(
  '/availability',
  authMiddleware,
  roleMiddleware(['TUTOR', 'ADMIN']),
  scheduleController.setAvailability
);

// GET /api/v1/schedules/availability/me - Get my availability
router.get(
  '/availability/me',
  authMiddleware,
  roleMiddleware(['TUTOR', 'ADMIN']),
  scheduleController.getMyAvailability
);

// PUT /api/v1/schedules/availability/:id - Update availability
router.put(
  '/availability/:id',
  authMiddleware,
  roleMiddleware(['TUTOR', 'ADMIN']),
  scheduleController.updateAvailability
);

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
