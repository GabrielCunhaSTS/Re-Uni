import { Router } from "express";
import { criarDespesa, listarDespesas, pagarFaturaInquilino } from "../controllers/despesaController.js";
import { gerarPixParaAluguel } from "../controllers/pagamentoController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/", authMiddleware, criarDespesa);
router.get("/", authMiddleware, listarDespesas);
router.patch("/:id_despesa_inquilino/pagar", authMiddleware, pagarFaturaInquilino);

router.post("/aluguel/:id_aluguel/gerar-pix", authMiddleware, gerarPixParaAluguel);

export default router;