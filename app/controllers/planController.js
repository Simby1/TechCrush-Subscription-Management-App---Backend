import Plan from "../models/planModel.js"; // Adjust the path to your Plan model

// Create a new plan
export const createPlan = async (planData) => {
  const { name, description, price, interval, features, trialDays } = planData;
  const plan = new Plan({ name, description, price, interval, features, trialDays });
  
  try {
    const result = await plan.save();
    console.log("Plan created:", result);
    return result; // Returns the created plan
  } catch (error) {
    console.error("Error creating plan:", error);
    throw error;
  }
};

// Get all plans
export const getPlans = async () => {
  try {
    const plans = await Plan.find();
    console.log("Plans fetched:", plans);
    return plans; // Returns the list of plans
  } catch (error) {
    console.error("Error fetching plans:", error);
    throw error; 
  }
};

// Find a plan by ID
export const findPlan = async (id) => {
  try {
    const result = await Plan.findById(id);
    console.log("Plan found:", result);
    return result; // Returns the found plan
  } catch (error) {
    console.error("Error finding plan:", error);
    throw error; 
  }
};

// Update a plan by ID
export const updatePlan = async (id, updates) => {
  try {
    const result = await Plan.updateOne(
      { _id: id },
      { $set: updates }
    );
    console.log("Plan updated:", result);
    return result; // Returns the result of the update operation
  } catch (error) {
    console.error("Error updating plan:", error);
    throw error; 
  }
};

// Delete a plan by ID
export const deletePlan = async (id) => {
  try {
    const result = await Plan.deleteOne({ _id: id });
    console.log("Plan deleted:", result);
    return result; // Returns the result of the delete operation
  } catch (error) {
    console.error("Error deleting plan:", error);
    throw error; 
  }
};