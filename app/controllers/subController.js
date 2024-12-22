import Subscription from '../models/subscriptionModel.js'; 

// Create a new subscription
export const createSubscription = async ( nameOfSub, userId, planId ) => {
  const subscription = new Subscription({
    nameOfSub,
    userId,
    planId,
    startDate: new Date(), // Automatically sets the start date to now
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
    .populate('planId');

    // Updates status for each subscription
  subscriptions.forEach(subscription => {
    subscription.status = subscription.updateStatus();
  });

  console.log("Subscriptions fetched:", subscriptions);
  return subscriptions;
};

// Find a subscription by ID (using MongoDB's _id)
export const findSubscription = async (subscriptionId) => {
  const subscription = await Subscription.findById(subscriptionId)
    .populate('userId')
    .populate('planId');

  if (!subscription) {
    console.log("Subscription not found for ID:", subscriptionId);
    return null; 
  }

  // Update status
  subscription.status = subscription.updateStatus();

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
    return null; 
  }

  // Update status
  result.status = result.updateStatus();

  console.log("Subscription updated:", result);
  return result;
};

// Cancel a subscription by ID
export const cancelSubscription = async (subscriptionId) => {
  const subscription = await Subscription.findById(subscriptionId);

  if (!subscription) {
    console.log("Subscription not found for ID:", subscriptionId);
    return null;
  }

  if (subscription.status === 'active') {
    subscription.status = 'canceled';
  await subscription.save();

  console.log("Subscription canceled:", subscription);
  return subscription;
} else {
    throw new Error('Subscription cannot be canceled because it is not active.');
}
};

// Renew a subscription by Id
export const renewSubscription = async (subscriptionId) => {
  const subscription = await Subscription.findById(subscriptionId);

  if (!subscription) {
      console.log("Subscription not found for ID:", subscriptionId);
      return null;
  }
 
  if (subscription.status === 'expired' || subscription.status === 'canceled') {
    subscription.status = 'active';
  await subscription.save();

  console.log("Subscription renewed:", subscription);
  return subscription;
} else {
    throw new Error('Subscription cannot be renewed because it is not active or canceled.');
}
};

// Inactivate a subscription
export const inactivateSubscription = async (subscriptionId) => {
  const subscription = await Subscription.findById(subscriptionId);

  if (!subscription) {
      console.log("Subscription not found for ID:", subscriptionId);
      return null;
  }
  if (subscription.status === 'active') {
    subscription.status = 'inactive';
  await subscription.save();

  console.log("Subscription inactivated:", subscription);
  return subscription;
} else {
    throw new Error('Subscription cannot be inativated because it is not active.');
}
};

// Delete a subscription (using MongoDB's _id)
export const deleteSubscription = async (subscriptionId) => {
  const result = await Subscription.findByIdAndDelete(subscriptionId);

  if (!result) {
    console.log("Subscription not found for ID:", subscriptionId);
    return null; 
  }

  console.log("Subscription deleted:", result);
  return result;
};