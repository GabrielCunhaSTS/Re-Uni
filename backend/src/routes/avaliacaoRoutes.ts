import { Router } from "express";
import {
    criarAvaliacao,
    listarAvaliacoesDaRepublica
} from "../controllers/avaliacaoController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
const router = Router();
router.post("/republicas/:id_republica/avaliacoes", authMiddleware, criarAvaliacao);
router.get("/republicas/:id_republica/avaliacoes", listarAvaliacoesDaRepublica);
export default router;