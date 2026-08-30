import { Router } from "express";
import { criarDespesa, listarDespesas, pagarFaturaInquilino } from "../controllers/despesaController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/", authMiddleware, criarDespesa);
router.get("/", authMiddleware, listarDespesas);
router.patch("/:id_despesa_inquilino/pagar", authMiddleware, pagarFaturaInquilino);

export default router;