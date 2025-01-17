import express from "express";
export const router = express.Router();
import {
  signup,
  login,
  logout,
  protectRoute,
  restrict,
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";

router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/logout").post(protectRoute, logout);
router.route("/forgotPassword").post(forgotPassword);
router.route("/resetPassword/:token").patch(resetPassword);
