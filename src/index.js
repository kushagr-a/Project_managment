import dotenv from "dotenv";
import app from "./app.js";
import { connectDB, disconnectDB, getConnectionState } from "./db/db.js";

dotenv.config({ path: "./.env" });

const PORT = process.env.PORT || 3000;

// Start server 
const startServer = async () => {
  try {
    // Connect to database first
    await connectDB();

    // Start HTTP server
    const server = app.listen(PORT, () => {
      console.log(`🚀 Server: http://localhost:${PORT}`);
      console.log(`📊 DB State: ${getConnectionState()}`);
    });

    // Graceful shutdown
    const shutdown = async (signal) => {
      console.log(`\n${signal} received. Shutting down...`);

      server.close(async () => {
        await disconnectDB();
        console.log("👋 Goodbye!");
        process.exit(0);
      });

      // Force exit after 10 seconds
      setTimeout(() => {
        console.error("  Forced exit");
        process.exit(1);
      }, 10000);
    };

    process.on("SIGINT", () => shutdown("SIGINT"));
    process.on("SIGTERM", () => shutdown("SIGTERM"));

  } catch (error) {
    console.error(" Startup failed:", error.message);
    process.exit(1);
  }
};

startServer();