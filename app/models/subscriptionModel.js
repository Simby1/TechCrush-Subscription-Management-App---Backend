import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
    nameOfSub: { type: String, required: true }, //Name of service being subscribed to
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
      }, 
      notificationSent: {
        type: Boolean,
        default: false,
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
        type: Date,
        required: true
      }, 
      status: { 
        type: String, 
        enum: ['active', 'inactive', 'canceled', 'expired' ], // restricts the possible values for the status field
        required: true 
      },
}, { timestamps: true });

subscriptionSchema.methods.updateStatus = function() {
  const currentDate = new Date();

  if (this.status === 'active') {
    if (this.endDate && currentDate > this.endDate) { // ensures an end date is defined and compares it with the current date against the defined end date
    return 'expired';
  }
}
  return this.status; // Returns normal subscription status if neither of the conditions are met
};

const Subscription = mongoose.model("Subscription", subscriptionSchema, "Subscriptions");
export default Subscription;