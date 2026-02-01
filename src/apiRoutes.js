import { Router } from "express";
import healthCheckRoutes from "./routes/healthCheck.routes.js";
import authRoutes from "./routes/auth.routes.js";

const apiRoutes = Router();

apiRoutes.use("/healthCheck", healthCheckRoutes);

apiRoutes.use("/auth", authRoutes);

export default apiRoutes; 