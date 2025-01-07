import { User } from "../models/userModel.js";
import jwt from "jsonwebtoken";
import { createCustomError } from "../utils/custom-error.js";
import util from "util";
import crypto from "crypto";
import { createSendResponse } from "./authController.js";

const filterReqObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((property) => {
    if (allowedFields.includes(property)) {
      newObj[property] = obj[property];
    }
  });
  return newObj;
};

export const getMyProfile = async (req, res, next) => {
  // Get user data by ID from the database
  const user = await User.findById(req.user.id);
  if (!user) {
    return next(createCustomError("User Not Found!", 404));
  }
  const sanitizedUser = user.sanitize();

  res.status(200).json({
    status: "success",
    data: { user: sanitizedUser },
  });
};

export const getAllUsers = async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    status: "success",
    result: users.length,
    data: { users },
  });
};

export const updatePassword = async (req, res, next) => {
  // Get user data by ID from the database
  const user = await User.findById(req.user.id).select("+password");
  // Check if the passwords match
  if (
    !(await user.comparePasswordInDB(req.body.currentPassword, user.password))
  ) {
    return next(
      createCustomError("The current password you provided is incorrect!", 400)
    );
  }
  // Update user password if the current password supplied matches with one in the DB
  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  user.passwordChangedAt = Date.now();
  await user.save();
  // Log in user and send JWT
  createSendResponse(user, 201, res);
};

export const updateProfile = async (req, res, next) => {
  if (req.body.password || req.body.confirmPassword) {
    return next(
      createCustomError(
        "You cannot update your password using this endpoint",
        400
      )
    );
  }
  // Filter the request body
  const filterObj = filterReqObj(req.body, "firstName", "lastName", "email");
  // Update user profile
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filterObj, {
    new: true,
    runValidators: true,
  });
  // Send a success response
  res.status(200).json({
    status: "success",
    message: "Profile updated successfully!",
    data: {
      user: updatedUser,
    },
  });
};

export const deleteProfile = async (req, res, next) => {
  // Find user data by ID from the database and initiate a soft delete
  const user = await User.findByIdAndUpdate(req.user.id, {
    isAccountActive: false,
  });
  res.status(204).json({ status: "success", data: null });
};
