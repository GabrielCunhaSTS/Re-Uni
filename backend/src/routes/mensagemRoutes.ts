import { Router } from "express";
import { enviarMensagem, listarConversa, listarContatosChat, listarNaoLidas } from "../controllers/mensagemController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
const router = Router();
router.post("/mensagens", authMiddleware, enviarMensagem);
router.get("/mensagens", authMiddleware, listarConversa);
router.get("/mensagens/contatos", authMiddleware, listarContatosChat);
router.get("/mensagens/nao-lidas", authMiddleware, listarNaoLidas);
export default router;