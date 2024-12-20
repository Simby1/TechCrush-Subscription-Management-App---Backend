import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
      }, 
      planId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Plan', 
        required: true 
      },
      startDate: { 
        type: Date, 
        required: true, 
        default: Date.now 
      },
      endDate: { 
        type: Date 
      }, 
      status: { 
        type: String, 
        enum: ['active', 'inactive', 'canceled', 'expired', 'trial'], // restricts the possible values for the status field
        default: 'active', 
        required: true 
      },
      paymentMethodId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'PaymentMethod' 
      },
}, { timestamps: true });

const Subscription = mongoose.model("Subscription", subscriptionSchema, "Subscriptions");
export default Subscription;