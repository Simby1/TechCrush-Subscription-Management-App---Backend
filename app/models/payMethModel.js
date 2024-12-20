import mongoose from "mongoose";

const paymentMethodSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  type: { 
    type: String, 
    enum: ['card', 'paypal', 'bank_transfer'], // Add more as needed
    required: true 
  },
  lastFour: { 
    type: String, // Store last 4 digits of card number for display 
  },
}, { timestamps: true });

const PaymentMethod = mongoose.model('PaymentMethod', paymentMethodSchema, "PaymentMethod");
export default PaymentMethod;