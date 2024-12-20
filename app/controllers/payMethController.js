import PaymentMethod from "../models/payMethModel.js"; 

// Create a new payment method
export const createPaymentMethod = async (paymentData) => {
  const { userId, type, lastFour } = paymentData; 
  const paymentMethod = new PaymentMethod({ userId, type, lastFour }); 
  
  try {
    const result = await paymentMethod.save(); 
    console.log("Payment method created:", result);
    return result; 
  } catch (error) {
    console.error("Error creating payment method:", error);
    throw error; 
  }
};

// Get all payment methods
export const getPaymentMethods = async () => {
  try {
    const paymentMethods = await PaymentMethod.find(); 
    console.log("Payment methods fetched:", paymentMethods);
    return paymentMethods; 
  } catch (error) {
    console.error("Error fetching payment methods:", error);
    throw error; 
  }
};

// Find a payment method by ID
export const findPaymentMethod = async (id) => {
  try {
    const result = await PaymentMethod.findById(id); 
    console.log("Payment method found:", result);
    return result; 
  } catch (error) {
    console.error("Error finding payment method:", error);
    throw error; 
  }
};

// Update a payment method by ID
export const updatePaymentMethod = async (id, updates) => {
  try {
    const result = await PaymentMethod.updateOne(
      { _id: id },
      { $set: updates } 
    );
    console.log("Payment method updated:", result);
    return result; 
  } catch (error) {
    console.error("Error updating payment method:", error);
    throw error; 
  }
};

// Delete a payment method by ID
export const deletePaymentMethod = async (id) => {
  try {
    const result = await PaymentMethod.deleteOne({ _id: id }); 
    console.log("Payment method deleted:", result);
    return result; 
  } catch (error) {
    console.error("Error deleting payment method:", error);
    throw error; 
  }
};