import express from "express";
import cors from "cors";
import { connectDB, resetIdleTimer } from "./db/db.js";
import { shouldSkipDb } from "./utils/skipDb.js";

const app = express();

// middlewares
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));

// CORS
app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(",") || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

//  Lazy DB connect middleware
app.use(async (req, res, next) => {
  try {
    if (!shouldSkipDb(req.path)) {
      await connectDB(); // connect only when needed
      resetIdleTimer(); // reset idle timer
    }
    next();
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    return res.status(500).json({ error: "Database connection error" });
  }
});

// Routes
import healthCheck from "./routes/healthCheck.routes.js";
import authRouter from "./routes/auth.routes.js";

app.use("/api/v1/healthCheck", healthCheck);
app.use("/api/v1/auth", authRouter);

// Health monitoring route
app.get("/health", (req, res) => {
  const memUsage = process.memoryUsage();
  const cpuUsage = process.cpuUsage();

  res.json({
    status: true,
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    memory: {
      rss: `${Math.round(memUsage.rss / 1024 / 1024)} MB`,
      heapTotal: `${Math.round(memUsage.heapTotal / 1024 / 1024)} MB`,
      heapUsed: `${Math.round(memUsage.heapUsed / 1024 / 1024)} MB`,
      external: `${Math.round(memUsage.external / 1024 / 1024)} MB`,
    },
    cpu: cpuUsage,
  });
});

if (process.env.NODE_ENV !== "production") {
  app.get("/dbString", (req, res) => {
    return res.status(200).json({
      message: `DB mode: ${process.env.NODE_ENV}`,
      uri: process.env.MONGO_URI_LOCAL,
    });
  });
}

app.get("/", (req, res) => {
  res.send("<h1>Aajao Backend pe </h1>");
});

export default app;
