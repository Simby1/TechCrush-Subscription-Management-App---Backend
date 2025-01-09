// subscriptionRoutes.js
import express from 'express';
import {
  createSubscription,
  getSubscriptions,
  findSubscription,
  updateSubscription,
  cancelSubscription,
  renewSubscription,
  inactivateSubscription,
  deleteSubscription
} from '../controllers/subController.js'; 

const subscriptionRoutes = express.Router(); // Create a new router for subscriptions

/**
 * @swagger
 * components:
 *   schemas:
 *     Subscription:
 *       type: object
 *       properties:
 *         nameOfSub:
 *           type: string
 *           description: Name of the service being subscribed to.
 *         userId:
 *           type: string
 *           description: ID of the user subscribing.
 *         planId:
 *           type: string
 *           description: ID of the plan being subscribed to.
 *         startDate:
 *           type: string
 *           format: date-time
 *           description: Start date of the subscription.
 *         endDate:
 *           type: string
 *           format: date-time
 *           description: End date of the subscription.
 *         renewalDate:
 *           type: string
 *           format: date-time
 *           description: Renewal date of the subscription.
 *         price:
 *           type: number
 *           description: Price of the subscription.
 *         status:
 *           type: string
 *           enum: ['active', 'inactive', 'canceled', 'expired']
 *           description: Status of the subscription.
 *     SubscriptionRequest: # For POST requests
 *       type: object
 *       properties:
 *         nameOfSub:
 *           type: string
 *           description: Name of the service being subscribed to.
 *         userId:
 *           type: string
 *           description: ID of the user subscribing.
 *         planId:
 *           type: string
 *           description: ID of the plan being subscribed to.
 *         endDate:
 *           type: string
 *           format: date-time
 *           description: End date of the subscription.
 *         renewalDate:
 *           type: string
 *           format: date-time
 *           description: Renewal date of the subscription.
 *         price:
 *           type: number
 *           description: Price of the subscription.
 */

// Create a new subscription
/**
 * @swagger
 * /api/v1/subscriptions/createSubscription:
 *   post:
 *     summary: Create a new subscription
 *     tags: [Subscriptions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *     responses:
 *       201:
 *         description: Subscription created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 subscription:
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */

subscriptionRoutes.route("/createSubscription").post( async (req, res) => {
  const { nameOfSub, userId, planId, endDate, renewalDate, price  } = req.body; // Destructure the request body. startDate not included cuz it automatically sets to now
  try {
    const newSubscription = await createSubscription(nameOfSub, userId, planId, endDate, renewalDate, price );
    res.status(201).json({ message: "Subscription created", subscription: newSubscription });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all subscriptions
/**
 * @swagger
 * /api/v1/subscriptions/retrieveSubscriptions:
 *   get:
 *     summary: Retrieve all subscriptions
 *     tags: [Subscriptions]
 *     responses:
 *       200:
 *         description: A list of subscriptions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Subscription'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */

subscriptionRoutes.route("/retrieveSubscriptions").get( async (req, res) => {
  try {
    const subscriptions = await getSubscriptions();
    res.status(200).json(subscriptions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Find a subscription by ID
/**
 * @swagger
 * /api/v1/subscriptions/findSubscritption/{id}:
 *   get:
 *     summary: Find a subscription by ID
 *     tags: [Subscriptions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the subscription to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Subscription found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Subscription'
 *       404:
 *         description: Subscription not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */

subscriptionRoutes.route("/findSubscription/:id").get( async (req, res) => {
  const { id } = req.params; // Gets the subscription ID from the request parameters
  try {
    const foundSubscription = await findSubscription(id);
    if (foundSubscription) {
      res.status(200).json(foundSubscription);
    } else {
      res.status(404).json({ error: "Subscription not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a subscription
/**
 * @swagger
 * /api/v1/subscriptions/updateSubscription/{id}:
 *   put:
 *     summary: Update a subscription
 *     tags: [Subscriptions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the subscription to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SubscriptionRequest'
 *     responses:
 *       200:
 *         description: Subscription updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Subscription'
 *       404:
 *         description: Subscription not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */

subscriptionRoutes.route("/updateSubscription/:id").put( async (req, res) => {
  const { id } = req.params; 
  const updates = req.body; 
  try {
    const updatedSubscription = await updateSubscription(id, updates);
    if (updatedSubscription) {
      res.status(200).json({ message: 'Subscription updated successfully', subscription: updatedSubscription });
    } else {
      res.status(404).json({ error: "Subscription not found" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Cancel a subscription
/**
 * @swagger
 * /api/v1/subscriptions/cancelSubscription/{id}:
 *   patch:
 *     summary: Cancel a subscription
 *     tags: [Subscriptions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the subscription to cancel
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Subscription canceled successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Subscription'
 *       404:
 *         description: Subscription not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */

subscriptionRoutes.route("/cancelSubscription/:id").patch( async (req, res) => { //changes subscription status to canceled
  const { id } = req.params;
  try {
    const canceledSubscription = await cancelSubscription(id);
    if (!canceledSubscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }
    res.status(200).json({ message: 'Subscription canceled successfully', canceledSubscription });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Renew a subscription
/**
 * @swagger
 * /api/v1/subscriptions/renewSubscription/{id}:
 *   patch:
 *     summary: Renew a subscription
 *     tags: [Subscriptions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the subscription to renew
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Subscription renewed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Subscription'
 *       404:
 *         description: Subscription not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */

subscriptionRoutes.route("/renewSubscription/:id").patch( async (req, res) => { //changes subscription status to active
  const { id } = req.params;
  try {
    const renewedSubscription = await renewSubscription(id);
    if (!renewedSubscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }
    res.status(200).json({ message: 'Subscription renewed successfully', renewedSubscription });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Inactivate a subscription
/**
 * @swagger
 * /api/v1/subscriptions/inactivateSubscription/{id}:
 *   patch:
 *     summary: Inactivate a subscription
 *     tags: [Subscriptions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the subscription to inactivate
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Subscription inactivated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Subscription'
 *       404:
 *         description: Subscription not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */

subscriptionRoutes.route("/inactivateSubscription/:id").patch( async (req, res) => { // changes subscription status to inactive
  const { id } = req.params;
  try {
    const inactivatedSubscription = await inactivateSubscription(id);
    if (!inactivatedSubscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }
    res.status(200).json({ message: 'Subscription inactivated successfully', inactivatedSubscription });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a subscription
/**
 * @swagger
 * /api/v1/subscriptions/deleteSubscription/{id}:
 *   delete:
 *     summary: Delete a subscription
 *     tags: [Subscriptions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the subscription to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Subscription deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Subscription not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */

subscriptionRoutes.route("/deleteSubscription/:id").delete( async (req, res) => {
  const { id } = req.params;
  try {
    const deletedSubscription = await deleteSubscription(id);
    if (deletedSubscription) {
      res.status(200).json({ message: 'Subscription deleted successfully' });
    } else {
      res.status(404).json({ error: "Subscription not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default subscriptionRoutes; 