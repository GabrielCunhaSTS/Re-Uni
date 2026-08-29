import { Router } from "express";
import { obterDashboard } from "../controllers/dashboardController.js";
import { obterFinanceiroDashboard } from "../controllers/dashboardFinanceiroController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/", authMiddleware, obterDashboard);
router.get("/financeiro", authMiddleware, obterFinanceiroDashboard);

export default router;