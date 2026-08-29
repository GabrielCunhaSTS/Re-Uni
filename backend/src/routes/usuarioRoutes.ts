import { Router } from "express";
import { obterPerfilEConfiguracoes, atualizarConfiguracoesUsuario, atualizarPerfilUsuario } from "../controllers/usuarioController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
const router = Router();
router.get("/perfil", authMiddleware, obterPerfilEConfiguracoes);
router.put("/perfil", authMiddleware, atualizarPerfilUsuario);
router.get("/configuracoes", authMiddleware, obterPerfilEConfiguracoes);
router.put("/configuracoes", authMiddleware, atualizarConfiguracoesUsuario);
export default router;