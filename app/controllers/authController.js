import {User}  from "../models/userModel.js";
import jwt from "jsonwebtoken";
import { createCustomError } from "../utils/custom-error.js";
import sendEmail from "../utils/emailService.js";
import {
  altPasswordResetEmailTemplate,
  passwordResetEmailTemplate,
} from "../utils/emailTemplates.js";
import util from "util";
import crypto from "crypto";

// Custom func to create a JWT
const signToken = (id) => {
  return jwt.sign({ id }, process.env.SECRET_STR, {
    expiresIn: process.env.LOGIN_EXPIRES,
  });
};

// Custom func to send response after token generation
export const createSendResponse = (user, statusCode, res) => {
  const token = signToken(user._id);
  res.cookie("jwt", token, {
    maxAge: parseInt(process.env.LOGIN_EXPIRES),
    // secure: true,
    httpOnly: true,
  });
  const sanitizedUser = user.sanitize();

  res.status(statusCode).json({
    status: "success",
    token,
    data: { user: sanitizedUser },
  });
};

export const signup = async (req, res, next) => {
  // Create new user in the DB
  const newUser = await User.create(req.body);
  // Create a token for the new user and send response
  createSendResponse(newUser, 201, res);
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;

  // Check if email and password is present in the request body
  if (!email || !password) {
    return next(
      createCustomError("Email ID & password is required for login!", 400)
    );
  }
  // Check if user exists in the DB
  const user = await User.findOne({ email }).select("+password");
  // Check if user is found on the DB and confirm if password match
  if (!user || !(await user.comparePasswordInDB(password, user.password))) {
    return next(createCustomError("Incorrect email or password!", 400));
  }
  // Create a token for the user and send response
  createSendResponse(user, 200, res);
};

export const protectRoute = async (req, res, next) => {
  // 1. Read the token and check if it exists
  const testToken = req.headers.authorization;
  let token;
  if (testToken && testToken.toLowerCase().startsWith("bearer")) {
    token = testToken.split(" ")[1];
  }
  if (!token) {
    return next(createCustomError("Unauthorized: You are not logged in!", 401));
  }
  // 2. Validate the token
  const decodedToken = await util.promisify(jwt.verify)(
    token,
    process.env.SECRET_STR
  );
  console.log(decodedToken);
  // 3. Check if the user exists
  const user = await User.findById(decodedToken.id);
  if (!user) {
    return next(
      createCustomError("The user with the given token does not exist", 401)
    );
  }
  // 4. Check if the user changed password after the token was issued.
  if (await user.isPasswordChanged(decodedToken.iat)) {
    return next(
      createCustomError(
        "The password has been changed recently. Please log in again!",
        401
      )
    );
  }
  // 5. Allow user to access route
  req.user = user;
  next();
};

export const restrict = (...role) => {
  return (req, res, next) => {
    if (!role.includes(req.user.role)) {
      return next(
        createCustomError(
          "You do not have permission to perform this action!",
          403
        )
      );
    }
    next();
  };
};

export const forgotPassword = async (req, res, next) => {
  // 1. Get user based on posted email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(
      createCustomError("We could not find the user with the given email.", 404)
    );
  }
  // 2. Generate a random reset token
  const resetToken = user.createResetPasswordToken();
  await user.save({ validateBeforeSave: false });
  // 3. Send the token back to the user email
  // Construct the reset URL
  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/users/resetPassword/${resetToken}`;
  // Construct the email message
  const message = passwordResetEmailTemplate(user.name, resetURL);
  const altText = altPasswordResetEmailTemplate(user.name, resetURL);
  // Attempt to send the email
  try {
    await sendEmail({
      email: user.email,
      subject: "Password Reset Request",
      message: message || altText,
      text: altText,
    });
    res
      .status(200)
      .json({ status: "success", message: "Password reset email sent" });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpires = undefined;
    await user.save({ validateBeforeSave: false });
    next(
      createCustomError(
        "An error occurred while sending password reset email. Please try again later.",
        500
      )
    );
  }
};

export const resetPassword = async (req, res, next) => {
  // Find the user in the DB with the plain token sent in the route params
  const token = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordTokenExpires: { $gt: Date.now() },
  });
  // Return an error if user does not exist or token has expired
  if (!user) {
    return next(createCustomError("Token is invalid or has expired!", 400));
  }
  // Modify user details if user exists
  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordTokenExpires = undefined;
  user.passwordChangedAt = Date.now();
  // Save to the DB
  await user.save();
  // Log in the user
  // Create a token for the user and send response
  createSendResponse(user, 200, res);
};
