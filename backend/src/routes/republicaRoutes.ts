import { Router } from "express";
import {
    listar,
    buscarPorId,
    criar
} from "../controllers/republicaController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();


router.get("/", listar);


router.get("/:id", buscarPorId);


router.post("/", authMiddleware, criar);

export default router;