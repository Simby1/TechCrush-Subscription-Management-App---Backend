import express from 'express';
import { getNotifications, createNotification } from '../controllers/notificationController.js';
import { scheduleNotifications } from '../utils/notifScheduler.js';


const router = express.Router();

// Route to process reminders for expiring subscriptions
router.get('/send-reminders', scheduleNotifications);

// Route to create a notification manually
router.post('/', createNotification);

// Route to get all notifications for a specific user
router.get('/:userId', getNotifications);

export default router;
