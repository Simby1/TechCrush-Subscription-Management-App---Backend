import mongoose from "mongoose";


const planSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Name of the subscription plan
  description: { type: String, required: true }, // Description of the plan
  price: { type: Number, required: true }, // Price of the plan
  interval: { 
    type: String, 
    enum: ["monthly", "yearly"], // Allowed values for interval
    required: true 
  },
  features: { type: [String], required: true }, // List of features included in the plan
  trialDays: { 
    type: Number, 
    min: 0,
    default: 0 
  },
}, { timestamps: true }); 

// Create the Plan model
const Plan = mongoose.model("Plan", planSchema, "Plan"); 

export default Plan; 