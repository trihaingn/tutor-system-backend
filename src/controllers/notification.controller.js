/**
 * CONTROLLER: NotificationController
 * FILE: notification.controller.js
 * MỤC ĐÍCH: Xử lý HTTP requests liên quan đến Notifications (UC-13, UC-14)
 * 
 * USE CASES:
 * - UC-13: User views notifications
 * - UC-14: User marks notification as read
 * 
 * DEPENDENCIES:
 * - NotificationService: Handle notification queries and updates
 * - NotFoundError
 */

// ============================================================
// FUNCTION: getMyNotifications()
// ============================================================
// METHOD: GET /api/v1/notifications
// PURPOSE: User xem danh sách notifications (UC-13)
// 
// REQUEST:
// - Query: {
//     isRead?: true | false,
//     type?: 'APPOINTMENT_CREATED' | 'SESSION_CREATED' | ...,
//     page?: 1,
//     limit?: 20
//   }
// - Headers: { Authorization: 'Bearer <JWT>' }
// 
// PROCESS:
// 1. Extract userId from JWT (req.user.userId)
// 2. Query Notification model:
//    - recipientId === userId
//    - Filter by isRead if provided
//    - Filter by type if provided
// 3. Sort by createdAt DESC (newest first)
// 4. Return with pagination
// 
// RESPONSE:
// {
//   "success": true,
//   "data": [
//     {
//       "notificationId": "...",
//       "type": "APPOINTMENT_CONFIRMED",
//       "title": "Appointment Confirmed",
//       "message": "Your appointment for Math 101 has been confirmed",
//       "relatedId": "sessionId or appointmentId",
//       "relatedType": "Appointment",
//       "isRead": false,
//       "createdAt": "2025-01-15T10:00:00Z"
//     }
//   ],
//   "pagination": {...}
// }

// ============================================================
// FUNCTION: markAsRead()
// ============================================================
// METHOD: PUT /api/v1/notifications/:id/read
// PURPOSE: User đánh dấu notification là đã đọc (UC-14)
// 
// REQUEST:
// - Params: { id: notificationId }
// - Headers: { Authorization: 'Bearer <JWT>' }
// 
// VALIDATION:
// - ⚠️ Validate ownership: notification.recipientId === userId
// 
// PROCESS:
// 1. Extract userId from JWT
// 2. Find notification by id
// 3. Validate ownership
// 4. Update isRead = true, readAt = Date.now()
// 5. Return updated notification
// 
// RESPONSE:
// {
//   "success": true,
//   "data": {
//     "notificationId": "...",
//     "isRead": true,
//     "readAt": "2025-01-15T10:05:00Z"
//   }
// }
// 
// ERROR HANDLING:
// - Notification not found → 404 NotFoundError
// - Not owned by user → 403 ForbiddenError

// ============================================================
// FUNCTION: markAllAsRead()
// ============================================================
// METHOD: PUT /api/v1/notifications/read-all
// PURPOSE: User đánh dấu tất cả notifications là đã đọc
// 
// REQUEST:
// - Headers: { Authorization: 'Bearer <JWT>' }
// 
// PROCESS:
// 1. Extract userId from JWT
// 2. Update all notifications where:
//    - recipientId === userId
//    - isRead === false
// 3. Set isRead = true, readAt = Date.now()
// 4. Return count of updated notifications
// 
// RESPONSE:
// {
//   "success": true,
//   "message": "All notifications marked as read",
//   "count": 15
// }

// ============================================================
// FUNCTION: getUnreadCount()
// ============================================================
// METHOD: GET /api/v1/notifications/unread-count
// PURPOSE: User xem số lượng notifications chưa đọc (for badge)
// 
// REQUEST:
// - Headers: { Authorization: 'Bearer <JWT>' }
// 
// PROCESS:
// 1. Extract userId from JWT
// 2. Count Notification where:
//    - recipientId === userId
//    - isRead === false
// 3. Return count
// 
// RESPONSE:
// {
//   "success": true,
//   "data": {
//     "unreadCount": 5
//   }
// }

// TODO: Import dependencies (NotificationService, error classes)

// TODO: Implement getMyNotifications() - GET /api/v1/notifications
// - Filter by isRead, type
// - Sort by createdAt DESC
// - Return with pagination

// TODO: Implement markAsRead() - PUT /api/v1/notifications/:id/read
// - Validate ownership
// - Update isRead + readAt

// TODO: Implement markAllAsRead() - PUT /api/v1/notifications/read-all
// - Update all unread notifications for user
// - Return count

// TODO: Implement getUnreadCount() - GET /api/v1/notifications/unread-count
// - Count unread notifications
// - Return count for badge

import { asyncHandler, NotFoundError } from '../middleware/errorMiddleware.js';

class NotificationController {
  /**
   * GET /api/v1/notifications
   * Get user notifications (UC-13)
   */
  getNotifications = asyncHandler(async (req, res) => {
    const userId = req.userId;
    const Notification = (await import('../models/Notification.model.js')).default;

    // Parse query params
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Build filter
    const filter = { recipientId: userId };
    
    if (req.query.isRead !== undefined) {
      filter.isRead = req.query.isRead === 'true';
    }
    
    if (req.query.type) {
      filter.type = req.query.type;
    }

    // Query notifications
    const [notifications, total] = await Promise.all([
      Notification.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Notification.countDocuments(filter)
    ]);

    res.status(200).json({
      success: true,
      data: notifications,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  });

  /**
   * PUT /api/v1/notifications/:notificationId/read
   * Mark notification as read (UC-14)
   */
  markAsRead = asyncHandler(async (req, res) => {
    const userId = req.userId;
    const { notificationId } = req.params;
    const { ForbiddenError } = await import('../middleware/errorMiddleware.js');
    const Notification = (await import('../models/Notification.model.js')).default;

    // Find notification
    const notification = await Notification.findById(notificationId);

    if (!notification) {
      throw new NotFoundError('Notification not found');
    }

    // Validate ownership
    if (notification.recipientId.toString() !== userId.toString()) {
      throw new ForbiddenError('You can only mark your own notifications as read');
    }

    // Update
    notification.isRead = true;
    notification.readAt = new Date();
    await notification.save();

    res.status(200).json({
      success: true,
      data: {
        notificationId: notification._id,
        isRead: notification.isRead,
        readAt: notification.readAt
      }
    });
  });

  /**
   * PUT /api/v1/notifications/read-all
   * Mark all notifications as read
   */
  markAllAsRead = asyncHandler(async (req, res) => {
    const userId = req.userId;
    const Notification = (await import('../models/Notification.model.js')).default;

    // Update all unread notifications
    const result = await Notification.updateMany(
      { recipientId: userId, isRead: false },
      { $set: { isRead: true, readAt: new Date() } }
    );

    res.status(200).json({
      success: true,
      message: 'All notifications marked as read',
      count: result.modifiedCount
    });
  });

  /**
   * GET /api/v1/notifications/unread-count
   * Get unread notification count
   */
  getUnreadCount = asyncHandler(async (req, res) => {
    const userId = req.userId;
    const Notification = (await import('../models/Notification.model.js')).default;

    const unreadCount = await Notification.countDocuments({
      recipientId: userId,
      isRead: false
    });

    res.status(200).json({
      success: true,
      data: {
        unreadCount
      }
    });
  });
}

export default new NotificationController();
