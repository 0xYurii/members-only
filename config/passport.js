import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import pool from "../db/pool.js";

// Passport configuration
passport.use(
  new LocalStrategy(
    { usernameField: "email" }, // Use email instead of username
    async (email, password, done) => {
      try {
        // Find user in database
        const { rows } = await pool.query(
          "SELECT * FROM users WHERE email = $1",
          [email]
        );
        const user = rows[0];

        // Check if user exists
        if (!user) {
          return done(null, false, { message: "Incorrect email" });
        }

        // Compare password with hashed password
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
          return done(null, false, { message: "Incorrect password" });
        }

        // Success!
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

// Store user ID in session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Retrieve user from database using ID stored in session
passport.deserializeUser(async (id, done) => {
  try {
    const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [
      id,
    ]);
    const user = rows[0];
    done(null, user);
  } catch (err) {
    done(err);
  }
});

export default passport;
