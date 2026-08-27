import { Router } from "express";
import { obterDashboard } from "../controllers/dashboardController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/", authMiddleware, obterDashboard);

export default router;