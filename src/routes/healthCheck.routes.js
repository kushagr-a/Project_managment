import { Router } from "express";
import { healthCheck } from "../controllers/healthCheck.controller.js";

const router = Router();

router.route("/").get(healthCheck);

export default router;

// const healthRouter = Router();

// healthRouter.route("/").get(healthCheck);
