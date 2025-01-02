// import Notification from "../models/notification.js";

// const createNotification = async (req, res) => {
//   const { userId, message, deliveryDate } = req.body;

//   try {
//     const notification = await Notification.create({ userId, message, deliveryDate });
//     res.status(201).json({ message: 'Notification scheduled', notification });
//   } catch (error) {
//     res.status(400).json({ message: 'Error creating notification', error });
//   }
// };

// const getNotifications = async (req, res) => {
//   try {
//     const notifications = await Notification.find({ userId: req.user.id });
//     res.status(200).json(notifications);
//   } catch (error) {
//     res.status(500).json({ message: 'Error retrieving notifications', error });
//   }
// };

// export{createNotification, getNotifications};

// const createNotification = async (req, res) => {
//   const { userId, message, deliveryDate } = req.body;

//   try {
//     const notification = await Notification.create({ userId, message, deliveryDate });
//     res.status(201).json({ message: 'Notification scheduled', notification });
//   } catch (error) {
//     res.status(400).json({ message: 'Error creating notification', error });
//   }
// };

// const getNotifications = async (req, res) => {
//   try {
//     const notifications = await Notification.findAll({ where: { userId: req.user.id } });
//     res.status(200).json(notifications);
//   } catch (error) {
//     res.status(500).json({ message: 'Error retrieving notifications', error });
//   }
// };

// export {createNotification, getNotifications}
import Notification from "../models/notification.js";
import Subscription from "../models/subscriptionModel.js";
import User from "../models/userModel.js";

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