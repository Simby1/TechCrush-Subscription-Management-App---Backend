import express from "express";
export const router = express.Router();
import {
  getMyProfile,
  getAllUsers,
  updatePassword,
  updateProfile,
  deleteProfile,
  getDashboard,
} from "../controllers/userController.js";
import { protectRoute, restrict } from "../controllers/authController.js";

router
  .route("/")
  .get(protectRoute, restrict("admin", "superuser"), getAllUsers);
router.route("/dashboard").get(protectRoute, getDashboard);
router.route("/me").get(protectRoute, getMyProfile);
router.route("/updatePassword").patch(protectRoute, updatePassword);
router.route("/updateProfile").patch(protectRoute, updateProfile);
router.route("/deleteProfile").delete(protectRoute, deleteProfile);
