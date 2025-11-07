import pool from "./pool.js";

// User queries
export const getAllUsers = async () => {
  try {
    const { rows } = await pool.query(
      "SELECT id, first_name, last_name, username, email, is_member, is_admin, created_at FROM users ORDER BY created_at DESC"
    );
    return rows;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export const getUserById = async (id) => {
  try {
    const { rows } = await pool.query(
      "SELECT id, first_name, last_name, username, email, is_member, is_admin, created_at FROM users WHERE id = $1",
      [id]
    );
    return rows[0];
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
};

export const getUserByUsername = async (username) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );
    return rows[0];
  } catch (error) {
    console.error("Error fetching user by username:", error);
    throw error;
  }
};

export const getUserByEmail = async (email) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );
    return rows[0];
  } catch (error) {
    console.error("Error fetching user by email:", error);
    throw error;
  }
};

export const createUser = async (firstName, lastName, email, username, passwordHash, isAdmin = false) => {
  try {
    const { rows } = await pool.query(
      "INSERT INTO users (first_name, last_name, email, username, password_hash, is_admin) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, first_name, last_name, username, email, is_member, is_admin, created_at",
      [firstName, lastName, email, username, passwordHash, isAdmin]
    );
    return rows[0];
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

export const updateMembershipStatus = async (userId, isMember) => {
  try {
    const { rows } = await pool.query(
      "UPDATE users SET is_member = $1 WHERE id = $2 RETURNING id, first_name, last_name, username, email, is_member, is_admin",
      [isMember, userId]
    );
    return rows[0];
  } catch (error) {
    console.error("Error updating membership status:", error);
    throw error;
  }
};

export const updateAdminStatus = async (userId, isAdmin) => {
  try {
    const { rows } = await pool.query(
      "UPDATE users SET is_admin = $1 WHERE id = $2 RETURNING id, first_name, last_name, username, email, is_member, is_admin",
      [isAdmin, userId]
    );
    return rows[0];
  } catch (error) {
    console.error("Error updating admin status:", error);
    throw error;
  }
};

// Message queries
export const getAllMessages = async () => {
  try {
    const { rows } = await pool.query(`
      SELECT 
        m.id, 
        m.title, 
        m.text, 
        m.timestamp, 
        m.user_id,
        u.first_name,
        u.last_name,
        u.username,
        u.is_member
      FROM messages m
      JOIN users u ON m.user_id = u.id
      ORDER BY m.timestamp DESC
    `);
    return rows;
  } catch (error) {
    console.error("Error fetching messages:", error);
    throw error;
  }
};

export const getMessageById = async (id) => {
  try {
    const { rows } = await pool.query(`
      SELECT 
        m.id, 
        m.title, 
        m.text, 
        m.timestamp, 
        m.user_id,
        u.first_name,
        u.last_name,
        u.username
      FROM messages m
      JOIN users u ON m.user_id = u.id
      WHERE m.id = $1
    `, [id]);
    return rows[0];
  } catch (error) {
    console.error("Error fetching message:", error);
    throw error;
  }
};

export const createMessage = async (title, text, userId) => {
  try {
    const { rows } = await pool.query(
      "INSERT INTO messages (title, text, user_id) VALUES ($1, $2, $3) RETURNING *",
      [title, text, userId]
    );
    return rows[0];
  } catch (error) {
    console.error("Error creating message:", error);
    throw error;
  }
};

export const deleteMessage = async (id) => {
  try {
    await pool.query("DELETE FROM messages WHERE id = $1", [id]);
  } catch (error) {
    console.error("Error deleting message:", error);
    throw error;
  }
};
