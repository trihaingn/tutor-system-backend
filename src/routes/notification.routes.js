/**
 * ROUTES: Notification Routes
 * FILE: notification.routes.js
 * MỤC ĐÍCH: Định nghĩa API endpoints cho Notifications
 * 
 * BASE PATH: /api/v1/notifications
 * 
 * ENDPOINTS:
 * - GET    /               - Get notifications (UC-13)
 * - PUT    /:id/read       - Mark as read (UC-14)
 * - PUT    /read-all       - Mark all as read
 * - GET    /unread-count   - Get unread count
 */

import express from 'express';
const router = express.Router();
import notificationController from '../controllers/notification.controller.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

// ============================================================
// ROUTE: GET /api/v1/notifications
// ============================================================
// PURPOSE: Lấy danh sách notifications (UC-13)
// ACCESS: Protected - ALL authenticated users
// CONTROLLER: notificationController.getNotifications
// QUERY PARAMS: { isRead?, type?, page?, limit? }
// 
// FILTER OPTIONS:
// - isRead: true (đã đọc) | false (chưa đọc)
// - type: APPOINTMENT_PENDING | APPOINTMENT_CONFIRMED | SESSION_CANCELLED | etc.
// 
// PSEUDOCODE:
// router.get(
//   '/',
//   authMiddleware,
//   notificationController.getNotifications
// )

// ============================================================
// ROUTE: PUT /api/v1/notifications/:id/read
// ============================================================
// PURPOSE: Đánh dấu notification đã đọc (UC-14)
// ACCESS: Protected - ALL authenticated users
// CONTROLLER: notificationController.markAsRead
// 
// VALIDATION:
// - Check notification.recipientId === userId
// - Set isRead=true, readAt=Date.now()
// 
// PSEUDOCODE:
// router.put(
//   '/:id/read',
//   authMiddleware,
//   notificationController.markAsRead
// )

// ============================================================
// ROUTE: PUT /api/v1/notifications/read-all
// ============================================================
// PURPOSE: Đánh dấu tất cả notifications đã đọc
// ACCESS: Protected - ALL authenticated users
// CONTROLLER: notificationController.markAllAsRead
// 
// PSEUDOCODE:
// router.put(
//   '/read-all',
//   authMiddleware,
//   notificationController.markAllAsRead
// )

// ============================================================
// ROUTE: GET /api/v1/notifications/unread-count
// ============================================================
// PURPOSE: Lấy số lượng notifications chưa đọc (hiển thị badge)
// ACCESS: Protected - ALL authenticated users
// CONTROLLER: notificationController.getUnreadCount
// 
// PSEUDOCODE:
// router.get(
//   '/unread-count',
//   authMiddleware,
//   notificationController.getUnreadCount
// )

// ============================================================
// ROUTES IMPLEMENTATION
// ============================================================

/**
 * @swagger
 * /notifications/unread-count:
 *   get:
 *     summary: Get unread notifications count (for badge display)
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Unread count
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
 *                     unreadCount:
 *                       type: integer
 *                       example: 5
 */
// GET /api/v1/notifications/unread-count - Get unread count (must be before /:id)
router.get(
  '/unread-count',
  authMiddleware,
  notificationController.getUnreadCount
);

/**
 * @swagger
 * /notifications:
 *   get:
 *     summary: Get all notifications (UC-13)
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: isRead
 *         schema:
 *           type: boolean
 *         description: Filter by read status
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         description: Filter by notification type
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
 *         description: List of notifications with pagination
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginationResponse'
 */
// GET /api/v1/notifications - Get all notifications (UC-20)
router.get(
  '/',
  authMiddleware,
  notificationController.getNotifications
);

/**
 * @swagger
 * /notifications/read-all:
 *   put:
 *     summary: Mark all notifications as read
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All notifications marked as read
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                   example: "All notifications marked as read"
 *                 data:
 *                   type: object
 *                   properties:
 *                     modifiedCount:
 *                       type: integer
 *                       example: 10
 */
// PUT /api/v1/notifications/read-all - Mark all as read
router.put(
  '/read-all',
  authMiddleware,
  notificationController.markAllAsRead
);

/**
 * @swagger
 * /notifications/{id}/read:
 *   put:
 *     summary: Mark notification as read (UC-14)
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Notification ID
 *     responses:
 *       200:
 *         description: Notification marked as read
 *       403:
 *         description: Not notification owner
 *       404:
 *         description: Notification not found
 */
// PUT /api/v1/notifications/:id/read - Mark as read (UC-20)
router.put(
  '/:id/read',
  authMiddleware,
  notificationController.markAsRead
);

export default router;
