import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
        userId: {
          type: mongoose.Schema.Types.ObjectId, 
          ref: 'User',
          required: true,
        },
    message: {
        type: String,
        required: true,
    },
    deliveryDate: {
        type: Date,
        required: true,
    },
    status: {
        type: String, // e.g., "pending", "sent"
        default: 'pending',
      },

}, {timestamps: true});

const Notification = mongoose.model("Notification", notificationSchema, "Notifications")
export default Notification