import { Router } from "express";
import {
    register,
    login,
    me,
    solicitarRecuperacaoSenha,
    redefinirSenha
} from "../controllers/authController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get(
    "/me",
    authMiddleware,
    me
);

router.post("/esqueci-senha", solicitarRecuperacaoSenha);
router.post("/resetar-senha", redefinirSenha);

export default router;