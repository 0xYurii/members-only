import bcrypt from "bcryptjs";
import pool from "../db/pool.js";

// Display sign-up form
export const getSignUp = (req, res) => {
  res.sendFile("signup.html", { root: "public" });
};

// Handle sign-up form submission
export const postSignUp = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await pool.query(
      "SELECT * FROM users WHERE username = $1 OR email = $2",
      [username, email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: "Username or email already exists" 
      });
    }

    // Hash password with bcrypt (10 salt rounds)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user into database
    await pool.query(
      "INSERT INTO users (username, email, password) VALUES ($1, $2, $3)",
      [username, email, hashedPassword]
    );

    res.status(201).json({ 
      success: true, 
      message: "User created successfully" 
    });
  } catch (error) {
    console.error("Sign-up error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error creating user" 
    });
  }
};

// Handle login
export const postLogin = (req, res) => {
  res.json({ 
    success: true, 
    message: "Logged in successfully",
    user: {
      id: req.user.id,
      username: req.user.username,
      email: req.user.email
    }
  });
};

// Handle logout
export const getLogout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.json({ success: true, message: "Logged out successfully" });
  });
};

// Get current user
export const getCurrentUser = (req, res) => {
  if (req.isAuthenticated()) {
    res.json({
      success: true,
      user: {
        id: req.user.id,
        username: req.user.username,
        email: req.user.email,
        membership_status: req.user.membership_status
      }
    });
  } else {
    res.status(401).json({ success: false, message: "Not authenticated" });
  }
};
