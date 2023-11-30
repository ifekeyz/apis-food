const Notification = require('../models/notification');

async function createNotification(message) {
  try {
    const notification = new Notification({ message });
    await notification.save();
    return notification;
  } catch (error) {
    throw error;
  }
}

async function getNotifications() {
    try {
      // Fetch notifications from the database
      const notifications = await Notification.find().sort({ timestamp: -1 });
  
      // Group notifications by date
      const groupedNotifications = groupNotificationsByDate(notifications);
  
      return groupedNotifications;
    } catch (error) {
      throw error;
    }
}
  
function groupNotificationsByDate(notifications) {
    const grouped = {};
    const now = new Date();

    notifications.forEach(notification => {
        const date = notification.timestamp;
        const dateKey = getDateKey(date, now);

        if (!grouped[dateKey]) {
        grouped[dateKey] = [];
        }

        // Calculate time since creation for today's notifications
        const timeAgo = isSameDay(date, now) ? getTimeAgo(date) : null;

        grouped[dateKey].push({ message: notification.message, timeAgo });
    });

    return grouped;
}

function getDateKey(date, now) {
    if (isSameDay(date, now)) {
        return 'Today';
    } else if (isYesterday(date, now)) {
        return 'Yesterday';
    } else {
        return date.toDateString();
    }
}

function isSameDay(date1, date2) {
    return date1.getDate() === date2.getDate() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getFullYear() === date2.getFullYear();
}

function isYesterday(date, now) {
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    return isSameDay(date, yesterday);
}

function getTimeAgo(timestamp) {
    const now = new Date();
    const diffInMilliseconds = now - timestamp;

    if (diffInMilliseconds < 60000) {
        return `${Math.floor(diffInMilliseconds / 1000)} seconds ago`;
    } else if (diffInMilliseconds < 3600000) {
        return `${Math.floor(diffInMilliseconds / 60000)} minutes ago`;
    } else {
        return `${Math.floor(diffInMilliseconds / 3600000)} hours ago`;
    }
}

module.exports = {
    createNotification,
    getNotifications,
};