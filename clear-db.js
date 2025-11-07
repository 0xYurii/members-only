#!/usr/bin/env node
import pool from "./db/pool.js";

async function clearDatabase() {
  try {
    console.log("🗑️  Clearing database...");
    
    // Delete all messages first (due to foreign key)
    const messagesResult = await pool.query("DELETE FROM messages");
    console.log(`✓ Deleted ${messagesResult.rowCount} messages`);
    
    // Delete all users
    const usersResult = await pool.query("DELETE FROM users");
    console.log(`✓ Deleted ${usersResult.rowCount} users`);
    
    // Reset ID sequences
    await pool.query("ALTER SEQUENCE users_id_seq RESTART WITH 1");
    await pool.query("ALTER SEQUENCE messages_id_seq RESTART WITH 1");
    console.log("✓ Reset ID sequences");
    
    console.log("\n✅ Database cleared successfully! Ready for fresh start.");
  } catch (error) {
    console.error("❌ Error clearing database:", error);
  } finally {
    await pool.end();
    process.exit(0);
  }
}

clearDatabase();
