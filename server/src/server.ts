import dotenv from "dotenv";
dotenv.config();

import pool from "./config/db.js";
import app from "./app.js";

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

// Graceful Shutdown on SIGTERM and SIGINT
const gracefulShutdown = async (signal: string) => {
  console.log(`\n🛑 Received ${signal}. Starting graceful shutdown...`);

  server.close(async () => {
    console.log("🔒 HTTP server closed.");
    try {
      await pool.end();
      console.log("🗄️ Database connection pool drained.");
      process.exit(0);
    } catch (err) {
      console.error("Error during database pool cleanup:", err);
      process.exit(1);
    }
  });

  // Force close if graceful shutdown takes too long
  setTimeout(() => {
    console.error("⚠️ Forcing shutdown after timeout.");
    process.exit(1);
  }, 10000);
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));