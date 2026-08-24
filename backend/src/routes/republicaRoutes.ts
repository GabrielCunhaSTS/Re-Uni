import { Router } from "express";
import {
    listar,
    buscarPorId,
    criar,
    atualizar,
    deletar
} from "../controllers/republicaController.js";
import { uploadImagens } from "../controllers/imagemController.js";
import { uploadMiddleware } from "../middlewares/uploadMiddleware.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/", listar);
router.get("/:id", buscarPorId);
router.post("/", authMiddleware, criar);
router.put("/:id", authMiddleware, atualizar);
router.delete("/:id", authMiddleware, deletar);
router.post("/:id/imagens", authMiddleware, uploadMiddleware.array('imagens', 5), uploadImagens);

export default router;