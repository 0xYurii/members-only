import pool from "./pool.js";

// Create users table
export const createUsersTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(255) UNIQUE NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      membership_status VARCHAR(50) DEFAULT 'non-member',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  
  try {
    await pool.query(query);
    console.log("Users table created successfully");
  } catch (error) {
    console.error("Error creating users table:", error);
    throw error;
  }
};

// Get all users
export const getAllUsers = async () => {
  try {
    const { rows } = await pool.query("SELECT id, username, email, membership_status, created_at FROM users");
    return rows;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

// Get user by ID
export const getUserById = async (id) => {
  try {
    const { rows } = await pool.query(
      "SELECT id, username, email, membership_status, created_at FROM users WHERE id = $1",
      [id]
    );
    return rows[0];
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
};

// Get user by email
export const getUserByEmail = async (email) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );
    return rows[0];
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
};

// Create user
export const createUser = async (username, email, hashedPassword) => {
  try {
    const { rows } = await pool.query(
      "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email, created_at",
      [username, email, hashedPassword]
    );
    return rows[0];
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

// Update membership status
export const updateMembershipStatus = async (userId, status) => {
  try {
    const { rows } = await pool.query(
      "UPDATE users SET membership_status = $1 WHERE id = $2 RETURNING id, username, email, membership_status",
      [status, userId]
    );
    return rows[0];
  } catch (error) {
    console.error("Error updating membership status:", error);
    throw error;
  }
};
