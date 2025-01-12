import express from "express";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
import cors from "cors";
import requestLogger from "./app/utils/requestLogger.js";
import logger from "./app/utils/logger.js";
import "express-async-errors";
import "dotenv/config";
import mongoSanitize from "express-mongo-sanitize";
import { router as authRouter } from "./app/routes/authRoutes.js";
import { router as userRouter } from "./app/routes/userRoutes.js";
import { scheduleNotifications } from "./app/utils/notifScheduler.js";
import notificationRoutes from "./app/routes/notificationRoutes.js";
import connectToMongoDB from "./app/configuration/mongoDBconn.js";
import subscriptionRoutes from "./app/routes/subscriptionRoutes.js";
import planRoutes from "./app/routes/planRoutes.js";
import swaggerUi from "swagger-ui-express"; // Import swagger-ui-express
import swaggerJsdoc from "swagger-jsdoc"; // Import swagger-jsdoc
import { notFound as notFoundMiddleware } from "./app/middleware/not-found.js";
import { errorHandlerMiddleware } from "./app/middleware/error-handler.js";

const app = express();

// Enable CORS
app.use(cors());

// Enable trust proxy to correctly handle X-Forwarded-For header
app.set("trust proxy", 1);
// Rate limiting security functionality
let limiter = rateLimit({
  max: 1000,
  windowMs: 60 * 60 * 1000,
  message:
    "We have received too many requests from this IP. Please try again after one hour.",
});

app.use("/api", limiter);
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

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
        url: ['http://localhost:3000','https://techcrush-subscription-management-app-api.onrender.com']

      },
    ],
  },
  apis: ["./app/routes/*.js"], // references all jsdoc comments in all files under routes
};

const specs = swaggerJsdoc(options);

// Serve Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

// Log HTTP requests
app.use(requestLogger);

// Security middleware
app.use(helmet());

app.use(express.json({ limit: "10kb" }));
// Data sanitization against NoSQL query injection
app.use(mongoSanitize());
app.use("/api/v1/subscriptions", subscriptionRoutes);
app.use("/api/v1/notifications", notificationRoutes);
app.use("/api/v1/plans", planRoutes);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);
// Use the user routes

// Validate critical environment variables
if (!process.env.SENDGRID_API_KEY) {
  logger.error("Missing SENDGRID_API_KEY in environment variables.");
  process.exit(1); // Exit the process if the API key is missing
}

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectToMongoDB(process.env.MONGO_URI);
    logger.info("CONNECTED TO THE DB...");
    app.listen(port, () =>
      logger.info(`Server is listening on port ${port}...`)
    );
  } catch (err) {
    logger.error("DB Connection Error: ", err);
    process.exit(1);
  }
  scheduleNotifications();
};

start();
