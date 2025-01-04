import morgan from "morgan";
import fs from "fs";
import path from "path";

// Create a stream for Morgan to write logs to
const accessLogStream = fs.createWriteStream(path.join("logs", "access.log"), {
  flags: "a",
}); // Append logs to the file "access.log"

// Configure Morgan Middleware to log HTTP requests
const requestLogger = morgan("combined", { stream: accessLogStream });

export default requestLogger;
