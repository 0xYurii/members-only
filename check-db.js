import pool from "./db/pool.js";

async function checkDatabase() {
  try {
    console.log("Checking database connection...");
    
    // Test connection
    const result = await pool.query("SELECT NOW()");
    console.log("✓ Database connected:", result.rows[0]);

    // Check users table structure
    const tableInfo = await pool.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'users'
      ORDER BY ordinal_position;
    `);
    
    console.log("\n✓ Users table structure:");
    tableInfo.rows.forEach(col => {
      console.log(`  - ${col.column_name} (${col.data_type}) ${col.is_nullable === 'NO' ? 'NOT NULL' : ''}`);
    });

    // Check if there are any users
    const userCount = await pool.query("SELECT COUNT(*) FROM users");
    console.log(`\n✓ Number of users: ${userCount.rows[0].count}`);

    // Show sample user (without password)
    if (parseInt(userCount.rows[0].count) > 0) {
      const sampleUser = await pool.query(
        "SELECT id, first_name, last_name, username, is_member, is_admin, created_at FROM users LIMIT 1"
      );
      console.log("\n✓ Sample user:");
      console.log(sampleUser.rows[0]);
    }

    // Check messages table
    const messageTableInfo = await pool.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'messages'
      ORDER BY ordinal_position;
    `);
    
    console.log("\n✓ Messages table structure:");
    messageTableInfo.rows.forEach(col => {
      console.log(`  - ${col.column_name} (${col.data_type}) ${col.is_nullable === 'NO' ? 'NOT NULL' : ''}`);
    });

    const messageCount = await pool.query("SELECT COUNT(*) FROM messages");
    console.log(`\n✓ Number of messages: ${messageCount.rows[0].count}`);

    console.log("\n✓ Database check completed successfully!");
  } catch (error) {
    console.error("✗ Database check failed:", error);
  } finally {
    await pool.end();
    process.exit(0);
  }
}

checkDatabase();
