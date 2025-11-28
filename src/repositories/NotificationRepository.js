import BaseRepository from './BaseRepository.js';
import Notification from '../models/Notification.model.js';

class NotificationRepository extends BaseRepository {
  constructor() {
    super(Notification);
  }

  async findByRecipient(recipientId, options = {}) {
    return await this.findAll(
      { recipientId },
      {
        ...options,
        sort: { createdAt: -1, ...options.sort }
      }
    );
  }

  async findUnreadByRecipient(recipientId, options = {}) {
    return await this.findAll(
      { recipientId, isRead: false },
      {
        ...options,
        sort: { createdAt: -1, ...options.sort }
      }
    );
  }

  async findByType(recipientId, type, options = {}) {
    return await this.findAll(
      { recipientId, type },
      {
        ...options,
        sort: { createdAt: -1, ...options.sort }
      }
    );
  }

  async markAsRead(notificationId) {
    return await this.update(notificationId, {
      isRead: true,
      readAt: new Date()
    });
  }

  async markAllAsRead(recipientId) {
    const notifications = await this.findAll({ recipientId, isRead: false });
    const updatePromises = notifications.map(notif =>
      this.markAsRead(notif._id)
    );
    return await Promise.all(updatePromises);
  }

  async countUnread(recipientId) {
    return await this.count({ recipientId, isRead: false });
  }

  async findByRelated(recipientId, relatedType, relatedId, options = {}) {
    return await this.findAll(
      { recipientId, relatedType, relatedId },
      options
    );
  }

  async deleteOldNotifications(daysOld = 30) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    return await this.deleteMany({
      createdAt: { $lt: cutoffDate },
      isRead: true
    });
  }
}

export default new NotificationRepository();
