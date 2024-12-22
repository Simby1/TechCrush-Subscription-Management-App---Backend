import express from "express";
import connectToMongoDB from "./app/configuration/mongoDBconn.js";
//importing database routes
import userRoutes from "./app/routes/userRoutes.js"; 
import subscriptionRoutes from "./app/routes/subscriptionRoutes.js";
import planRoutes from "./app/routes/planRoutes.js";

const app = express();
app.use(express.json());

const startServer = async () => {
  await connectToMongoDB();

  // Use the user routes
  app.use("/Users", userRoutes); // Set the base route for user operations
  app.use("/subscriptions", subscriptionRoutes);
  app.use("/plans", planRoutes);

  // Start server
  app.listen(3000, () => {
    console.log("Server started on port 3000");
  });
};

startServer();