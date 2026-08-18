import { Router } from "express";
import { register } from "../controllers/authController.js";

const router = Router();

// Rota POST para cadastro de novos usuários
router.post("/register", register);

export default router;