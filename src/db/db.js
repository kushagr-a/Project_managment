import mongoose from "mongoose";

let idleTimer = null;

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
