const { Notification } = require('../models');

async function getNotifications(req, res, next) {
  try {
    const notifications = await Notification.findAll({
      where: { user_id: req.user.id },
      order: [['created_at', 'DESC']]
    });
    const unreadCount = notifications.filter(n => !n.is_read).length;
    res.json({ success: true, data: { notifications, unreadCount } });
  } catch (error) {
    next(error);
  }
}

async function markAsRead(req, res, next) {
  try {
    const notification = await Notification.findOne({
      where: { id: req.params.id, user_id: req.user.id }
    });
    if (!notification) return res.status(404).json({ success: false, message: 'Notification not found.' });

    notification.is_read = true;
    await notification.save();
    res.json({ success: true, message: 'Notification marked as read.' });
  } catch (error) {
    next(error);
  }
}

async function markAllAsRead(req, res, next) {
  try {
    await Notification.update(
      { is_read: true },
      { where: { user_id: req.user.id, is_read: false } }
    );
    res.json({ success: true, message: 'All notifications marked as read.' });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getNotifications,
  markAsRead,
  markAllAsRead
};

