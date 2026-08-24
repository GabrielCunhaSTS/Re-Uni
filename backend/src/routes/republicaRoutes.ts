import { Router } from "express";
import {
    listar,
    buscarPorId,
    criar,
    atualizar,
    deletar 
} from "../controllers/republicaController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/", listar);
router.get("/:id", buscarPorId);
router.post("/", authMiddleware, criar);
router.put("/:id", authMiddleware, atualizar);
router.delete("/:id", authMiddleware, deletar);

export default router;