import express from "express";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import morgan from "morgan";
import "express-async-errors";
import "dotenv/config";
import { router as authRouter } from "./app/routes/authRoutes.js";
import { router as userRouter } from "./app/routes/userRoutes.js";
import { scheduleNotifications } from "./app/utils/notifScheduler.js";
import notificationRoutes from "./app/routes/notificationRoutes.js";
import connectToMongoDB from "./app/configuration/mongoDBconn.js";
//importing database routes
import subscriptionRoutes from "./app/routes/subscriptionRoutes.js";
import planRoutes from "./app/routes/planRoutes.js";
import swaggerUi from "swagger-ui-express"; // Import swagger-ui-express
import swaggerJsdoc from "swagger-jsdoc"; // Import swagger-jsdoc
import { notFound as notFoundMiddleware } from "./app/middleware/not-found.js";
import { errorHandlerMiddleware } from "./app/middleware/error-handler.js";

const app = express();
// Enable trust proxy to correctly handle X-Forwarded-For header
app.set("trust proxy", 1);

// Enable CORS
app.use(cors());
// Handle preflight requests for CORS
app.options("*", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.sendStatus(200);
});
// Swagger configuration
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "TechCrush Subscription Management App",
      version: "1.0.0",
      description: "TechCrush Subscription Management App Database API",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
  },
  apis: ["./app/routes/*.js"], // references all jsdoc comments in all files under routes
};

const specs = swaggerJsdoc(options);

// Serve Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

// Use the other routes
app.use("/users", userRouter);
// Create a write stream for logs
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const logStream = fs.createWriteStream(path.join(__dirname, "sma.log"), {
  flags: "a",
}); // Append logs to the file "sma.log"
app.use(morgan("combined", { stream: logStream }));
app.use(helmet());
// Rate limiting security functionality
let limiter = rateLimit({
  max: 1000,
  windowMs: 60 * 60 * 1000,
  message:
    "We have received too many requests from this IP. Please try again after one hour.",
});
app.use(cors());

app.use("/api", limiter);
app.use(express.json({ limit: "10kb" }));
app.use("/api/v1/subscriptions", subscriptionRoutes);
app.use("/api/v1/plans", planRoutes);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);
// Use the user routes

app.use("/notifications", notificationRoutes);

// Validate critical environment variables
if (!process.env.SENDGRID_API_KEY) {
  console.error("Missing SENDGRID_API_KEY in environment variables.");
  process.exit(1); // Exit the process if the API key is missing
}

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
  scheduleNotifications();
};

start();
