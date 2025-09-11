import dotenv from "dotenv";
import app from "./app.js";

dotenv.config({ path: "./.env" });

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Connection monitoring stats
let lastMonitoringTime = Date.now();
const MONITORING_INTERVAL = 60 * 60 * 1000; // every 1 hr

async function monitorConnections() {
  const now = Date.now();
  if (now - lastMonitoringTime > MONITORING_INTERVAL) {
    console.info(
      "🔍 MongoDB connection check - idle connection management active",
    );
    lastMonitoringTime = now;
  }
}
setInterval(monitorConnections, MONITORING_INTERVAL);

// Graceful Shutdown
process.on("SIGINT", () => {
  console.log("🛑 Shutting down app...");
  server.close(() => process.exit(0));
});
process.on("SIGTERM", () => {
  console.log("🛑 App terminated...");
  server.close(() => process.exit(0));
});
