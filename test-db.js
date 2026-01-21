import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

console.log("🧪 Testing MongoDB Connection...\n");
console.log("URI:", process.env.MONGO_URI_LOCAL);
console.log("DB Name:", process.env.DB_NAME || "ProjectManagement");
console.log("\n⏳ Connecting...\n");

try {
  await mongoose.connect(process.env.MONGO_URI_LOCAL, {
    dbName: process.env.DB_NAME || "ProjectManagement",
    serverSelectionTimeoutMS: 10000,
  });
  
  console.log("✅ Connection Successful!");
  console.log("📊 Database:", mongoose.connection.name);
  console.log("📍 Host:", mongoose.connection.host);
  console.log("🔌 Port:", mongoose.connection.port);
  
  await mongoose.disconnect();
  console.log("\n✅ Test completed successfully!");
  
} catch (error) {
  console.error("❌ Connection Failed!");
  console.error("Error:", error.message);
  console.error("\n💡 Possible fixes:");
  console.error("1. Check MongoDB is running: net start MongoDB");
  console.error("2. Check port 27017: netstat -ano | findstr :27017");
  console.error("3. Try MongoDB Compass with: mongodb://127.0.0.1:27017");
}

process.exit(0);