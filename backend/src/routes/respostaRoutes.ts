import { Router } from "express";
import { criarResposta, deletarResposta } from "../controllers/respostaComentarioController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/comentarios/:id_comentario/respostas", authMiddleware, criarResposta);
router.delete("/respostas/:id_resposta", authMiddleware, deletarResposta);

export default router;