import { Router } from "express";
import { obterPerfilEConfiguracoes, atualizarConfiguracoesUsuario } from "../controllers/usuarioController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/perfil", authMiddleware, obterPerfilEConfiguracoes);

router.get("/configuracoes", authMiddleware, obterPerfilEConfiguracoes); 
router.put("/configuracoes", authMiddleware, atualizarConfiguracoesUsuario);

export default router;