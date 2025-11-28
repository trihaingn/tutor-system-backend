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

// TODO: Import express.Router
// TODO: Import registrationController
// TODO: Import authMiddleware, roleMiddleware

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

const express = require('express');
const router = express.Router();
const registrationController = require('../controllers/registration.controller');
const { authMiddleware } = require('../middleware/authMiddleware');
const { roleMiddleware } = require('../middleware/roleMiddleware');

// POST /api/v1/registrations - Register course
router.post(
  '/',
  authMiddleware,
  roleMiddleware(['STUDENT']),
  registrationController.registerCourse
);

// GET /api/v1/registrations/me - Get my registrations
router.get(
  '/me',
  authMiddleware,
  roleMiddleware(['STUDENT']),
  registrationController.getMyRegistrations
);

// DELETE /api/v1/registrations/:id - Cancel registration
router.delete(
  '/:id',
  authMiddleware,
  roleMiddleware(['STUDENT']),
  registrationController.cancelRegistration
);

module.exports = router;
