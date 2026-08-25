import { Router } from "express";
import {
    criarComentario,
    listarComentarios,
    deletarComentario
} from "../controllers/comentarioController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/republicas/:id/comentarios", listarComentarios);
router.post("/republicas/:id/comentarios", authMiddleware, criarComentario);
router.delete("/comentarios/:id_comentario", authMiddleware, deletarComentario);

export default router;