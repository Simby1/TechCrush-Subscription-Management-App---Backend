import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv"
import cors from 'cors'
import {scheduleNotifications}  from "./app/utils/notifScheduler.js";
import connectToMongoDB from "./app/configuration/mongoDBconn.js";
import notificationRoutes from './app/routes/notificationRoutes.js';
//importing database routes
import userRoutes from "./app/routes/userRoutes.js"; 
import subscriptionRoutes from "./app/routes/subscriptionRoutes.js";
import planRoutes from "./app/routes/planRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());
// Load environment variables
 dotenv.config()

// Use the user routes
app.use("/Users", userRoutes); // Set the base route for user operations
app.use("/subscriptions", subscriptionRoutes);
app.use("/plans", planRoutes);
app.use('/notifications', notificationRoutes);

const port = process.env.PORT || 3000;

// Validate critical environment variables
if (!process.env.SENDGRID_API_KEY) {
  console.error("Missing SENDGRID_API_KEY in environment variables.");
  process.exit(1); // Exit the process if the API key is missing
}
const startServer = async () => {
  await  connectToMongoDB();

 scheduleNotifications()


  // Start server
  app.listen(port, () => {
    console.log(`Server started on port ${port}`);
  });
};

startServer();