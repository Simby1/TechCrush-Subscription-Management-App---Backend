import express from "express";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import morgan from "morgan";
import "express-async-errors";
import "dotenv/config";
import { router as authRouter } from "./app/routes/authRoutes.js";
import { router as userRouter } from "./app/routes/userRoutes.js";
import connectToMongoDB from "./app/configuration/mongoDBconn.js";
import subscriptionRoutes from "./app/routes/subscriptionRoutes.js";
import planRoutes from "./app/routes/planRoutes.js";
import { notFound as notFoundMiddleware } from "./middleware/not-found.js";
import { errorHandlerMiddleware } from "./middleware/error-handler.js";

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
