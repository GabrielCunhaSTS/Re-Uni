import { Router } from "express";
import { gerarPixParaAluguel, notificarPagamentoDinheiro, darBaixaManualDinheiro } from "../controllers/pagamentoController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/gerar-pix", authMiddleware, gerarPixParaAluguel);
router.post("/notificar-dinheiro", authMiddleware, notificarPagamentoDinheiro);

router.patch("/:id_aluguel/baixa-manual", authMiddleware, darBaixaManualDinheiro);

export default router;