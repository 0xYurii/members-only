import { createUsersTable } from "./queries.js";
import pool from "./pool.js";

async function setupDatabase() {
  try {
    console.log("Setting up database...");
    await createUsersTable();
    console.log("Database setup completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Database setup failed:", error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

setupDatabase();
