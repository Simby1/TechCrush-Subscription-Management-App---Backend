import Notification from "../models/notification.js";
import Subscription from "../models/subscriptionModel.js";
import {User} from "../models/userModel.js";

export const createNotification = async (req, res) => {
  const { userId, subscriptionId, message, deliveryDate } = req.body;

  try {
    const notification = new Notification({ userId, subscriptionId, message, deliveryDate});
    await notification.save();
    res.status(201).json({ message: 'Notification created successfully.', notification });
  } catch (error) {
    console.error('Error creating notification:', error);
    res.status(500).json({ error: 'Failed to create notification.' });
  }
};

/**
 * Get all notifications for a user.
 */
export const getNotifications = async (req, res) => {
  const { userId } = req.params;

  try {
    const notifications = await Notification.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json({ notifications });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Failed to fetch notifications.' });
  }
};