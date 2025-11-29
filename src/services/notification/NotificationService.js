// REFACTORED: November 29, 2025 - Verified Architecture & Integration
// UC-18: Notification management
// BR-008: Auto-send notifications for important events
// Architecture: Services import Repositories ONLY

import NotificationRepository from '../../repositories/NotificationRepository.js';
import UserRepository from '../../repositories/UserRepository.js';
import { 
  ValidationError, 
  NotFoundError,
  AuthorizationError
} from '../../utils/error.js';

/**
 * Notification types enum
 */
const NOTIFICATION_TYPES = {
  SESSION_REQUEST: 'SESSION_REQUEST',
  SESSION_CONFIRMED: 'SESSION_CONFIRMED',
  SESSION_REJECTED: 'SESSION_REJECTED',
  SESSION_CANCELLED: 'SESSION_CANCELLED',
  SESSION_CREATED: 'SESSION_CREATED',
  NEW_APPOINTMENT: 'NEW_APPOINTMENT',
  APPOINTMENT_CANCELLED: 'APPOINTMENT_CANCELLED',
  SESSION_REPORT_CREATED: 'SESSION_REPORT_CREATED',
  REGISTRATION_APPROVED: 'REGISTRATION_APPROVED',
  FEEDBACK_RECEIVED: 'FEEDBACK_RECEIVED',
  SYSTEM_ANNOUNCEMENT: 'SYSTEM_ANNOUNCEMENT'
};

/**
 * Create notification (BR-008)
 * Main function to send notifications to users
 */
async function create(userId, type, title, message, additionalData = {}) {
  // Step 1: Validate user exists
  const user = await UserRepository.findById(userId);
  if (!user) {
    throw new NotFoundError('User không tồn tại');
  }

  // Step 2: Validate notification type
  if (!Object.values(NOTIFICATION_TYPES).includes(type)) {
    throw new ValidationError(`Invalid notification type: ${type}`);
  }

  // Step 3: Validate required fields
  if (!title || title.trim() === '') {
    throw new ValidationError('Title là bắt buộc');
  }

  if (!message || message.trim() === '') {
    throw new ValidationError('Message là bắt buộc');
  }

  // Step 4: Create notification record
  const notification = await NotificationRepository.create({
    recipientId: userId,
    type: type,
    title: title,
    message: message,
    relatedId: additionalData.relatedId || null,
    relatedType: additionalData.relatedType || null,
    isRead: false,
    readAt: null,
    createdAt: new Date()
  });

  // Step 5: (Optional) Push real-time notification via Socket.io
  // if (global.io) {
  //   global.io.to(userId.toString()).emit('new-notification', notification);
  // }

  // Step 6: (Optional) Send email notification if user has email preferences enabled
  // if (user.emailNotifications && user.email) {
  //   await EmailService.sendNotificationEmail(user.email, title, message);
  // }

  return notification;
}

/**
 * Bulk create notifications (for multiple users)
 */
async function createBulk(userIds, type, title, message, additionalData = {}) {
  const notifications = [];

  for (const userId of userIds) {
    try {
      const notification = await create(userId, type, title, message, additionalData);
      notifications.push(notification);
    } catch (error) {
      // Log error but continue with other users
      console.error(`Failed to create notification for user ${userId}:`, error.message);
    }
  }

  return {
    success: notifications.length,
    failed: userIds.length - notifications.length,
    notifications: notifications
  };
}

/**
 * Mark notification as read
 */
async function markAsRead(userId, notificationId) {
  // Step 1: Find notification
  const notification = await NotificationRepository.findById(notificationId);
  if (!notification) {
    throw new NotFoundError('Notification không tồn tại');
  }

  // Step 2: Validate ownership
  if (notification.recipientId.toString() !== userId.toString()) {
    throw new AuthorizationError('Bạn không phải chủ notification này');
  }

  // Step 3: Update if not already read
  if (!notification.isRead) {
    await NotificationRepository.update(notificationId, {
      isRead: true,
      readAt: new Date()
    });
  }

  return { success: true };
}

/**
 * Mark all notifications as read for a user
 */
async function markAllAsRead(userId) {
  const query = {
    recipientId: userId,
    isRead: false
  };

  const unreadNotifications = await NotificationRepository.findAll(query);

  for (const notification of unreadNotifications) {
    await NotificationRepository.update(notification._id, {
      isRead: true,
      readAt: new Date()
    });
  }

  return {
    success: true,
    markedCount: unreadNotifications.length
  };
}

/**
 * Get notifications for a user
 */
async function getByUser(userId, filters = {}) {
  const query = { recipientId: userId };

  // Filter by read status
  if (filters.isRead !== undefined) {
    query.isRead = filters.isRead;
  }

  // Filter by type
  if (filters.type) {
    query.type = filters.type;
  }

  // Filter by date range
  if (filters.startDate || filters.endDate) {
    query.createdAt = {};
    if (filters.startDate) {
      query.createdAt.$gte = filters.startDate;
    }
    if (filters.endDate) {
      query.createdAt.$lte = filters.endDate;
    }
  }

  const options = {
    sort: { createdAt: -1 },
    limit: filters.limit || 50
  };

  const notifications = await NotificationRepository.findAll(query, options);
  return notifications;
}

/**
 * Get unread count for a user
 */
async function getUnreadCount(userId) {
  const query = {
    recipientId: userId,
    isRead: false
  };

  const notifications = await NotificationRepository.findAll(query);
  return { count: notifications.length };
}

/**
 * Delete notification
 */
async function deleteNotification(userId, notificationId) {
  // Step 1: Find notification
  const notification = await NotificationRepository.findById(notificationId);
  if (!notification) {
    throw new NotFoundError('Notification không tồn tại');
  }

  // Step 2: Validate ownership
  if (notification.recipientId.toString() !== userId.toString()) {
    throw new AuthorizationError('Bạn không phải chủ notification này');
  }

  // Step 3: Delete
  await NotificationRepository.delete(notificationId);

  return { success: true };
}

/**
 * Delete all notifications for a user
 */
async function deleteAllByUser(userId) {
  const query = { recipientId: userId };
  const notifications = await NotificationRepository.findAll(query);

  for (const notification of notifications) {
    await NotificationRepository.delete(notification._id);
  }

  return {
    success: true,
    deletedCount: notifications.length
  };
}

export {
  NOTIFICATION_TYPES,
  create,
  createBulk,
  markAsRead,
  markAllAsRead,
  getByUser,
  getUnreadCount,
  deleteNotification,
  deleteAllByUser
};
