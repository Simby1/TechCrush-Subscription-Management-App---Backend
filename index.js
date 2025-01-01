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

// Create a write stream for logs
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const logStream = fs.createWriteStream(path.join(__dirname, "sma.log"), {
  flags: "a",
}); // Append logs to the file "sma.log"
app.use(morgan("combined", { stream: logStream }));

// Rate limiting security functionality
app.use(helmet());
let limiter = rateLimit({
  max: 1000,
  windowMs: 60 * 60 * 1000,
  message:
    "We have received too many requests from this IP. Please try again after one hour.",
});

app.use("/api", limiter);
app.use(express.json({ limit: "10kb" }));

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
