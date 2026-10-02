import pool, { ensureDatabaseSchema } from "./db.js";

const command = process.argv[2];
const emailArg = process.argv[3];
const roleArg = process.argv[4];

async function main() {
  try {
    await ensureDatabaseSchema();
    if (command === "set-admin" && emailArg) {
      const result = await pool.query(
        "UPDATE users SET role = 'admin' WHERE email = $1 RETURNING id, name, email, role",
        [emailArg.trim().toLowerCase()]
      );

      if (result.rows.length === 0) {
        console.error(`\n❌ User not found with email: ${emailArg}\n`);
        process.exit(1);
      }

      console.log("\n✅ SUCCESS: User role updated to 'admin'!");
      console.table(result.rows);
      process.exit(0);
    }

    if (command === "set-superadmin" && emailArg) {
      const result = await pool.query(
        "UPDATE users SET role = 'superAdmin' WHERE email = $1 RETURNING id, name, email, role",
        [emailArg.trim().toLowerCase()]
      );

      if (result.rows.length === 0) {
        console.error(`\n❌ User not found with email: ${emailArg}\n`);
        process.exit(1);
      }

      console.log("\n✅ SUCCESS: User role updated to 'superAdmin'!");
      console.table(result.rows);
      process.exit(0);
    }

    if (command === "set-user" && emailArg) {
      const result = await pool.query(
        "UPDATE users SET role = 'user' WHERE email = $1 RETURNING id, name, email, role",
        [emailArg.trim().toLowerCase()]
      );

      if (result.rows.length === 0) {
        console.error(`\n❌ User not found with email: ${emailArg}\n`);
        process.exit(1);
      }

      console.log("\n✅ SUCCESS: User role updated to 'user'!");
      console.table(result.rows);
      process.exit(0);
    }

    // Default: List all users
    const result = await pool.query(
      "SELECT id, name, email, role, is_blocked, created_at FROM users ORDER BY id ASC"
    );

    console.log("\n==========================================================================");
    console.log("👥 ALL DATABASE USERS & ROLES IN POSTGRESQL:");
    console.log("==========================================================================");
    console.table(result.rows);
    console.log("==========================================================================");
    console.log("💡 Commands to change roles from terminal:");
    console.log("   npm run user:set-admin <email>");
    console.log("   npm run user:set-superadmin <email>");
    console.log("   npm run user:set-user <email>\n");
    process.exit(0);
  } catch (err: any) {
    console.error("\n❌ Error:", err.message);
    process.exit(1);
  }
}

main();
