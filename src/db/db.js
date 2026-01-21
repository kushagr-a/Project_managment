import mongoose from "mongoose";

// Simple connection state
let isConnecting = false;

// Check if connected
export const isConnected = () => {
  return mongoose.connection.readyState === 1;
};

// Get connection state
export const getConnectionState = () => {
  const states = ["disconnected", "connected", "connecting", "disconnecting"];
  return states[mongoose.connection.readyState] || "unknown";
};

// Main connect function
export const connectDB = async () => {
  // Already connected
  if (isConnected()) {
    console.log("✅ MongoDB already connected");
    return;
  }

  // Connection in progress
  if (isConnecting) {
    console.log("⏳ Connection in progress...");
    return;
  }

  // Check URI exists
  const mongoUri = process.env.MONGO_URI_LOCAL || process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error("❌ MONGO_URI_LOCAL not found in .env file");
  }

  try {
    isConnecting = true;
    console.log("🔌 Connecting to MongoDB...");

    await mongoose.connect(mongoUri, {
      dbName: process.env.DB_NAME || "ProjectManagement",
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });

    console.log(`✅ MongoDB connected: ${mongoose.connection.name}`);
    setupEventListeners();
    
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    throw error;
  } finally {
    isConnecting = false;
  }
};

// Disconnect function
export const disconnectDB = async () => {
  if (!isConnected()) {
    console.log("⚠️  Already disconnected");
    return;
  }

  try {
    await mongoose.connection.close();
    console.log("✅ MongoDB disconnected");
  } catch (error) {
    console.error("❌ Disconnect error:", error.message);
    throw error;
  }
};

// Event listeners (setup once)
let listenersSetup = false;

const setupEventListeners = () => {
  if (listenersSetup) return;

  mongoose.connection.on("error", (err) => {
    console.error("❌ MongoDB error:", err.message);
  });

  mongoose.connection.on("disconnected", () => {
    console.warn("⚠️  MongoDB disconnected");
    isConnecting = false;
  });

  mongoose.connection.on("reconnected", () => {
    console.log("🔄 MongoDB reconnected");
  });

  listenersSetup = true;
};

export default connectDB;

/*

export const connectDB = async () => {
  if (mongoose.connection.readyState === 1) return; // already connected
  if (mongoose.connection.readyState === 2) {
    await waitForConnection();
    return;
  }

  try {
    await mongoose.connect(process.env.MONGO_URI_LOCAL, {
      dbName: "ProjectManagement",
      serverSelectionTimeoutMS: 5000, // jaldi fail kare
    });
    await waitForConnection();
    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    throw error;
  }
};

const waitForConnection = () =>
  new Promise((resolve, reject) => {
    if (mongoose.connection.readyState === 1) return resolve();
    mongoose.connection.once("connected", resolve);
    mongoose.connection.once("error", reject);
  });

export const disconnectDB = async () => {
  if (mongoose.connection.readyState !== 1) return;

  try {
    await mongoose.disconnect();
    console.log("⚠️ MongoDB disconnected due to inactivity");
  } catch (error) {
    console.error("❌ MongoDB disconnection error:", error.message);
  }
};

export const resetIdleTimer = () => {
  if (idleTimer) clearTimeout(idleTimer);

  idleTimer = setTimeout(() => {
    disconnectDB();
  }, 60 * 1000); // 1 min idle → disconnect
};

*/
