import winston from "winston";
import path from "path";

// Create a new Winston Logger
const logger = winston.createLogger({
  level: "info", // Set the default log level
  format: winston.format.combine(
    winston.format.timestamp(), // Add a timestamp to the logs
    winston.format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] [${level}]: ${message}`; // Format the logs output
    })
  ),
  transports: [
    new winston.transports.File({
      filename: path.join("logs", "combined.log"), // Log info to combined.log
    }),
    new winston.transports.File({
      filename: path.join("logs", "error.log"),
      level: "error",
    }),
    new winston.transports.Console(), // Log info to the console
  ],
});

// Export the logger
export default logger;
