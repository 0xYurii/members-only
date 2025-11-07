import bcrypt from "bcryptjs";
import pool from "../db/pool.js";

// Display sign-up form
export const getSignUp = (req, res) => {
  res.sendFile("signup.html", { root: "public" });
};

// Handle sign-up form submission
export const postSignUp = async (req, res, next) => {
  try {
    const { firstName, lastName, email, username, password, confirmPassword, isAdmin } = req.body;

    // Validate input
    if (!firstName || !lastName || !email || !username || !password) {
      return res.status(400).json({ 
        success: false, 
        message: "All fields are required" 
      });
    }

    // Validate password confirmation
    if (password !== confirmPassword) {
      return res.status(400).json({ 
        success: false, 
        message: "Passwords do not match" 
      });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({ 
        success: false, 
        message: "Password must be at least 6 characters long" 
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid email format" 
      });
    }

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
    const admin = isAdmin === 'true' || isAdmin === true;
    await pool.query(
      "INSERT INTO users (first_name, last_name, email, username, password_hash, is_admin) VALUES ($1, $2, $3, $4, $5, $6)",
      [firstName, lastName, email, username, hashedPassword, admin]
    );

    res.status(201).json({ 
      success: true, 
      message: "User created successfully. You can now log in." 
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
      firstName: req.user.first_name,
      lastName: req.user.last_name,
      username: req.user.username,
      email: req.user.email,
      isMember: req.user.is_member,
      isAdmin: req.user.is_admin
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
        firstName: req.user.first_name,
        lastName: req.user.last_name,
        username: req.user.username,
        email: req.user.email,
        isMember: req.user.is_member,
        isAdmin: req.user.is_admin
      }
    });
  } else {
    res.status(401).json({ success: false, message: "Not authenticated" });
  }
};

// Join club with secret passcode
export const postJoinClub = async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }

    const { passcode } = req.body;
    const SECRET_PASSCODE = process.env.CLUB_PASSCODE || "SECRET123";

    if (passcode !== SECRET_PASSCODE) {
      return res.status(400).json({ 
        success: false, 
        message: "Incorrect passcode" 
      });
    }

    // Update user membership status
    await pool.query(
      "UPDATE users SET is_member = true WHERE id = $1",
      [req.user.id]
    );

    // Update session
    req.user.is_member = true;

    res.json({ 
      success: true, 
      message: "Welcome to the club! You are now a member." 
    });
  } catch (error) {
    console.error("Join club error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error joining club" 
    });
  }
};
