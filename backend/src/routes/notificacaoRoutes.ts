import { Router } from "express";
import { listarNotificacoes, marcarLida, marcarTodasLidas } from "../controllers/notificacaoController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
const router = Router();
router.get("/", authMiddleware, listarNotificacoes);
router.patch("/ler-todas", authMiddleware, marcarTodasLidas);
router.patch("/:id_notificacao/ler", authMiddleware, marcarLida);
export default router;