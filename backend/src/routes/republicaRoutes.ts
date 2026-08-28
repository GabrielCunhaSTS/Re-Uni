import { Router } from "express";
import {
    listar,
    buscarPorId,
    criar,
    atualizar,
    deletar,
    listarMinhasRepublicas
} from "../controllers/republicaController.js";
import { uploadImagens,removerImagem } from "../controllers/imagemController.js";
import { uploadMiddleware } from "../middlewares/uploadMiddleware.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { buscarRepublicas } from "../controllers/republicaFiltroController.js";



const router = Router();

router.get("/", listar);
router.get("/buscar", buscarRepublicas);
router.get("/minhas", authMiddleware, listarMinhasRepublicas);
router.get("/:id", buscarPorId);
router.post("/", authMiddleware, criar);
router.put("/:id", authMiddleware, atualizar);
router.delete("/:id", authMiddleware, deletar);

router.post("/:id/imagens", authMiddleware, uploadMiddleware.array('imagens', 5), uploadImagens);
router.delete("/:id/imagens/:id_imagem", authMiddleware, removerImagem);

export default router;