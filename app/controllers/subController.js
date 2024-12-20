import Subscription from '../models/subscriptionModel.js'; // Adjust the path to your Subscription model

// Create a new subscription
export const createSubscription = async (userId, planId, paymentMethodId) => {
  const subscription = new Subscription({
    userId,
    planId,
    paymentMethodId,
    startDate: new Date(), // Automatically set the start date to now
    status: 'active' // Default status
  });

  const result = await subscription.save();
  console.log("Subscription created:", result);
  return result;
};

// Get all subscriptions
export const getSubscriptions = async () => {
  const subscriptions = await Subscription.find()
    .populate('userId')
    .populate('planId')
    .populate('paymentMethodId');
  console.log("Subscriptions fetched:", subscriptions);
  return subscriptions;
};

// Find a subscription by ID (using MongoDB's _id)
export const findSubscription = async (subscriptionId) => {
  const subscription = await Subscription.findById(subscriptionId)
    .populate('userId')
    .populate('planId')
    .populate('paymentMethodId');

  if (!subscription) {
    console.log("Subscription not found for ID:", subscriptionId);
    return null; // Return null if not found
  }

  console.log("Subscription found:", subscription);
  return subscription;
};

// Update a subscription (using MongoDB's _id)
export const updateSubscription = async (subscriptionId, updates) => {
  const result = await Subscription.findByIdAndUpdate(
    subscriptionId,
    { $set: updates },
    { new: true } // Return the updated document
  );

  if (!result) {
    console.log("Subscription not found for ID:", subscriptionId);
    return null; // Return null if not found
  }

  console.log("Subscription updated:", result);
  return result;
};

// Delete a subscription (using MongoDB's _id)
export const deleteSubscription = async (subscriptionId) => {
  const result = await Subscription.findByIdAndDelete(subscriptionId);

  if (!result) {
    console.log("Subscription not found for ID:", subscriptionId);
    return null; // Return null if not found
  }

  console.log("Subscription deleted:", result);
  return result;
};