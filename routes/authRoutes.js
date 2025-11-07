import express from "express";
import passport from "passport";
import {
  getSignUp,
  postSignUp,
  postLogin,
  getLogout,
  getCurrentUser,
  postJoinClub,
} from "../controllers/authController.js";

const router = express.Router();

// Sign-up routes
router.get("/sign-up", getSignUp);
router.post("/sign-up", postSignUp);

// Login route
router.post(
  "/log-in",
  passport.authenticate("local"),
  postLogin
);

// Logout route
router.get("/log-out", getLogout);

// Get current user
router.get("/current-user", getCurrentUser);

// Join club with passcode
router.post("/join-club", postJoinClub);

export default router;
