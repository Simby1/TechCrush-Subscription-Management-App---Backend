import sgMail from "@sendgrid/mail";
// import Notification from "../models/notification.js";
import Subscription from "../models/subscriptionModel.js";
import {User} from "../models/userModel.js";


// Set SendGrid API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

/**
 * Send a reminder email for an expiring subscription.
 * @param {Object} subscription - The subscription object containing details.
 * @param {String} userEmail - The email of the user to notify.
 */
const sendReminderEmail = async (subscription, userEmail) => {
  const msg = {
    to: userEmail,
    from: process.env.EMAIL_USER, 
    subject: `Reminder: Your ${subscription.nameOfSub} subscription is expiring soon`,
    text: `Hi, your subscription for ${subscription.nameOfSub} will expire on ${subscription.endDate.toDateString()}. Please take action to renew or cancel as necessary.`,
  };

  try {
    await sgMail.send(msg);
    console.log(`Reminder email sent to ${userEmail} for ${subscription.nameOfSub}`);
  } catch (error) {
    console.error('Error sending email:', error.response?.body || error);
    throw new Error('Failed to send reminder email.');
  }
};

/**
 * Process reminders for subscriptions nearing expiration.
 * Fetches subscriptions that are expiring within 3 days and sends reminders.
 */
export const scheduleNotifications = async (req, res) => {
  const now = new Date();
  const reminderThreshold = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000); // 3 days from now

  try {
    // Fetch subscriptions expiring within 3 days that have not been notified
    const expiringSubscriptions = await Subscription.find({
      expirationDate: { $lte: reminderThreshold, $gt: now },
      notificationSent: false,
    }).populate('userId', 'email');

    console.log(`Found ${expiringSubscriptions.length} subscriptions nearing expiration.`);

    // Loop through and notify users
    for (const subscription of expiringSubscriptions) {
      if (subscription.userId?.email) {
        try {
          await sendReminderEmail(subscription, subscription.userId.email);
          
          // Mark as notified
          subscription.notificationSent = true;
          await subscription.save();
        } catch (emailError) {
          console.error(`Failed to notify user for subscription ${subscription._id}:`, emailError);
        }
      } else {
        console.warn(`No valid email for user linked to subscription ${subscription._id}`);
      }
    }
    return 
    res.status(200).json({ message: 'Reminders processed successfully.' });
  } catch (error) {
    console.error('Error processing reminders:', error);
     res.status(500).json({ error: 'Failed to process reminders.' });
  }
};
