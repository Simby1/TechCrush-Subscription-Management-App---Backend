import { CustomAPIError } from "../utils/custom-error.js";

export const errorHandlerMiddleware = (err, req, res, next) => {
  // Custom API Error Handling
  if (err instanceof CustomAPIError) {
    return res.status(err.statusCode).json({ msg: err.message, error: err });
  }
  // JWT Expired Error
  if (err.name === "TokenExpiredError") {
    return res
      .status(401)
      .json({ msg: "JWT has expired. Please login again!" });
  }
  // JWT Invalid Token Error
  if (err.name === "JsonWebTokenError") {
    return res
      .status(401)
      .json({ msg: "Invalid Token. Please login again!", error: err });
  }
  // Default to 500 Internal Server Error for unknown errors
  return res
    .status(err.statusCode || 500)
    .json({ msg: err.message || "Something went wrong!", error: err });
};
