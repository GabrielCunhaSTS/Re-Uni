import { Router } from "express";
import { listarNotificacoes, marcarLida } from "../controllers/notificacaoController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/notificacoes", authMiddleware, listarNotificacoes);
router.patch("/notificacoes/:id_notificacao/lida", authMiddleware, marcarLida);

export default router;