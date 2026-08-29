import { Router } from "express";
import { enviarMensagem, listarConversa, listarContatosChat } from "../controllers/mensagemController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
const router = Router();
router.post("/mensagens", authMiddleware, enviarMensagem);
router.get("/mensagens", authMiddleware, listarConversa);
router.get("/mensagens/contatos", authMiddleware, listarContatosChat);
export default router;