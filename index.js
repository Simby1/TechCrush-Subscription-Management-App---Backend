import express from "express";
import connectToMongoDB from "./app/configuration/mongoDBconn.js";
import "dotenv/config";
//importing database routes
import userRoutes from "./app/routes/userRoutes.js";
import subscriptionRoutes from "./app/routes/subscriptionRoutes.js";
import planRoutes from "./app/routes/planRoutes.js";

const app = express();
app.use(express.json());

// Use the user routes
app.use("/Users", userRoutes); // Set the base route for user operations
app.use("/subscriptions", subscriptionRoutes);
app.use("/plans", planRoutes);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectToMongoDB(process.env.MONGO_URI);
    console.log("CONNECTED TO THE DB...");
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (err) {
    console.log("DB Connection Error: ", err);
    process.exit(1);
  }
};

start();
